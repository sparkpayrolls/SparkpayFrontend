# SparkPay frontend — progress

Source of truth: this file is **status only**. The plan is
[MARKETING_MASTERPLAN.md](MARKETING_MASTERPLAN.md); operations are
[docs/runbooks/deployment.md](docs/runbooks/deployment.md). Nothing here is duplicated from those.

Rules for this file, from `wakanow-engineering-standards` §1:

- A box is ticked **only** after its exit gate passed in the session that ticked it, with the date,
  the commit SHA, and the commands that ran. Never on assumption.
- **Build-complete and gated are different words.** A phase can be built and still not closed.
- Gate 4 (unit tests) cannot be claimed anywhere until P5 lands (see M-14). Until then every entry
  names which suites actually ran, under which config.

Last updated: **2026-11-06**

---

## Phase status

| Phase                             | State                            | Branch / PR                        | Closed     |
| --------------------------------- | -------------------------------- | ---------------------------------- | ---------- |
| P0 — Restore deployments          | ✅ **Closed**                    | `fix/pin-node-24` → PR #118        | 2026-11-06 |
| P1 — Public pages render honestly | 🟡 **Build-complete, in review** | `fix/marketing-audit-p1` → PR #119 | —          |
| P2 — Page weight                  | ⬜ Not started                   | —                                  | —          |
| P3 — Positioning and copy         | 🔴 Blocked (Q2, Q3)              | —                                  | —          |
| P4 — Accessibility completion     | ⬜ Not started                   | —                                  | —          |
| P5 — Unblock the gates            | 🔴 Blocked (Q4)                  | —                                  | —          |
| P6 — Get off Next 12              | ⬜ Not started                   | —                                  | —          |

---

## P0 — Restore deployments ✅ closed 2026-11-06

- [x] **P0.1** Pin `engines.node` to `24.x` — `31674eb`, 2026-11-06
- [x] **P0.2** Add `.nvmrc` — `31674eb`, 2026-11-06
- [x] **P0.3** Runbook rewritten around the verified root cause — `31674eb`, 2026-11-06

**Merged:** `b2fb56f` (PR #118), 2026-11-06.

**Exit gate — passed.**

| Gate              | Command / check               | Result                                                                                              |
| ----------------- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| Preview build     | Vercel, PR #118               | **success** in ~180s                                                                                |
| Production build  | Vercel, `main` at `b2fb56f`   | **success** in ~180s                                                                                |
| Live confirmation | `GET sparkpayhq.com/about-us` | `308 → /about` — a redirect that exists only in the new build, so production is serving this commit |
| Browser check     | `sparkpayhq.com` in Chrome    | every footer fix from the previous slice rendering                                                  |

**What this closed.** Roughly three months of silently failing deployments, ending 2026-11-06. Root
cause and the disproved hypotheses are in the masterplan (M-1) and the runbook.

**Still open from this phase:** Q1 — the short 1–10s failures recorded in the runbook are **not**
explained by the Node fix and may be a second fault. Assumed superseded deployments (A1), not
confirmed.

**Carries a caveat:** A2 — the fix was verified on a host macOS Node 24.21.0 build and by green
Vercel builds. A Linux container build was never completed; Docker ran out of disk mid-run and the
containers were deliberately not pruned (16 Supabase/Postgres containers were running).

---

## P1 — Public pages render honestly 🟡 build-complete, in review

Branch `fix/marketing-audit-p1`, **PR #119**, two commits:

- `610678d` — render public pages without waiting on a session
- `eb02fd7` — say "Book a demo" and drop the newsletter stub

- [x] **P1.1** Marketing pages routed past `AuthManager` — `610678d`
- [x] **P1.2** `<Html lang="en">` — `610678d`
- [x] **P1.3** Nav theme toggle and Sign in to a 40px target — `610678d`
- [x] **P1.4** Every `/book-a-demo` CTA renamed — `eb02fd7`
- [x] **P1.5** Newsletter form, styles and tests removed — `eb02fd7`

**Not yet ticked:** the phase itself. The gates below passed and the preview is green, but the PR is
unreviewed and unmerged, so P1 is **build-complete, not closed**.

### Gate results, 2026-11-06, at `eb02fd7`

| #   | Gate       | Command                                                                  | Result                                                                                                                                                       |
| --- | ---------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Typecheck  | `npx tsc --noEmit`                                                       | **2 errors, both pre-existing** in `DashBoardLayout.test.tsx` (TS1149 casing, TS2741 missing `pageTitle`). Nothing from this branch. Tracked as M-15 / P5.2. |
| 3   | Lint       | `next lint`                                                              | **clean** — "No ESLint warnings or errors"                                                                                                                   |
| 4   | Unit tests | `jest -c <scratchpad>/jestshim/jest.config.js marketing-footer.test.tsx` | **9/9 passed.** Only this suite ran. `yarn test` is broken repo-wide (M-14), so **gate 4 is not claimed for this phase.**                                    |
| 9   | Build      | `next build`                                                             | **clean**                                                                                                                                                    |

### Behaviour verified in Chrome against a local production build

| Check                                                      | Result                              |
| ---------------------------------------------------------- | ----------------------------------- |
| `document.documentElement.lang`                            | `"en"`                              |
| Loader present on a marketing page                         | `false` — was the whole page before |
| Footer links rendered                                      | 11                                  |
| "Book a demo" instances, all → `/book-a-demo`              | 5                                   |
| Footer form / input                                        | none                                |
| "Sign in" target                                           | 57 × 40 px                          |
| Theme toggle target                                        | 40 × 40 px                          |
| `/book-a-demo` still renders and loads availability        | yes — the interceptor split works   |
| Prerendered HTML for `/`, `/pricing`, `/product`, `/about` | 11 footer links, **0** `app-loader` |

### Unplanned win, worth recording

P1.1 was scoped as a correctness fix for visitors. It also fixed SEO on every marketing page: the
prerendered HTML previously shipped an empty loader shell, so a crawler saw no content on any public
page. That was never costed and nobody asked for it, but it is probably the largest commercial effect
in this phase.

### Preview build

**success** in ~150s, both projects:

- `https://sparkpay-frontend-42wf1e4pi-payeasy-africa.vercel.app`
- `https://sparkpay-frontend-lx4cr0w6o-mhizterkeyzs-projects.vercel.app`

Both redirect to `vercel.com/sso-api` for an unauthenticated client (team Deployment Protection), so
they were **not** fetched directly; verification above is against the identical tree built locally.

### Flagged for Daniel — scope

P1.4 renamed the Starter tier's **"Start free" → "Book a demo"**. That went slightly beyond what was
approved: Starter genuinely is free, so the old label was not false, only inconsistent with the
destination. Reverting it is one line. Tracked as **Q5**.

Left deliberately unchanged because they are true prose about the real free tier, not CTAs:
`pages/pricing.tsx:15`, `pages/pricing.tsx:105` (meta description), `pages/security.tsx:73`.

---

## P2 — Page weight ⬜ not started

Nothing built. The measurement is done and is in the masterplan (M-7, M-8): the global stylesheet is
777,156 bytes, of which **529,011 bytes — 68.1% — are `.ant-` rules** that no marketing page renders.
Measured 2026-11-06 against `.next/static/css/78cacd282b43dcf9.css`.

**Correction to an earlier estimate:** I had described this as "antd + FontAwesome in the marketing
CSS". FontAwesome is **not** in that bundle — it is a separate render-blocking `<link>` to
`use.fontawesome.com` in `_document.tsx`. Two different problems, both real, now split as P2.1 and P2.2.

This phase touches a global import, so its exit gate requires a **dashboard route verified in a
browser** before the PR is opened.

---

## P3 — Positioning and copy 🔴 blocked

- P3.1 (hero subhead) blocked on **Q2** — Daniel's wording. No copy ships without it.
- P3.3 (testimonials) blocked on **Q3** — customer outreach, not a copy edit. The customers are real
  (D2); only the quotes are wrong for the job the site sells.

P3.2 and P3.4 are unblocked but are a naming and a design call respectively, so they are better taken
together with P3.1 than piecemeal.

Binding constraint on this whole phase: **D3 — no pan-African language is added to the site.**

---

## P4 — Accessibility completion ⬜ not started

Unblocked once P1 merges. Nothing built.

---

## P5 — Unblock the gates 🔴 blocked

- P5.1 blocked on **Q4** — changing the `ansi-regex` pin is a dependency change and needs sign-off.
- P5.2, P5.3, P5.4 not started.

**This is the phase that makes this tracker trustworthy.** Until it closes, "all tests pass" is not a
statement this repo can make, and every tick above says so explicitly instead of implying otherwise.

The working Jest configuration currently lives **outside the repo**, in
`/private/tmp/claude-502/-Users-daniel-olaniyan-SparkpayFrontend/dc21c6c0-2308-4e11-8297-4c24b4d36a52/scratchpad/jestshim/`
(a CJS `ansi-regex` shim plus a custom plain reporter — Jest's own reporter loads `ansi-regex`
outside `moduleNameMapper`, so the shim alone is not enough). It is session-scoped and **will be lost**.
P5.1 is where it becomes real.

---

## P6 — Get off Next 12 ⬜ not started

Nothing built. No ADR yet. Depends on P5.

---

## Housekeeping

- [ ] Delete four merged remote branches: `fix/pin-node-24`, `fix/vercel-lockfile-drift`,
      `fix/marketing-scroll-to-top`, `feature/marketing-footer-fix`. **Daniel to do** — the delete was
      permission-blocked here.
- [ ] No deploy alerting exists. A failed production build is silent, which is how M-1 went unnoticed
      for three months. Not yet assigned to a phase.
