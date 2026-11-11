// The comparison pages (/compare and /compare/<id>). Cloudgate's side comes from the cloudgate
// repository (README, CONTEXT.md, CHANGELOG.md, docs/connecting-an-agent.md, ADR 0054); see
// docs/product-facts.md. The other side states only well-known, stable facts in general terms:
// no competitor prices, limits or plan names, which change.
import { site, plans } from './site';

export type RowKey = 'runs' | 'owns' | 'what' | 'pricing' | 'mcp' | 'selfHost' | 'databases' | 'previews';

export const rowLabels: Record<RowKey, string> = {
  runs: 'Where your apps run',
  owns: 'Who owns the servers',
  what: 'What you can run',
  pricing: 'Pricing model',
  mcp: 'AI agent access over MCP',
  selfHost: 'Self-hosting',
  databases: 'Databases',
  previews: 'Preview deployments',
};

const [starter, business] = plans;

export const cloudgateRow: Record<RowKey, string> = {
  runs: 'Your own Servers over SSH, your AWS or Google Cloud account, or a server bought from Cloudgate',
  owns: 'You do. Apps and data stay on your machines and in your cloud accounts',
  what: 'Long-running containers: web apps, workers, private services, cron jobs, static sites, Compose stacks and AI models',
  pricing: `Hosted: $${starter.price} or $${business.price} a month, counting Servers and Cloud Environments, never members. Servers and cloud usage are billed by their provider`,
  mcp: 'Built in. Each Agent is a member with its own role, grant and keys; every call is audited, secrets are masked, and it gets 120 reads and 10 writes a minute',
  selfHost: 'Yes, free under the Elastic License 2.0 (source-available)',
  databases: 'PostgreSQL, MySQL, MariaDB, MongoDB, Redis and libSQL on your Servers; RDS, Cloud SQL, ElastiCache and Memorystore in your cloud',
  previews: 'One per GitHub pull request, or a requested preview that expires on its own',
};

export interface Competitor {
  id: 'heroku' | 'vercel' | 'render' | 'coolify';
  name: string;
  /** One line for the hub. */
  summary: string;
  title: string;
  description: string;
  h1: string;
  lede: string;
  /** "The short answer": two or three sentences, the first one the whole answer. */
  answer: string[];
  /** What the other platform is called in the hero diagram. */
  theirPlace: string;
  row: Record<RowKey, string>;
  chooseThem: string[];
  chooseUs: string[];
  faq: { q: string; a: string }[];
}

const agentsLink = '<a href="/ai-agents">how Agents work</a>';
const selfLink = '<a href="/self-hosted">self-host Cloudgate</a>';
const pricingLink = '<a href="/pricing">the hosted plans</a>';

export const competitors: Competitor[] = [
  {
    id: 'heroku',
    name: 'Heroku',
    summary: 'A long-running platform as a service that runs your apps on its own infrastructure.',
    title: 'Cloudgate vs Heroku: a self-hosted Heroku alternative',
    description:
      'Cloudgate vs Heroku: the same push-to-deploy workflow, but on your own servers, AWS or Google Cloud, with flat monthly pricing and AI agents over MCP.',
    h1: 'Cloudgate vs Heroku',
    lede: 'Both turn a git push into a running app with logs, domains and a database beside it. The difference is whose machines it runs on and how you pay for them.',
    answer: [
      'Choose Cloudgate if you want Heroku-style deploys on servers and cloud accounts you own, with a flat monthly price that does not grow with each app.',
      'Choose Heroku if you never want to think about a server at all and are happy to pay per dyno and add-on for that.',
      'Cloudgate even builds with Heroku buildpacks, so many apps move across without a Dockerfile.',
    ],
    theirPlace: 'Heroku’s platform',
    row: {
      runs: 'Heroku’s own platform, on infrastructure Heroku runs',
      owns: 'Heroku does. You rent capacity as dynos',
      what: 'Web and worker processes, scheduled jobs through an add-on',
      pricing: 'Pay per dyno and per add-on, by size and how many you run',
      mcp: 'Has an MCP server of its own; see Heroku’s docs for what an agent can reach',
      selfHost: 'No',
      databases: 'Managed Postgres and key-value stores, plus a marketplace of third-party add-ons',
      previews: 'Review apps for pull requests, through pipelines',
    },
    chooseThem: [
      'You want no servers in the picture at all, not even ones someone else sets up for you.',
      'You rely on add-ons from its marketplace and want them billed in one place.',
      'You want a platform with a long track record and a large company behind it.',
    ],
    chooseUs: [
      'You want the apps and the data on machines or cloud accounts you control.',
      'Your bill grows with each app and worker, and you would rather pay for servers once and fill them.',
      'You want an AI agent to deploy and read logs with its own role, grant and audit trail.',
      'You may want to self-host the platform itself later.',
    ],
    faq: [
      {
        q: 'Is Cloudgate a Heroku alternative?',
        a: 'Yes, for teams that want Heroku’s workflow on their own infrastructure. You push code or upload a folder, Cloudgate builds it and runs it with domains, TLS, logs and backups, on your own Servers, AWS or Google Cloud instead of on a shared platform.',
      },
      {
        q: 'Can Cloudgate build my Heroku app without changes?',
        a: 'Often. Cloudgate can build with Heroku buildpacks as well as Nixpacks, Railpack, Paketo buildpacks or a Dockerfile. Heroku add-ons do not come across: you run the database as a Cloudgate Service or in your cloud account instead.',
      },
      {
        q: 'How is Cloudgate priced compared with Heroku?',
        a: `Cloudgate’s hosted plans are a flat $${starter.price} or $${business.price} a month that counts Servers and Cloud Environments, not apps or members. You pay your server or cloud provider for the machines. See ${pricingLink}.`,
      },
      {
        q: 'Do I have to manage servers with Cloudgate?',
        a: 'Cloudgate sets up each Server for you (Docker Swarm, Traefik and certificates), and you can buy one from Cloudgate in the console. You still own the machine, so operating-system updates are yours. If you would rather have no server at all, connect AWS or Google Cloud and Cloudgate deploys to their managed services.',
      },
      {
        q: 'Can an AI agent deploy to Cloudgate?',
        a: `Yes. Give it an Agent: a member with its own role, a grant to the Projects it may reach and its own key, connected over MCP. Every call is in the audit log and stored secrets are masked out of results. Read ${agentsLink}.`,
      },
    ],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    summary: 'A frontend cloud built around Next.js, serverless functions and a preview for every push.',
    title: 'Cloudgate vs Vercel: a self-hosted Vercel alternative',
    description:
      'Cloudgate vs Vercel: run whole apps, workers, cron jobs and databases on your own servers or cloud for a flat price, with previews and AI agents over MCP.',
    h1: 'Cloudgate vs Vercel',
    lede: 'Vercel is built for frontends and serverless functions on its own network. Cloudgate runs whole apps as long-running containers, with their databases, on machines you own.',
    answer: [
      'Choose Vercel for a Next.js or frontend-heavy site that wants global edge delivery and a preview for every push, with no servers.',
      'Choose Cloudgate when your app is more than a frontend: a long-running backend, workers, cron jobs and a database, on your own servers or cloud account for a flat monthly price.',
      'Many teams use both: the frontend on Vercel and the backend and data on Cloudgate.',
    ],
    theirPlace: 'Vercel’s network',
    row: {
      runs: 'Vercel’s own global network and serverless functions',
      owns: 'Vercel does',
      what: 'Frontends, static sites and serverless functions; long-running processes are not its model',
      pricing: 'Plans per team member, plus metered usage',
      mcp: 'Has an MCP server of its own; see Vercel’s docs for what an agent can reach',
      selfHost: 'No. The Next.js framework itself can be self-hosted, for example on Cloudgate',
      databases: 'Through integrations with third-party database providers',
      previews: 'A preview deployment for every push, a core feature',
    },
    chooseThem: [
      'Your app is a Next.js or other frontend that benefits from an edge network and serverless functions.',
      'You want a preview URL for every push with no setup at all.',
      'You do not need long-running processes, background workers or a database next to the app.',
    ],
    chooseUs: [
      'Your app needs a long-running server, background workers or cron jobs.',
      'You want the database on the same Server or in your own cloud account, not with a third party.',
      'You would rather pay a flat price for servers you fill than a bill that follows traffic.',
      'You want AI agents to deploy with their own role, grant and audit trail.',
    ],
    faq: [
      {
        q: 'Is Cloudgate a Vercel alternative?',
        a: 'For full-stack apps, yes. Cloudgate runs a Next.js app, or any other app, as a long-running container on your own Server, AWS or Google Cloud, with its database, workers and cron jobs beside it. For a purely static or edge-rendered frontend, Vercel’s global network is hard to beat.',
      },
      {
        q: 'Can I deploy a Next.js app to Cloudgate?',
        a: 'Yes. Cloudgate builds it with Nixpacks, Railpack, buildpacks or your Dockerfile and runs it as a web Service with a domain and a Let’s Encrypt certificate. It runs as one long-running server rather than as serverless functions.',
      },
      {
        q: 'Does Cloudgate have preview deployments like Vercel?',
        a: 'Yes. Cloudgate makes one preview per GitHub pull request, and you or an AI agent can ask for a requested preview of a branch that expires on its own.',
      },
      {
        q: 'How does pricing differ?',
        a: `Cloudgate’s hosted plans are a flat monthly price that counts Servers and Cloud Environments, not members or traffic. Your server or cloud provider bills you for the machines. Or ${selfLink} for free.`,
      },
      {
        q: 'Can I use Vercel and Cloudgate together?',
        a: 'Yes. A common split is the frontend on Vercel and the API, workers and database on Cloudgate, on your own Server or cloud account.',
      },
    ],
  },
  {
    id: 'render',
    name: 'Render',
    summary: 'A cloud platform for web services, workers, cron jobs and managed databases on its own cloud.',
    title: 'Cloudgate vs Render: a self-hosted Render alternative',
    description:
      'Cloudgate vs Render: web services, workers, cron jobs and databases on your own servers, AWS or Google Cloud, for a flat price, with AI agents over MCP.',
    h1: 'Cloudgate vs Render',
    lede: 'Render and Cloudgate offer much the same building blocks: web services, workers, cron jobs, databases and previews. Render runs them on its cloud; Cloudgate runs them on yours.',
    answer: [
      'Choose Render if you want those building blocks fully managed on its cloud, with no servers or cloud accounts of your own.',
      'Choose Cloudgate if you want the same kinds of Service on servers you own or in your own AWS or Google Cloud account, for a flat monthly price, or self-hosted for free.',
    ],
    theirPlace: 'Render’s cloud',
    row: {
      runs: 'Render’s own cloud',
      owns: 'Render does',
      what: 'Web services, private services, background workers, cron jobs and static sites',
      pricing: 'Per service instance by size, plus metered usage',
      mcp: 'Has an MCP server of its own; see Render’s docs for what an agent can reach',
      selfHost: 'No',
      databases: 'Managed Postgres and a Redis-compatible key-value store',
      previews: 'Preview environments for pull requests',
    },
    chooseThem: [
      'You want managed infrastructure and no servers or cloud accounts to look after.',
      'You want managed Postgres with its backups and upgrades handled for you.',
      'Your team is small and the per-service price is lower than your time.',
    ],
    chooseUs: [
      'You already pay for servers or an AWS or Google Cloud account and want to use them.',
      'You want many small services without a price per service.',
      'You need MySQL, MariaDB, MongoDB, libSQL or an AI model next to your app.',
      'You want AI agents to deploy with their own role, grant and audit trail.',
    ],
    faq: [
      {
        q: 'Is Cloudgate a Render alternative?',
        a: 'Yes. Cloudgate has the same kinds of Service: web, private web, worker, cron, static sites and databases, with previews and rollbacks. The difference is where they run: on your own Servers or in your own AWS or Google Cloud account.',
      },
      {
        q: 'Does Cloudgate run cron jobs and background workers?',
        a: 'Yes. A worker is always on with no address, and a cron Service starts a fresh container for each run on a timetable. Both run on a Server or in your cloud (ECS on AWS).',
      },
      {
        q: 'Which databases can I run?',
        a: 'On a Server: PostgreSQL, MySQL, MariaDB, MongoDB, Redis and libSQL, with backups to S3-compatible storage. In a cloud account: RDS, Cloud SQL, ElastiCache and Memorystore. Or connect an existing database as given.',
      },
      {
        q: 'How does pricing differ?',
        a: `Render prices each service by its size. Cloudgate’s hosted plans are a flat monthly price that counts Servers and Cloud Environments, so a Server can hold as many Services as fit. See ${pricingLink}.`,
      },
      {
        q: 'Can an AI agent manage my Cloudgate services?',
        a: `Yes, within limits you set. An Agent has its own role (Reader or Operator), a grant and its own key at the MCP endpoint, and it can deploy, read logs and health and open previews, but never apply a Plan or change alerts. Read ${agentsLink}.`,
      },
    ],
  },
  {
    id: 'coolify',
    name: 'Coolify',
    summary: 'An open-source, self-hostable platform that deploys apps and databases to your servers.',
    title: 'Cloudgate vs Coolify: self-hosted deployment platforms',
    description:
      'Cloudgate vs Coolify: both deploy to servers you own. Cloudgate adds AWS and Google Cloud, AI agents with scoped keys over MCP, and a hosted console option.',
    h1: 'Cloudgate vs Coolify',
    lede: 'Coolify and Cloudgate both put apps and databases on servers you own and can both be self-hosted. They differ in license, in reach beyond your servers, and in how AI agents get in.',
    answer: [
      'Choose Coolify if an open-source license and a large community catalogue matter most to you.',
      'Choose Cloudgate if you also want to deploy into AWS and Google Cloud’s managed services, give AI agents their own scoped access over MCP, or use a hosted console instead of running one.',
    ],
    theirPlace: 'Coolify on your server',
    row: {
      runs: 'Servers you connect over SSH, including cloud VMs',
      owns: 'You do',
      what: 'Apps, databases and Docker Compose services on your servers',
      pricing: 'Free to self-host; a paid cloud option runs the dashboard for you',
      mcp: 'See Coolify’s docs for its API and any MCP support',
      selfHost: 'Yes, open source under the Apache License 2.0',
      databases: 'Common databases as containers on your servers',
      previews: 'Preview deployments for pull requests',
    },
    chooseThem: [
      'You want an OSI-approved open-source license.',
      'You want its large catalogue of one-click services and an active community.',
      'You only deploy to your own servers and never into cloud managed services.',
    ],
    chooseUs: [
      'You want to deploy into AWS (ECS, RDS, S3) and Google Cloud (Cloud Run, Cloud SQL), not only onto servers.',
      'You want each AI agent to be a member with its own role, grant, keys, audit trail and rate limits.',
      'You want one reviewed Plan from a `cloudgate.yaml` before anything changes.',
      'You would rather use a hosted console than run the platform yourself.',
    ],
    faq: [
      {
        q: 'Is Cloudgate open source like Coolify?',
        a: 'No. Cloudgate is source-available under the Elastic License 2.0: free to use, self-host and modify, but you may not offer it to others as a hosted service. Coolify is open source under the Apache License 2.0. Read <a href="/license">Cloudgate’s license in plain English</a>.',
      },
      {
        q: 'Can Cloudgate deploy to AWS and Google Cloud?',
        a: 'Yes. Besides your own Servers, Cloudgate deploys into your AWS account (ECS Fargate, RDS, ElastiCache, S3 and CloudFront) and your Google Cloud project (Cloud Run, Cloud SQL, Memorystore), made with OpenTofu, with drift shown when someone changes them by hand.',
      },
      {
        q: 'Can I self-host Cloudgate like Coolify?',
        a: `Yes. One script installs it on an Ubuntu 24.04 server. The free version holds one Organization and runs one build at a time per Server; an Enterprise license adds the rest. Read how to ${selfLink}.`,
      },
      {
        q: 'How do AI agents connect to Cloudgate?',
        a: `Over MCP, at your console’s address plus /mcp, with an agent key. The Agent is a member with its own role and grant, every call is in the audit log, and stored secrets are masked out of every result. Read ${agentsLink}.`,
      },
      {
        q: 'Is there a hosted version of Cloudgate?',
        a: `Yes. The hosted console at ${site.console.replace('https://', '')} is run by Octabyte and deploys to your Servers and cloud accounts, from $${starter.price} a month with a 30-day free trial.`,
      },
    ],
  },
];

export const competitor = (id: Competitor['id']) => {
  const c = competitors.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown competitor ${id}`);
  return c;
};
