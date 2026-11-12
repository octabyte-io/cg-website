# Polish audit (visual)

⚠️ DEGRADED: single-context (no sub-agent tool exposed in this session, and the impeccable
detector was not run: its launcher downloads an engine binary, which this pass was told not to do).
Evidence is Playwright screenshots of all 18 pages at 1440 dark, 1440 light and 390 light, plus
768 and 1024 on six pages, a scripted WCAG contrast walk of every text node in both themes, a
touch-target walk at 390, an overflow check at every width, and a reading of the source.

Scope is visual only: layout, rhythm, type, colour and contrast, component consistency,
responsive behaviour and phone feel. Motion is owned by a separate pass; motion problems found
here are listed at the end and were not changed.

## Audit health score

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 3 | Light theme: console window bars 2.5:1, `--live` green 3.9:1 on tinted wells |
| 2 | Performance | 3 | Out of scope (motion pass); no layout-property animation found in visual CSS |
| 3 | Theming | 3 | `.window.ui` keeps the dark-only bar tokens on a light surface |
| 4 | Responsive design | 2 | Header nav wraps at 981 to 1130px; mobile menu cannot scroll in landscape; Gateway panel overflows at 1024 |
| 5 | Implementation integrity | 3 | Coherent token system; a few one-off patterns (coloured left bars, centred-text-in-left-box) |
| **Total** | | **14/20** | **Good: address responsive and light-theme contrast** |

## Design specificity verdict

Pass. The site is clearly authored for Cloudgate: the three-slice lane markers, product
mock-ups built from real states (agent card, audit log, Plan and Apply, the wizard), the beam
over the blueprint grid and one dark closing band per page follow `docs/design.md` closely. Copy
uses the product's own words throughout. Nothing reads as a template. The issues below are
finish, not concept.

## Critique: heuristics (Persuade surface)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Mobile menu button still says "Menu" when open |
| 2 | Match system / real world | 4 | Product words, answer-shaped headings |
| 3 | User control and freedom | 3 | Landscape menu traps the last links below the fold |
| 4 | Consistency and standards | 3 | Window bars differ by theme; feature lists use two different list treatments |
| 5 | Error prevention | n/a | Marketing site, no input |
| 6 | Recognition rather than recall | 4 | Breadcrumbs, current-page nav state, jump links on features |
| 7 | Flexibility and efficiency | n/a | Persuade surface |
| 8 | Aesthetic and minimalist design | 3 | A few off-centre or crowded spots (below) |
| 9 | Error recovery | 3 | 404 offers four useful routes |
| 10 | Help and documentation | n/a | Persuade surface |
| **Total** | | **23/28** | **Good** |

## What is working

- One system everywhere: tokens, `.panel`, `.window`, `.facts`, `PageHero`, `Faq`, `CtaBand`.
  Pages feel like one product.
- Dark theme passes AA on every text node checked (0 failures across 18 pages).
- Product mock-ups do real explanatory work (the audit log with refusals, the counts bar on
  pricing, the upload tree on the CLI page).

## Findings by severity

### P1 (major; fix before release)

1. **Header nav wraps between 981 and ~1130px.** At 1024 "AI agents", "Vibe coding" and
   "Self-host" break onto two lines and the bar crowds the CTA. The Menu breakpoint is 980px.
   *Location:* `src/components/Header.astro`. *Fix:* `white-space: nowrap` on nav links and
   switch to the Menu below 1120px. *Command:* adapt.
2. **Mobile menu cannot scroll.** On a phone in landscape (844×390) "Self-host" is cut and "Sign
   in" is unreachable: the panel is absolutely positioned under a sticky header with no
   overflow. *Fix:* `max-height: calc(100svh - 64px)`, `overflow-y: auto`,
   `overscroll-behavior: contain`. *Command:* adapt.
3. **Console window bars in the light theme.** `.window.ui` / `.window.browser` swap the body to
   `--surface` but keep `--night-line` dots, a dark rule and `--night-muted` text: 2.51:1 on white,
   heavy black dots. Seen on the AI agents hero card and audit log, the Features Health window and
   the Vibe coding wizard. *Fix:* a shared rule in `global.css` that gives bars on surface
   windows `--line` / `--muted`. WCAG 1.4.3. *Command:* colorize.
4. **Light `--live` and `--warn` under AA on tinted wells.** `#13865c` measures 3.92 to 4.00:1 on
   `--paper-2` and `--brand-tint` wells ("Certificate issued", "Active", "Uptime check up",
   "running", "Deployment done"); `--warn` `#a15c00` 4.45:1 (license "No"). *Fix:* light
   `--live: #0e7450` (4.67 to 5.78:1), `--warn: #955400` (4.78 to 5.92:1). WCAG 1.4.3.
   *Command:* colorize.
5. **Gateway panel overflows on the AI agents page at ~980 to 1180px.** Its nodes are
   `nowrap`, so at 1024 the panel and the `.env` window run 116px past the viewport and are clipped
   by `html { overflow-x: clip }`. *Location:* `src/pages/ai-agents.astro` `.gw`. *Fix:*
   `min-width: 0` on the column and let the nodes wrap below 1180px. *Command:* adapt.

### P2 (minor; fix in this pass)

6. **Centred lines that are not centred.** On the home page "What runs where, in detail" and the
   pricing add-on line with "Compare plans and see worked examples" are `text-align: center` inside
   a `.more` box capped at 70ch but left-aligned, so they sit ~200px left of the centred heading
   and cards at 1440. *Fix:* `.center-text { margin-inline: auto }`. *Command:* layout.
7. **Home "Let your AI agent deploy" list.** Four items with 2px brand `border-left` bars (a
   craft-floor ban, and `docs/design.md` says hairlines), only 8px under the lede, and squeezed
   into two ~180px columns at 901 to 1180px. *Fix:* hairline top rules like `.facts`, a proper gap
   under the lede, one column while the split is narrow. *Command:* layout.
8. **Footer links on phones.** Labels that wrap ("Cloudgate for AI agents", "Deploy an app you
   built with AI") sit flush against the next link: `gap: 0`, no padding, 1.6 line-height, so two
   links read as one block. *Fix:* vertical padding inside a 44px minimum and a tighter
   line-height. *Command:* layout.
9. **Phone feel.** No `-webkit-tap-highlight-color` reset (grey flash on tap). Hover styles on
   buttons, nav pills, footer links and cards are not gated, so they stick after a tap. No
   `viewport-fit=cover` / safe-area padding, so landscape iPhones letterbox the page.
   `theme-color` only follows the system, so the browser chrome mismatches when a visitor picks
   the other theme in the header. *Command:* adapt (mobile-native).
10. **Small targets on the legal pages.** The "other documents" links under Terms and Privacy
    are 27px tall. *Fix:* 44px rows. WCAG 2.5.8 (24px floor met; 44px is the house target).
    *Command:* adapt.
11. **Legal table of contents uses `100vh`.** Its max-height overshoots under mobile browser
    chrome. *Fix:* `100svh`. *Command:* adapt.

### P3 (polish)

12. Mobile menu button reads "Menu" while open; say "Close". (clarify)
13. Code blocks in the CLI steps clip commands on phones (`cloud.example.` cut, scroll with no
    hint). Wrap them below 520px. (adapt)
14. Pricing "Hosted at cloudgate.octabyte.app" bracket shrinks to a 2px stub at 390. Give it a
    minimum width. (layout)
15. Contact route cards: the action buttons do not share a baseline ("Ask for access" sits
    higher). Push actions to the card foot. (layout)
16. Home hero buttons stack at two different widths on phones. (layout)
17. Compare table header links are 21px tall; CLI CI tabs 36px. (adapt; table header left as is)

## Patterns and systemic issues

- Light theme was tuned less than dark: every contrast failure found is light-only.
- Two widths are under-served: 981 to 1180px (header, Gateway panel, home agent list) and phone
  landscape (menu).
- Hover is used as a primary state on touch devices.

## Motion problems seen (not changed here; for the motion pass)

- Home "Put it online in three steps": `vb-step` dims the non-active steps to opacity 0.45 for
  most of the 9s loop. In the light theme their text then measures about 2.3:1, so two of the
  three steps are unreadable most of the time. Consider dimming less (0.7) or dimming only the
  numbers.
- Home `HeroPanel` on phones: before it plays, the wizard shows three tall empty rows and a large
  blank area under them (about 40% of the first screen at 390).

## Recommended actions

1. [P1] adapt: header breakpoint, menu scroll, Gateway panel.
2. [P1] colorize: light window bars, `--live` and `--warn`.
3. [P2] layout: centred lines, home agent list, footer rhythm.
4. [P2] adapt: tap highlight, hover gating, safe areas, theme-color, legal targets, TOC height.
5. [P3] clarify and layout: Close label, CLI code wrap, pricing bracket, contact cards, hero buttons.
6. polish: re-screenshot and re-run the contrast and overflow walks.

## Resolution (what changed)

All P0 to P2 items and P3 items 12 to 16 are fixed. Rebuilt with 0 errors. After the pass: the
contrast walk finds 0 text nodes under AA in either theme at 1440 and 390 (it found 35 before,
all light); the overflow walk finds 0 elements past the viewport on 21 pages at 13 widths from
320 to 1920 (before: every page at 320, AI agents at 1024 to 1180).

- `src/styles/global.css`: light `--live` #0e7450 and `--warn` #955400; `.window.ui` and
  `.window.browser` drawn on `--surface` with a theme-following bar (dots `--line-strong`, rule
  `--line`, text `--muted`); tap-highlight reset; `.wrap` pads to the safe-area insets; button hover
  gated to hover-capable fine pointers; `touch-action: manipulation` on controls and no label
  selection on `.btn` / `summary`; buttons wrap their label below 400px; step code blocks wrap
  below 520px.
- `src/layouts/Base.astro`: `viewport-fit=cover`; `theme-color` follows a chosen theme.
- `src/components/Header.astro`: nav links never wrap; Menu below 1100px; menu panel scrolls
  (`max-height: calc(100svh - 64px)`), pads to safe areas, has a soft edge; the button reads
  "Close" when open; hover gated; wordmark hidden below 480px and the mark never squashed; under
  350px the trial button moves into the menu.
- `src/components/Footer.astro`: 44px link rows with padding and 1.35 line-height on phones;
  44px brand link; hover gated.
- `src/components/PageHero.astro`: `min-width: 0` on copy and visual so long buttons and window
  bars cannot widen the page on small phones.
- `src/pages/index.astro`: centred lines really centred; agent list uses hairline tops, a real gap
  under the lede, one column at 901 to 1180px; hero buttons stack at equal width on phones;
  template tile hover gated.
- `src/pages/ai-agents.astro`: Gateway column `min-width: 0`, nodes and the `.env` block wrap
  below 1180px.
- `src/pages/pricing.astro`: "Hosted at" bracket keeps a 2.5rem minimum; table row hover gated.
- `src/pages/contact.astro`: route-card buttons share the card foot.
- `src/layouts/Legal.astro`: 44px "other documents" links; TOC height in `svh`; hover gated.
- Hover gated in `Breadcrumbs.astro`, `ComparePage.astro`, `CtaBand.astro`, `compare.astro`,
  `legal.astro`, `features.astro`.

Left as they are: the compare-table header links (21px, inside a table header, spacing
exception), the CLI CI tabs (36px, inside a night window bar), and the two motion items above.
