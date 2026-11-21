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
  A free sslip.io address works right away: HTTPS with Let's Encrypt on a Server with a public
  address, plain http on a private one (0.3.9); or type your own domain (0.3.10).
  - **Real progress** (0.3.10): which of the setup's eight steps runs and the machine's newest
    line; the launch's stages and the deploy's output; how long a card (Stripe) confirmation has
    taken. Step 1 offers every Buy option (OS image, backups, extra storage, map). After Buy, step 2
    opens at once with the server's progress in a strip; it asks the values, **Web address** (own
    domain + Check DNS) and **Where it goes** (**More options**: existing Project, Project name,
    Setup name).
  - **HTTPS wait** (0.3.11): an https address adds a **Getting its HTTPS certificate** stage; Open
    shows once Let's Encrypt has issued (until then Traefik serves its self-signed certificate).
  - **How to sign in** (0.3.11): from the template's optional `signIn` in `template.yaml`. Account
    made at setup: username (optional) and masked password with Show/Copy, read from the stack's
    variables under the stack's read (a member who can't read sees no password); `path`/`domain`
    give an **Open /admin** link. Or `firstVisit: { path, note }`: where to open the app to make the
    first account. No `signIn`, no block. **What next** links to the stack's Variables tab.
  - A Template setup for a new Project with nowhere to deploy opens Get started (0.3.11).
  - **Show** on the How to sign in rows widens them to the card and wraps a long password whole
    (0.3.12).
- **CLI** `@octabyte-io/cloudgate` on npm (Node 22+). **0.1.1** is the current release (0.1.0 was
  the first stable one), on npm's `latest` tag, so every install line on the site is `npm install -g @octabyte-io/cloudgate`
  (no `@next`, no "beta"). It holds everything from the 0.0.2 betas. Source in the repo's
  `cli/`. Commands: `login` (approve a code in the console), `whoami`, `instance list|use`,
  `logout`, `link`/`unlink`, `deploy` (respects .gitignore and .cloudgateignore, skips .env),
  `status`, `logs`, `vars list|set|unset`, `template check|pack|try`, `config pull|plan`. In CI:
  `CLOUDGATE_KEY=<personal key>`. A declined `config plan` exits 1 (0.1.0). A template config
  file may end in `.js` (CLI 0.1.0, Instance 0.3.0, ADR-0083). `template check`/`pack` take a
  template's `signIn` block (CLI 0.1.1; 0.1.0 refuses it): `password` (+ optional `username`, input
  or `{ value }`, `path`, `domain: <service>`), or `firstVisit: { path, note, domain }`. A password
  in a `value` input must be exactly one reference to a secret input. Refused: both forms, an unknown
  or unread input, a `domain` not in `domains` or shared by several, a non-secret password. Such
  templates name `cloudgate: "0.3.11"`.
  - **Changed files only** (since 0.0.2-beta.3): `deploy` sends file checksums (SHA-256) and uploads
    only files the Instance lacks or holds different; local deletions are deleted there too.
    `--full` sends every file. Needs an Instance at 0.2.0+; an older one gets the full upload.
    The CLI still works with Instances from 0.1.0.
  - **Project folders** (since 0.0.2-beta.3, ADR-0080): `link --whole-project` saves the Project config
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
  - 0.3.10: an **Operating system** select (filtered to the size's architecture, opens on Ubuntu
    24.04, named in the summary); families Standard, Performance, Arm, Dedicated; suggestions
    **Closest** and **Cheapest**; the summary stays in view. The first setup run waits up to ten
    minutes for SSH. A Server **Powered off by an operator** (reason, support link) is refused as a
    deploy target: deploy, rollback, Start/restart, Run now, upload, preview get a 409 naming it; a
    Template setup waits; pickers leave it out.
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
- Shell into a container from the console. A Server's shell is its **Shell** tab
  (`/servers/<id>/shell`; `/terminal` forwards, 0.3.10). On Hosted, the **This host** card (a shell
  on the platform host) shows only to the instance's operators (0.3.11).
- **Expand** (0.3.10): every file editor (Compose file, Project config, Traefik files, Variables,
  patch editor, whole-file text boxes) opens filling the window, with Discard/Save in a top bar and a
  status line (line count, YAML valid). Back to page or Esc keeps the edit. Read-only for an
  Environment's copy of a repository-kept config.
- **Config files tab** (0.3.11): a Compose stack's file mounts from its Template, listed by path and
  edited in the console; Save writes them where the stack runs; **Restart to apply**. Absent with no
  mount or no read of mounts.
- **Served certificate** (0.3.11): the Domains tab's Certificate column says Let's Encrypt
  · issuing (usually under a minute), · valid until <date>, or · not issued yet (check the A record
  and port 80; attempts in the Server's Traefik log). The Service Overview says so beside its
  address. `GET /domains/:id/served-certificate`.
- **Templates list** (0.3.11): logos by address (`GET /templates/:templateId/logo`, cached, SVG
  sandboxed), no longer ~10 MB inline. An official-catalogue Template's name/logo open its page on
  cgt.octabyte.io; a mirror or private catalogue opens the app's website.
- **Generate one for me** (Add a domain) makes an sslip.io host and, when the server's address is
  public, turns on HTTPS with Let's Encrypt (0.3.9); a private address stays plain HTTP.
- A running Docker Compose stack offers **Restart** in place of **Start** (0.3.9). **Remove
  containers** shows it ran (status stopped, empty Containers tab); a stopped stack offers Start.
- **Kernel check** (0.3.9): MongoDB 8 (`mongo:8`, `mongo:8.0.x`, `mongo:latest`) exits at start on
  Linux 6.19.0 to 7.0.13 (Ubuntu 26.04's first 7.0 kernels). The console shows a **Kernel** row
  with a warning under a Server's **What is installed** and the platform host's **What this host
  is running**, and warns in the database form, a MongoDB's Overview and a Template setup that
  runs MongoDB 8. Nothing is refused. Fix: `sudo apt update && sudo apt full-upgrade`, reboot;
  until then `mongo:7`.

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
- Install on a bare Ubuntu 24.04 or 26.04 host, x86-64 (amd64), 2 vCPU, 4 GB memory, 40 GB
  disk, root over SSH, ports 22, 80, 443, 3000, 4000. No DNS needed to start (sslip.io). Node
  under systemd (Cloudgate's own Node in `/usr/local/share/cloudgate/node`, leaving any Node in
  `/usr/local` alone), PostgreSQL on the box, a Swarm of one and Traefik. The first sign-up owns
  the instance.
- Without a license: one Organization, one build at a time per Server. An **Enterprise license**
  unlocks SSO, SCIM, custom roles, forward auth, white-labelling, parallel builds and cloud runs,
  and more than one Organization.
- The source repository is **public**: https://github.com/octabyte-io/cloudgate. Install with one command:
  `curl -fsSL https://cloudgate.octabyte.io/install.sh | sudo sh`. It is the repo's root `install.sh`
  (POSIX sh), which this site copies at build time at a pinned cloudgate commit (`src/pages/install.sh.ts`). Nothing is cloned
  or built on the server (0.3.0, ADR-0082): it checks Ubuntu 24.04 or 26.04 on x86-64 (anything
  else is refused by name), installs a published **Cloudgate version** (the latest, or the one
  `CLOUDGATE_VERSION=vX.Y.Z` names; never an older one than installed), downloads its prebuilt
  tarball from the GitHub Release, checks it against the published sha256, and runs that
  version's `deploy/install.sh`. `CLOUDGATE_PUBLIC_HOST` (the host alone, no scheme or port) comes
  from the environment, the last install, or the detected public IPv4. `CLOUDGATE_REF` and
  `CLOUDGATE_REPOSITORY` are gone. Then sign up at `http://<host>:3000/sign-up`. No access
  request, no deploy key.
- **Signed versions** (0.3.3, first published in 0.3.5, ADR-0087): each published version has a
  `.sha256.sig` beside each tarball and `.sha256`. The install carries Cloudgate's public key and
  checks the signature with `ssh-keygen -Y verify` before downloading the tarball; a missing or
  failed signature, or a `.sha256` naming another file, stops with nothing changed. A release
  counts as the latest only once signed (the console's update notice too). `openssh-client` is
  installed from apt if `ssh-keygen` is missing.
- **arm64**: each version is published for amd64 and arm64, but arm64 is for the Hosted instance
  only (ADR-0088). A Self-hosted install on arm64 is refused by name.
- **Public address** (0.3.7/0.3.8): the install finds the host's public IP (`CLOUDGATE_PUBLIC_HOST`
  if it is a public IP, else `api.ipify.org`, `checkip.amazonaws.com`, `ipv4.icanhazip.com`, 5 s
  each) and the backend saves it as **Settings > Instance > Public address** at boot, only while
  that setting was never set. `CLOUDGATE_PUBLIC_IP=<ip>` names it, `CLOUDGATE_PUBLIC_IP=none`
  turns it off. The field takes only an IP; one the server does not know as its own needs
  **Save it anyway** (NAT, load balancer). It is what sslip.io Domains on the platform host use.
- The install ends with the Cloudgate mark, the version and the sign-up (or sign-in) address,
  where it used to end with `==> Done.`
- **Boot recovery** (0.3.9): the install and Server setup (step 8, "Install boot recovery") add a
  systemd unit `cloudgate-boot-recover` that runs after every start of Docker, waits up to 3
  minutes for `cloudgate-network`, and starts the containers (Traefik, Compose containers on
  `cloudgate-network`/`cloudgate-ai`) whose start failed because the network was missing. A stack
  you stopped stays stopped. `journalctl -u cloudgate-boot-recover -b`. Existing Servers get it
  with **Run setup again**.
- Before downloading it warns (never stops) about a busy port 80/443/3000/4000, less than 15 GB
  free, less than 4 GB memory, or an unreachable download host (`CLOUDGATE_SKIP_PREFLIGHT=1`
  skips). Downloads are retried up to 3 times. Every run is logged to
  `/var/log/cloudgate/install-<time>.log` (newest 10 kept). One run at a time; apt waits for its
  lock. The firewall keeps SSH open on whatever port sshd uses.
- **Upgrade**: run the same command again. A run that changes the version first dumps the
  database with `pg_dump` to `/var/backups/cloudgate` (newest 3 kept; `CLOUDGATE_SKIP_BACKUP=1`
  skips), keeps the old version at `/opt/cloudgate.previous` until the new backend answers its
  health check, and prints the steps to go back if it never does. A re-run also brings Traefik to
  its version (ports 80 and 443 drop for a few seconds). An old git-checkout install is switched
  over by itself, the checkout moved aside to `/opt/cloudgate.checkout-<date>`.
- **Uninstall**: `deploy/uninstall.sh` (0.3.2) removes Cloudgate's services, Traefik container and
  files, and keeps the instance (database, env files, `/etc/cloudgate`, backups, logs) so a later
  install is the same instance. `--purge` removes those too, after you type the public host.
  Docker, Postgres and the firewall are left in place.
- The latest Instance (server) version is **0.3.12**. 0.3.1 was the first version with a published
  tarball (0.3.0 has none); 0.3.3, 0.3.4 and 0.3.7 were tagged but never published.

## Source, contributing and security reports

- **Help & support** (0.3.12): a row at the foot of the console's Organization rail opens `/help`,
  linking Quickstart, the user guide (get-started), concepts, CLI, MCP, API, Troubleshooting, FAQ,
  Limits and the changelog on this site (new tab), plus support@octabyte.io with Email support and
  copy. It never links the issue tracker.
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

Setup in the console (0.3.8+): opens on the Template (logo, name, version, description, links,
tags); the Project is picked from cards (New Project and each Project; a picker past five); a
Project with no Environment offers to add one. Typing your own domain in place of the generated
sslip.io host shows the A record (Name, address) and **Check DNS** (0.3.9); a failed check does
not block Set up. A Template's logo and name open its website in a new tab (0.3.9); from 0.3.11 an official one opens its cgt.octabyte.io page, at `https://cgt.octabyte.io/templates/<id>/` (0.3.12).
