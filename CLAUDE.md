# CLAUDE.md

The public marketing site for Cloudgate: Astro, static, published to GitHub Pages at
cloudgate.octabyte.io. `README.md` has the commands; `docs/design.md` is the design system and
`docs/product-facts.md` the facts every page must match.

## Which skill for which job

Several design skills overlap. Pick by the job, not by habit:

| Job | Skill |
|---|---|
| Any page, title, description, schema, internal links, llms.txt | SearchFit (`searchfit-seo` plugin): always, on every page change |
| New page or section: layout, type, colour decisions | `frontend-design`, inside the rules of `docs/design.md` |
| Critique, audit or polish an existing page (spacing, hierarchy, contrast, responsive) | `impeccable` |
| Build a new animation or entrance | `animate`; several elements moving together: `choreograph` |
| "What else could move?" / review or tidy existing motion | `find-animation-opportunities`, `review-animations`, `improve-animations`, `remove-animations` |
| Dropped frames, janky scroll | `animation-performance` |
| Naming a motion effect | `animation-vocabulary` |
| Phone feel (tap highlight, 100vh, input zoom) | `mobile-native` |
| Stress-test a component with worst-case content | `break-ui` |
| General UI polish philosophy | `emil-design-eng` |

`docs/design.md` wins over any skill's defaults: tokens only in `src/styles/global.css`, both
themes, motion that respects reduced motion, no invented facts. `impeccable`'s helper script
downloads its engine binary from the internet on first run; ask before running it.
