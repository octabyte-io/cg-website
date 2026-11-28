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
  mcp: 'Built in. Each Agent is a member with its own role, grant and keys; it reads build logs, health and container metrics, and runtime logs once allowed; every call is audited, stored secrets are masked, and it gets 120 reads and 10 writes a minute',
  selfHost: 'Yes, free under the Elastic License 2.0 (source-available)',
  databases: 'PostgreSQL, MySQL, MariaDB, MongoDB, Redis and libSQL on your Servers; RDS, Cloud SQL, ElastiCache and Memorystore in your cloud',
  previews: 'One per GitHub pull request, or a requested preview that expires on its own',
};

/** Where the other product runs your apps: its own cloud, or servers you run. */
export type Group = 'cloud' | 'self';

export const groupLabels: Record<Group, { title: string; lede: string }> = {
  cloud: {
    title: 'Platforms that run your app on their cloud',
    lede: 'Heroku, Vercel, Render, Railway, Fly.io and Netlify run your app on machines they own. Cloudgate runs it on yours.',
  },
  self: {
    title: 'Tools that run your app on your own servers',
    lede: 'Coolify, Dokploy, Kamal and CapRover deploy to servers you own, as Cloudgate does. They differ in license, reach and how much they manage.',
  },
};

export interface Competitor {
  id: 'heroku' | 'vercel' | 'render' | 'coolify' | 'railway' | 'fly-io' | 'netlify' | 'dokploy' | 'kamal' | 'caprover';
  name: string;
  group: Group;
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
    group: 'cloud',
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
    group: 'cloud',
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
    group: 'cloud',
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
    group: 'self',
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
        a: `Yes. One command installs a published release on an Ubuntu 24.04 or 26.04 server. The free version holds one Organization and runs one build at a time per Server; an Enterprise license adds the rest. Read how to ${selfLink}.`,
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
  {
    id: 'railway',
    name: 'Railway',
    group: 'cloud',
    summary: 'A hosted platform that runs services, databases and cron jobs on its own infrastructure, billed by usage.',
    title: 'Cloudgate vs Railway: a self-hosted Railway alternative',
    description:
      'Cloudgate vs Railway: web services, workers, cron jobs and databases on your own servers, AWS or Google Cloud, for a flat price, with AI agents over MCP.',
    h1: 'Cloudgate vs Railway',
    lede: 'Railway and Cloudgate both turn a repository into running services with a database beside them. Railway runs them on its infrastructure and bills by usage; Cloudgate runs them on yours.',
    answer: [
      'Choose Railway if you want a polished hosted platform where usage is the bill and there is no server or cloud account of your own to look after.',
      'Choose Cloudgate if you want the same kinds of Service on servers you own or in your own AWS or Google Cloud account, for a flat monthly price that does not follow CPU and memory, or self-hosted for free.',
    ],
    theirPlace: 'Railway’s infrastructure',
    row: {
      runs: 'Railway’s own infrastructure',
      owns: 'Railway does',
      what: 'Web services, workers, cron jobs and databases, from a repository, an image or a template',
      pricing: 'A plan plus metered usage of CPU, memory, storage and network',
      mcp: 'Has an MCP server of its own; see Railway’s docs for what an agent can reach',
      selfHost: 'No',
      databases: 'Postgres, MySQL, Redis and MongoDB as services on its platform',
      previews: 'Pull-request environments',
    },
    chooseThem: [
      'You want no servers or cloud accounts of your own, and a bill that follows what you use.',
      'Your usage is small or spiky, so paying per minute of CPU and memory costs less than a server.',
      'You like its canvas view of a project and its template marketplace.',
    ],
    chooseUs: [
      'You already pay for servers or an AWS or Google Cloud account and want your apps there.',
      'Your services run all the time, and a server you fill costs less than metered usage.',
      'You want the data on machines you control, with backups to storage you choose.',
      'You want AI agents to deploy with their own role, grant, keys and audit trail.',
    ],
    faq: [
      {
        q: 'Is Cloudgate a Railway alternative?',
        a: 'Yes, for teams that want Railway’s way of working on their own infrastructure. Cloudgate builds from a git repository, a Docker image or an uploaded folder and runs web services, workers, cron jobs and databases, on your own Servers, AWS or Google Cloud instead of a shared platform.',
      },
      {
        q: 'How is Cloudgate priced compared with Railway?',
        a: `Railway bills by the CPU, memory and other resources your services use. Cloudgate’s hosted plans are a flat $${starter.price} or $${business.price} a month that counts Servers and Cloud Environments, not usage, apps or members, and your server or cloud provider bills you for the machines. See ${pricingLink}.`,
      },
      {
        q: 'Can Cloudgate build the same apps Railway does?',
        a: 'Usually. Cloudgate builds with Nixpacks by default, and also with Railpack, a Dockerfile, Heroku or Paketo buildpacks, or a ready-made Docker image. Databases do not move by themselves: you make them as Cloudgate Services and restore your data into them.',
      },
      {
        q: 'Does Cloudgate have pull-request environments like Railway?',
        a: 'Cloudgate makes one preview per GitHub pull request. You, or an AI agent, can also ask for a requested preview of a branch, which expires on its own.',
      },
      {
        q: 'Can I self-host Cloudgate, unlike Railway?',
        a: `Yes. One command installs a published release on an Ubuntu 24.04 or 26.04 server, free under the Elastic License 2.0. Read how to ${selfLink}.`,
      },
    ],
  },
  {
    id: 'fly-io',
    name: 'Fly.io',
    group: 'cloud',
    summary: 'A public cloud that runs your Docker images as fast-starting virtual machines in regions around the world.',
    title: 'Cloudgate vs Fly.io: a Fly.io alternative on your servers',
    description:
      'Cloudgate vs Fly.io: run Docker apps, workers and databases on your own servers, AWS or Google Cloud for a flat price, with previews and AI agents over MCP.',
    h1: 'Cloudgate vs Fly.io',
    lede: 'Fly.io runs your Docker image as virtual machines on its own hardware in many regions. Cloudgate runs your app as containers on servers and cloud accounts you own, with the platform around it.',
    answer: [
      'Choose Fly.io if you want your app close to users in many regions, on machines that start in moments, and you are happy to work mostly from its command line.',
      'Choose Cloudgate if you want your apps, databases and backups on servers or cloud accounts you own, run from a console with roles, previews and an audit log, for a flat monthly price.',
    ],
    theirPlace: 'Fly.io’s machines',
    row: {
      runs: 'Fly.io’s own hardware, in regions around the world',
      owns: 'Fly.io does. Apps run as its Fly Machines, small virtual machines',
      what: 'Anything in a Docker image: web apps, workers and machines started on demand',
      pricing: 'Pay for the machines, storage and network you use',
      mcp: 'Its command-line tool can run as an MCP server; see Fly.io’s docs for what an agent can reach',
      selfHost: 'No',
      databases: 'Managed Postgres, or databases you run yourself on its machines',
      previews: 'Not built in; review apps can be made with a GitHub Action',
    },
    chooseThem: [
      'You need the app running in many regions close to your users.',
      'You want machines that start and stop in moments, billed while they run.',
      'You are at home in a command line and want low-level control of each machine.',
    ],
    chooseUs: [
      'You want the apps and data on servers you own or in your own AWS or Google Cloud account.',
      'You want a console for your team with roles, grants and an audit log, not only a command line.',
      'You want a preview for every GitHub pull request without building it yourself.',
      'You would rather pay a flat price for servers you fill than for each machine as it runs.',
    ],
    faq: [
      {
        q: 'Is Cloudgate a Fly.io alternative?',
        a: 'For teams that want their apps on infrastructure they own, yes. Cloudgate runs a Docker image, or builds one from your code, as a long-running container on your own Server, AWS or Google Cloud, with domains, certificates, logs, backups and previews around it. It does not spread one app across many regions the way Fly.io does.',
      },
      {
        q: 'Can I deploy a Docker image to Cloudgate?',
        a: 'Yes. Point a Service at a ready-made image, or let Cloudgate build one from a git repository or an uploaded folder with Nixpacks, Railpack, buildpacks or your Dockerfile.',
      },
      {
        q: 'Does Cloudgate have a command line like flyctl?',
        a: 'Yes. The Cloudgate CLI logs in, deploys a folder, shows status and logs, and sets variables, from a terminal or from CI with a personal key. Read <a href="/cli">how the Cloudgate CLI works</a>.',
      },
      {
        q: 'How does pricing differ?',
        a: `Fly.io bills for the machines, storage and network you use. Cloudgate’s hosted plans are a flat monthly price that counts Servers and Cloud Environments, and your server or cloud provider bills you for the machines. Or ${selfLink} for free.`,
      },
      {
        q: 'Can an AI agent deploy to Cloudgate?',
        a: `Yes. An Agent is a member with its own role, a grant to the Projects it may reach and its own key, connected over MCP. It can deploy, read logs and health and open previews; every call is in the audit log. Read ${agentsLink}.`,
      },
    ],
  },
  {
    id: 'netlify',
    name: 'Netlify',
    group: 'cloud',
    summary: 'A web platform for static sites and frontends, with serverless functions and a preview for every pull request.',
    title: 'Cloudgate vs Netlify: a Netlify alternative for full apps',
    description:
      'Cloudgate vs Netlify: deploy static sites and whole apps, with workers, cron jobs and databases, on your own servers or cloud for a flat price, with AI agents.',
    h1: 'Cloudgate vs Netlify',
    lede: 'Netlify is built for static sites and frontends, served from its own network with functions beside them. Cloudgate runs static sites too, and the long-running backends and databases behind them, on machines you own.',
    answer: [
      'Choose Netlify for a static site or frontend that wants a global network, a preview for every pull request and no servers at all.',
      'Choose Cloudgate when the site is part of a bigger app: a long-running backend, workers, cron jobs and a database, on your own servers or cloud account for a flat monthly price.',
      'The two work together: the frontend on Netlify, the API and data on Cloudgate.',
    ],
    theirPlace: 'Netlify’s network',
    row: {
      runs: 'Netlify’s own network, with serverless and edge functions',
      owns: 'Netlify does',
      what: 'Static sites and frontends, with serverless and edge functions; long-running processes are not its model',
      pricing: 'Free and paid plans, with usage past a plan’s allowance billed or capped',
      mcp: 'Has an MCP server of its own; see Netlify’s docs for what an agent can reach',
      selfHost: 'No',
      databases: 'Through its own data products and integrations; see Netlify’s docs',
      previews: 'A deploy preview for every pull request, a core feature',
    },
    chooseThem: [
      'Your project is a static site or a frontend framework app, and functions cover its backend.',
      'You want a global network and a preview of every pull request with no setup.',
      'You never want a server or a cloud account in the picture.',
    ],
    chooseUs: [
      'Your app needs a long-running server, background workers or cron jobs.',
      'You want the database on your own Server or in your own cloud account.',
      'You want static sites and the apps behind them in one place, on infrastructure you own.',
      'You want AI agents to deploy with their own role, grant and audit trail.',
    ],
    faq: [
      {
        q: 'Is Cloudgate a Netlify alternative?',
        a: 'For full-stack apps, yes. Cloudgate deploys static sites and also long-running web services, workers, cron jobs and databases, on your own Server, AWS or Google Cloud. For a static site that only needs a global network, Netlify is hard to beat.',
      },
      {
        q: 'Can Cloudgate host a static site?',
        a: 'Yes. Cloudgate builds a static site and serves it from your Server with a domain and a Let’s Encrypt certificate, or from S3 and CloudFront in your own AWS account.',
      },
      {
        q: 'Does Cloudgate have deploy previews like Netlify?',
        a: 'Yes. Cloudgate makes one preview per GitHub pull request, and you or an AI agent can ask for a requested preview of a branch that expires on its own.',
      },
      {
        q: 'How does pricing differ?',
        a: `Cloudgate’s hosted plans are a flat $${starter.price} or $${business.price} a month that counts Servers and Cloud Environments, not members or traffic. Your server or cloud provider bills you for the machines. See ${pricingLink}.`,
      },
      {
        q: 'Can I use Netlify and Cloudgate together?',
        a: 'Yes. Keep the frontend on Netlify and run the API, workers and database on Cloudgate, on your own Server or in your cloud account.',
      },
    ],
  },
  {
    id: 'dokploy',
    name: 'Dokploy',
    group: 'self',
    summary: 'A self-hostable platform that deploys apps, databases and Compose stacks to your servers with Docker Swarm.',
    title: 'Cloudgate vs Dokploy: self-hosted deployment platforms',
    description:
      'Cloudgate vs Dokploy: both deploy apps to servers you own with Docker Swarm and Traefik. Cloudgate adds AWS and Google Cloud and AI agents with scoped keys.',
    h1: 'Cloudgate vs Dokploy',
    lede: 'Dokploy and Cloudgate are built on the same pieces: Docker Swarm and Traefik on servers you own, a console on top, and the option to self-host. They differ in license, in reach beyond your servers, and in how AI agents get in.',
    answer: [
      'Choose Dokploy if you want a self-hosted platform whose core is under the Apache License 2.0, and your apps only ever run on your own servers.',
      'Choose Cloudgate if you also want to deploy into AWS and Google Cloud’s managed services, give AI agents their own scoped access over MCP, or use a hosted console instead of running one.',
    ],
    theirPlace: 'Dokploy on your server',
    row: {
      runs: 'Servers you connect, set up with Docker Swarm and Traefik',
      owns: 'You do',
      what: 'Applications, databases and Docker Compose stacks on your servers',
      pricing: 'Free to self-host; a paid cloud option runs the dashboard for you',
      mcp: 'See Dokploy’s docs for its API and any MCP support',
      selfHost: 'Yes. Its core is under the Apache License 2.0; some features are under its own source-available license',
      databases: 'Common databases as containers on your servers, with backups',
      previews: 'Preview deployments for pull requests',
    },
    chooseThem: [
      'You want the core of the platform under an OSI-approved open-source license.',
      'You only deploy to your own servers and never into cloud managed services.',
      'You want its community and its templates for self-hosted apps.',
    ],
    chooseUs: [
      'You want to deploy into AWS (ECS, RDS, S3) and Google Cloud (Cloud Run, Cloud SQL), not only onto servers.',
      'You want each AI agent to be a member with its own role, grant, keys, audit trail and rate limits.',
      'You want one reviewed Plan from a `cloudgate.yaml` before anything changes.',
      'You would rather use a hosted console than run the platform yourself.',
    ],
    faq: [
      {
        q: 'How is Cloudgate different from Dokploy?',
        a: 'Both put apps on your servers with Docker Swarm and Traefik. Cloudgate also deploys into your AWS account and Google Cloud project, describes a whole Project in one cloudgate.yaml whose changes you review as a Plan, and gives each AI agent its own member account, key and audit trail over MCP.',
      },
      {
        q: 'Is Cloudgate open source like Dokploy?',
        a: 'No. Cloudgate is source-available under the Elastic License 2.0: free to use, self-host and modify, but you may not offer it to others as a hosted service. Dokploy’s core is under the Apache License 2.0, with some features under a source-available license of its own. Read <a href="/license">Cloudgate’s license in plain English</a>.',
      },
      {
        q: 'Can I self-host Cloudgate like Dokploy?',
        a: `Yes. One command installs a published release on an Ubuntu 24.04 or 26.04 server. The free version holds one Organization and runs one build at a time per Server; an Enterprise license adds the rest. Read how to ${selfLink}.`,
      },
      {
        q: 'Can Cloudgate run Docker Compose stacks?',
        a: 'Yes. A Compose stack is a kind of Service: on a Server it runs on the Swarm, with a Volume backups tab that can back up all of its named volumes in one run, and in a cloud account it gets a Stack VM of its own.',
      },
      {
        q: 'Is there a hosted version of Cloudgate?',
        a: `Yes. The hosted console at ${site.console.replace('https://', '')} is run by Octabyte and deploys to your Servers and cloud accounts, from $${starter.price} a month with a 30-day free trial.`,
      },
    ],
  },
  {
    id: 'kamal',
    name: 'Kamal',
    group: 'self',
    summary: 'An open-source command-line tool from 37signals that deploys Docker containers to your servers over SSH.',
    title: 'Cloudgate vs Kamal: a deploy tool or a deploy platform?',
    description:
      'Cloudgate vs Kamal: both deploy containers to servers you own over SSH. Cloudgate adds a console, databases, previews, AWS, Google Cloud and AI agents.',
    h1: 'Cloudgate vs Kamal',
    lede: 'Kamal is a command-line tool: you describe your servers in a config file and it ships containers to them over SSH. Cloudgate is a platform: it sets up the servers, then builds, runs and watches what you deploy there.',
    answer: [
      'Choose Kamal if you want a small, open-source tool you run from your own machine or CI, and you are happy to own everything around the deploy yourself.',
      'Choose Cloudgate if you want the rest done for you as well: server setup, databases with backups, domains, previews, monitoring, roles and an audit log, on your servers or in AWS and Google Cloud.',
    ],
    theirPlace: 'Kamal on your servers',
    row: {
      runs: 'Servers you list in its config file, reached over SSH',
      owns: 'You do',
      what: 'Docker containers for web apps and workers, with accessories such as a database beside them',
      pricing: 'Free; you pay only for your servers',
      mcp: 'Not part of Kamal; an agent can run its commands with your SSH access',
      selfHost: 'It runs from your own machine or CI by design: open source under the MIT License',
      databases: 'Accessories: containers you configure, run and back up yourself',
      previews: 'Not built in',
    },
    chooseThem: [
      'You want a small open-source tool and one config file in your repository, with no platform to run.',
      'You already handle builds, backups, monitoring and access your own way.',
      'You want full control of every container on every server.',
    ],
    chooseUs: [
      'You want a console your whole team can use, with roles, grants and an audit log.',
      'You want managed databases with backups to S3-compatible storage, not containers you look after.',
      'You want previews of pull requests, uptime checks, error rates and alerts without wiring them up.',
      'You want to deploy into AWS and Google Cloud too, or give an AI agent its own scoped access over MCP.',
    ],
    faq: [
      {
        q: 'Is Cloudgate an alternative to Kamal?',
        a: 'It solves the same first problem, getting containers onto servers you own over SSH, and then keeps going. Cloudgate sets each Server up (Docker Swarm, Traefik and certificates), builds your code, and runs databases, backups, previews, monitoring and access control around it.',
      },
      {
        q: 'Do I need a Dockerfile for Cloudgate?',
        a: 'No. Cloudgate builds with Nixpacks by default, and also with Railpack, Heroku or Paketo buildpacks or your own Dockerfile, or runs a ready-made Docker image.',
      },
      {
        q: 'Can I deploy from the command line or CI, as with Kamal?',
        a: 'Yes. The Cloudgate CLI deploys a folder from your terminal, uploading only the files that changed, and runs in CI with a personal key. Or push to git and let Cloudgate build. Read <a href="/cli">how the Cloudgate CLI works</a>.',
      },
      {
        q: 'Can I keep my setup in a file in the repository?',
        a: 'Yes. A cloudgate.yaml describes a whole Project’s services. Each change shows as a Plan of what it creates, changes and destroys, and nothing happens until you apply it.',
      },
      {
        q: 'Is Cloudgate free like Kamal?',
        a: `Self-hosting Cloudgate is free under the Elastic License 2.0, which is source-available rather than open source; Kamal is open source under the MIT License. The hosted console is $${starter.price} or $${business.price} a month. Read how to ${selfLink} or see ${pricingLink}.`,
      },
    ],
  },
  {
    id: 'caprover',
    name: 'CapRover',
    group: 'self',
    summary: 'A self-hosted platform as a service that runs apps on your servers with Docker Swarm, nginx and one-click apps.',
    title: 'Cloudgate vs CapRover: self-hosted PaaS on your servers',
    description:
      'Cloudgate vs CapRover: both run apps on your servers from a web dashboard. Cloudgate adds pull-request previews, AWS and Google Cloud, and AI agents over MCP.',
    h1: 'Cloudgate vs CapRover',
    lede: 'CapRover and Cloudgate both turn servers you own into a platform with a dashboard, domains and free certificates. They differ in what sits around a deploy and in where else your apps can run.',
    answer: [
      'Choose CapRover if you want a long-established, free, self-hosted dashboard for apps and one-click services on your own servers.',
      'Choose Cloudgate if you also want pull-request previews, a reviewed Plan for every change, deploys into AWS and Google Cloud, AI agents with their own scoped access, or a hosted console.',
    ],
    theirPlace: 'CapRover on your server',
    row: {
      runs: 'Your servers, one or several joined in a Docker Swarm',
      owns: 'You do',
      what: 'Apps from a Dockerfile or an image, plus one-click apps and databases',
      pricing: 'Free to self-host, with some paid features',
      mcp: 'See CapRover’s docs for its API and any MCP support',
      selfHost: 'Yes, under the Apache License 2.0 with an appendix of extra terms',
      databases: 'Common databases as one-click apps on your servers',
      previews: 'Not built in',
    },
    chooseThem: [
      'You want a mature self-hosted dashboard with a long list of one-click apps.',
      'You are comfortable with nginx and want to customise it directly.',
      'You only deploy to your own servers and do not need previews.',
    ],
    chooseUs: [
      'You want a preview for every GitHub pull request, and rollbacks to an earlier Deployment.',
      'You want to deploy into AWS and Google Cloud’s managed services, not only onto servers.',
      'You want roles, grants per Project and an audit log for your team and your AI agents.',
      'You want one reviewed Plan from a `cloudgate.yaml` before anything changes.',
    ],
    faq: [
      {
        q: 'How is Cloudgate different from CapRover?',
        a: 'Both run apps and databases on your servers with a web dashboard and Let’s Encrypt certificates. Cloudgate uses Traefik rather than nginx, makes pull-request previews, deploys into AWS and Google Cloud as well, and gives AI agents their own member account and key over MCP.',
      },
      {
        q: 'Does Cloudgate have one-click apps like CapRover?',
        a: 'Cloudgate has a catalogue of ready-made app templates, such as n8n, WordPress and Plausible Analytics, each deployed through the console’s get-started wizard. Databases are their own kind of Service: PostgreSQL, MySQL, MariaDB, MongoDB, Redis and libSQL.',
      },
      {
        q: 'Is Cloudgate open source?',
        a: 'No. Cloudgate is source-available under the Elastic License 2.0: free to use, self-host and modify, but not to offer to others as a hosted service. Read <a href="/license">Cloudgate’s license in plain English</a>.',
      },
      {
        q: 'Can I self-host Cloudgate like CapRover?',
        a: `Yes. One command installs a published release on an Ubuntu 24.04 or 26.04 server. The free version holds one Organization and runs one build at a time per Server. Read how to ${selfLink}.`,
      },
      {
        q: 'Can I deploy apps I built with AI to Cloudgate?',
        a: 'Yes. Point Cloudgate at the folder or the repository, get a server from Cloudgate or bring your own, and press Deploy. Read <a href="/vibe-coding">how to deploy an app you built with AI</a>.',
      },
    ],
  },
];

export const competitor = (id: Competitor['id']) => {
  const c = competitors.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown competitor ${id}`);
  return c;
};

export const inGroup = (g: Group) => competitors.filter((c) => c.group === g);
