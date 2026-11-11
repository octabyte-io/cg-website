import type { APIRoute } from 'astro';
import { site, plans, addOn, trialDays, deployUrl } from '../data/site';
import templates from '../data/templates.json';

// llms.txt (https://llmstxt.org): a plain summary an AI assistant can read in one request.
export const GET: APIRoute = () => {
  const planLines = plans.map((p) => `- ${p.name}: $${p.price} a month. ${p.includes.join('; ')}.`).join('\n');
  const templateLines = templates
    .map((t) => `- ${t.name}: ${t.tagline} Deploy: ${deployUrl(t.id)}`)
    .join('\n');

  const body = `# ${site.name}

> ${site.description}

Cloudgate is made by ${site.company.name}. Use it on the hosted console at ${site.console}, or self-host it for free under the Elastic License 2.0 (source-available, not open source).

## Key facts

- Where apps run: your own Linux server over SSH (or one bought from Cloudgate in the console), your AWS account (ECS Fargate, RDS, ElastiCache, S3 and CloudFront), or your Google Cloud project (Cloud Run, Cloud SQL, Memorystore).
- What it runs: web apps, workers, cron services, private web services, buckets, PostgreSQL, MySQL, MariaDB, MongoDB, Redis, libSQL, Docker Compose stacks, and AI models served by Ollama, vLLM or llama.cpp behind an OpenAI-compatible gateway.
- Sources and builds: GitHub, GitLab, Bitbucket, Gitea or any git URL, a Docker image, or a folder uploaded with the CLI. Builds with Nixpacks, Railpack, a Dockerfile or buildpacks.
- Included: domains with TLS certificates, backups to S3-compatible storage, pull-request previews, rollbacks, uptime checks, error rates, logs, traces, notifications, roles, grants and an audit log.
- AI agents: an Agent is a member with its own role, access grant and keys. It connects to the MCP endpoint at <console address>/mcp with "Authorization: Bearer <agent key>". It can deploy, start and stop Services, read deployment logs and health, request Plans, and open previews of a branch that expire. Every call is audited, secrets are masked from results, and writes are rate limited to 10 a minute.
- For non-experts: the get-started wizard at ${site.getStarted} goes from sign-up to a running app in three steps: account, server (buy one or connect your own with one command), Deploy.
- CLI: npm install -g @octabyte-io/cloudgate, then cloudgate login and cloudgate deploy (Node 22 or newer).

## Pricing (USD, monthly)

${planLines}
- Add-on: $${addOn.price} a month for ${addOn.what}.
- Free trial: ${trialDays} days on either plan; a card is needed to start it.
- Self-hosted: free. An Enterprise license (contact ${site.support}) adds SSO, SCIM, custom roles, forward auth, white-labelling, parallel builds and more than one Organization.

## Pages

- [Home](${site.url}/): what Cloudgate is and who it is for
- [Cloudgate for AI agents](${site.url}/ai-agents): MCP endpoint, agent roles, guard rails
- [Deploy an app you built with AI](${site.url}/vibe-coding): the three-step path for non-experts
- [Features](${site.url}/features): every feature, by where it runs
- [App templates](${site.url}/templates): ${templates.length} self-hosted apps, deployable in one click
- [Pricing](${site.url}/pricing): plans, add-ons and worked examples
- [Self-host Cloudgate](${site.url}/self-hosted): requirements and license
- [CLI](${site.url}/cli): deploy a folder from the terminal
- [Template catalogue](${site.templatesSite}): the full templates website

## Templates

${templateLines}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
