# Writing docs pages

The documentation lives at `/docs`. Read `docs/design.md` (tokens, voice, motion) and
`docs/product-facts.md` first; every claim must trace to the cloudgate repository.

## Where things are

| Path | What |
|---|---|
| `src/content/docs/**/*.mdx` | One file per page. Its path is its URL: `guide/servers.mdx` is `/docs/guide/servers`. |
| `src/content.config.ts` | The frontmatter schema (below). |
| `src/data/docs-nav.ts` | Sidebar sections and the user guide's group order. |
| `src/pages/docs/index.astro` | The docs home. |
| `src/pages/docs/[...slug].astro` | Renders every `.mdx` page in `src/layouts/Docs.astro`. |
| `src/pages/docs/api/[group].astro` + `src/data/api-reference.ts` | The API reference, generated from `src/data/openapi.json`. |
| `src/pages/docs/search.json.ts` | The search index (pages, headings, API operations). |
| `src/styles/docs.css`, `src/scripts/docs.ts` | Docs styles and interactions. Tokens only. |
| `public/docs/screens/` | Console screenshots, `<name>-dark.webp` and `<name>-light.webp`, listed in `manifest.json`. |

## Frontmatter

```yaml
title: Add a Server                # the one <h1>, sentence case, in the reader's words
seoTitle: Add a Server to Cloudgate over SSH   # optional; <title> is this + " | Cloudgate", aim 50-60 chars total
description: 140-160 characters, unique, says what the reader will be able to do.
lede: One or two sentences under the title that answer "what is this and when do I need it".
section: guide                     # start | guide | cli | mcp | api | self-host | help
group: Where it runs               # user guide only: Deploy | Where it runs | Services | Data | Operate | Team and access | Account
order: 20                          # position in its group, smallest first
navTitle: Servers                  # optional short sidebar label
badges: ['Owner or Admin', 'Hosted only']   # who/what it applies to: roles, plans, hosted vs self-hosted
howto:                             # only when the page has a real ordered how-to (HowTo JSON-LD)
  name: Add a Server over SSH
  steps:
    - { name: Open Servers, text: In the console, open Servers and press Add server. }
faq:                               # 2-5 real questions, answer first; rendered at the end and as FAQPage JSON-LD
  - { q: Can I use a server that is not Ubuntu?, a: 'No. ...' }
```

## Components (no import needed in `.mdx`)

- `<Steps>` with `<Step title="...">` children: a real sequence only. Put a `<Screenshot>` inside the step it illustrates.
- `<Screenshot name="servers-list" alt="..." caption="..." />`: a console screenshot from
  `public/docs/screens/` (both themes). `alt` says what is on screen; the caption says what to notice.
  Every screenshot is made from fictional data (the "Northwind Labs" organization).
- `<Callout type="note|tip|warn|limit" title="...">`: `warn` for anything that cannot be undone or
  costs money; `limit` for what Cloudgate does not do, or a role, plan or licence gate.
- `<Badge tone="plain|brand|live|warn">` inline, for example in a table cell.
- `<Tabs group="mcp-client">` with `<Tab label="Cursor">` children: alternatives for one step. Tabs
  sharing a `group` stay in sync across the page and are remembered.
- `<CardGrid cols={2|3}>` with `<Card href title slice={1|2|3}>`: hub pages only.
- Fenced code blocks get syntax colours, a language tag and a copy button. Use `bash`, `json`,
  `yaml`, `http`, `text`.

## Writing rules

- Use CONTEXT.md's words: Organization, Project, Environment, Service, Server, Deployment, Plan,
  Agent, Template. Never "app" for a Service in prose about the model (an Application is a kind of
  Service), never "workspace", "team", "node", "host" for these things.
- Answer first. Headings are what a reader searches for ("Add a custom domain", "What happens when a
  build fails?"); the first sentence under a heading answers it.
- Say what the reader cannot do, and who may: role, plan, hosted or self-hosted. Use `limit` callouts.
- Exact UI labels in **bold** (press **Add server**), routes and values in `code`.
- Link 3+ related docs pages with descriptive text, and the marketing page for the topic where one
  exists (`/features`, `/ai-agents`, `/cli`, `/pricing`, `/self-hosted`, `/security`).
- No invented numbers, quotes or features. No "open source": Cloudgate is source-available
  (Elastic License 2.0).
- Link files in the public cloudgate repository (https://github.com/octabyte-io/cloudgate) where it
  helps the reader; use `repoFile(path)` from `src/data/site.ts`.
- No all-caps labels, no "→" glued to links, no emoji.
