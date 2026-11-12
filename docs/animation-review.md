# Animation review (review-animations)

A review of every piece of motion on the marketing site against the `review-animations` bar
(`.claude/skills/review-animations/SKILL.md` and `STANDARDS.md`), read with `docs/design.md`
("Motion (v3)"), `docs/motion-audit.md` and `docs/improvements-audit.md`. Scope: the Motion section
and every transition in `src/styles/global.css`, `src/scripts/motion.ts`, every component, layout
and page. Line numbers are those of the code as reviewed (before the fixes).

Bar used: this is a marketing site, so the home hero's load sequence and in-view illustrations
count as rare or first-time motion and may run past 300ms if they earn it. UI feedback (buttons,
tabs, menu, hover, theme switch, FAQ, spotlight) gets the strict UI bar. Where `docs/design.md`
sets a rule (tokens, "loops are 4s and up", reduced motion shows final states) it is applied too.

## Part 1: Findings

| Before | After | Why |
| --- | --- | --- |
| `card.style.setProperty('--mx' / '--my')` on every pointer frame, read by the card's `::before/::after` (`scripts/motion.ts:70`, `styles/global.css:850`); the properties are unregistered, so they inherit | `@property --mx/--my { inherits: false }`, pseudo-elements take them with `--mx: inherit` | Escalation trigger: a CSS variable on the parent restyles the whole subtree every pointer frame. Non-inherited, only the card and its two pseudo-elements restyle. Measured on a home bento tile: style time over 90 pointer moves 91.6 ms → 63.1 ms |
| Spotlight gated on `@media (pointer: fine)` and `matchMedia('(pointer: fine)')` (`styles/global.css:863`, `scripts/motion.ts:54`) | `(hover: hover) and (pointer: fine)` in both | Hover motion must be gated on both; a fine pointer without hover (some pens, hybrid devices) gets a glow stuck where it tapped |
| Featured card border `animation: sweep 8s linear infinite` (`styles/global.css:916`), on `data-loop` cards (`pages/index.astro:274`, `pages/pricing.astro:175`, `pages/self-hosted.astro:486`) | One turn when the card has arrived: `.is-playing { animation: sweep 2.4s var(--ease-in-out) 300ms both }`, cards carry `data-play` | Missed simplification and performance: a registered custom property animates on the main thread and repaints the whole card (and its 80px shadow) every frame, forever, beside the prices the visitor is reading. Measured on /pricing idle: 180 style passes / 106 ms per 3 s → 0 |
| Theme switch flips `data-theme` while `.btn`, tabs, logos and legal links carry 150-300ms colour transitions (`components/Header.astro:60`) | `.theme-switching` on `<html>` sets `transition: none !important` for the two frames of the flip | Feel-breaking: the page switches instantly but the buttons trail it by 160ms, so one click reads as two. Measured: the unguarded flip starts 8+ CSS transitions on the home hero alone; guarded, 0 |
| Theme switch: the canvas keeps the old theme's strands as its CSS background until the new image is encoded (`components/home/HeroField.astro:316`) | `canvas.style.backgroundImage = ''` as soon as the strands are repainted | Two themes' strands overlap for a few frames: a jarring crossfade on the same click |
| Reduced motion sets `transition-duration: 0.01ms !important` on everything (`styles/global.css:683`) | `transition-property: opacity, color, background-color, border-color, text-decoration-color, fill, stroke !important` | Reduced motion means gentler, not zero: keep colour and opacity fades, drop movement. Transform transitions (press scale, chevron) now snap; hover and spotlight fades keep their timing |
| `label:hover { color }` with a 150ms transition, ungated (`components/home/HeroPanel.astro:103`) | Inside `@media (hover: hover) and (pointer: fine)` | Ungated hover: a tap leaves the tab label in its hover colour |
| Theme switch and menu button have no press feedback (`components/Header.astro:131`, `.menu summary`) | `:active { transform: scale(0.97) }`, `transition: transform var(--dur-press) var(--ease-out)` | Every pressable element gives the same give as `.btn` (STANDARDS: Button press feedback); two controls in the header felt dead next to the trial button |
| Wizard tick `tick 420ms var(--ease)` from `scale(0.4)`, overshoot `1.15` (`components/home/HeroPanel.astro:292`) | `tick 400ms var(--ease-out)` from `scale(0.5)` + opacity 0, overshoot `1.12` | Near-from-nothing start on a weak curve, and a second, different pop beside the bento's: one pop for the site |
| Wizard result `opacity/transform 500ms var(--ease)` (`components/home/HeroPanel.astro:266`) | `400ms var(--ease-out)` | An entrance on the weak general curve; the result is the payoff of the demo and should land, not drift |
| Transcript lines `line-in 260ms var(--ease)` (`components/home/HeroPanel.astro:329`) | `line-in 260ms var(--ease-out)` | Entrances use the strong ease-out token |
| Bento pulses `pulse-ring 2.6s` and `pulse-ring 2.8s` infinite (`components/home/Bento.astro:415`, `:440`) | Both `pulse-ring 4s` | Two loops under the 4s floor in neighbouring tiles, at periods that drift against each other (a beat every ~36s) |
| Backups dots rest at `scale(0.3); opacity: 0.3` but `pop` starts at `scale(0.5); opacity: 0` (`components/home/Bento.astro:432`) | Rest state `scale(0.5); opacity: 0` | The start state jumps when `.is-playing` lands: faint dots vanish, then pop |
| Team rows `slide-in 0.6s`, stagger `0.14s` (`components/home/Bento.astro:485`) | `slide-in 0.5s`, stagger `70ms` | Stagger is 30-80ms; 140ms per row reads as a queue |
| Lanes `packet 3.6s` (delays 1.2s, 2.4s) and `gate-glow 3.6s` (`components/home/Lanes.astro:101`, `:110`) | `4.2s` (delays 1.4s, 2.8s) | Loops are 4s and up (design.md); same rhythm, a third packet every 1.4s |
| Vibe band messages crossfade on the same keyframes, 31% → 34% (`pages/index.astro:840`) | A handoff: message 1 out by 33%, message 2 rises 4px in from 33% to 36% on `--ease-out` | Jarring crossfade: halfway through, both status lines sit on top of each other at half opacity |
| Hero aside `fade-in 500ms` (`pages/index.astro:494`) | `rise-in 500ms` with `--rise: 6px` | Pure-fade entrance inside a wave where everything else rises: it read as appearing from nowhere |
| Self-hosted `layer-fade` (ufw tag, free slot) opacity only (`pages/self-hosted.astro:825`) | Opacity + 6px rise | Pure-fade entrance; the slot and the tag land like the layers they join |
| Pricing refusal text `slot-text` opacity only (`pages/pricing.astro:816`) | Opacity + 4px rise | Pure-fade entrance |
| Logos hover transitions `border-color` and `box-shadow` (`pages/index.astro:1008`) on a `data-spotlight` card | `border-color` only, no hover shadow | Three responses to one hover (spotlight, border, shadow); the shadow transition repaints. The spotlight already answers the pointer |
| `data-reveal-stagger="90"` (16 places) and `"140"` (`pages/license.astro:69`); no clamp in `scripts/motion.ts:13` | `"80"`, and the step clamped to 30-80ms in `motion.ts` | Stagger is 30-80ms between items; longer reads as a queue |
| PageHero wave `ph-rise 600ms` 12px, visual `ph-rise-far 700ms` 20px, settled ~0.9s (`components/PageHero.astro:75`, `:84`) | `500ms` 8px, visual `560ms` 16px, settled ~0.75s | It replays on every inner page a visitor opens (occasional, not first-time): smaller and quicker, same order |
| Legal contents and document cards hover `color/border-color var(--ease-out)` (`layouts/Legal.astro:126`, `pages/legal.astro:95`) | `var(--ease)` | Hover and colour changes use `ease` (STANDARDS: Easing); the rest of the site's hovers already do |

## Part 2: Verdict (as reviewed)

1. **Feel-breaking regressions**
   - The theme switch is a click whose answer arrives twice: the page flips, then the buttons and
     tabs catch up 150-300ms later, and the hero canvas briefly shows both themes' strands.
   - The vibe band's two status lines overlap mid-crossfade, the one moment that explains "building".
2. **Missed simplifications**
   - The featured-card sweep loops forever next to prices. One turn on arrival says "this one"; a
     perpetual one says nothing more and costs a main-thread repaint every frame.
   - The logos tiles answer hover three times.
   - The inner-page hero wave was sized like a first-visit entrance but plays on every page.
3. **Performance**
   - Spotlight: inherited custom properties on the card drive its pseudo-elements, so every
     pointer frame restyles the card's subtree (escalation trigger, easy fix).
   - Sweep: registered-property animation, 0.6 ms of style per frame plus a full-card repaint on
     /pricing while idle.
   - Kept, noted: the Lanes and features maps animate `stroke-dashoffset` (and the Lanes packets
     carry a `drop-shadow`), and the hero transcript types by stepping `width`. None has a GPU
     equivalent that keeps the look (a dash travelling a curved, non-uniformly scaled path; a caret
     riding the typed text); all run only in view, and the scroll and idle traces show no cost.
4. **Interruptibility and timing**
   - Bento pulses and Lanes loops ran under the 4s floor, the pulses at beating periods.
   - Staggers of 90-140ms; team rows at 140ms.
   - Approved: the menu's `menu-in` keyframes (closing is instant, so a reopen starting from zero is
     correct), the HeroPanel `pane-in` (a `display` swap; the old pane is gone at once), `.btn`
     press 140ms both ways (STANDARDS' own symmetric press rule), spotlight in 150ms / out 300ms.
5. **Origin, physicality and cohesion**
   - Wizard tick from `scale(0.4)` on a weak curve, and unlike the site's other pop.
   - Backups dots' rest state does not match their first keyframe.
   - Pure fades on the hero aside, the self-hosted tag and slot, and the pricing refusal text.
   - Weak `--ease` on HeroPanel entrances; `--ease-out` on legal hovers.
   - Header theme and menu buttons without the site's press feedback.
6. **Accessibility**
   - Reduced motion zeroed every transition, colour and opacity included.
   - Spotlight gated on `pointer: fine` only; HeroPanel tab hover ungated.

Approved as they stand: the home hero's single load wave (settled ~1.45s, first visit, the one
documented long sequence; masked headline lines, `--ease-out` throughout), the canvas light field
(off screen, hidden tabs and reduced motion all stop it; frame governor), the scroll-linked
`flatten` tilt (linear, tied to scroll), `data-reveal` (600ms, 16px, transitions so they retarget),
the marquee (48s linear, hover pause gated), the CTA beam drift (22s, transform only), type-on
lines (terminal text appears, it doesn't travel), pricing meters, self-hosted layers, about
drawing, vibe-coding toast, the features route map (2.4s gate pulse is tied to the 7.2s route
loop), FAQ chevron (180ms), changelog contents marker (180ms `scaleY` + opacity), spinner and caret.

**Decision: Block.** A feel-breaking regression on a UI action (the theme switch), a parent CSS
variable driving child paint on every pointer frame with an easy fix, a perpetual main-thread
repaint with an easy fix, and reduced motion that removes colour feedback instead of movement.

## After fixes

Every row in Part 1 is applied. `docs/design.md` ("Motion (v3)") now records the new values: the
30-80ms stagger clamp, the non-inherited spotlight properties, the one-turn sweep, the smaller
PageHero wave, the theme-switch guard, reduced motion keeping colour and opacity fades, one press
feedback for every pressable control, and no pure-fade entrances outside ambient light and terminal
lines.

Re-review of the changes:

- **Theme switch**: guarded; 0 transitions start on the flip, the class is gone two frames later,
  and the canvas drops the old strands in the same frame.
- **Spotlight**: `--mx` reaches `::after` (238px under the pointer) while the card's children keep
  the initial 50%: the subtree no longer inherits. Gated on hover and fine pointer in CSS and JS.
- **Sweep**: on /pricing the card gets `.is-playing` once its reveal has landed, turns once
  (`--sweep` 312deg mid-turn, `360deg`/finished after) and rests; idle style work on the page is 0.
- **Reduced motion**: 14 pages walked with emulation: every revealed, played and hero element at
  opacity 1 and no transform, no infinite animation running, `.btn` keeps only colour and opacity
  transitions.
- **Vibe band**: seeked to 30, 32, 33, 34.5 and 36%: one message at a time, never two.
- **No new findings**: every new or changed curve is a token (`--ease-out`, `--ease-in-out`,
  `--ease`), new entrances start at or above `scale(0.5)` with opacity, and nothing new animates a
  layout property.

Left as they are, with reasons above: `stroke-dashoffset` on the Lanes and features maps, the
Lanes packet `drop-shadow`, and the stepped `width` of the hero's typed lines.

**Decision: Approve.** No feel-breaking regressions, no motion that should be deleted left
running, UI durations within 140-300ms on strong curves, loops at 4s and up (except the loading
indicators and the route-tied gate pulse), interruptibility handled where it matters, hover gated,
reduced motion respected.

### Measured

Headless Chromium (software compositing), rAF frame deltas; avg / frames over 20ms / worst.

| Phase | Before | After |
| --- | --- | --- |
| Home hero idle 20s, 1440 | 16.68 ms / 1 of 1198 / 33.4 | 16.69 ms / 2 of 1198 / 33.3 |
| Home hero idle 20s, 390 | 16.68 ms / 1 of 1199 / 33.3 | 16.67 ms / 0 of 1200 / 16.8 |
| Scroll home 10s, 1440 | 16.67 ms / 0 of 649 / 16.8 | 16.67 ms / 0 of 648 / 16.8 |
| Scroll features 10s, 1440 | 16.67 ms / 0 of 643 / 16.8 | 16.67 ms / 0 of 643 / 16.8 |
| Scroll home 10s, 390 | 16.67 ms / 0 of 650 / 16.8 | 16.67 ms / 0 of 643 / 16.8 |
| Scroll features 10s, 390 | 16.67 ms / 0 of 640 / 16.8 | 16.67 ms / 0 of 641 / 16.8 |
| /pricing idle 3s, style work | 180 passes / 106.5 ms | 0 passes / 0 ms |
| Spotlight, 90 pointer moves on a bento tile, style time | 91.6 ms | 63.1 ms |

The single 33 ms frames in hero idle are one dropped frame in 20 s, present before and after (run
noise in headless). No page is wider than the viewport at 390 or 1440 (14 pages each).
