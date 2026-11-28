# Where a cloudgate change shows up on the website

A starting map, not a complete one: always grep the site for the feature's words too, because a
feature is often mentioned on pages far from its own guide page (FAQ, limits, features, compare,
llms.txt). Paths on the left are in `/home/user/cloudgate`; on the right in `/home/user/cg-website`.
If a new console area appears that this map does not list, add a row here in the same PR.

## Always, for every release

| Thing | Website files |
|---|---|
| `CHANGELOG.md` sections | `src/content/changelog.md` (rewritten for readers), `docs/product-facts.md` |
| Server version | `src/data/schema.ts` `softwareVersion`, `src/pages/llms.txt.ts`, `src/pages/about.astro`, `src/pages/self-hosted.astro`, `src/content/docs/self-host/install.mdx`, `src/content/docs/guide/instance-settings.mdx`, `docs/product-facts.md` (run `scripts/check_copy.py` to list them all) |
| `cli/CHANGELOG.md`, CLI version | `src/content/docs/cli.mdx`, `src/content/docs/cli/commands.mdx`, `src/content/docs/cli/ci.mdx`, `src/content/docs/cli/troubleshooting.mdx`, `src/pages/cli.astro`, `src/content/docs/guide/templates.mdx`, `src/pages/llms.txt.ts`, `src/pages/about.astro` |
| `install.sh`, `deploy/` | Copied at build by `src/pages/install.sh.ts` (no edit). Prose: `src/content/docs/self-host/*.mdx`, `src/pages/self-hosted.astro`, `src/content/docs/help/troubleshooting.mdx`, `llms.txt` |
| `backend/openapi.json` | `src/data/openapi.json` via `scripts/api-reference/` (README there); prose in `src/content/docs/api*.mdx`, `src/content/docs/api/*.mdx` |
| `CONTEXT.md` (glossary) | `src/content/docs/glossary.mdx`, `src/content/docs/concepts.mdx`, and any page using a renamed term |
| Prices, plans, allowances (`backend/src/...billing`, plan constants) | `src/data/site.ts` (`plans`, `addOn`, `trialDays`), `src/pages/pricing.astro`, `src/content/docs/guide/billing.mdx`, `src/content/docs/help/limits.mdx`, `src/data/schema.ts` offers |

## Console areas (`frontend/src/app/(console)/...` routes, `frontend/src/features/<area>`)

| Console route / feature | Guide page(s) in `src/content/docs/guide/` | Also check |
|---|---|---|
| `/` home, `_components/home`, shell, ⌘K, rail | `console-tour.mdx` | `src/data/tour.ts`, `src/pages/tour.astro`, home `src/components/home/` |
| `/get-started`, `features/get-started` | `get-started.mdx` | `src/content/docs/quickstart.mdx`, `src/pages/vibe-coding.astro`, home hero |
| `/projects`, `/environments`, `features/project`, `features/environment` | `projects-and-environments.mdx` | `concepts.mdx` |
| `/applications`, `features/application` | `applications.mdx`, `application-settings.mdx`, `environment-variables.mdx`, `previews.mdx`, `workers-and-cron.mdx` | deploy guides in `src/content/docs/guides/` |
| `/deployments`, `features/deployments` | `deployments.mdx` | `help/troubleshooting.mdx` |
| `/compose`, `features/compose` | `compose-stacks.mdx`, `backups.mdx` (volume backups) | `src/content/docs/guide/templates.mdx` |
| `/databases`, `features/database` | `databases.mdx`, `backups.mdx` | `src/pages/features.astro` |
| `/buckets`, `features/bucket` | `buckets.mdx` | |
| `/servers`, `features/server` | `servers.mdx`, `ssh-keys.mdx` | `help/limits.mdx` |
| `/servers/buy`, bought Servers (Hosted only) | `bought-servers.mdx` | `billing.mdx`, `src/pages/pricing.astro` |
| `/monitoring`, `features/monitoring`, `features/service-health`, `features/traces` | `monitoring.mdx` | `src/pages/features.astro` |
| `/requests`, `features/requests` | `requests.mdx` | |
| `/templates`, `features/templates` | `templates.mdx` | cg-templates site (link only, never copy a template page) |
| `/help`, `features/help` | `help/faq.mdx`, `help/troubleshooting.mdx` | links the console's Help page points at must exist |
| `/account`, `/settings/account` | `sign-in-and-account.mdx`, `personal-keys.mdx` | |
| `/settings/members`, `/settings/roles`, `features/members` | `members-and-roles.mdx` | `src/pages/security.astro` |
| `/settings/organizations` | `organizations.mdx` | |
| `/settings/billing`, `features/billing` (Hosted only) | `billing.mdx` | `src/pages/pricing.astro`, `src/data/site.ts` |
| `/settings/agents`, `features/agents`, `backend/src/mcp` | `agents.mdx` | `src/content/docs/mcp*.mdx`, `src/pages/ai-agents.astro` |
| `/settings/ai`, `backend/src/ai-models` | `ai-models.mdx` | `src/pages/ai-models.astro` |
| `/settings/git-providers` | `git-providers.mdx` | deploy guides |
| `/settings/registries` | `registries.mdx` | |
| `/settings/cloud-accounts`, `backend/src/cloud*` | `cloud-accounts.mdx` | |
| `/settings/destinations` | `destinations.mdx`, `backups.mdx` | |
| `/settings/certificates`, `features/certificates`, Domains | `certificates.mdx`, `domains.mdx` | |
| `/settings/traefik` | `traefik.mdx` | |
| `/settings/forward-auth` | `forward-auth.mdx` | |
| `/settings/notifications` | `notifications.mdx` | |
| `/settings/audit-log` | `audit-log.mdx` | `src/pages/security.astro` |
| `/settings/sso`, `features/enterprise` | `sso-and-scim.mdx` | `src/pages/security.astro`, pricing |
| `/settings/license`, `/settings/branding` | `license-and-branding.mdx` | `src/pages/license.astro` |
| `/settings/instance`, `/settings/maintenance`, `/settings/operator` | `instance-settings.mdx` | `src/content/docs/self-host/instance-settings.mdx` |
| Project config (`cloudgate.yaml`, `backend/src/project-config`) | `project-config.mdx` | CLI docs (`config pull|plan`) |

## Backend-only changes

A backend change with no console change can still change the site: a new limit, a new refusal
message, a changed default, a new API route, a new MCP tool, a new notification. Find which screen
or command shows it, then use the console table above.

## Screenshots

`public/docs/screens/manifest.json` lists every screenshot with its console `route`. To find the
images a console change affects:

```bash
jq -r '.[] | "\(.name)\t\(.route)"' public/docs/screens/manifest.json | grep -i "<route or area>"
grep -rn 'Screenshot name="<name>"' src/content/docs
```

The home page and `/tour` use copies in `src/assets/console/` (listed in `src/data/tour.ts`):
when one of those names is retaken, copy the new files there too.
