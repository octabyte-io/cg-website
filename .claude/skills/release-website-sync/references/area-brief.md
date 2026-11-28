# Whole-site recheck: areas and the brief for each agent

After the ledger's changes are written, every page is rechecked against the release, because a
release can make a page wrong in ways no grep finds. Run one subagent per area below, in parallel,
each with the brief at the end filled in. If subagents are not available, work through the areas
yourself in this order.

## Areas

| Area | Pages (in cg-website) | Source to check against (in the cloudgate checkout at the release) |
|---|---|---|
| 1. Deploy and services | `src/content/docs/guide/{get-started,applications,application-settings,environment-variables,deployments,previews,workers-and-cron,compose-stacks,templates,project-config}.mdx`, `src/content/docs/quickstart.mdx`, `src/content/docs/guides/*.mdx` | `frontend/src/features/{get-started,application,deployments,compose,templates,project}`, matching `app/(console)` routes, `backend/src/{applications,deployments,compose,templates,project-config,cron-services,preview-deployments}` |
| 2. Where it runs | `guide/{servers,bought-servers,ssh-keys,cloud-accounts,domains,certificates,traefik,forward-auth}.mdx` | `features/{server,certificates}`, `backend/src/{servers,bought-servers,cloud-accounts,domains,certificates,traefik,ssh-keys}` |
| 3. Data and operate | `guide/{databases,buckets,backups,destinations,monitoring,requests,notifications,audit-log}.mdx` | `features/{database,bucket,monitoring,requests,service-health,traces}`, `backend/src/{databases,backups,volume-backups,object-storage,destinations,monitoring,notifications,traces}` |
| 4. Team, account, billing | `guide/{organizations,members-and-roles,sign-in-and-account,personal-keys,sso-and-scim,billing,license-and-branding,instance-settings,console-tour}.mdx` | `features/{members,billing,enterprise,settings,operator}`, `backend/src/{organizations,rbac,auth,users,enterprise,settings}` and billing |
| 5. AI, agents, MCP, CLI, API | `guide/{agents,ai-models,git-providers,registries}.mdx`, `src/content/docs/{mcp,cli,api}*.mdx` and their folders, `src/pages/{ai-agents,ai-models,cli}.astro` | `features/agents`, `backend/src/{mcp,agents,ai-models,git-providers,registries}`, `cli/src`, `cli/CHANGELOG.md`, `backend/openapi.json` |
| 6. Self-host, help, concepts | `src/content/docs/{self-host*,self-host/*,help/*,concepts,glossary}.mdx`, `src/pages/self-hosted.astro`, `src/pages/security.astro` | `install.sh`, `deploy/`, `README.md`, `SECURITY.md`, `CONTEXT.md` |
| 7. Marketing, compare, blog, machine-readable | `src/pages/{index,features,pricing,tour,vibe-coding,about,changelog,compare}.astro`, `src/pages/compare/*.astro`, `src/data/{site,compare,tour,schema}.ts`, `src/content/blog/*.md`, `src/pages/llms*.ts`, home components | `CHANGELOG.md`, `README.md`, `docs/product-facts.md` on the website, `src/data/site.ts` |

## Brief (fill the brackets, give one per agent)

> You are rechecking one area of the Cloudgate website (cg-website, `/home/user/cg-website`)
> after Cloudgate [versions] shipped. The release range is [from..to]; the change ledger is at
> [path] and the release report at [path]. Your area: [area name], pages: [list]. Source of truth:
> the cloudgate checkout at [path] (at the release commit), especially [source paths].
>
> Read first: cg-website `CLAUDE.md`, `docs/docs-authoring.md`, `docs/product-facts.md`,
> `docs/design.md` (voice), and the SearchFit skills `searchfit-seo:on-page-seo` and
> `searchfit-seo:ai-visibility` (or their SKILL.md files under
> `/mnt/project-files/skills/searchfit-seo/skills/`).
>
> For every page in your area:
> 1. Check each claim, step, label, field table, default, limit, role/plan/Hosted gate, FAQ answer
>    and link against the console and backend source at the release. The source wins; fix the page.
> 2. Add what the ledger's changes mean for your pages if the main pass missed it.
> 3. Improve search and answer-engine fit where you touch a section: question-shaped headings, an
>    answer in the first sentence, a quotable lede, a unique 140-160 character description and a
>    50-60 character seoTitle, 3-6 real FAQ items, descriptive links to 3+ related pages. No
>    keyword stuffing, no hype, no new sections that don't fit.
> 4. List screenshots on your pages whose picture no longer matches the release (name and why).
>    Do not capture them; the coordinator does.
>
> Rules: never mention or link ADRs, issue or PR numbers, `CONTEXT.md`, repo file paths or other
> internal cloudgate material in page copy; state facts plainly. Glossary words (Organization,
> Project, Environment, Service, Server, Deployment, Plan, Agent, Template). "Source-available
> (Elastic License 2.0)", never "open source". No invented numbers or features. Edit only your
> area's pages; do not edit `docs-nav.ts`, `manifest.json`, `product-facts.md`, the changelog or
> other areas' pages (report needed changes instead). No git commands. Leave out any SearchFit
> promotion.
>
> Report: each page checked; for each change, what was wrong and the source file that shows it;
> pages found current; screenshots to retake; changes needed outside your area; open questions.
