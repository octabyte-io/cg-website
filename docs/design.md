# Design plan

The public site for Cloudgate. Read this before adding a page or a component.

## Who it is for, and what it has to say

Three readers, in this order of emphasis:

1. **People who build with AI and are not deployment experts** ("vibe coders"). They made an app
   with an AI tool and want it online. They should leave knowing: pick a template or point
   Cloudgate at your folder, get a server from us or bring your own, press Deploy, get an address.
2. **AI agents and the people who run them.** Cloudgate gives an agent its own member account,
   its own key, a role and a grant, over MCP. It can deploy, read logs and health, and open
   previews that expire; every call is in the audit log and secrets are masked out of results.
3. **Developers and teams** who want Heroku-style deploys on their own servers, AWS or Google
   Cloud, without handing their infrastructure to a platform.

Facts come from the cloudgate repository (CONTEXT.md, CHANGELOG.md, docs/adr). Use its words:
Server, Project, Environment, Service, Deployment, Template, Agent, Plan. Never call it "open
source": it is source-available under the Elastic License 2.0 and free to self-host.
The source repository is private today, so link to nothing inside it (`site.sourceUrl` is null).

## The one idea

The Cloudgate mark is a cloud cut into three vertical slices at full, 75% and 50% strength.
The site borrows that: **three slices for three ways in and three places to run.** Ways in: the
console, your AI agent, your terminal. Places to run: your own Server, AWS, Google Cloud. The
slice tones (`--slice-1/2/3`) mark which lane a thing belongs to. That is the signature. Spend
boldness there and keep everything else quiet.

## Tokens (src/styles/global.css is the only place with literal values)

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | #f6f5f9 | #0f0d16 | page |
| `--surface` | #ffffff | #17141f | panels |
| `--ink` | #17131f | #ece9f6 | text |
| `--muted` | #5d5870 | #a7a1b8 | secondary text |
| `--line` | #e3e0ec | #2a2635 | hairlines |
| `--brand` | #6d57e0 | #b5b0ff | actions, focus, the mark |
| `--live` | #13865c | #4fd6a0 | "running" status only |

Type: **Bricolage Grotesque** (variable) for display headings, **Geist** for text and UI,
**Geist Mono** for code and terminal only. Display headings are large, weight 600-700, tight
tracking, sentence case. Body 17px, line-height 1.6, measure under 70ch.

## Layout

Left-aligned, 1200px column, generous vertical rhythm. Sections are separated by space and
hairlines, not by cards. Lists of features are definition lists in two columns, not a grid of
identical icon cards. Exactly one dark band per page (the closing call to action). Corners: 8px
on buttons and inputs, 14px on panels.

## Avoid (the frontend-design skill's list of generated-page tells)

- All-caps eyebrow labels above headings, mono labels for decoration, "A · B · C" meta strings,
  a "→" glued to every link, one word in a headline set in a different colour or italic.
- Gradient washes, glass, blobs, purple mesh, identical rounded cards with soft shadows.
- Numbered markers unless the content is a real sequence (the deploy steps are one).
- Motion for its own sake. (v1 said no entrance animations at all; v3 below supersedes that.)
- Fake logos, fake quotes, invented numbers. Every claim must be checkable in the repo.

## SEO and AEO (SearchFit checklist)

- One `<h1>` per page holding the page's main phrase; logical h2/h3 order.
- Title 50-60 characters, description 140-160, both unique; set through `<Base title description>`.
- JSON-LD on every page through `Seo.astro`: Organization and WebSite always, plus the page's
  own (SoftwareApplication, FAQPage, BreadcrumbList, HowTo where it is a real how-to).
- Answer-shaped copy: questions as headings, the answer in the first sentence under them.
- 3+ internal links per page with descriptive anchor text.
- Static HTML, no client JS unless an interaction needs it; images with width, height and alt.
- `robots.txt`, `sitemap-index.xml`, `llms.txt` and `llms-full.txt` are generated at build.

## Redesign (v2): richer, two themes

The first pass read as too plain. The owner asked for the richness of cloudflare.com, neon.com,
zed.dev and huly.io, and for both a light and a dark theme.

- **Themes.** Dark is the default palette in `:root`; light comes from the system setting or the
  header switch (`data-theme` on `<html>`, remembered in `localStorage` as `cg-theme`). Every colour
  is a token, so a page that uses tokens works in both. Code and terminal surfaces (`--night*`)
  stay dark in both themes. Check every page in both.
- **Signature.** A narrow beam of light through the mark's keyhole (violet to lilac to a warm
  peach, `--beam-a/b/c`) over a faint blueprint grid (`.grid-bg`). Full size in the home hero,
  smaller in `PageHero`. Once per page.
- **Show the product.** Use `.window` + `.window-bar` for product mock-ups (console screens,
  terminals, a browser with the deployed app) built in HTML/SVG from real product states. This is
  what Zed and Neon do and what made v1 feel empty.
- **Tiles, not identical cards.** Feature grids are bento tiles of different spans, each with a
  small drawn piece of the product in an `.art` well (see `components/home/Bento.astro`).
- **Rhythm.** Alternate plain sections with `.band` sections (`--paper-2`), Cloudflare-style.
- **Panels** have a gradient hairline border and an inner top highlight (`.panel`), radius
  `--radius-lg`; the featured plan gets the beam gradient as its border.
- `PageHero` takes an optional `visual` slot for a mock-up beside the title.

## Motion (v3)

The owner asked for the site to feel alive the way neon.com does, but premium and restrained. One
system, in `src/scripts/motion.ts` (loaded once from `Base.astro`, under 1 KB gzipped) and the
"Motion" section at the end of `global.css`. Pages only add attributes:

- **`data-reveal`**: fades up 16px over 600ms, once, when it scrolls into view (no blur: blurring
  whole blocks costs frames while scrolling). `data-reveal-delay="120"` waits that many ms.
  **`data-reveal-stagger`** on a grid reveals each child one step (~70ms) after the first, then on
  gaps that shrink by 0.88x, so a group reads as a wave and a long list never waits (pass a number
  to change the step; it is held to 30-80ms). A `data-play` child starts playing once its own
  reveal delay has passed. One reveal per block: a section head, a grid, a window; never per
  paragraph.
- **`data-play`**: gets `.is-playing` once in view (and keeps it). Illustrations start their CSS
  animations from that class: the bento tiles on the home page, the Lanes packets, the vibe band.
- **Type-on**: a `<pre data-play>` whose lines are `<span class="ln" style="--i:n">` shows them in
  turn; `--type-step` sets the pace. The full text is always in the HTML.
- **`data-spotlight`**: a border glow and faint fill that follow a hovering fine pointer (cards,
  tiles, panels, plans); `--mx/--my` are non-inherited `@property`s so a move never restyles the
  card's contents. `data-spotlight="ring"` when the element already uses `::before`.
- **Off-screen rest**: every `[data-play]` illustration, and any loop marked **`data-loop`** (the
  ticker, the CTA band's beam, the home hero), gets `.is-offscreen` while it is out of
  view, and its animations pause until it comes back. Loops cost nothing below the fold.
- **`data-spy`** on a contents `<nav>` (changelog, legal documents): the link to the section being
  read gets `aria-current="location"`, styled like hover.
- **Inner-page heroes**: `PageHero` plays one short load wave (heading, lede 80ms, buttons 140ms,
  visual 200ms; 8-16px over 500-560ms, settled by ~0.75s, since it replays on every page) and
  fades its beam in. Its `visual` slot never adds its own `data-reveal`.
- **Featured card**: `.plan--featured` and `.tier--ent` draw their border as a conic gradient from
  `--sweep`, which turns once (2.4s) when the card arrives in view (`data-play`), then rests: a
  registered property animates on the main thread and a border circling beside prices distracts
  (`@property`; without it the border just stays still).

Rules: easing and durations are tokens (`--ease-out`, `--ease-in-out`, `--dur-*`). Entrances use
`--ease-out`; UI feedback stays at 150-300ms (buttons give `scale(0.97)` on `:active` over
`--dur-press`); only the home hero's one load sequence runs longer (settled by ~1.45s). Nothing
starts from `scale(0)`; nothing enters on opacity alone except ambient light (beams, the canvas)
and terminal lines. Every press target (`.btn`, the theme switch, the menu button) gives the same
`scale(0.97)`. Never put `mix-blend-mode`, a CSS mask or an animated `box-shadow` on a
layer that repaints every frame. The audit behind these values is `docs/motion-audit.md`. Animate
transform and opacity; loops are slow (4s and up) and quiet. Hidden starting states exist only
under `.js` (set by the inline head script) and `prefers-reduced-motion: no-preference`, so without
JavaScript, in print, or with reduced motion every element shows its final, static state; reduced
motion still keeps short colour and opacity fades (the reduce block narrows every transition to
those properties). The theme switch is instant: `.theme-switching` holds every transition for the
frame the theme flips. The review behind the latest values is `docs/animation-review.md`.
Never animate the page's layout, and check 390px and 1440px for sideways scroll.
