# Runbook: deployment

**Current production state, 2026-11-06: deployments are broken and have been since 2026-08-18.**
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

### Most likely causes — all account-side

Ranked. None are fixable from this repository.

1. **Plan vs. repo ownership.** The repo belongs to the `sparkpayrolls` GitHub _organization_.
   Hobby-plan Vercel projects cannot build from org-owned repos, and that fails instantly. The
   second project, `mhizterkeyzs-projects`, looks like a personal account.
2. **Billing, spend cap, or a suspended account.**
3. **Project paused**, or the Git integration's repository authorization revoked.
4. **Node version pinned to 18.x** in project settings — no longer an available Vercel runtime.
   `package.json` declares `engines.node: ">=18.0.0"` and there is no `.nvmrc`.
5. **Build resource limits** (memory/time) on the builder. This is the only one of the five that
   would produce the ~3min failure rather than an instant one, and it is the least testable from
   here — the same tree builds fine locally in a container with no imposed limit.

That two independent Vercel projects fail identically on the same commits points at either the
GitHub integration or both accounts' standing, rather than at either project's settings.

---

## Fix it: first lever

Read the log. A 10-second failure normally states its reason on the first line.

```bash
# needs membership of the team that owns the project
npx vercel inspect dpl_Fs9aChLpHNVGhqdCvx1MpVVhfYyx --logs --scope payeasy-africa  # the ~3min one
npx vercel inspect dpl_9UxPiwvHCE4xoLAe1Uqek2RpRhEJ --logs --scope payeasy-africa  # a 10s one
```

Or open the deployment in the dashboard:
`https://vercel.com/payeasy-africa/sparkpay-frontend/9UxPiwvHCE4xoLAe1Uqek2RpRhEJ`

Then, in the Vercel dashboard for **each** of the two projects, check in this order:

1. **Account status** — banner about billing, spend limit, or a blocked account.
2. **Plan vs. org repo** — if Hobby, either upgrade the project's owner to Pro or transfer the
   project to a team that is.
3. **Settings → Git** — is the repository still connected and authorized?
4. **Settings → General → Node.js Version** — set it to a supported version (22.x or later).
5. **Is the project paused?**

Decide whether both projects should still deploy this repo. Two projects building every commit
doubles build minutes and makes every PR show two checks. If `mhizterkeyzs-projects` is a leftover
personal account, disconnect it.

### Once deployments run again

Merge **PR #116** before anything else. `yarn install --frozen-lockfile` genuinely fails on `main`
today, reproduced on macOS and in a clean container:

```
error Your lockfile needs to be updated, but yarn was run with `--frozen-lockfile`.
```

`package.json` carries a large `resolutions` block of security pins, but the lockfile was never
regenerated after some were added — `jsonwebtoken@9.0.3` and `send@0.19.0` were declared and never
locked. This is a latent blocker that will stop the first build that actually gets to install.

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
