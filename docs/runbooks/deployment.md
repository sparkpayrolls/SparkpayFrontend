# Runbook: deployment

**Current production state, 2026-11-06: deployments are broken and have been since 2026-08-18.**
**Root cause found and fixed in the repo — see "Root cause, verified" below. Not yet confirmed
by a green Vercel build.**
`sparkpayhq.com` is serving the build from `3c101be` (2026-08-18). Every commit pushed since then,
including the five on `main` from 2026-11-06, has failed to deploy. Production is roughly three
months behind `main`.

This runbook records how deployment works, what is currently broken, and what was ruled out. Source
of truth for the footer slice that uncovered it: `plan.md`.

---

## How this repo deploys

|                   |                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| Platform          | Vercel, via the GitHub integration                                                                                    |
| Production domain | `sparkpayhq.com` (and `www`), served by Vercel                                                                        |
| Vercel projects   | **two**, both building every commit: `payeasy-africa/sparkpay-frontend` and `mhizterkeyzs-projects/sparkpay-frontend` |
| Trigger           | push to any branch → preview; push to `main` → production                                                             |
| Install command   | `yarn install --frozen-lockfile` (Vercel's default for a Yarn 1 lockfile)                                             |
| Build command     | `yarn build` → `next build`                                                                                           |

**There is no CI.** `.github/workflows/ci.yml[deleted]` has the brackets literally in its filename,
so GitHub Actions ignores it — the API reports `"total_count": 0` workflows. Nothing lints,
type-checks or tests on push. That file previously built a Docker image, pushed it to ECR and
deployed to ECS; `Dockerfile` and `task-definitions/{production,staging}.json` are still in the repo
and are the remains of that path. _Verified 2026-11-06._

---

## The current failure

**The build never runs.** Vercel creates the deployment and marks it failed within 0–49 seconds:

| deployment             | created     | failed      | gap     |
| ---------------------- | ----------- | ----------- | ------- |
| `7e4b523` (PR #116)    | `12:40:42Z` | `12:40:52Z` | **10s** |
| `f701ab2` (production) | `11:56:15Z` | `11:57:04Z` | 49s     |
| `6d85950` (PR #115)    | `11:46:59Z` | `11:47:02Z` | 3s      |
| `6cd86a4` (production) | `02:15:31Z` | `02:15:32Z` | **1s**  |

A cold build of this app takes minutes — in `node:22-alpine`, 443s to install and 414s to build.
Most of these never compile anything.

**The exception matters.** The retry of PR #116 (`3f886e9`, lockfile already fixed) ran for about
three minutes before failing — long enough to install and begin building. So there are probably
_two_ distinct failures here: the near-instant ones, which never start, and at least one real build
failure further in. Treat the ~3min deployment as the informative one; its log is the one to read
first. Whether the near-instant ones are a separate fault or just superseded/queued deployments is
unresolved.

### Ruled out — do not spend time here again

| Suspicion                     | Finding                                                               | How                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| A bad commit broke it         | No. `main` builds clean                                               | `yarn install && yarn build` on a clean tree of `main` in `node:22-alpine` → success, all routes compiled |
| The footer PR (#115) broke it | No. `main` fails on its own, and its failure is _newer_ than the PR's | `main` deployment failed `11:57:04Z`; PR #115's at `11:47:02Z`; `main`'s head predates the PR             |
| Case-sensitive filesystem     | No. Linting and type-checking pass on Linux                           | Same container build. (One real case bug exists — see Known issues — but it does not fail the build)      |
| Lockfile drift                | **Real, but not this.** A correct lockfile still failed in 10s        | PR #116                                                                                                   |
| Missing build-time env vars   | No. The container build has none and succeeds                         | Same container build                                                                                      |

### Checked on 2026-11-06, with results

| Check                                                                          | Result                                                                                                                                                               |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Is the Vercel GitHub App still installed on the org?                           | **Yes** — installed, not suspended, scoped to selected repositories                                                                                                  |
| Can Vercel still reach this repo?                                              | **Yes** — it is still creating GitHub Deployment records and posting commit statuses, which it cannot do without repo access. **The GitHub side is not the problem** |
| Repo pathologies (submodules, oversized tree, archived, disabled)              | **None.** ~10.8MB, public, org-owned, no `.gitmodules`                                                                                                               |
| Do either of the failing projects belong to an account we can authenticate to? | **No.** Both are out of reach, so their plan, billing status and build settings cannot be inspected from here                                                        |

### A refinement worth checking first

Every push to this repo fans out to **two** Vercel projects, and today's pushes landed close
together. On Vercel, a deployment superseded by a newer one on the same branch is failed
immediately — which is what a 1-second "failure" usually is. Low concurrent-build allowances make
this more likely.

So the near-instant failures are plausibly superseded or queued-out deployments rather than a
separate fault. If that holds, there is only **one** real failure to explain: the ~3min build. Do
not spend time on the 1-second ones until that log has been read.

**Note for anyone working in this repo: a `git push` of any branch triggers a build on both Vercel
projects.** There is no way to push without deploying unless a project is disconnected or its
Ignored Build Step is configured.

## Root cause, verified 2026-11-06

**Vercel builds this app with Node.js 26. `next@12.3.7` cannot load under Node 26.**

Next 12 vendors its own copy of `jsonwebtoken` at
`node_modules/next/dist/compiled/jsonwebtoken/index.js`. That bundle includes
`buffer-equal-constant-time`, which reads `SlowBuffer.prototype` at module load:

```js
var n = t(300).Buffer;
var i = t(300).SlowBuffer;   // undefined on Node >= 26
...
var o = i.prototype.equal;   // TypeError
```

`buffer.SlowBuffer` was long deprecated and is **removed in Node 26**. So the module throws the
moment Next requires it, and the build dies:

```
TypeError: Cannot read properties of undefined (reading 'prototype')
    at 112 (/vercel/path0/node_modules/next/dist/compiled/jsonwebtoken/index.js:1:414)
Node.js v26.13.0
```

This is not our code. Nothing in `src/` or `pages/` imports `jsonwebtoken` — it is Next's own
vendored copy, loaded during `next build`.

### Evidence

| Check                                                    | Result                                                   |
| -------------------------------------------------------- | -------------------------------------------------------- |
| Vercel build log, branch `fix/vercel-lockfile-drift`     | `Node.js v26.13.0`, the `SlowBuffer` TypeError above     |
| `node:26-alpine` → `typeof require("buffer").SlowBuffer` | `undefined`                                              |
| `node:24-alpine` (v24.22.2) → same probe                 | `function`                                               |
| host Node v24.21.0 → same probe                          | `function`                                               |
| `next build` on host Node v24.21.0, pinned tree          | **exit 0**, every route compiled                         |
| `yarn install && yarn build` in `node:22-alpine`         | success (recorded above) — the tree builds fine on Linux |

**Not verified:** a full Linux build on Node 24 specifically. The container run for it could not
finish — the local Docker VM hit `ENOSPC`. The Node 24 evidence above is a host build plus a Linux
runtime probe, not a Linux build.

### Why the version drifted

`package.json` declared `engines.node: ">=18.0.0"`. Vercel treats that as a semver _range_, and
Node 26 satisfies it, so Vercel resolved it to the newest runtime it offers. Per Vercel's docs the
override has to name a major, e.g. `"24.x"`. There was also no `.nvmrc`, so nothing else pinned it.

The earlier ranked-hypotheses list in this runbook was wrong on all five counts. The closest,
"Node version pinned to 18.x", had the right subject and the wrong direction: the runtime was too
**new**, not too old. Everything account-side — plan, billing, org ownership, Git authorization —
was a dead end.

---

## Fix it

Pin the major version in the repository, which overrides the project setting:

```json
// package.json
"engines": { "node": "24.x", ... }
```

plus a `.nvmrc` containing `24`, so local work and CI agree.

Do **not** pin `22.x`: it is older, and nothing here needs it. Do not pin `26.x` until Next is
upgraded. Node 24 is the current Vercel default LTS and has `SlowBuffer`.

The durable fix is to get off Next 12, which is years out of support. Pinning Node 24 buys time; it
does not remove the hazard, because the next Node major Vercel defaults to may break Next 12 again.
Treat a Next upgrade as its own slice.

### Still to confirm after this lands

The near-instant (1–10s) failures in the table above are **not** explained by this. They may be
superseded/queued deployments, as the refinement section argues, or a second fault. Once a push
produces a green build, check whether any instant failures remain.

### Once deployments run again

**PR #116 is merged** (`42497e3`, 2026-11-06), so the lockfile blocker below is resolved. Kept for
the record: `yarn install --frozen-lockfile` used to fail on `main`, reproduced on macOS and in a
clean container:

```
error Your lockfile needs to be updated, but yarn was run with `--frozen-lockfile`.
```

`package.json` carries a large `resolutions` block of security pins, but the lockfile was never
regenerated after some were added — `jsonwebtoken@9.0.3` and `send@0.19.0` were declared and never
locked. That was a latent blocker that would have stopped the first build that actually got to install.
It was never the reason deploys failed — the Node version was.

**Then expect a large release.** Merging to `main` will ship roughly three months of undeployed
work, including the bank-detail validation and bulk-upload changes from 2026-11-06. Review what is
in `3c101be..main` before promoting, and watch the first production deploy.

### Rollback

Vercel keeps every successful deployment. In the dashboard, open the last known-good deployment
(`3c101be`, 2026-08-18) and use **Promote to Production**, or `vercel rollback` with team scope. No
database migration is involved in a frontend-only rollback.

---

## Verifying a deploy reached production

`sparkpayhq.com` renders client-side — every route returns the same ~26KB `app-loader` shell, so
`curl` cannot tell you what shipped. Check in a browser, or assert against the DOM after load:

```js
// in the browser console on https://sparkpayhq.com
document.querySelector('.mkt-footer__rc')?.textContent; // placeholder RC line: gone after PR #115
document.body.innerText.includes('Product overview'); // true once PR #115 is live
```

As of 2026-11-06 the live footer still shows `SparkPay Technologies Ltd · RC 1234567`, the
"Overview" label and a "RESOURCES" column, and 9 of its 11 link rows are unclickable at the row
centre — i.e. production predates PR #115.

---

## Known issues, not currently breaking the build

- **Jest cannot run at all.** `resolutions` pins `ansi-regex` to `6.2.2`, which is ESM-only, while
  Jest 27's `pretty-format` and `strip-ansi@6` `require()` it as CommonJS. No suite runs, including
  the pre-existing ones. Likely fix: `ansi-regex: 5.0.1` — patched for CVE-2021-3807 and still
  CommonJS. Changes a security pin, so it needs sign-off.
- **A case-mismatched import.** `src/layouts/dashboard-layout/DashBoardLayout.test.tsx` imports
  `./DashboardLayout` (lower-case `b`) while the file on disk is `DashBoardLayout.tsx`. Harmless on
  macOS, and it does not currently fail the Linux build, but it is a trap.
- **Broken imports in `src/_decomissioned_pages/`** — nine unresolvable module paths. Excluded from
  the build, still matched by `tsconfig`.
- **A hydration warning** on marketing pages: `Did not expect server HTML to contain a <div> in
  <div>`. Pre-existing — confirmed by re-testing with PR #115's changes stashed.
- **No `.nvmrc`**, so local and CI Node versions are unpinned.
