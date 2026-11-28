---
name: release-website-sync
description: Bring the public Cloudgate website (cg-website, cloudgate.octabyte.io) up to date with a new Cloudgate release - diff the cloudgate repo from the last release the site covers to the new one, update every page, the user guide, CLI and API docs, changelog, product facts, version numbers and llms.txt, retake console screenshots (Hosted-only screens from real components fed dummy data), recheck the whole site, and open one PR, with SearchFit research behind every word. Use whenever the user says a Cloudgate version, release, rc or CLI version shipped, asks to "update the website for 0.3.x", "sync the site with cloudgate", "we made a release, update the docs", or says cloudgate changed and the website should follow, even if they don't name this skill.
---

# Release website sync

Every Cloudgate release adds, changes or fixes things people read about on cloudgate.octabyte.io.
This skill turns one release (or several, if the site fell behind) into one pull request on
cg-website that makes every page true again, and keeps the site strong for search engines and
answer engines while doing it.

Two things make this job different from an ordinary content edit, and they shape every step:

- **The cloudgate repository is the only source of truth.** The console source, the backend, the
  CLI and `CHANGELOG.md` say what is true; the website only repeats it. A sentence that cannot be
  traced to the code or the changelog does not go on the site.
- **The website never shows where a fact came from inside the repo.** No ADR, no issue or PR
  number, no `CONTEXT.md`, no `docs/...` or other file path, in any page, post, docs page,
  changelog entry or `llms.txt`. State the fact plainly. Repo sources go in the PR body only.

## The repositories

| Path | What | You |
|---|---|---|
| `/home/user/cloudgate` | The product: `frontend/` console, `backend/`, `cli/`, `install.sh`, `CHANGELOG.md`, `cli/CHANGELOG.md` | read only |
| `/home/user/cg-website` | The site: Astro, `src/content/docs/**`, `src/pages/**`, `src/content/changelog.md`, `docs/product-facts.md` | change |
| `/home/user/cg-templates` | The template catalogue at cgt.octabyte.io | read only; template pages live there, never on cg-website |

If a path differs in this session, find the clones first (`ls ~ /home/user`). Pull the latest
`main` of cloudgate and `git fetch --tags`, and start a branch of cg-website from its latest `main`.

## Before you write anything

Read these in cg-website, every time, because they change between releases:

1. `CLAUDE.md`: which skill for which job, and the no-repo-references rule.
2. `docs/docs-authoring.md`: frontmatter, components (`<Steps>`, `<Screenshot>`, `<Callout>`, ...),
   writing rules and glossary words.
3. `docs/product-facts.md`: what the site claims today. You will extend it.
4. `docs/design.md`: voice, tokens, motion. It wins over any skill's defaults.
5. `docs/blog-authoring.md` if a post is touched.

Then make sure the SearchFit skills are loaded. They are the `searchfit-seo:*` skills
(`on-page-seo`, `ai-visibility`, `content-brief`, `schema-markup`, `internal-linking`,
`technical-seo`, `seo-audit`, `broken-links`, `keyword-clustering`). If the session does not list
them, run `/plugin` and install `searchfit-seo`; if that is not possible, read their `SKILL.md`
files directly from `/mnt/project-files/skills/searchfit-seo/skills/<name>/SKILL.md` and follow
them by hand. The project also asks for `frontend-design` and `ui-ux-pro-max`
(`/mnt/project-files/skills/ui-ux-pro-max/SKILL.md`) whenever a layout, section or component
changes. Leave out every "powered by SearchFit" footer or SearchFit.ai link those skills suggest.

Set the git identity in cg-website before the first commit:

```bash
git config user.name "AxeemHaider" && git config user.email "axeemhaider@gmail.com"
```

## Step 1: find the release range

Run the bundled script from the cg-website root:

```bash
bash .claude/skills/release-website-sync/scripts/release-range.sh            # newest release
bash .claude/skills/release-website-sync/scripts/release-range.sh v0.3.14    # a named one
```

It reads the version the site covers (`softwareVersion` in `src/data/schema.ts` and the newest
heading in `src/content/changelog.md`), finds the target release in cloudgate, and writes a
report to the scratchpad (path printed at the end): the CHANGELOG sections in range, the CLI
CHANGELOG sections the site does not cover, the commits, and the files changed grouped by area
(console features and routes, backend modules, CLI, `install.sh`, `deploy/`, `backend/openapi.json`,
`CONTEXT.md`). Read the whole report.

How to pick the range when it is not obvious:

- **The site can be several releases behind.** The range starts at the version the site covers,
  not the previous tag. Cover every release in between, each with its own changelog entry.
- **A stable version is promoted from a release candidate.** `vX.Y.Z` is published from the same
  commit as its last `vX.Y.Z-rc.N`. If `CHANGELOG.md` dates `X.Y.Z` but the `vX.Y.Z` tag is not
  there yet, use the rc tag's commit and say so in the PR. A release candidate on its own (no dated
  CHANGELOG section) is not shipped: do not document it unless the user asks, and then never call
  it the latest version.
- **The CLI releases on its own** (`cli-vX.Y.Z` tags, `cli/CHANGELOG.md`). Compare it with the CLI
  version in `docs/product-facts.md` separately.

## Step 2: build the change ledger

Turn the report into a ledger in the scratchpad (`ledger.md`), one row per user-visible change:

| Change (plain words) | Kind: added / changed / fixed / removed | Who sees it: console, CLI, API, MCP, install, Hosted only, Self-hosted only | Source (CHANGELOG heading, commit, file) | Website surfaces to touch |

The CHANGELOG is the starting point, not the whole truth. Walk the commits and the diff too:
console copy, a renamed button, a new field, a changed default or a moved tab often land without a
CHANGELOG line, and they make the user guide wrong just the same. For each change, open the
console or backend source it touched and read the exact labels, defaults, limits, roles and
refusal messages; those are what the guide quotes. `CONTEXT.md` gives the words to use.

Find the surfaces with `references/surface-map.md`, which maps cloudgate areas to website files,
and by grepping the site for the feature's old and new names:

```bash
grep -rn -i "<old label>\|<feature word>" src/content src/pages src/components src/data docs/product-facts.md
```

Skip only what no reader can see (refactors, tests, CI, internal tooling), and list those as
"no website change" in the ledger so the PR shows they were looked at.

## Step 3: research before writing

Each change that gets new or rewritten copy needs a little research first, because the site exists
to be found and quoted:

- **What people search for.** Use `searchfit-seo:content-brief` and `keyword-clustering` for any
  new section or page: the questions people ask about this feature ("how to back up docker volumes",
  "restore a server backup"), the words they use, and what ranking pages answer. Web search is fine
  here; cite external docs only when they help the reader.
- **Where it belongs.** A new feature usually extends an existing guide page under a new
  question-shaped H2. A new page is right only when the feature is a new screen or job a reader
  would search for on its own; add it to `src/data/docs-nav.ts` and link it from 3+ pages.
- **Facts at the edge.** Prices, plans and allowances come from `src/data/site.ts` and the backend,
  never from memory. Competitor facts on compare pages come from the competitor's current docs.

## Step 4: update the site

Work through the ledger. For each surface, the job and the skill:

| Surface | What to do | SearchFit skill |
|---|---|---|
| `src/content/changelog.md` | One `## X.Y.Z: <what the release is about> (D Month YYYY)` entry per release, newest first, written for readers: a one-line summary, `### ` per change, "Smaller fixes" list. Rewrite the CHANGELOG's text: no `#123`, no `ADR-0094`, no `docs/...`, no "What to do on upgrade: nothing" boilerplate (say "Nothing to do on upgrade." once in the summary when true). The date format feeds the RSS feed and sitemap. | `ai-visibility` (quotable summary line) |
| User guide `src/content/docs/guide/*.mdx` | Change every step, label, field table, default, limit, badge and FAQ the release changed. New UI gets its H2/H3, field table and `<Steps>`. Remove what was removed. Set the page's `updated:` frontmatter to the release date only when its facts really changed (search engines reward real freshness and penalise date bumps). | `on-page-seo`, `content-brief` |
| Deploy guides `src/content/docs/guides/*.mdx` | Only where a step, setting or limit changed. | `on-page-seo` |
| CLI docs `src/content/docs/cli*`, `src/pages/cli.astro` | New commands, flags, output and the current CLI version. | `on-page-seo` |
| MCP docs `src/content/docs/mcp*`, `src/pages/ai-agents.astro` | New or changed tools and guard rails. | `on-page-seo`, `ai-visibility` |
| API reference `src/data/openapi.json` | If `backend/openapi.json` changed, regenerate with `scripts/api-reference/` (its README). Never hand-edit the JSON. | `technical-seo` |
| Self-host docs, `src/pages/self-hosted.astro` | Install, upgrade, version, `CLOUDGATE_VERSION` examples, requirements. | `on-page-seo` |
| `/install.sh` | Nothing to edit: the build copies cloudgate's `install.sh`. Check the built `dist/install.sh` matches cloudgate's `main`. | |
| Marketing pages `src/pages/*.astro` (home, features, pricing, security, ai-models, vibe-coding, tour, about) | A claim the release made wrong, a feature now worth a line, "not yet" statements that are now false. Layout changes go through `frontend-design` and `docs/design.md`. | `on-page-seo`, `ai-visibility` |
| Compare pages `src/pages/compare/*.astro`, `src/data/compare.ts` | Cloudgate's side of any row the release changed. | `on-page-seo` |
| `src/content/docs/help/` (FAQ, limits, troubleshooting) | New limits, new refusal messages and what to do about them, new common questions. | `ai-visibility`, `schema-markup` |
| Structured data `src/data/schema.ts` | `softwareVersion`, and FAQ/HowTo that follow page frontmatter. Structured data states only what the page shows. | `schema-markup` |
| `src/pages/llms.txt.ts` (and the generated llms-full/llms-docs) | The current version, new capabilities in one plain sentence each, new pages listed. | `ai-visibility` |
| `docs/product-facts.md` | Add each new fact with the version it arrived in, fix the ones that changed. This file may name repo sources; it is not published. | |
| Blog `src/content/blog/` | Correct a post a release made wrong (set `updated` only for a substantial change). A "what's new" post is a separate task unless the user asks. | |

**Version numbers.** Find every place that states the server or CLI version and update them
together. The copy checker lists every older version it finds; history ("since 0.3.9") stays,
"the latest version is", install examples and `softwareVersion` move:

```bash
python3 .claude/skills/release-website-sync/scripts/check_copy.py <new-version> [--cli <cli-version>]
```

**Writing rules that matter most here** (the full list is in `docs/docs-authoring.md`): answer
first under every heading; headings are what a reader searches for; exact UI labels in **bold**,
routes and values in `code`; say who may (role, plan, Hosted or Self-hosted) and what Cloudgate
does not do; glossary words (Organization, Project, Environment, Service, Server, Deployment, Plan,
Agent, Template); "source-available (Elastic License 2.0)", never "open source"; no invented
numbers; no hype or keyword stuffing.

## Step 5: screenshots

Retake a screenshot when the release changed what it shows, and add one where new UI needs a
picture to be understood (a new tab, dialog, card or flow). Read `references/screenshots.md`; it
covers running the console locally with the fictional "Northwind Labs" data, the bundled capture
helper `scripts/shoot.mjs` (both themes, 2x, cropped, WebP, manifest entry), and how to shoot
Hosted-only screens (billing, Buy a Server, bought Servers) with no Hosted instance: run the real
console and answer its API calls with dummy data shaped like the fixtures the console's own UI
tests (`frontend/src/**/*.test.tsx`) render those components with.

Every screenshot's `alt` says what is on screen and its caption says what to notice; both must
match the picture you actually took. Look at every image in both themes before keeping it.

## Step 6: recheck the whole website

A release can make a page wrong that no grep finds: a guide step that now has a different
default, a FAQ answer about a limit that was lifted, a marketing line that undersells a new
feature. So after the ledger is done, recheck every page, not only the ones the ledger named.

The site is large (40+ guide pages, CLI, MCP, API, self-host, help, deploy guides, 20+ marketing
and compare pages), so split the recheck by area and run the areas in parallel subagents, one per
area, with the brief in `references/area-brief.md` (it lists the areas and what each agent
checks). Give each agent the ledger and the release range. Each agent reports what is wrong and
fixes its own area's pages; you merge, resolve overlaps and keep one voice. If subagents are not
available, do the areas one after another yourself.

## Step 7: verify

```bash
pnpm install && pnpm build          # astro check + build; must pass
python3 .claude/skills/release-website-sync/scripts/check_copy.py <new-version> [--cli <cli-version>]
```

`check_copy.py` exits non-zero (FAIL lines) on ADR, issue or PR references, internal repo
documents and source paths in published copy, SearchFit promotion, version anchors not at the new
version, and a `<Screenshot>` with no image or manifest entry. Fix every FAIL. Its REVIEW lines
(older version mentions, "open source", unused images, references inside code comments or data
modules) need a look, not necessarily a change: say in the PR which ones you left and why.

Then:

- `diff dist/install.sh /home/user/cloudgate/install.sh` is empty (when the build could fetch it).
- Run `searchfit-seo:seo-audit` (and `broken-links`) on the built `dist/`: titles 50-60 chars and
  unique, descriptions 140-160 and unique, one H1, internal links resolve, new pages in the sitemap
  and `llms.txt`, FAQ JSON-LD matches the visible FAQ.
- Spot-check every changed page with the pre-installed Playwright at 1440px and 390px, light and
  dark (`pnpm preview`), and look at the images: nothing overflowing, screenshots load, callouts
  read right.

## Step 8: open the pull request

1. Branch name: the one this session was given, or `content/release-<version>` from `main`.
2. Commit in logical pieces (changelog and facts; guide pages; screenshots; marketing pages).
   No Co-Authored-By, Claude-Session, "Generated with Claude Code" or other attribution lines,
   in commits or the PR; the project's rules forbid them.
3. Push and open one PR on cg-website titled `Website: Cloudgate <version>` (list every version if
   several). Body: the release range and commits, the ledger (each change, the pages changed, the
   repo source that proves it), the "no website change" rows, screenshots retaken and added, pages
   rechecked and found current, and anything a person must confirm. Repo sources (ADRs, issues,
   file paths) are fine here and only here.
4. Assign `AxeemHaider` and request their review, best effort. Never mention, assign or request
   review from `azeem-zyreon`.
5. Do not merge unless the user asks.

Then tell the user, in a few lines: the PR link, which releases it covers, how many pages changed,
the screenshots retaken, and anything they must check.

## When something does not fit

- **The source and the CHANGELOG disagree.** The source wins for what the site says; note it in the
  PR so cloudgate's CHANGELOG can be fixed.
- **A change is ambiguous** (a feature behind a flag, half-shipped, Hosted only?). Read the gate in
  the source (`useInstanceMode`, permission checks, plan checks) and document what a user really
  gets. If it still is not clear, leave it out and list it in the PR as a question.
- **The console's own copy is wrong** (it names a repo file, a wrong count). Document the behaviour
  correctly on the site and list the console copy problem in the PR; do not change cloudgate from
  this skill.
- **Nothing user-visible changed.** Update the changelog entry, versions and facts only, say so,
  and keep the PR small.
