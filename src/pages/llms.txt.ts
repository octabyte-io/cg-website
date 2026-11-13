import type { APIRoute } from 'astro';
import { site, plans, addOn, trialDays, deployUrl, repoFile } from '../data/site';
import { templatesHome } from '../data/template-links';
import { getDocsNav } from '../data/docs-nav';
import { getCollection } from 'astro:content';

// llms.txt (https://llmstxt.org): a plain summary an AI assistant can read in one request.
export const GET: APIRoute = async () => {
  const docsNav = await getDocsNav();
  const docsMeta = new Map((await getCollection('docs')).map((e) => [`/docs/${e.id}`, e.data.description]));
  const docLines = docsNav
    .map((s) => `### ${s.title}\n\n` + s.groups.flatMap((g) => g.links).map((l) => `- [${l.title}](${site.url}${l.href})${docsMeta.get(l.href) ? `: ${docsMeta.get(l.href)}` : ''}`).join('\n'))
    .join('\n\n');
  const planLines = plans.map((p) => `- ${p.name}: $${p.price} a month. ${p.includes.join('; ')}.`).join('\n');

  const body = `# ${site.name}

> ${site.description}

Cloudgate is made by ${site.company.name}. Use it on the hosted console at ${site.console}, or self-host it for free under the Elastic License 2.0 (source-available, not open source). The source is public on GitHub at ${site.sourceUrl}.

## Key facts

- Where apps run: your own Linux server over SSH (or one bought from Cloudgate in the console), your AWS account (ECS Fargate, RDS, ElastiCache, S3 and CloudFront), or your Google Cloud project (Cloud Run, Cloud SQL, Memorystore).
- What it runs: web apps, workers, cron services, private web services, buckets, PostgreSQL, MySQL, MariaDB, MongoDB, Redis, libSQL, Docker Compose stacks, and AI models served by Ollama, vLLM or llama.cpp behind an OpenAI-compatible gateway.
- Sources and builds: GitHub, GitLab, Bitbucket, Gitea or any git URL, a Docker image, or a folder uploaded with the CLI. Builds with Nixpacks, Railpack, a Dockerfile or buildpacks.
- Included: domains with TLS certificates, backups to S3-compatible storage, pull-request previews, rollbacks, uptime checks, error rates, logs, traces, notifications, roles, grants and an audit log.
- AI agents: an Agent is a member with its own role, access grant and keys. It connects to the MCP endpoint at <console address>/mcp with "Authorization: Bearer <agent key>". It can deploy, start and stop Services, read deployment logs and health, request Plans, and open previews of a branch that expire. It asks for Plans but never applies them. Every call is in the audit log, allowed or refused; stored secrets are masked out of every result, logs included; calls are rate limited to 120 reads and 10 writes a minute. An agent key works only at the MCP endpoint and the Gateway.
- For non-experts: the get-started wizard at ${site.getStarted} goes from sign-up to a running app in three steps: account, server (buy one or connect your own with one command), Deploy.
- CLI: npm install -g @octabyte-io/cloudgate@next, then cloudgate login and cloudgate deploy (Node 22 or newer). It is a beta: the current release is 0.0.2-beta.3 on the npm next tag; the latest tag (0.0.1) is a placeholder. A deploy uploads only the files that changed (--full sends every file; needs an Instance at 0.2.0 or newer). A Project folder (cloudgate link --whole-project, cloudgate config pull, cloudgate config plan) holds a whole Project's cloudgate.yaml, and a root cloudgate deploy plans the change and then builds every app built from a subfolder. cloudgate template try runs a template on the local Docker for template authors.
- Source and contributing: the source is public at ${site.sourceUrl}. Bug reports and feature ideas go in GitHub issues; how to send a change is in ${repoFile('CONTRIBUTING.md')}.
- Security reports: privately through the GitHub repository's Security tab, "Report a vulnerability" (${site.sourceUrl}/security), never in a public issue. Policy: ${repoFile('SECURITY.md')}.

## Pricing (USD, monthly)

${planLines}
- Add-on: $${addOn.price} a month for ${addOn.what}.
- Free trial: ${trialDays} days on either plan; a card is needed to start it.
- Going over a count refuses only the next addition; nothing running is switched off.
- Self-hosted: free, with one Organization and one build at a time per Server. An Enterprise license (contact ${site.support}) adds SSO, SCIM, custom roles, forward auth, white-labelling, parallel builds and cloud runs, and more than one Organization.
- Self-host requirements: a bare Ubuntu 24.04 x86-64 server with 2 vCPU, 4 GB memory and 40 GB disk, root over SSH, ports 22, 80, 443, 3000 and 4000 open.
- Self-host install, as root: git clone ${site.sourceUrl}.git /opt/cloudgate, then CLOUDGATE_PUBLIC_HOST=<public IP or hostname> bash /opt/cloudgate/deploy/install.sh, then open http://<host>:3000/sign-up; the first account owns the instance. The self-hosted server reports version 0.2.0.

## Pages

- [Home](${site.url}/): what Cloudgate is, where it runs, and who it is for
- [Deploy an app you built with AI](${site.url}/vibe-coding): the three-step path for people new to deploying
- [Cloudgate for AI agents](${site.url}/ai-agents): Agents, the MCP endpoint, tools and guard rails
- [Features](${site.url}/features): ways in, where apps run, and what Cloudgate looks after in production
- [Cloudgate CLI](${site.url}/cli): install, log in and deploy a folder from the terminal or CI
- [Pricing](${site.url}/pricing): Starter and Business plans, the Add-on, the free trial and worked examples
- [Self-host Cloudgate](${site.url}/self-hosted): server requirements, what the installer sets up, and the Elastic License 2.0
- [Compare Cloudgate](${site.url}/compare): how Cloudgate differs from Heroku, Vercel, Render and Coolify, with one page each
- [About](${site.url}/about): what Cloudgate is, who makes it and why
- [Security](${site.url}/security): how agent keys, secrets, roles and the audit log protect you, and how to report a vulnerability
- [License](${site.url}/license): the Elastic License 2.0 in plain English
- [Changelog](${site.url}/changelog): what has shipped
- [Contact](${site.url}/contact): support and sales by email, bugs and ideas on GitHub, and how to report a security problem
- [Legal](${site.url}/legal): terms of service, privacy policy, acceptable use, cookies, subprocessors and the DPA

## Documentation

- [Documentation home](${site.url}/docs): the user guide, API reference, CLI and MCP references

${docLines}

## Optional

- [Full site text](${site.url}/llms-full.txt): every marketing page above as plain text, in one file
- [Full docs text](${site.url}/llms-docs.txt): every documentation page as Markdown, in one file
- [Sitemap](${site.url}/sitemap-index.xml)

## App templates

Ready-made apps (for example n8n, WordPress, Plausible Analytics and Vaultwarden) live in their own catalogue at ${templatesHome}, not on this site. Each one deploys through the console's get-started wizard at ${site.getStarted}?template=<id>, for example ${deployUrl('n8n')}.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
