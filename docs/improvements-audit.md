# Improvements audit (page by page)

A pass over every page except the home hero (fixed separately) for places where motion would
explain something, sections that read flat, loops with a visible restart, and missing cross-links.
Read with `docs/design.md` ("Motion (v3)"), `docs/motion-audit.md` and `docs/polish-audit.md`;
nothing here undoes them. Every finding below was fixed in the same pass.

Evidence: Playwright at 1440 dark and 390 light, animation seeking (`getAnimations()` paused at set
times) to check loop seams, an overflow walk of 25 pages at 8 widths (320 to 1920), a reduced-motion
and a no-JavaScript walk, and rAF frame deltas over a 10 s scripted scroll. The impeccable launcher
was not run (it downloads a binary); its craft floor was read and applied by hand.

## Findings, by priority

| # | Pri | Page | Finding | Fix |
| --- | --- | --- | --- | --- |
| 1 | P1 | Home, "Put it online in three steps" | **Loop hitch.** The 9 s demo restarts with a visible jump: at 96% the overlay fades back in still showing the end state ("Building with Nixpacks", a full progress bar), then at 0% both snap to "Waiting for a server" and an empty bar. | The message and bar reset at 80-82%, while the overlay is fully hidden (68-96%). 100% and 0% are now the same frame (checked by seeking 8.6 s to 9.3 s). |
| 2 | P1 | All pages | **Loops never rest.** Lanes wires and packets, the bento loops, the vibe demo, the CTA beam, the ticker and the featured-card sweep kept animating after they scrolled away (the sweep and SVG dash offsets repaint every frame). | `motion.ts` marks `[data-play]` and new `[data-loop]` elements `.is-offscreen` when out of view (120px margin) and `global.css` pauses every animation inside. Measured: at the foot of the home page only the on-screen CTA beam (and the home hero's own rings, out of scope) still run. |
| 3 | P1 | Every inner page | **Static heroes, out-of-step visuals.** `PageHero` had no entrance while every block below it revealed; four hero visuals (about, contact, license, security) and the comparison pages ran their own `data-reveal` unsynchronised with the copy. | One short load wave in `PageHero`: heading 0, lede 80 ms, buttons 140 ms, visual 200 ms (fade + 12-20px rise on `--ease-out`, settled by ~0.9 s); the beam fades in without moving. The per-visual `data-reveal`s are gone (one entrance per container). |
| 4 | P2 | Features, hero | **The page's key idea is a still diagram.** "Three ways in, three places to run" through one gate never shows anything going through. | A 7.2 s seamless loop: a packet leaves one way in, the gate pulses, and it goes out to a place, pairing them differently each time (console to AWS, agent to Google Cloud, terminal to your Server), so it reads as "any way in, any place". Opacity-only node rings, short SVG dashes; hidden at 0% and 100%. |
| 5 | P2 | Pricing, "What counts toward a plan?" | **The over-the-limit rule is told, not shown.** | In view, once: each meter fills slot by slot, the try row fills its three, then the fourth Server slides in already refused with a short head-shake (4px, 420 ms) and the explanation fades in. Transform and opacity only. |
| 6 | P2 | Self-hosted, "What does the installer set up?" | Host drawing appears as one block. | In view, once: the layers land in turn on the empty host frame (systemd, PostgreSQL, Swarm, tools), then the ufw tag and the free "next deploy" slot. |
| 7 | P2 | About, "How is Cloudgate built?" | **Flat, text-only section** beside a four-item list. | A small drawn architecture from the page's own facts: console (Next.js), CLI (npm) and AI agent (MCP) into one NestJS backend (API, deploy engine, job queue, `/mcp`, PostgreSQL), out to your Servers, AWS and Google Cloud. In view the links draw top to bottom once, the way a deploy travels. |
| 8 | P2 | Vibe coding, hero | The "Your app is live" notice, the page's payoff, is there from the first frame; its tick is a Unicode glyph. | The notice arrives once the hero settles (1 s, 520 ms rise) and its check draws; the glyph is now a drawn SVG check. |
| 9 | P2 | Changelog, legal documents | **Sticky contents with no "you are here".** | `data-spy` on the contents nav: the link for the section being read gets `aria-current="location"` (brand rule on the changelog, the hover treatment on legal docs); a contents list that scrolls on its own keeps that link in view. |
| 10 | P3 | AI agents, guard rails | Six items with 2px brand left bars (a craft-floor ban; home's version was already fixed to hairlines). | Hairline top rules like `.facts`. |
| 11 | P3 | Self-hosted, CLI, pricing, security, 404 | **Cross-links missing where the next question is.** Self-hosted's license section never linked `/license`; the CLI's "early" note never linked the changelog that lists its betas; pricing never linked `/compare`; 404 offered four routes. | Added descriptive links: self-hosted to the license page, CLI to the changelog, pricing to the comparisons, security to "what runs where" on features, 404 to features, self-hosting and the changelog. |

## Checked and left alone

- **Bento, Lanes, CTA beam, ticker, featured sweep loops**: 0% and 100% already match (dash
  periods divide the offsets, packets are hidden at both ends, the marquee slides exactly one copy).
- **Vibe band skeleton breathe (1.5 s)**: a loading indicator, exempt from the 4 s rule like the spinner.
- **AI agents, CLI, contact, security, compare pages**: already carry product mock-ups that play
  (type-on terminals, the audit log, the session transcript); adding more would decorate.
- **The `.note` 3px left rule**: the site-wide callout pattern in `global.css`, not a card accent.

## Out of scope, noted for the hero pass

- The home hero's keyhole rings keep looping when the hero is scrolled away (seen in the off-screen
  walk). Adding `data-loop` to the hero section would rest them with the same mechanism.

## Measured result

rAF frame deltas while scrolling the whole page over 10 s (headless Chromium): home 1440 and 390,
features 1440 and 390 all at 16.67 ms average, 0 frames over 20 ms, worst frame 16.8 ms. Overflow
walk: 0 pages wider than the viewport. Reduced motion and no-JS: every new animated piece at its
final state, no infinite loop running under reduced motion.
