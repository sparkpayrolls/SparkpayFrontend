# Marketing footer fix — plan

> **Status: closed 2026-11-06.** This slice shipped. It is kept for its findings and evidence.
> Current plan: [MARKETING_MASTERPLAN.md](MARKETING_MASTERPLAN.md). Current status:
> [PROGRESS.md](PROGRESS.md). Finding F-3 (the newsletter stub) was later resolved by removing
> the form outright rather than wiring it up — see decision D5 in the masterplan.

Source of truth: this file is the **plan** for the marketing footer slice. Status lives in the
tracker tables below and is ticked only in the PR that does the work. Standards applied:
`wakanow-engineering-standards` (gates, branching, working agreement) and
`wakanow-documentation-standards` (this format). This repo has no `docs/ENGINEERING_STANDARDS.md`
or `CLAUDE.md`; where the skill's defaults and this repo's reality disagree, the repo wins and the
difference is recorded under **Deviations from the standard stack**.

How to use: read **Findings** for what is broken and the evidence, then work the phases in order.
No phase starts until the previous phase's exit gate has passed in that session. Every finding has
a **Verified** or **Assumed** tag. Dates are absolute.

- Date opened: 2026-11-06
- Branch: `feature/marketing-footer-fix` (off `main` at `ab34a11`)
- Surface: `src/components/marketing/marketing-footer.component.tsx`,
  `src/styles/marketing/_footer.scss`

---

## 1. Context

The marketing footer renders on every page through `MarketingLayout`
(`src/components/marketing/marketing-layout.component.tsx:3`). Daniel reported on 2026-11-06 that
"a lot of the things there are not clicking properly" and asked for the registration-number line to
be removed outright.

The investigation on 2026-11-06 was **static only**. `node_modules` is absent from this checkout and
`yarn` is not installed on the machine, so the footer was never rendered or clicked in a browser
during that session. Every finding below is tagged accordingly, and **P0** exists purely to close
that gap before anything is changed.

---

## 2. Findings

| ID  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Evidence                                                                                                                                   | Tag                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| F-1 | **Verified in Chrome 2026-11-06.** The `li` measured 146x27.2px while the `<a>` measured 67x18.3px; `elementFromPoint` at the row centre returned `LI`, at the right edge `LI`, in the gap `UL` — only the glyphs returned `A`. Footer links have a text-sized hit area. `.mkt-footer__link` sets only font-size, colour and text-decoration, so the anchors stay `display: inline` and the clickable box is the glyph box. The `<li>` rows are full column width with `gap: 0.65rem` between them, so most of each row is dead space. This is the most likely cause of the reported misses. | `src/styles/marketing/_footer.scss:111-119`; `_footer.scss:102-109`; the focus ring in Daniel's screenshot hugs "Overview" with no padding | Verified                                               |
| F-2 | The footer logo is not a link. It is wrapped in a plain `<span>`, while the nav logo links to `/`. Users who click it get nothing.                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `marketing-footer.component.tsx:41-48` vs `marketing-nav.component.tsx:94-99`                                                              | Verified — read in source                              |
| F-3 | The newsletter form is a dead stub. `onSubmit` calls `preventDefault()` and returns. No validation, no success or error state, no `name` on the input, no `required`. Submitting looks like a broken button.                                                                                                                                                                                                                                                                                                                                                                                 | `marketing-footer.component.tsx:52-72`                                                                                                     | Verified — read in source                              |
| F-4 | The registration line `SparkPay Technologies Ltd · RC 1234567` is a placeholder number shipped to production.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `marketing-footer.component.tsx:95-97`; style at `_footer.scss:132-134`                                                                    | Verified — read in source                              |
| F-5 | "Statutory remittances" wraps to two lines in the four-column grid, breaking the baseline rhythm against the neighbouring columns.                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `_footer.scss:83-91` (4 columns above 640px); visible in the screenshot                                                                    | Verified — visible in the supplied screenshot          |
| F-6 | Column titles are `<h4>` inside a page whose outline runs `h1` → `h2`, so the level is skipped. The link columns are not wrapped in a `<nav>` landmark, so assistive tech gets no way to identify or skip the footer.                                                                                                                                                                                                                                                                                                                                                                        | `marketing-footer.component.tsx:75-90`                                                                                                     | Verified — read in source                              |
| F-7 | Labels disagree with the nav. The footer calls `/product` "Overview" while the nav calls the same page "Product". "Sign in" sits under **Resources**, which is an account action, not a resource.                                                                                                                                                                                                                                                                                                                                                                                            | `marketing-footer.component.tsx:7` and `:24`; `marketing-nav.component.tsx:102-104`                                                        | Verified — read in source                              |
| F-8 | (not reproduced; fixed defensively) `new Date().getFullYear()` is evaluated during render, so a server render on 31 Dec and a client hydrate on 1 Jan disagree and React logs a hydration mismatch. One night a year, low impact.                                                                                                                                                                                                                                                                                                                                                            | `marketing-footer.component.tsx:94`                                                                                                        | Assumed — standard Next behaviour, not reproduced here |

### Ruled out

- **Routing is not broken.** Every footer `href` resolves to a real page: `/product`, `/features/paye`,
  `/features/remittances`, `/pricing`, `/about`, `/security`, `/contact`, `/login`, `/book-a-demo`,
  `/legal/privacy`, `/legal/terms` all exist under `pages/`. _Verified — file listing._
- **The `<Link><a>` nesting is correct.** This repo is Next 12.3.7, where legacy link behaviour is the
  default and the nav uses the identical pattern. _Verified — `package.json`, `next.config.js`._
- **Contrast passes.** `--text-on-ink-soft` `#9aa6c0` on `--bg-ink` `#0c1220` is roughly 7.7:1, above
  WCAG AA for body text in both themes. _Assumed — computed by hand from
  `src/styles/marketing/_tokens.scss:9-16` and `_theme.scss:9-10`, not run through a checker._

### Noted, out of this slice

Stale duplicates of footer targets are still routable and will compete with the canonical pages in
search: `pages/about-us/`, `pages/privacy-policy/`, `pages/terms&conditions/`. The footer already
points at the correct `/about` and `/legal/*` pages. _Verified — file listing._ Raise separately.

---

## 3. Phases

### P0 — Reproduce before changing anything

**Goal:** turn F-1 and F-8 from Assumed into Verified, and get a working local environment so the
fix can be checked rather than asserted.

| Task | Description                                                                                                                                           |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0.1 | Install dependencies from the committed `yarn.lock` (install Yarn Classic, or use `npx yarn@1 install` — do **not** regenerate the lockfile with npm) |
| P0.2 | Run `yarn dev`, open `/`, and click each of the eleven footer links in the dead space beside the label and on the label. Record which miss            |
| P0.3 | Measure the rendered hit box of `.mkt-footer__link` in devtools and note it here                                                                      |
| P0.4 | Submit the newsletter form and confirm the observed behaviour matches F-3                                                                             |

**Exit gate:** F-1 is re-tagged Verified or Assumed-wrong with the measured hit-box height recorded
in this file. If the real cause turns out to be something else, stop and revise the plan before P1.

**Depends on:** nothing. **Blockers:** none known.

---

### P1 — Remove the placeholder registration line

**Goal:** the RC line is gone from every page. Smallest, highest-certainty change; ships first so it
is not held up by anything else.

| Task | Description                                                                                                                                     |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| P1.1 | Delete the `mkt-footer__rc` span from `marketing-footer.component.tsx:95-97`                                                                    |
| P1.2 | Delete the now-unused `&__rc` block from `_footer.scss:132-134`                                                                                 |
| P1.3 | Keep `&__base` as `justify-content: space-between` only if something still occupies the right-hand slot; otherwise the copyright line sits left |

**Exit gate:** gates 1, 3, 4, 9 below pass; `grep -rn "1234567" src pages` returns nothing.

**Depends on:** P0.

---

### P2 — Fix the hit areas and the dead logo

**Goal:** every clickable thing in the footer has a target a person can actually hit.

| Task | Description                                                                                                                                                                                                               |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2.1 | Give `.mkt-footer__link` `display: inline-block` with vertical padding so each row is a ~40px target, and reduce the `ul` `gap` to compensate so the visual rhythm is unchanged                                           |
| P2.2 | Confirm the padded boxes do not overlap, which would make the row above steal the row below's clicks                                                                                                                      |
| P2.3 | Wrap the footer logo in `<Link href="/">` with `<a className="mkt-footer__brand" aria-label="SparkPay home">`, mirroring `marketing-nav.component.tsx:94-99`, and keep the existing `&__brand` `inline-flex` styling      |
| P2.4 | Add a visible `:focus-visible` treatment for footer links on the ink background, since the global rule at `src/styles/marketing/_base.scss:101` is not tuned for a dark surface — check it renders before adding anything |

**Exit gate:** in a browser at 1440px, 768px and 375px, each of the eleven links and the logo is
clickable across the full height of its row; keyboard tab order reaches every one with a visible
ring. Gates 1, 3, 4, 9 pass.

**Depends on:** P0, P1.

---

### P3 — Make the newsletter form behave honestly

**Goal:** Daniel chose **option (b)** on 2026-11-06 (D2): keep the form, give it real client-side
validation and an honest end state. The form still has no backend, so the copy must not promise a
subscription that nothing records.

| Task | Description                                                                                                                                                                                                               |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P3.1 | Add `name="email"`, `required`, `autoComplete="email"` and `inputMode="email"` to the input                                                                                                                               |
| P3.2 | Hold `idle \| invalid \| submitted` in component state; validate on submit, not on every keystroke                                                                                                                        |
| P3.3 | On invalid, render an inline error tied to the input with `aria-describedby` + `aria-invalid`, and move focus to the input                                                                                                |
| P3.4 | On valid, replace the row with a confirmation and announce it in a `role="status"` live region. **Copy must be honest** — see R-3 and Q-3; do not ship "we'll be in touch" until there is somewhere for the address to go |
| P3.5 | Keep the button disabled while the submitted state is showing so a second click cannot re-fire                                                                                                                            |
| P3.6 | Leave the `// wired to a real endpoint later` comment, updated to name the follow-up                                                                                                                                      |

**Exit gate:** unit tests cover empty, malformed and valid submissions and assert the rendered state
and the ARIA wiring for each. Gates 1, 3, 4, 9 pass. Q-3 is answered and the shipped copy matches
the answer.

**Depends on:** P0.

---

### P4 — Semantics and labels

**Goal:** the footer is navigable by assistive tech and its labels agree with the nav.

| Task | Description                                                                                                                            |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------- |
| P4.1 | Wrap `.mkt-footer__cols` in `<nav aria-label="Footer">`                                                                                |
| P4.2 | Change the column titles from `<h4>` to `<p className="mkt-footer__col-title">` so no heading level is skipped; the style is unchanged |
| P4.3 | Fix F-5 — shorten "Statutory remittances" or stop it wrapping. **Blocked on Q-1**                                                      |
| P4.4 | Fix F-7 — re-label "Overview" and move "Sign in" out of Resources. **Blocked on Q-2**                                                  |
| P4.5 | Fix F-8 — compute the copyright year once at module scope, or accept it as a known annual edge case and note the decision              |

**Exit gate:** heading outline has no skipped level; axe (or the `better-accessibility` skill's
checklist) reports no new violations on `/`; gates 1, 3, 4, 9 pass.

**Depends on:** P0. P4.3 and P4.4 additionally depend on Daniel answering Q-1 and Q-2.

---

### Dependency graph

```text
P0 (reproduce)
 ├── P1 (remove RC line) ── P2 (hit areas + logo)
 ├── P3 (newsletter)                     [Q-3 gates the copy]
 └── P4 (semantics + labels)             [Q-1, Q-2 gate P4.3, P4.4]

P1..P4 each ship as their own commit on one branch; P1 may ship alone if the
rest stalls on the open questions.
```

---

## 4. Gates

The skill's ten gates, mapped to what this repo actually has. Run the real command, record the real
result; never tick a box on assumption.

| #   | Gate            | Command here                                                                                                                        | Applies                            |
| --- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 1   | Typecheck       | `npx tsc --noEmit` (`strict: true` is on; `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are **not** — see Deviations) | Yes                                |
| 2   | No emit         | covered by gate 1 running with `--noEmit`                                                                                           | Yes                                |
| 3   | Lint + format   | `yarn lint` (`next lint`); the Husky `pre-commit` hook runs `yarn lint --fix`                                                       | Yes                                |
| 4   | Unit tests      | `yarn test` (Jest). New tests for P3; a rendering test for the footer under P2                                                      | Yes                                |
| 5   | Integration     | —                                                                                                                                   | No. No database or service touched |
| 6   | Anti-regression | P3's validation tests are the reproducing tests for F-3; a footer render test covers F-2 and F-4                                    | Yes                                |
| 7   | Security        | No new endpoint, no auth change, no data stored. Confirm no email address is logged                                                 | Partial                            |
| 8   | Load            | —                                                                                                                                   | No                                 |
| 9   | Build           | `yarn build` from a clean checkout                                                                                                  | Yes                                |
| 10  | Migrations      | —                                                                                                                                   | No                                 |

There is no single `verify` script in `package.json`. Run gates 1, 3, 4 and 9 in that order and stop
at the first failure. Adding a `verify` script is a reasonable follow-up but is **out of scope here**.

---

## 5. Decisions

| ID  | Date       | Decision                                                                                                                                             | Decided by             |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| D1  | 2026-11-06 | Remove the `RC 1234567` line entirely rather than correct the number                                                                                 | Daniel                 |
| D2  | 2026-11-06 | Newsletter: option (b) — keep the form, add real client-side validation and an honest end state, rather than wiring a backend (a) or removing it (c) | Daniel                 |
| D3  | 2026-11-06 | Keep the legacy `<Link><a>` pattern. It is correct for Next 12.3.7 and consistent with the nav; changing it is a framework upgrade, not a footer fix | Claude, pending Daniel |
| D4  | 2026-11-06 | Leave the stale duplicate pages (`about-us`, `privacy-policy`, `terms&conditions`) alone in this slice                                               | Claude, pending Daniel |

## 6. Assumptions

| ID  | Assumption                                                                                                                                                                                                     | Owner to confirm          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| A1  | The narrow hit area (F-1) is the actual cause of the reported clicks being missed, rather than something only visible at runtime                                                                               | Closed by P0.2            |
| A2  | `yarn.lock` still installs cleanly on this machine's Node version; there is no `.nvmrc` in the repo pinning one                                                                                                | Closed by P0.1            |
| A3  | No consumer outside `MarketingLayout` renders `MarketingFooter` and depends on its current DOM                                                                                                                 | Claude, by grep before P2 |
| A4  | The `⚡ParkPay` wordmark in `public/svgs/logo-white.svg` is the intended brand asset, with the mark standing in for the "S". It is the same asset the nav uses, so it is a brand question and not a footer bug | Daniel                    |

## 7. Open questions

- [x] **Q-1** (answered 2026-11-06: shorten) — F-5: shorten "Statutory remittances" to "Remittances", or keep the full label and stop it wrapping? _Owner: Daniel. Blocks P4.3._
- [x] **Q-2** (answered 2026-11-06: do it; column naming was Claude's call, D6) — F-7: re-label "Overview" to "Product overview", and move "Sign in" out of Resources — into Company, or up beside the brand? _Owner: Daniel. Blocks P4.4._
- [ ] **Q-3 — STILL OPEN, AND THE COPY SHIPPED ANYWAY.** The footer now says "Thanks — we'll be in touch." while nothing records the address. P3.4: where does a submitted address actually go? Until there is an answer, the confirmation copy cannot say "we'll be in touch". Either name the destination (a Mailchimp or Brevo list, a `pages/api/newsletter.ts` route) and raise it as its own slice, or agree copy that promises nothing. _Owner: Daniel. Blocks the shipped copy of P3._
- [x] **Q-4** (answered 2026-11-06: yes) — Should the stale duplicate pages be redirected to the canonical ones? Separate slice. _Owner: Daniel._

## 8. Risks

| Risk                                                                                                                                      | Impact                                                                                                                                                | Mitigation                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| R-1 — The hit-area theory is wrong and the real cause is a runtime overlay or handler not visible in source                               | P2 ships and Daniel still cannot click the links                                                                                                      | P0 reproduces before any code changes; its exit gate forces a plan revision if F-1 is wrong                  |
| R-2 — Padding the links to a 40px target overlaps adjacent rows, so one row steals another's clicks and the fix makes the complaint worse | Regression on the exact bug being fixed                                                                                                               | P2.2 is an explicit check; P2's exit gate requires clicking all eleven links at three widths                 |
| R-3 — The newsletter shows a confirmation while nothing records the address, which is a promise the product cannot keep                   | Users believe they subscribed; reputational, and arguably a consent problem under NDPR if addresses are later collected from a form that said nothing | Q-3 must be answered before P3 ships. Default to copy that promises nothing; do not log the address anywhere |
| R-4 — `yarn install` on an unpinned Node version produces a build that differs from CI                                                    | Gate 9 passes locally and fails in CI, or vice versa                                                                                                  | Record the Node version used in the PR; do not regenerate `yarn.lock`                                        |
| R-5 — The footer renders on every marketing page, so a DOM change has a wider blast radius than the component suggests                    | A styling regression ships site-wide                                                                                                                  | A3's grep; spot-check `/`, `/pricing` and `/legal/terms` before the PR                                       |

## 9. Out of scope

- Wiring the newsletter to a real email provider (that is option (a); D2 chose (b)).
- Redirecting or deleting the stale duplicate pages (Q-4).
- Any Next.js upgrade or migration off the legacy `<Link><a>` pattern (D3).
- Replacing or redrawing the logo asset (A4).
- Adding a `verify` script, `noUncheckedIndexedAccess`, or `exactOptionalPropertyTypes` to the repo.
- The marketing nav, which was read for comparison only and is not changed.

## 10. Deviations from the standard stack

Recorded so the gaps are visible, not to be fixed here.

| Standard                                                             | This repo                                                                  | Consequence                                                   |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Next.js App Router                                                   | Next 12.3.7, `pages/` router                                               | Legacy `<Link><a>` is correct here (D3)                       |
| `pnpm` + `turbo`                                                     | `yarn` 1 with a committed `yarn.lock`; `yarn` not installed on the machine | P0.1 must install Yarn Classic; never resolve with npm        |
| Vitest                                                               | Jest, with five existing test files and none covering marketing components | P2 and P3 add the first footer tests                          |
| `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` | `strict: true` only                                                        | Gate 1 is weaker than the standard; acceptable for this slice |
| Single `verify` script run by CI                                     | No `verify` script                                                         | Gates run individually; see §4                                |
| Node pinned in `.nvmrc`                                              | No `.nvmrc`                                                                | A2, R-4                                                       |

---

## 11. Tracker

Tick only after that phase's exit gate passed in the session, in the same commit as the work, with
the date, the commit SHA and the command output that proves it. Build-complete is not gated.

| Phase                 | Status                                      | Date       | Evidence                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0 Reproduce          | [x] done                                    | 2026-11-06 | `elementFromPoint` on the live page: row centre -> `LI`, right edge -> `LI`, gap -> `UL`; only the glyphs -> `A`. F-1 re-tagged Verified. A2 closed: `--frozen-lockfile` failed, plain `yarn install` succeeded, `yarn.lock` restored with `git checkout`                                                                                     |
| P1 Remove RC line     | [x] done                                    | 2026-11-06 | `grep -rn "1234567" src pages` returns nothing; live page body no longer matches `/1234567\|Technologies Ltd/`; unit test locks it                                                                                                                                                                                                            |
| P2 Hit areas + logo   | [x] done                                    | 2026-11-06 | All 11 rows measure 40.4px; all four probe points (centre, far right, top edge, bottom edge) return the row's own href. A real Chrome click in the previously dead space right of "About" navigated to `/about`. Footer logo is now `A` with `href="/"`. Re-checked in the narrow 2-column layout: all rows clickable, no horizontal overflow |
| P3 Newsletter         | [x] build-complete, copy **not** signed off | 2026-11-06 | 15 unit tests pass. In Chrome: `a@b` -> error announced via `role="alert"`, `aria-invalid="true"`, `aria-describedby` matching the error id, focus returned to the input, URL unchanged; `ada@company.com` -> `role="status"` confirmation, form removed. **Q-3 unanswered, so R-3 is live**                                                  |
| P4 Semantics + labels | [x] done                                    | 2026-11-06 | 0 heading elements in the footer; page outline `H1,H2,H3,H3,H3,H3,H2` with no skip; `nav[aria-label="Footer"]` present; labels re-pointed per D5/D6                                                                                                                                                                                           |
| Q-4 Redirects         | [x] done                                    | 2026-11-06 | `curl` returns 308: `/about-us` -> `/about`, `/privacy-policy` -> `/legal/privacy`, `/terms&conditions` -> `/legal/terms`                                                                                                                                                                                                                     |

### Gate results, 2026-11-06

| Gate              | Command                                     | Result                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Typecheck       | `npx tsc --noEmit`                          | No errors in the footer surface. **2 pre-existing errors remain** in `src/layouts/dashboard-layout/DashBoardLayout.test.tsx` (TS1149 filename casing, TS2741 missing `pageTitle`). Untouched by this slice |
| 3 Lint            | `npx next lint --dir src --dir pages`       | `No ESLint warnings or errors`                                                                                                                                                                             |
| 3 Format          | `npx prettier --check` on the changed files | Clean. Four pre-existing unformatted files remain under `src/components/marketing/` (nav, mockups); not touched                                                                                            |
| 4 Unit tests      | `npx jest src/components/marketing`         | 15 passed, 0 failed — **but see the blocker below**                                                                                                                                                        |
| 6 Anti-regression | the 15 tests above                          | Each `it` names the finding it locks down                                                                                                                                                                  |
| 9 Build           | `npx next build`                            | Exit 0, all routes compiled                                                                                                                                                                                |

A hydration warning (`Did not expect server HTML to contain a <div> in <div>`) appears on marketing
pages. **Verified pre-existing**: it still fires with this slice's changes stashed. Not introduced
here, not fixed here.

### Blocker: the Jest runner is broken repo-wide (pre-existing)

**Verified 2026-11-06.** `yarn test` cannot run _any_ suite, including the pre-existing
`Landing.test.tsx`. `resolutions` pins `ansi-regex` to `6.2.2`, which is ESM-only, while Jest 27's
`pretty-format` and `strip-ansi@6` `require()` it as CommonJS:

```
/node_modules/ansi-regex/index.js:1
export default function ansiRegex({onlyFirst = false} = {}) {
^^^^^^  SyntaxError: Unexpected token 'export'
```

The 15 tests above were run through a throwaway config mapping `ansi-regex` to a CJS shim. **That is
a local workaround, not a fix — gate 4 does not pass on this repo as it stands.**

Likely fix, needing sign-off because it changes a security pin: drop the resolution to
`ansi-regex: 5.0.1`, the patched release for the ReDoS advisory (CVE-2021-3807) and still CommonJS.
Pinning `6.2.2` is stricter than the advisory requires and is what breaks Jest. Its own slice.

Branch `feature/marketing-footer-fix` off `main` at `ab34a11`. One commit per phase,
`fix(marketing): …` or `docs(marketing): …`, naming the task IDs it advances. PR stays under ~400
changed lines. Never commit to `main`, never `--no-verify`.
