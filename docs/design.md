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
- Entrance animations on every section. Motion only where a person acted (tabs, details).
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
