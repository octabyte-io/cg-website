# Product facts

What the site may claim, each traceable to the cloudgate repository (README.md, CONTEXT.md,
CHANGELOG.md, cli/CHANGELOG.md, SECURITY.md, CONTRIBUTING.md, docs/, docs/adr/), public at
https://github.com/octabyte-io/cloudgate (`site.sourceUrl`; link files with `repoFile(path)`). If a claim is not here, check the repository before writing it.

## What Cloudgate is

A deployment platform. You connect your own Servers (the machine it runs on, or remote ones over
SSH), or Cloud accounts (AWS, Google Cloud), and it builds and runs Applications, managed
databases and Compose stacks on them, with build logs, domains, certificates, backups, metrics
and access control. Self-hosted, or used through the Hosted instance at
https://cloudgate.octabyte.app run by Octabyte.

Model: **Organization → Project → Environment → Services**, deployed onto Servers or a Cloud
account. A Deployment is one attempt to build and release a Service.

## Ways to deploy

- **Console**: the web UI.
- **Get started wizard** (`/get-started?template=<id>` on the console): for someone who has never
  used a deployment tool. Three steps: sign up or in, get a Server (buy one from Cloudgate, or
  use your own: the wizard makes a key and gives the one command to run), then Deploy. Cloudgate
  applies the setup by itself once the Server is ready, then shows "Open <app>" and the address.
  A free sslip.io address works right away (plain http); add your own domain for https.
- **CLI** `@octabyte-io/cloudgate` on npm (Node 22+). The npm `latest` tag is 0.0.1, a
  placeholder with no commands; the real CLI is the beta on `next` (0.0.2-beta.3), so every
  install line on the site is `npm install -g @octabyte-io/cloudgate@next`. Source in the repo's
  `cli/`. Commands: `login` (approve a code in the console), `whoami`, `instance list|use`,
  `logout`, `link`/`unlink`, `deploy` (respects .gitignore and .cloudgateignore, skips .env),
  `status`, `logs`, `vars list|set|unset`, `template check|pack|try`, `config pull|plan`. In CI:
  `CLOUDGATE_KEY=<personal key>`.
  - **Changed files only** (0.0.2-beta.3): `deploy` sends file checksums (SHA-256) and uploads
    only files the Instance lacks or holds different; local deletions are deleted there too.
    `--full` sends every file. Needs an Instance at 0.2.0+; an older one gets the full upload.
    The CLI still works with Instances from 0.1.0.
  - **Project folders** (0.0.2-beta.3, ADR-0080): `link --whole-project` saves the Project config
    as `cloudgate.yaml` (a working copy); `config pull` refreshes it; `config plan` shows and
    applies each Environment's Plan (destroys and major upgrades need the Config name typed;
    `--yes` refuses both); a stale copy is refused. A root `deploy` runs the plan step, then
    builds every app whose entry is `source: { folder: <subfolder> }`; others are skipped.
    A first `deploy` in an unlinked folder asks which Project (or "Create a new Project": name,
    a `production` Environment on a ready Server or a Cloud account and region, a starter
    `cloudgate.yaml`), then "One app or the whole Project?".
  - **`template try <folder>`**: runs a template's compose part on local Docker (Compose
    2.1.1+), checks each Domain answers, removes everything; values from the folder's
    `test-values.yaml`. No Instance or login needed.
- **Git**: GitHub, GitLab, Bitbucket, Gitea, or any git URL; push-to-deploy via webhooks.
  Also a Docker image, or uploaded files.
- **Project config** `cloudgate.yaml`: one file describing a Project's services, kept in the
  repository or in Cloudgate. Changes show as a **Plan** (create, change, destroy) you review and
  Apply.
- **AI agents over MCP** (below).

## Builds

Nixpacks (default), Railpack, Dockerfile, Heroku buildpacks, Paketo buildpacks, static sites,
or a ready-made Docker image.

## Kinds of Service

- `web` Applications with Domains, `worker` (always on, no address), `web-private` (reachable only
  by other Services), `cron` (a fresh container per run on a timetable), `bucket` (files; on a
  Server it is its own Garage container, S3-compatible).
- Databases: PostgreSQL, MySQL, MariaDB, MongoDB, Redis, libSQL. Or an existing database made
  outside Cloudgate, used as given.
- Compose stacks (Docker Compose).
- AI models: one model served by Ollama, vLLM or llama.cpp, optionally reserving whole GPUs,
  reached through Cloudgate's **Gateway** (OpenAI-compatible calls), which counts token spend
  per model and per calling Agent.
- Sizes: xsmall (0.25 CPU / 512 MB) doubling up to 2xlarge (8 CPU).

## Where it runs

- **A Server**: any Ubuntu machine over SSH, with Docker Swarm and Traefik set up by Cloudgate's
  Setup run. Domains get Let's Encrypt certificates.
- **Bought Server** (Hosted only): buy a server from Cloudgate in the console; a world map of
  locations, sizes, optional backups and extra storage (10 GB to 10 TB). Billed monthly in
  advance on the same invoice. Machines are Hetzner Cloud, but do not name the provider on the
  site unless asked.
- **AWS**: ECS (Fargate) for web, workers, private web services and cron; RDS for Postgres and
  MySQL; ElastiCache for Redis; S3 and CloudFront for buckets and static sites.
- **Google Cloud**: Cloud Run for web; Cloud SQL; Memorystore for Redis.
- A Compose stack in a cloud runs on its own Stack VM.
- Cloud resources are made with OpenTofu; Cloudgate keeps the infrastructure state and shows
  drift (changes made by hand in the cloud console).
- On the Hosted instance, a cloud Service builds in the cloud's own build service (CodeBuild,
  Cloud Build).

## Running it in production

- Domains and TLS certificates; CDN providers Cloudflare, Bunny, Fastly, ArvanCloud.
- Backups of databases and volumes to S3-compatible destinations.
- Preview deployments: one per pull request (GitHub), or a requested preview that expires.
- Rollbacks to an earlier Deployment.
- Monitoring: server CPU and memory thresholds, uptime checks, error rate from Traefik's 5xx
  counts per Domain, incidents, traces (own trace store per Service), runtime logs, access logs.
- Notifications: Slack, Discord, Microsoft Teams, Telegram, Mattermost, email, Resend, ntfy,
  Gotify, Pushover, Lark, custom webhook.
- Environment variables per Project, Environment and Service; wired variables link one Service's
  outputs (for example `DATABASE_URL: pg-1.url`) and are filled in at deploy, never saved.
- Secrets are encrypted at rest; API responses show only whether a secret is set.
- Shell into a container from the console.

## Teams and access

- Organizations, members with roles, grants per Project, Environment and Service, audit log.
- Personal keys for scripts and the CLI.
- Paid features: SSO (for domains the Organization has proven with DNS), SCIM, custom roles,
  forward auth in front of apps.

## AI agents (docs/connecting-an-agent.md)

- An **Agent** is a member that is not a person: its own role (Reader or Operator), its own grant
  to the Projects, Environments and Services it may reach, and its own **agent keys**. It
  outlives whoever made it.
- It connects to the **MCP endpoint**: the console's address plus `/mcp`, with
  `Authorization: Bearer <agent key>`. The console's Connect panel has the config for each
  supported MCP client.
- Tools include `deploy_service`, `start_service`, `stop_service`, `cancel_deployment`,
  `create_preview`, `extend_preview`, `redeploy_preview`, `delete_preview`, `request_plan`,
  `get_plan`, `get_project_config`, `get_service`, `get_environment`, `get_service_health`,
  `list_deployments`, `read_deployment_log`, `list_projects`, `list_environments`, `list_domains`,
  `list_previews`, `get_preview`.
- Guard rails: every call is a row in the audit log, allowed or refused. Every tool result,
  logs included, passes through a mask that replaces stored secrets with `••••••`. Rate limits:
  120 reads a minute, 10 writes a minute. `deploy_service` is safe to call twice (a second call
  joins the queued Deployment). An agent asks for a Plan but never applies one, and reads health
  but never changes alerts. An agent key works only at the MCP endpoint and the Gateway.
- An agent can push a fix to a branch (with git access you give it) and ask for a requested
  preview of that branch, which expires on its own.

## Prices (Hosted instance, USD, monthly only)

- **Starter** $15: 3 Servers and 3 Cloud Environments. Members, Projects and Environments are not
  counted.
- **Business** $35: the same counts plus SSO, SCIM, custom roles, forward auth, and paying for
  more Organizations on one plan.
- **Add-on** $5: one more Server and one more Cloud Environment, on either plan.
- **30-day free trial** on both; a card is needed to start it. One trial per Organization, person
  and card.
- Going over a count refuses only the next addition; nothing running is switched off.
- Bought Servers are billed on top, at the provider's price plus a markup, shown before you buy.
- **Enterprise**: custom deals, contact support@octabyte.io.
- A Cloud Environment is an Environment that deploys to a cloud account; it counts once however
  many accounts or regions it uses.

## Self-hosted

- Free to use, self-host and modify under the **Elastic License 2.0** (source-available, not
  open source). You may not offer it to others as a hosted service.
- Install: `deploy/install.sh` on a bare Ubuntu 24.04 host, x86-64, 2 vCPU, 4 GB memory, 40 GB
  disk, root over SSH, ports 22, 80, 443, 3000, 4000. No DNS needed to start (sslip.io). Node
  under systemd, PostgreSQL on the box, a Swarm of one and Traefik. The first sign-up owns the
  instance.
- Without a license: one Organization, one build at a time per Server. An **Enterprise license**
  unlocks SSO, SCIM, custom roles, forward auth, white-labelling, parallel builds and cloud runs,
  and more than one Organization.
- The source repository is **public**: https://github.com/octabyte-io/cloudgate. Install as root:
  `git clone https://github.com/octabyte-io/cloudgate.git /opt/cloudgate`, then
  `CLOUDGATE_PUBLIC_HOST=<public ip or hostname> bash /opt/cloudgate/deploy/install.sh`, then
  sign up at `http://<host>:3000/sign-up`. No access request, no deploy key (the repo's
  docs/deploy.md still describes the SSH deploy key from when it was private; that is stale).
  Upgrade: `git pull` in /opt/cloudgate and run the installer again with the same host.
- The Instance (server) reports version **0.2.0**.

## Source, contributing and security reports

- Bug reports and feature ideas: GitHub issues (Bug report / Feature request forms). Pull
  requests welcome; `CONTRIBUTING.md` has the setup, the tests and the contribution terms (agreed
  once on the first pull request: the contributor keeps copyright and grants Octabyte a license).
- Security problems: never a public issue. Report privately on the repository's **Security** tab,
  **Report a vulnerability** (`SECURITY.md`); only maintainers see it. SECURITY.md names no email,
  so the site gives none for security reports. Acknowledgement within a few working days; fixes go
  into the latest release.

## Templates

20 apps in the public catalogue (github.com/octabyte-io/cg-templates), each a `cloudgate.yaml`
plus `template.yaml`: Activepieces, Automatisch, Baserow, Cal.com, Chatwoot, Ghost, Gitea,
Immich, listmonk, Matomo, Mattermost, Metabase, n8n, Nextcloud, Outline, Plausible Analytics,
Umami, Uptime Kuma, Vaultwarden, WordPress, growing to hundreds. The catalogue's own website,
https://cgt.octabyte.io, is the only home of template pages: this site never repeats one, and
never states a fixed count. Deploy link `deployUrl(id)` from `src/data/site.ts`.
