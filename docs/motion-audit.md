# Motion audit (v3 pass 2)

An audit of every animation on the site against Emil Kowalski's bar (purposeful, quick,
interruptible, composite-only) and the rules in `docs/design.md` → "Motion (v3)". Findings are
ordered by leverage. Every one listed here was fixed in the same pass; "Kept" lists what was
weighed and left alone on purpose.

Measured in headless Chromium (software compositing, so absolute numbers are pessimistic; the
before/after difference is the point). Script: rAF frame deltas over 2.5 s of load, 3 s of hero
idle and a 10 s scripted scroll of the home page.

## Findings

| # | Sev | Category | Location | Finding | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Performance | `components/home/HeroField.astro` (`.hero-field`) | The canvas repaints every frame, and it carried `mix-blend-mode: screen/multiply` plus a CSS `mask-image`. Blending a full-width layer forces the compositor to re-blend the whole hero each frame. At 1440 px the hero idled at ~20-24 ms a frame (about a third of frames over 20 ms); with the blend and mask off it holds 16.7 ms. 390 px was already clean. | Plain compositing; the bottom fade is baked into the canvas (strands once per resize, particles by a per-point alpha), so the per-frame cost is only the particles. The still strands become the canvas's CSS background (no full-size copy per frame), and a frame-budget governor sheds particles on slow devices. |
| 2 | HIGH | Choreography / easing | `pages/index.astro` hero load sequence | 2.1 s from first paint to the panel settling. Six beats on near-uniform 80-100 ms gaps read as a queue; the panel only started at 900 ms. Two hand-typed curves (`0.2,0.8,0.2,1`, `0.3,0.6,0.4,1`) outside the tokens. The keyhole entered from `scale(0.72)` animating `filter: blur(8px) brightness(1.8)` on an element that also has `backdrop-filter`: an expensive filter animation on the very first frames. The beam's `beam-in` played even with reduced motion. | One wave, settled by ~1.45 s: keyhole and beam at 0, headline lines at 100/170/220 ms (shrinking gaps), lede 380, actions 440, aside 500 (fade only), panel 540 ms. Entrances on `--ease-out`, the keyhole is opacity + `scale(0.94)` with no filter, the beam is gated on reduced motion. The self-playing demo starts at 1 s instead of 1.1 s so it begins as the panel lands. |
| 3 | HIGH | Performance / duration | `styles/global.css` reveal | Every reveal ran 900 ms and animated `filter: blur(6px)` on whole blocks, including every tile of a grid at once (seven blurred bento tiles in one frame). Measured: removing the blur cut frames over 20 ms while scrolling at 4x CPU throttle by roughly a third. 900 ms also holds content back from fast scrollers. | Fade + 16 px rise, no blur, 600 ms on `--ease-out`. |
| 4 | MED | Choreography | `scripts/motion.ts` stagger | Uniform 70 ms steps: item 8 waits 8x as long as item 2 (a metronome, and long lists grow without limit). | Decaying steps (each gap 0.88x the one before), so a group reads as a wave and the total is capped near 4.8 steps whatever the count. |
| 5 | MED | Choreography | `scripts/motion.ts` + `Bento.astro` | A `[data-play]` tile inside a stagger got `.is-playing` the moment it was seen, so the last bento tile's illustration started before the tile itself had faded in. | `.is-playing` waits for the element's own reveal delay. |
| 6 | MED | Feedback | `styles/global.css` `.btn` | No press feedback on any button. | `:active { transform: scale(0.97) }`, transform on 140 ms `--ease-out` (`--dur-press`). |
| 7 | MED | Performance | `HeroPanel.astro` tab timer | The tab's progress bar animated `background-size` for the whole 6-8 s dwell, a repaint every frame for as long as the hero is on screen. | Two pseudo-elements: a still track and a fill that animates `transform: scaleX()`. |
| 8 | MED | Duration / interruptibility | `HeroPanel.astro` | Tab content entered over 420 ms with a 6 px rise each click; tab labels faded colour over 240 ms. Clicked repeatedly, these are UI, not marketing. | Pane: opacity + 4 px over 200 ms `--ease-out`. Labels: 150 ms. |
| 9 | MED | Purpose / busy loops | `Lanes.astro`, `Bento.astro` (AI tile) | Wire dashes flowed on 1.6 s and 1.2 s linear loops (busy, against the "loops are 4 s and up" rule), and the Lanes wires ran from page load even off screen, not only once in view. The gateway "hit" animated `box-shadow` (paint every frame). | Dashes flow at a calmer pace (3.2 s / 2.4 s) and only once `.is-playing`. The gateway glow is a pseudo-element whose opacity animates. |
| 10 | MED | Physicality | `Bento.astro` `pop` | Dots popped from `scale(0)` with a 1.25 overshoot; the preview dot's resting hidden state was `scale(0)`. | From `scale(0.5)` + opacity 0, overshoot 1.12. |
| 11 | LOW | Feedback timing | `styles/global.css` spotlight | Glow faded in and out over 400 ms: lags the pointer on the way in. | In over 150 ms, out over 300 ms (asymmetric: respond fast, leave gently). |
| 12 | LOW | Accessibility | `pages/index.astro` marquee | Hover pause applied on touch, where a tap leaves the ticker stuck paused. | Pause only under `(hover: hover) and (pointer: fine)`. |
| 13 | LOW | Missed opportunity | `components/Header.astro` mobile menu | The menu panel teleports open on phones. | 180 ms fade + 6 px drop on open (`--ease-out`); closing stays instant. |
| 14 | LOW | Tokens | `HeroPanel.astro`, `index.astro` | Hand-typed curves (`0.4,0.1,0.3,1` for the build bar, `0.2,0.8,0.2,1`, `0.3,0.6,0.4,1`) next to the token set. | Use `--ease-out` / `--ease-in-out`. |

## Kept, on purpose

- **Hero canvas light field.** The signature; it already pauses off screen, in hidden tabs and
  with reduced motion. With finding 1 fixed it costs nothing measurable at 1440 px.
- **Featured card sweep (`--sweep`, 8 s).** Documented in design.md; one card per page.
- **CTA band beam drift (22 s).** Slow, quiet, transform-only on a pre-blurred layer.
- **Marquee (48 s linear).** Constant motion, linear is correct.
- **Vibe band 9 s cycle, the wizard and transcript demo, the type-on terminals.** Explanation:
  they show how the product works. The demo stops for good on the first click or focus.
- **Keyhole rings (5.6 s).** Slow and faint; now start after the entrance has settled.
- **Spinner (800 ms) and caret blink (1 s).** Loading and typing indicators, exempt from the
  "4 s and up" loop rule.
- **Inherited `--mx/--my` on spotlight cards.** It recalculates the card's subtree per pointer
  frame, but the cards are small and the measured cost is nil; noted, not changed.

## Rejected opportunities

- **FAQ answers animating open.** Read-and-scan surface; the chevron already turns. A height
  animation would slow every open.
- **Theme switch crossfade.** A click users may repeat to compare; instant is right.
- **Hover lift on cards.** The spotlight already answers the pointer; a lift would double it.

## Reduced motion

Every hidden start state lives under `.js` and `prefers-reduced-motion: no-preference`; the
reduce block forces reveals visible. The one gap was the hero beam (finding 2). The canvas draws
one still frame, the hero panel shows every pane in its final state, the marquee becomes a
wrapped list.

## Measured result

rAF frame deltas on the home page, headless Chromium, 1440x900 (avg ms per frame / frames over
20 ms). 390x844 was already at 16.7 ms everywhere and stays there.

| Phase | Before | After |
| --- | --- | --- |
| Load sequence, first 2.5 s | 22.6 ms / 42 of 111 | 16.6 ms / 1 of 152 |
| Hero idle, 3 s | 23.6 ms / 51 of 128 | 16.6 ms / 0 of 181 |
| Scroll whole page, 10 s | 17.5 ms / 29 of 571 | 16.7 ms / 0 of 601 |
| Hero idle at 4x CPU throttle | 32.5 ms / 82 of 93 | ~23 ms / 54 of 129 |

At 4x CPU throttle the remaining cost is the canvas particles themselves (software raster in
headless); the field now sheds a quarter of its particles at a time when frames keep running long
after the load sequence. Scrolling at 4x throttle is unchanged within run-to-run noise.
