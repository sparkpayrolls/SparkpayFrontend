# SparkPay marketing site — masterplan

Source of truth: this file is the **plan** (phases, task IDs, exit gates). Live status is
[PROGRESS.md](PROGRESS.md) — never duplicated here. Deployment operations are
[docs/runbooks/deployment.md](docs/runbooks/deployment.md). The footer slice that closed on
2026-11-06 has its own closed plan in [plan.md](plan.md) and is not repeated below.

Standards applied: `wakanow-engineering-standards` (gates, branching, working agreement) and
`wakanow-documentation-standards` (this format). This repo has no `docs/ENGINEERING_STANDARDS.md`
and no `CLAUDE.md`; where the skill's default stack and this repo's reality disagree the repo wins,
and the gap is recorded under **Deviations from the standard stack**.

How to use: read **Findings** for what is wrong and the evidence, then work the phases in order. No
phase starts until the previous phase's exit gate has passed in that session and Daniel has signed
off. Every factual claim carries a **Verified** or **Assumed** tag. Dates are absolute.

- Date opened: 2026-11-06
- Scope: the public marketing surface — `pages/` (`/`, `/product`, `/pricing`, `/about`,
  `/security`, `/contact`, `/features/*`, `/legal/*`, `/book-a-demo`, `/request-access`),
  `src/components/marketing/**`, `src/styles/marketing/**`, plus `pages/_app.tsx` and
  `pages/_document.tsx` where the marketing path runs through them.
- Out of scope: the authenticated dashboard, the API, and anything behind `/login`.

---

## 1. Context

Daniel asked on 2026-11-06 for a UI/UX and positioning audit of the marketing site, with the brief
that it reads "too Nigeria focused" given that **pan-African expansion is the plan**. Two answers
from him bound the work and are recorded as decisions below: the testimonials on the site are from
real customers, and **no pan-African language is to be added to the site** — the copy stays specific
and true, and the positioning work is about removing accidental narrowness, not adding a continental
claim the product has not yet earned.

That audit ran against a site that had not deployed successfully in roughly three months. P0 below
is the fix for that, and it landed first because nothing else could be verified in production until
it did.

---

## 2. Findings

| ID   | Finding                                                                                                                                                                                                                                                                                                                                      | Evidence                                                                                                                                                 | Tag                                                       | Phase |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----- |
| M-1  | **Every Vercel build had failed since ~2026-08.** Vercel resolved `engines.node: ">=18.0.0"` to the newest runtime it had, Node 26.13.0. `next@12.3.7` vendors its own `jsonwebtoken`, which reads `SlowBuffer.prototype` at module load; Node 26 removed `buffer.SlowBuffer`, so the build threw a `TypeError` before it compiled anything. | Vercel build log supplied by Daniel 2026-11-06: `Node.js v26.13.0` + the `SlowBuffer` TypeError; `node_modules/next/dist/compiled/jsonwebtoken/index.js` | Verified — log read, fix shipped green                    | P0    |
| M-2  | **Public pages waited on a session before rendering.** `_app.tsx` wrapped every route in `AuthManager`, so a marketing visitor got `AppLoader` until a session lookup resolved. The prerendered HTML shipped an empty loader shell with no content — a correctness problem for visitors and an SEO problem for every marketing page.         | `pages/_app.tsx` before `610678d`; prerendered HTML contained `app-loader` and 0 footer links                                                            | Verified — reproduced in a local production build         | P1    |
| M-3  | **No `lang` attribute on `<html>`.** Screen readers guess the language; it also suppresses correct hyphenation and quote rendering.                                                                                                                                                                                                          | `pages/_document.tsx:7` before `610678d`                                                                                                                 | Verified — read in source                                 | P1    |
| M-4  | **Nav tap targets below the floor.** The theme toggle and the "Sign in" anchor were glyph-sized (~24px tall) rather than a usable target.                                                                                                                                                                                                    | `src/styles/marketing/_nav.scss`; measured 57x40 and 40x40 after the fix                                                                                 | Verified — measured in Chrome                             | P1    |
| M-5  | **The CTA label did not match what the button did.** Buttons said "Start free" and "Run your first payroll free" but every one of them routed to `/book-a-demo`. The visitor was promised self-serve signup and got a sales form.                                                                                                            | `pages/pricing.tsx`, `src/components/marketing/*` before `eb02fd7`                                                                                       | Verified — read in source                                 | P1    |
| M-6  | **The footer newsletter form was a dead stub.** `onSubmit` called `preventDefault()` and returned. Nothing recorded the address.                                                                                                                                                                                                             | `marketing-footer.component.tsx` before `eb02fd7`                                                                                                        | Verified — read in source                                 | P1    |
| M-7  | **68% of the CSS bundle is Ant Design that no marketing page renders.** The global stylesheet is 777,156 bytes; 529,011 of those bytes (68.1%) belong to rules whose selector contains `.ant-`. A marketing visitor downloads and parses the entire dashboard component library to read a landing page.                                      | Measured 2026-11-06 against `.next/static/css/78cacd282b43dcf9.css` from a local production build                                                        | Verified — measured                                       | P2    |
| M-8  | **FontAwesome is a render-blocking third-party stylesheet.** `_document.tsx` links `use.fontawesome.com/releases/v5.13.1/css/all.css` on every page, including marketing pages. It is _not_ in the bundle measured in M-7 — it is an additional blocking request to a third-party origin.                                                    | `pages/_document.tsx:20-25`                                                                                                                              | Verified — read in source                                 | P2    |
| M-9  | **The hero subhead leads with acronyms, not an outcome.** It opens on statutory vocabulary (PAYE, NHF, NSITF, ITF) before saying what the product does for the reader. It is also the single strongest source of the "Nigeria only" read, because those four acronyms are Nigeria-specific.                                                  | `src/components/marketing/home/home-page.component.tsx`                                                                                                  | Verified — read in source                                 | P3    |
| M-10 | **Feature naming hard-codes one country's statutory model into the nav.** "PAYE per state" and "Statutory remittances" are the two items in the Features mega-menu. Both are real and both are Nigeria-shaped; they are the product's nav-level self-description.                                                                            | `src/components/marketing/marketing-nav.component.tsx:6-17`                                                                                              | Verified — read in source                                 | P3    |
| M-11 | **Testimonial quotes use payment-gateway vocabulary, not payroll vocabulary.** The customers are real (D2), but the quotes do not describe the job the site is selling. Replacing them needs customer outreach, not a copy edit.                                                                                                             | Reviewed 2026-11-06 against the home page testimonial block                                                                                              | Verified — read in source                                 | P3    |
| M-12 | **The logo reads "ParkPay" at nav size.** The `S` closes up against the following letter at 26px. A design call, not a code fix.                                                                                                                                                                                                             | Observed in Chrome at nav size, 2026-11-06                                                                                                               | Verified — observed                                       | P3    |
| M-13 | **No skip link and incomplete landmarks** on the marketing layout, so a keyboard user tabs the whole nav on every page.                                                                                                                                                                                                                      | `src/components/marketing/marketing-layout.component.tsx`                                                                                                | Assumed — read in source, not tested with a screen reader | P4    |
| M-14 | **The test runner is broken repo-wide.** `ansi-regex@6.2.2` is ESM-only and Jest 27 loads it from its own reporter, outside `moduleNameMapper`, so `jest` dies with `TypeError: ansiRegex is not a function` before running a suite. Individual suites only run under a scratchpad config with a CJS shim and a custom plain reporter.       | Reproduced 2026-11-06; workaround config lives outside the repo                                                                                          | Verified — reproduced                                     | P5    |
| M-15 | **Two pre-existing `tsc` errors** in `src/layouts/dashboard-layout/DashBoardLayout.test.tsx` predate this work and keep gate 1 from ever being clean.                                                                                                                                                                                        | `tsc --noEmit` 2026-11-06                                                                                                                                | Verified — reproduced                                     | P5    |
| M-16 | **Next 12.3.7 is years out of support.** M-1 was a symptom: the framework cannot survive a runtime it predates. The next time Vercel moves its default major, the same class of failure returns. The Node pin buys time, it does not fix this.                                                                                               | `package.json`; M-1                                                                                                                                      | Verified                                                  | P6    |

### Ruled out

- **The repeated 1–10 second Vercel failures recorded in the runbook are not explained by M-1.** A
  SlowBuffer failure takes longer than that. They are most likely superseded deployments, but that is
  _Assumed_ — not confirmed — and it is the one open thread from P0. See Q1.
- **`pull_request_template.md` was not a cause.** Vercel does not read it. _Verified._
- **Not an account, billing or plan problem.** Five account-side hypotheses were ranked in an earlier
  session (Hobby plan vs org repo, billing, project paused, Node pinned to 18, build resource limits)
  and **all five were wrong**. The closest one had the right subject and the wrong direction: the
  runtime was too new, not too old. Recorded here so the next person does not re-run that search.

---

## 3. Phases

### P0 — Restore deployments

**Goal:** a push to `main` produces a green production build.

| Task | Description                                                        |
| ---- | ------------------------------------------------------------------ |
| P0.1 | Pin `engines.node` to a major (`24.x`) so Vercel stops choosing 26 |
| P0.2 | Add `.nvmrc` so local and CI agree                                 |
| P0.3 | Rewrite the deployment runbook around the verified root cause      |

**Exit gate:** a preview build green, then a production build green on `main`, both confirmed in the
Vercel API — not inferred from the absence of an error.
**Depends on:** nothing. **Blocks:** every other phase, because nothing else is verifiable in
production until this passes.

### P1 — Public pages render honestly

**Goal:** a first-time visitor gets content, not a loader, and every button's label matches where it
goes.

| Task | Description                                                                              | Finding |
| ---- | ---------------------------------------------------------------------------------------- | ------- |
| P1.1 | Route marketing pages past `AuthManager` without breaking the pages that do call the API | M-2     |
| P1.2 | `<Html lang="en">`                                                                       | M-3     |
| P1.3 | Nav theme toggle and "Sign in" to a 40px target                                          | M-4     |
| P1.4 | Rename every CTA that routes to `/book-a-demo` to "Book a demo"                          | M-5     |
| P1.5 | Remove the newsletter form and its styles and tests                                      | M-6     |

**Exit gate:** gates 1, 3 and 9 pass; the footer suite passes; prerendered HTML for `/`, `/pricing`,
`/product` and `/about` contains real content and no `app-loader`; `/book-a-demo` still loads its
availability; a preview build green.
**Depends on:** P0. **Risk:** skipping `AuthManager` also skips `$api.registerInterceptors`, so any
marketing page that calls the API would send unauthenticated requests. Mitigated by splitting
`MARKETING_API_ROUTES` out and wrapping those routes in an interceptor-only provider.

### P2 — Page weight

**Goal:** a marketing visitor downloads marketing CSS, not the dashboard's component library.

| Task | Description                                                                               | Finding |
| ---- | ----------------------------------------------------------------------------------------- | ------- |
| P2.1 | Move the antd stylesheet import out of the global path so only dashboard routes pull it   | M-7     |
| P2.2 | Drop the FontAwesome CDN link from marketing pages, or self-host the glyphs actually used | M-8     |
| P2.3 | Record before/after bundle bytes and a Lighthouse score for `/` in PROGRESS.md            | —       |

**Exit gate:** gates 1, 3, 9; the marketing CSS payload measurably smaller with the number recorded;
**and a dashboard route verified to still render correctly in a browser** — this phase touches a
global import, so the dashboard is the thing most likely to break.
**Depends on:** P1 merged. **Risk:** high blast radius for a performance win. Ship it on its own
branch, on its own PR, with the dashboard check in the PR body.

### P3 — Positioning and copy

**Goal:** the site stops reading as Nigeria-only without claiming a reach the product has not earned.

| Task | Description                                                                                                                 | Finding |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | ------- |
| P3.1 | Rewrite the hero subhead: outcome first, statutory acronyms second — **Daniel's wording sign-off required before any edit** | M-9     |
| P3.2 | Reconsider the two Features mega-menu labels so the nav is not a one-country statutory list                                 | M-10    |
| P3.3 | Collect replacement testimonial quotes that describe payroll — needs customer outreach, not a copy edit                     | M-11    |
| P3.4 | Logo legibility at nav size — design call                                                                                   | M-12    |

**Exit gate:** Daniel's sign-off on every copy string, and **no pan-African language added** (D3).
**Depends on:** P1 merged. **Blockers:** P3.1 blocked on Daniel's wording; P3.3 blocked on customer
outreach. Until both clear, P3 cannot close — do P2 and P4 first.

### P4 — Accessibility completion

| Task | Description                                                      | Finding |
| ---- | ---------------------------------------------------------------- | ------- |
| P4.1 | Skip link to `main` on the marketing layout                      | M-13    |
| P4.2 | Audit the remaining marketing tap targets against the 40px floor | M-4     |
| P4.3 | Run an automated accessibility pass and record what it finds     | —       |

**Exit gate:** gates 1, 3, 9; the automated pass clean or every exception justified in writing.
**Depends on:** P1 merged.

### P5 — Unblock the gates

**Goal:** `verify` is a command that actually runs, so a tick in the tracker can mean something.

| Task | Description                                                                                           | Finding |
| ---- | ----------------------------------------------------------------------------------------------------- | ------- |
| P5.1 | Resolve the `ansi-regex` ESM/CJS conflict in the repo — **needs sign-off, it is a dependency change** | M-14    |
| P5.2 | Fix the two `tsc` errors in `DashBoardLayout.test.tsx`                                                | M-15    |
| P5.3 | Add a `verify` script running typecheck → lint → test in order, stopping at the first failure         | —       |
| P5.4 | Require `verify` green on `main`                                                                      | —       |

**Exit gate:** `yarn verify` exits 0 from a clean checkout.
**Depends on:** nothing technically — but it is sequenced here because P1 was urgent and this is not.
**Note:** until P5 closes, **gate 4 cannot be claimed for any phase**. Every tracker tick before then
names which suites actually ran.

### P6 — Get off Next 12

**Goal:** the framework stops being a standing outage risk.

| Task | Description                                                                  | Finding |
| ---- | ---------------------------------------------------------------------------- | ------- |
| P6.1 | ADR: target version, Pages Router vs App Router, and the migration sequence  | M-16    |
| P6.2 | Upgrade, one major at a time, each with a green `verify` and a preview build | M-16    |

**Exit gate:** on a supported Next major, `verify` green, production green, no regression in the
marketing or dashboard surface.
**Depends on:** P5 — do not attempt a framework migration without a working test runner.

### Dependency graph

```text
P0 (deployments)  ── blocks everything
   └── P1 (render honestly)
          ├── P2 (page weight)
          ├── P3 (positioning)   [blocked: Daniel's copy, customer outreach]
          └── P4 (accessibility)
P5 (unblock gates)  ── independent, but blocks P6 and blocks claiming gate 4 anywhere
   └── P6 (Next upgrade)
```

---

## 4. Gates

Adapted from `wakanow-engineering-standards` §3 to this repo's real scripts. Gates that the repo
cannot currently satisfy are marked and the reason given, rather than quietly dropped.

| #   | Gate            | Command in this repo                   | State                                                                                        |
| --- | --------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | Typecheck       | `npx tsc --noEmit`                     | Available — but 2 pre-existing errors (M-15) until P5.2                                      |
| 2   | No emit         | covered by `--noEmit`                  | Available                                                                                    |
| 3   | Lint            | `yarn lint`                            | Available, clean                                                                             |
| 4   | Unit tests      | `yarn test`                            | **Broken repo-wide** (M-14). Suites run only under a scratchpad config; name which ones ran. |
| 5   | Integration     | —                                      | N/A — this is a frontend against a separate API                                              |
| 6   | Anti-regression | a failing test first, per standards §1 | Partly — constrained by gate 4                                                               |
| 7   | Security        | `yarn npm audit`                       | Not run in this slice; marketing pages take no user input except `/book-a-demo`              |
| 8   | Load            | —                                      | N/A for a marketing surface; P2 uses Lighthouse instead                                      |
| 9   | Build           | `yarn build`                           | Available, clean                                                                             |
| 10  | Migrations      | —                                      | N/A — no database in this repo                                                               |

There is **no single `verify` script yet**; that is P5.3. Until then every tracker tick lists the
commands that actually ran and their results.

---

## 5. Decisions

| ID  | Date       | Decision                                                                                                                                           | Who                        |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| D1  | 2026-11-06 | Pin `engines.node` to `24.x`, a major, not a range. A range lets Vercel pick a runtime the framework predates — that is what broke the site.       | Claude, approved by Daniel |
| D2  | 2026-11-06 | The testimonials on the site are from real customers and stay. Only their wording is in question (M-11).                                           | Daniel                     |
| D3  | 2026-11-06 | Pan-African expansion is the plan, but **no pan-African language goes on the site**. Remove accidental narrowness; do not add a continental claim. | Daniel                     |
| D4  | 2026-11-06 | Every CTA that routes to `/book-a-demo` says "Book a demo". The label matches the destination.                                                     | Daniel                     |
| D5  | 2026-11-06 | The newsletter form is removed rather than wired up. Nothing was recording the addresses and no list exists to send to.                            | Daniel                     |
| D6  | 2026-11-06 | Deployment is never pointed at Daniel's personal Vercel account (`adeydan05`).                                                                     | Daniel                     |

---

## 6. Assumptions

| ID  | Assumption                                                                                                                                                                                                                                                             | Owner to confirm |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| A1  | The short 1–10s Vercel failures in the runbook were superseded deployments, not a second fault.                                                                                                                                                                        | Claude — Q1      |
| A2  | A Linux Node 24 build works. The fix was verified on a host macOS Node 24.21.0 build and green Vercel builds; a Linux container build was never completed (Docker ran out of disk). The green Vercel builds are strong evidence, but the container matrix was not run. | Claude           |
| A3  | No marketing page other than `/book-a-demo` calls the API. Established by grepping for `$api.` and `config()` across the marketing surface.                                                                                                                            | Claude           |
| A4  | The footer brand column reads acceptably now the newsletter is gone (logo + one line against four link columns).                                                                                                                                                       | Daniel           |

---

## 7. Open questions

- [ ] **Q1** — Are the short Vercel failures in the runbook a second fault? _Owner: Claude._
- [ ] **Q2** — Hero subhead wording. Blocks P3.1; nothing in P3 copy ships without it. _Owner: Daniel._
- [ ] **Q3** — Can we get fresh testimonial quotes from the existing customers? Blocks P3.3. _Owner: Daniel._
- [ ] **Q4** — Sign-off to change the `ansi-regex` pin to `5.0.1`? Blocks P5.1, which blocks gate 4 everywhere. _Owner: Daniel._
- [ ] **Q5** — Keep the "Start free" → "Book a demo" rename on the Starter tier? It went slightly beyond the approved scope (see PROGRESS.md). _Owner: Daniel._

---

## 8. Risks

| Risk                                                         | Impact                                                             | Mitigation                                                                                             |
| ------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Next 12 breaks again on the next Vercel default-major move   | Total outage, same class as M-1, up to months before it is noticed | P6. Interim: the `24.x` pin, plus the runbook's root-cause section so the next diagnosis takes minutes |
| P2 touches a global style import                             | Dashboard styling regression, invisible from the marketing surface | Own branch, own PR, dashboard render verified in a browser and stated in the PR body                   |
| Gate 4 cannot be claimed until P5                            | A tick could overstate what was proven                             | Every tick names the suites that ran; "build-complete" and "gated" stay separate words                 |
| Nobody notices a failed deployment                           | Repeat of the three-month outage                                   | Not yet mitigated — no deploy alerting exists. Candidate for P5 or its own slice                       |
| Copy changes drift toward a claim the product has not earned | Credibility, and a direct conflict with D3                         | Daniel signs off on every string in P3                                                                 |

---

## 9. Out of scope

The authenticated dashboard's own UI, the API, pricing or plan changes, anything that moves money,
and any new marketing page. Lead capture beyond `/book-a-demo` is out of scope until there is a
system to receive it (see D5).

---

## 10. Deviations from the standard stack

The house default is Next App Router + Tailwind/shadcn + pnpm + vitest + Playwright. This repo is
**Next 12.3.7 Pages Router, SCSS with hand-rolled tokens, yarn, Jest 27, and no e2e framework**. The
repo wins; nothing here proposes a stack migration except P6, which is about support, not taste.
Browser verification is done by driving Chrome directly rather than with Playwright.
