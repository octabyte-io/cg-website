// The API reference, generated from src/data/openapi.json: the public, filtered copy of the Cloudgate
// OpenAPI document (operator-only, webhook and internal routes left out), enriched with a summary,
// a plain description and the permission each operation needs, read from the backend's controllers.
// Groups of OpenAPI tags become the pages at /docs/api/<slug>; search.json.ts and docs-nav.ts read
// `apiGroups` and `apiOperations`. Everything here runs at build time only.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ApiGroup {
  slug: string;
  title: string;
  /** One line for cards and the meta description. */
  summary: string;
  tags: string[];
  /** <title> without " | Cloudgate" (50-60 characters with it). */
  seoTitle: string;
  /** Meta description, 140-160 characters. */
  description: string;
  /** A short paragraph in plain words under the title. */
  intro: string;
  /** The user-guide page for the console side of the same things. */
  guide: { href: string; title: string };
  /** Who or what the whole group applies to, shown as tags under the title. */
  badges?: string[];
  /** Section headings for tags, when the tag name alone would read badly. */
  tagTitles?: Record<string, string>;
}
export interface ApiOperation { method: string; path: string; summary: string; tag: string; anchor: string }

export const HOSTED_BASE = 'https://cloudgate.octabyte.app/backend';

export const apiGroups: ApiGroup[] = [
  {
    slug: 'account',
    guide: { href: '/docs/guide/personal-keys', title: 'Personal keys' },
    seoTitle: 'Account and Personal keys API reference',
    description: 'Make and revoke Personal keys, check which key a request carries, manage two-factor sign-in and sessions, and run the CLI device login over the Cloudgate API.',
    title: 'Account and Personal keys',
    summary: 'Your profile, two-factor sign-in, sessions, Personal keys, the CLI device login and the sign-up checks.',
    tags: ['Users', 'DeviceLogin', 'SignUp'],
    intro:
      'These routes act on you, the person the key belongs to, not on an Organization. Making, listing and revoking Personal keys, two-factor changes, revoking a session and changing your sign-in email need a signed-in console session: a Personal key is refused there with 403, except that a key may delete itself (what cloudgate logout does).',
    tagTitles: { Users: 'You and your keys', DeviceLogin: 'Device login', SignUp: 'Sign-up checks' },
  },
  {
    slug: 'organizations',
    guide: { href: '/docs/guide/members-and-roles', title: 'Members and roles' },
    seoTitle: 'Organizations, members and roles API reference',
    description: 'Invite members, change roles and entitlements, manage teams, custom roles and tags, and read the audit log of a Cloudgate Organization through the REST API.',
    title: 'Organizations, members and roles',
    summary: 'Organizations, members, invitations, teams, custom roles, tags and the audit log.',
    tags: ['Organizations', 'CustomRole', 'Tags', 'AuditLog'],
    intro:
      'An Organization holds everything else: Projects, Servers, Cloud accounts and the people who use them. These routes invite and remove members, change roles and entitlements, manage custom roles and tags, and read the audit log.',
    tagTitles: { CustomRole: 'Custom roles', AuditLog: 'Audit log' },
  },
  {
    slug: 'projects',
    guide: { href: '/docs/guide/projects-and-environments', title: 'Projects and Environments' },
    seoTitle: 'Projects, Environments and Plans API reference',
    description: 'Create Projects and Environments, set up Templates, read and move Project config, and check, review and apply Plans with the Cloudgate REST API and curl.',
    title: 'Projects, Environments and Plans',
    summary: 'Projects, Environments, Templates, Project config, Plans and the variables wired between Services.',
    tags: ['Projects', 'Environments', 'Templates', 'PendingSetups', 'ProjectConfigs', 'ProjectConfigSchema', 'Plans', 'WiredVariables', 'NetworkCloudResources'],
    intro:
      'A Project groups the Environments of one product, and each Environment holds its Services. A Project config (cloudgate.yaml) describes the Services; Cloudgate turns a change into a Plan you review and apply.',
    tagTitles: {
      PendingSetups: 'Pending setups',
      ProjectConfigs: 'Project config',
      ProjectConfigSchema: 'Project config schema',
      WiredVariables: 'Wired variables',
      NetworkCloudResources: 'Network cloud resources',
    },
  },
  {
    slug: 'applications',
    guide: { href: '/docs/guide/applications', title: 'Applications' },
    seoTitle: 'Applications API: create, configure and run',
    description: 'Create and configure Cloudgate Applications over REST: runtime variables, ports, mounts, basic auth, patches, runtime logs, cron runs, start, stop and delete.',
    title: 'Applications',
    summary: 'Create, configure, start and stop Applications, with their variables, ports, mounts, basic auth, patches and logs.',
    tags: ['Applications', 'Ports', 'Mounts', 'Security', 'Patch', 'RuntimeLog', 'CronRuns', 'ServiceCloudResources'],
    intro:
      'An Application is a Service built from your code or a Docker image: a web service, a worker, a private web service or a cron job. Deploying one is on the Deployments page; these routes create and configure it.',
    tagTitles: {
      Security: 'Basic auth',
      Patch: 'Patches',
      RuntimeLog: 'Runtime log',
      CronRuns: 'Cron runs',
      ServiceCloudResources: 'Cloud resources',
    },
  },
  {
    slug: 'deployments',
    guide: { href: '/docs/guide/deployments', title: 'Deployments' },
    seoTitle: 'Deployments, previews and rollbacks API',
    description: 'Deploy and redeploy Services, follow a Deployment and its log, request previews that expire, roll back to an earlier build and run schedules over the API.',
    title: 'Deployments, previews and rollbacks',
    summary: 'Deploy and redeploy Services, follow a Deployment, request previews, roll back and run schedules.',
    tags: ['Deployments', 'PreviewDeployments', 'Rollbacks', 'Schedules'],
    intro:
      'A Deployment is one attempt to build and release a Service. Every deploy request queues a new Deployment; nothing is merged with a request already waiting. Previews are Deployments of a branch that expire, and a rollback puts an earlier build back.',
    tagTitles: { PreviewDeployments: 'Preview deployments' },
  },
  {
    slug: 'compose',
    guide: { href: '/docs/guide/compose-stacks', title: 'Compose stacks' },
    seoTitle: 'Compose stacks API: Docker Compose services',
    description: 'Create a Cloudgate Compose stack from a Docker Compose file, then start, stop, restart, read its converted file and remove its containers through the API.',
    title: 'Compose stacks',
    summary: 'Create a Compose stack from a Docker Compose file, then start, stop, restart and read it.',
    tags: ['Compose'],
    intro:
      'A Compose stack runs a Docker Compose file as one Service. On a Server it runs with Docker; in a Cloud account it runs on its own Stack VM. Deploy it with the Compose route on the Deployments page.',
    tagTitles: { Compose: 'Compose stacks' },
  },
  {
    slug: 'databases',
    guide: { href: '/docs/guide/databases', title: 'Databases' },
    seoTitle: 'Databases API: Postgres, MySQL, Redis and more',
    description: 'Create, deploy, start, stop and delete PostgreSQL, MySQL, MariaDB, MongoDB, Redis and libSQL databases on Servers or in AWS and Google Cloud via the API.',
    title: 'Databases',
    summary: 'PostgreSQL, MySQL, MariaDB, MongoDB, Redis and libSQL databases: create, deploy, start, stop and delete.',
    tags: ['Postgres', 'Mysql', 'Mariadb', 'Mongo', 'Redis', 'Libsql'],
    intro:
      'Each database engine has the same set of routes under its own prefix. PostgreSQL, MySQL and Redis can also run in a Cloud account (RDS, Cloud SQL, ElastiCache, Memorystore) or stand for an existing database made outside Cloudgate.',
    tagTitles: { Postgres: 'PostgreSQL', Mysql: 'MySQL', Mariadb: 'MariaDB', Mongo: 'MongoDB', Redis: 'Redis', Libsql: 'libSQL' },
  },
  {
    slug: 'storage',
    guide: { href: '/docs/guide/backups', title: 'Backups' },
    seoTitle: 'Buckets, backups and destinations API reference',
    description: 'Manage buckets, database and volume backups, restores and S3-compatible backup destinations with the Cloudgate REST API, with a curl example per endpoint.',
    title: 'Buckets and backups',
    summary: 'Buckets for files, database and volume backups, and the S3-compatible destinations backups go to.',
    tags: ['Buckets', 'Backups', 'VolumeBackups', 'Destinations'],
    intro:
      'A bucket is a Service that stores files. Backups copy a database or a volume to a destination, an S3-compatible bucket you name, on a schedule or when you ask, and restore from it.',
    tagTitles: { VolumeBackups: 'Volume backups', Destinations: 'Backup destinations' },
  },
  {
    slug: 'domains',
    guide: { href: '/docs/guide/domains', title: 'Domains' },
    seoTitle: 'Domains, certificates and redirects API',
    description: 'Add Domains to Applications, Compose stacks and buckets, upload TLS certificates, check a Domain behind a CDN and set redirects with the Cloudgate REST API.',
    title: 'Domains, certificates and redirects',
    summary: 'Domains for Applications, Compose stacks and buckets, TLS certificates, CDN checks and redirects.',
    tags: ['Domains', 'Certificates', 'Redirects', 'Cdn'],
    intro:
      'A Domain sends a host name to a Service. Cloudgate requests a Let’s Encrypt certificate for it, or uses one you upload. Redirects rewrite requests on an Application’s Domains.',
    tagTitles: { Cdn: 'CDN' },
  },
  {
    slug: 'monitoring',
    guide: { href: '/docs/guide/monitoring', title: 'Monitoring' },
    seoTitle: 'Monitoring, health and uptime checks API',
    description: 'Read Service health, Server and container metrics and request logs, and set uptime checks, error-rate thresholds and trace settings with the Cloudgate API.',
    title: 'Monitoring and health',
    summary: 'Service health, uptime checks, error-rate thresholds, traces, Server and container metrics and request logs.',
    tags: ['ServiceHealth', 'UptimeChecks', 'ErrorRateThresholds', 'Traces', 'Monitoring'],
    intro:
      'Read how a Service is doing and set the limits that raise an incident: uptime checks, the error rate from 5xx answers per Domain, and Server CPU and memory thresholds. Metrics and request logs come from the Server the Service runs on.',
    tagTitles: { ServiceHealth: 'Service health', UptimeChecks: 'Uptime checks', ErrorRateThresholds: 'Error-rate thresholds' },
  },
  {
    slug: 'notifications',
    guide: { href: '/docs/guide/notifications', title: 'Notifications' },
    seoTitle: 'Notifications API: Slack, Discord, email, more',
    description: 'Create, update, test and delete Cloudgate notification channels for Slack, Discord, Microsoft Teams, Telegram, Mattermost, email, ntfy and others via the API.',
    title: 'Notifications',
    summary: 'Notification channels for Slack, Discord, Teams, Telegram, Mattermost, email and more, with test sends.',
    tags: ['Notifications'],
    intro:
      'A notification channel is where Cloudgate tells you about Deployments, backups, incidents and Server thresholds. Each kind has its own create, update and test route; listing, reading and deleting are shared.',
  },
  {
    slug: 'servers',
    guide: { href: '/docs/guide/servers', title: 'Servers' },
    seoTitle: 'Servers and Cloud accounts API reference',
    description: 'Add and set up Servers, manage SSH keys and AWS or Google Cloud accounts, and work with Swarm nodes, Docker containers and Traefik through the Cloudgate API.',
    title: 'Servers and Cloud accounts',
    summary: 'Servers, SSH keys, Cloud accounts for AWS and Google Cloud, Swarm nodes, containers and Traefik.',
    tags: ['Servers', 'SshKeys', 'CloudAccounts', 'Cluster', 'Swarm', 'DockerOps', 'Traefik'],
    intro:
      'Services run on a Server (any Ubuntu machine Cloudgate reaches over SSH) or in a Cloud account (AWS or Google Cloud). These routes add and set up Servers, manage SSH keys and Cloud accounts, and work with the Docker containers and Swarm nodes on a Server.',
    tagTitles: { SshKeys: 'SSH keys', CloudAccounts: 'Cloud accounts', DockerOps: 'Containers' },
  },
  {
    slug: 'git',
    guide: { href: '/docs/guide/applications', title: 'Applications' },
    seoTitle: 'Git providers and registries API reference',
    description: 'Connect GitHub, GitLab, Gitea and Bitbucket, list repositories and branches, and add or test container registries with the Cloudgate REST API and curl.',
    title: 'Git providers and registries',
    summary: 'Connect GitHub, GitLab, Gitea and Bitbucket, list repositories and branches, and add container registries.',
    tags: ['GitProviders', 'Github', 'Gitlab', 'Gitea', 'Bitbucket', 'GitProviderOauth', 'Registries'],
    intro:
      'A git provider connection lets Cloudgate read your repositories and deploy on push. A registry is where Cloudgate pulls private Docker images from, or pushes the images it builds.',
    tagTitles: { GitProviders: 'Git providers', Github: 'GitHub', Gitlab: 'GitLab', GitProviderOauth: 'Connect with OAuth' },
  },
  {
    slug: 'agents',
    guide: { href: '/docs/guide/agents', title: 'Agents' },
    seoTitle: 'Agents and AI providers API: keys and spend',
    description: 'Create, suspend and resume Agents and their keys, configure AI providers for suggestions and log analysis, and read token spend with the Cloudgate REST API.',
    title: 'Agents and AI',
    summary: 'Agents and their keys, AI providers for suggestions and log analysis, and token spend of AI models.',
    tags: ['Agents', 'Ai', 'TokenSpend', 'ProjectTokenSpend', 'EnvironmentTokenSpend'],
    intro:
      'An Agent is a member account for an AI agent, with its own role and keys. You manage Agents here with a Personal key; the Agent itself works only through the MCP endpoint and the AI Gateway, never through this API.',
    tagTitles: {
      Ai: 'AI providers',
      TokenSpend: 'Token spend of an AI model',
      ProjectTokenSpend: 'Token spend of a Project',
      EnvironmentTokenSpend: 'Token spend of an Environment',
    },
  },
  {
    slug: 'identity',
    guide: { href: '/docs/guide/sso-and-scim', title: 'SSO and SCIM' },
    seoTitle: 'SSO, SCIM, forward auth and licence API',
    description: 'Configure SSO providers, SCIM provisioning, trusted origins and proven domains, protect apps with forward auth and manage the Enterprise licence over the API.',
    title: 'SSO, SCIM and licences',
    summary: 'Single sign-on providers, SCIM provisioning, forward auth for protected apps and the Enterprise licence.',
    tags: ['Sso', 'Scim', 'ForwardAuth', 'License'],
    intro:
      'Sign people in with your identity provider, provision them with SCIM, and put apps behind Cloudgate sign-in with forward auth. On a Self-hosted instance, the Enterprise licence routes activate and check your licence key.',
    tagTitles: { Sso: 'Single sign-on', Scim: 'SCIM', ForwardAuth: 'Forward auth', License: 'Licence' },
  },
  {
    slug: 'settings',
    guide: { href: '/docs/self-host/instance-settings', title: 'Instance settings' },
    seoTitle: 'Instance settings API: version, Traefik, cleanup',
    description: 'Read the version and update Cloudgate, set the console domain, edit Traefik, run Docker cleanup, set up GPUs and check health of an instance through the API.',
    title: 'Instance settings',
    summary: 'The instance: version and updates, the console domain, Traefik, cleanup, GPUs, branding and health.',
    tags: ['About', 'Settings'],
    intro:
      'Settings of the Cloudgate instance itself and the machine it runs on (the platform host). Most writes here are for an owner or admin of the instance organization, the first Organization made on the instance.',
    badges: ['Mostly self-hosted'],
  },
  {
    slug: 'billing',
    guide: { href: '/docs/guide/billing', title: 'Billing' },
    seoTitle: 'Billing and bought Servers API reference',
    description: 'Read plans and invoices, start checkout, change Add-ons, upgrade or downgrade, and buy, resize or grow Servers from Cloudgate on the Hosted instance over REST.',
    title: 'Billing and bought Servers',
    summary: 'Plans, checkout, add-ons, upgrades and invoices on the Hosted instance, and Servers bought from Cloudgate.',
    tags: ['Billing', 'BoughtServers'],
    intro:
      'Billing on the Hosted instance: the plan an Organization holds, checkout and the customer portal, Add-ons, trials and invoices. Bought Servers are Servers you buy from Cloudgate, billed monthly on the same invoice.',
    badges: ['Hosted only'],
    tagTitles: { BoughtServers: 'Bought Servers' },
  },
];

/** Tags in the source document that the public reference leaves out, and why. */
export const excludedApi = [
  { what: 'Operator and abuse reports', why: 'The Hosted instance’s own administration (suspensions, Enterprise switches, bought-Server repricing, abuse reports). Only Octabyte’s operators can call them; on a Self-hosted instance they answer 404.' },
  { what: 'Instance administration', why: 'One maintenance route for the instance’s metrics, used by the console during setup.' },
  { what: 'Webhooks', why: 'The GitHub push webhook and the Stripe billing webhook. They are called by GitHub and Stripe, signed with a shared secret, never by you.' },
  { what: 'Metrics agent callback', why: 'Where the metrics agent on a Server reports threshold alerts, authenticated by the Server’s own token.' },
  { what: 'OAuth redirects', why: 'The pages GitHub, GitLab and Gitea send the browser back to while you connect a git provider in the console.' },
];

// ---- The document ----

type Json = Record<string, any>;
const spec: Json = JSON.parse(readFileSync(join(process.cwd(), 'src/data/openapi.json'), 'utf8'));
export const openapiDocument = spec;
const schemas: Json = spec.components?.schemas ?? {};
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

export const anchorFor = (method: string, path: string) =>
  `${method}-${path}`.toLowerCase().replace(/[{}]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

interface RawOp { method: string; path: string; op: Json }
const byTag = new Map<string, RawOp[]>();
for (const [path, item] of Object.entries<Json>(spec.paths)) {
  for (const method of METHODS) {
    const op = item[method];
    if (!op) continue;
    const tag = op.tags?.[0] ?? 'Other';
    if (!byTag.has(tag)) byTag.set(tag, []);
    byTag.get(tag)!.push({ method, path, op });
  }
}

export const tagTitle = (g: ApiGroup, tag: string) =>
  g.tagTitles?.[tag] ?? tag.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

const rawOps = (g: ApiGroup) => g.tags.flatMap((t) => byTag.get(t) ?? []);

export const apiOperations = (g: ApiGroup): ApiOperation[] =>
  rawOps(g).map(({ method, path, op }) => ({ method, path, summary: op.summary ?? '', tag: op.tags?.[0] ?? '', anchor: anchorFor(method, path) }));

export const apiOperationCount = () => apiGroups.reduce((n, g) => n + rawOps(g).length, 0);

// ---- Roles ----

// The static roles, from the backend's access-control statements. Owner holds every action; Admin
// every one but deleting the Organization; Member the list below. Agents never call this API.
const memberHolds: Record<string, string[]> = {
  ac: ['read'],
  service: ['read', 'update'],
  environment: ['read', 'update'],
  volume: ['read', 'create', 'delete'],
  deployment: ['read', 'create', 'cancel'],
  backup: ['read', 'create', 'update', 'delete', 'restore'],
  volumeBackup: ['read', 'create', 'update', 'delete', 'restore'],
  schedule: ['read', 'create', 'update', 'delete'],
  domain: ['read', 'create', 'delete'],
  monitoring: ['read'],
  tag: ['read'],
};
export interface Permission { resource: string; actions: string[] }
export function rolesFor(perms: Permission[]): string {
  const roles = ['Owner'];
  if (!perms.some((p) => p.resource === 'organization' && p.actions.includes('delete'))) roles.push('Admin');
  if (perms.every((p) => p.actions.every((a) => memberHolds[p.resource]?.includes(a)))) roles.push('Member');
  return roles.length === 1 ? roles[0] : `${roles.slice(0, -1).join(', ')} or ${roles.at(-1)}`;
}

// ---- Schemas into tables ----

export interface FieldRow { name: string; depth: number; type: string; required: boolean; notes: string[] }

const deref = (s: Json | undefined, seen = new Set<string>()): Json => {
  let cur = s ?? {};
  while (cur.$ref) {
    const n = String(cur.$ref).split('/').pop()!;
    if (seen.has(n)) return { type: 'object' };
    seen.add(n);
    cur = schemas[n] ?? {};
  }
  if (cur.allOf) {
    const merged: Json = { type: 'object', properties: {}, required: [] };
    for (const part of cur.allOf) {
      const p = deref(part, seen);
      Object.assign(merged.properties, p.properties ?? {});
      merged.required.push(...(p.required ?? []));
      if (p.description && !merged.description) merged.description = p.description;
    }
    return merged;
  }
  return cur;
};

function typeOf(s: Json): string {
  s = deref(s);
  if (s.const !== undefined) return JSON.stringify(s.const);
  const alts = s.oneOf ?? s.anyOf;
  if (alts) return [...new Set(alts.map((a: Json) => typeOf(a)))].join(' or ');
  let t = Array.isArray(s.type) ? s.type.join(' or ') : typeof s.type === 'object' ? typeOf(s.type) : (s.type ?? 'any');
  if (t === 'array') t = `array of ${typeOf(s.items ?? {})}`;
  if (t === 'object' && s.additionalProperties && !s.properties) {
    t = typeof s.additionalProperties === 'object' ? `map of ${typeOf(s.additionalProperties)}` : 'map';
  }
  if (s.format && t === 'string') t = `string (${s.format})`;
  if (s.nullable) t += ' or null';
  return t;
}

function notesOf(s: Json): string[] {
  s = deref(s);
  const n: string[] = [];
  if (s.description) n.push(s.description);
  const e = s.enum ?? (s.type && typeof s.type === 'object' ? s.type.enum : undefined);
  if (e) n.push(`One of ${e.map((v: unknown) => `\`${v}\``).join(', ')}.`);
  const max = (v: unknown) => (typeof v === 'number' && v < 9007199254740991 ? v : undefined);
  const range = (lo: unknown, hi: unknown, unit = '') => {
    const l = typeof lo === 'number' ? lo : undefined;
    const h = max(hi);
    if (l !== undefined && h !== undefined) return `${l} to ${h}${unit}.`;
    if (l !== undefined) return `At least ${l}${unit}.`;
    if (h !== undefined) return `Up to ${h}${unit}.`;
    return '';
  };
  const len = range(s.minLength, s.maxLength, ' characters');
  if (len) n.push(len.replace(/^At least 1 characters\./, 'Not empty.'));
  const num = range(s.minimum, s.maximum);
  if (num) n.push(num);
  if (s.exclusiveMinimum !== undefined) n.push(`More than ${s.exclusiveMinimum}.`);
  const items = range(s.minItems, s.maxItems, ' items');
  if (items) n.push(items.replace(/^At least 1 items/, 'At least 1 item'));
  if (s.pattern) n.push(`Matches \`${s.pattern}\`.`);
  if (s.default !== undefined) n.push(`Default \`${JSON.stringify(s.default)}\`.`);
  return n;
}

/** A schema's fields, nested objects flattened as `parent.child` and `list[].child`, three levels deep. */
export function fieldsOf(schema: Json | undefined, prefix = '', depth = 0): FieldRow[] {
  const s = deref(schema);
  const alts = s.oneOf ?? s.anyOf;
  if (alts && !s.properties) {
    const objs = alts.map((a: Json) => deref(a)).filter((a: Json) => a.properties);
    if (objs.length) {
      const merged: Json = { properties: {}, required: [] as string[] };
      for (const o of objs) Object.assign(merged.properties, o.properties);
      merged.required = objs.reduce((acc: string[], o: Json) => acc.filter((r) => (o.required ?? []).includes(r)), objs[0].required ?? []);
      return fieldsOf(merged, prefix, depth);
    }
    return [];
  }
  if (s.type === 'array' && !prefix) return fieldsOf(s.items, '[]', depth);
  const props: Json = s.properties ?? {};
  const req: string[] = s.required ?? [];
  const rows: FieldRow[] = [];
  for (const [name, raw] of Object.entries<Json>(props)) {
    const p = deref(raw);
    const full = prefix ? `${prefix}.${name}`.replace(/^\[\]\./, '[].') : name;
    rows.push({ name: full, depth, type: typeOf(raw), required: req.includes(name), notes: notesOf(raw) });
    if (depth < 2) {
      if (p.properties || ((p.oneOf ?? p.anyOf) && (p.oneOf ?? p.anyOf).some((a: Json) => deref(a).properties))) rows.push(...fieldsOf(p, full, depth + 1));
      else if (p.type === 'array' && deref(p.items).properties) rows.push(...fieldsOf(deref(p.items), `${full}[]`, depth + 1));
    }
  }
  return rows;
}

// ---- Examples ----

// Fictional ids in the shape Cloudgate uses (21-character nanoids), stable per name.
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
export function fakeId(seed: string): string {
  let h = 2166136261;
  let out = '';
  for (let i = 0; i < 21; i++) {
    for (const c of seed + i) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
    out += ALPHA[h % ALPHA.length];
  }
  return out;
}

const NAME_BY_TAG: Record<string, string> = {
  Projects: 'storefront', Environments: 'production', Applications: 'storefront-web', Compose: 'analytics', Postgres: 'orders-db',
  Mysql: 'catalog-db', Mariadb: 'catalog-db', Mongo: 'events-db', Redis: 'sessions', Libsql: 'edge-db', Buckets: 'uploads',
  Servers: 'eu-web-1', SshKeys: 'deploy-key', CloudAccounts: 'northwind-aws', Agents: 'release-bot', Organizations: 'Northwind Labs',
  Tags: 'customer-facing', Destinations: 'offsite-backups', Registries: 'northwind-registry', Notifications: 'ops-alerts',
  CustomRole: 'release-manager', Users: 'Ada Lovelace',
};

function exampleString(name: string, s: Json, tag: string): string {
  const n = name.toLowerCase();
  if (s.enum) return s.enum[0];
  if (s.format === 'date-time' || /(^|_)(at|date)$|At$/.test(name)) return '2026-11-12T09:30:00.000Z';
  if (s.format === 'email' || n.includes('email')) return 'ada@northwind.dev';
  if (s.format === 'uri' || n.endsWith('url') || n === 'endpoint') {
    if (n.includes('webhook')) return 'https://hooks.example.com/services/T000/B000/XXXX';
    if (n.includes('repo') || n.includes('git')) return 'https://github.com/northwind-labs/storefront';
    return 'https://northwind.dev';
  }
  if (/id$/.test(n) && n !== 'id' && !n.endsWith('valid')) return fakeId(name);
  if (n === 'id') return fakeId(tag);
  if (n === 'name' || n === 'appname') return NAME_BY_TAG[tag] ?? 'storefront';
  if (n === 'description') return 'Storefront for Northwind Labs';
  if (n === 'host' || n === 'domain' || n.endsWith('domain')) return 'shop.northwind.dev';
  if (n.includes('branch')) return 'main';
  if (n === 'repository' || n === 'repo') return 'storefront';
  if (n === 'owner') return 'northwind-labs';
  if (n.includes('image')) return 'ghcr.io/northwind-labs/storefront:latest';
  if (n === 'ipaddress' || n === 'ip') return '203.0.113.10';
  if (n === 'username' || n === 'user') return 'deploy';
  if (n.includes('password') || n.includes('secret') || n.includes('token') || n.includes('apikey') || n.endsWith('key')) return '<secret>';
  if (n === 'path' || n.endsWith('path')) return '/';
  if (n.includes('cron') || n === 'schedule') return '0 3 * * *';
  if (n === 'region') return 'eu-central-1';
  if (n === 'env' || n.endsWith('env')) return 'NODE_ENV=production';
  if (n === 'role') return 'member';
  if (n === 'prefix') return 'ci';
  return s.minLength && s.minLength > 8 ? 'x'.repeat(s.minLength) : 'example';
}

export function exampleFor(schema: Json | undefined, tag: string, name = '', depth = 0, onlyRequired = true): unknown {
  const s = deref(schema);
  if (s.example !== undefined) return s.example;
  if (s.const !== undefined) return s.const;
  if (s.default !== undefined && depth > 0) return s.default;
  const alts = s.oneOf ?? s.anyOf;
  if (alts) return exampleFor(alts[0], tag, name, depth, onlyRequired);
  const t = Array.isArray(s.type) ? s.type[0] : typeof s.type === 'object' ? s.type.type : s.type;
  if (t === 'object' || s.properties) {
    if (depth > 3) return {};
    const props: Json = s.properties ?? {};
    const req: string[] = s.required ?? [];
    let keys = Object.keys(props).filter((k) => req.includes(k));
    if (!keys.length || !onlyRequired) keys = Object.keys(props).slice(0, Math.max(keys.length, 3));
    const o: Json = {};
    for (const k of keys) o[k] = exampleFor(props[k], tag, k, depth + 1, onlyRequired);
    return o;
  }
  if (t === 'array') return [exampleFor(s.items, tag, name.replace(/s$/, ''), depth + 1, onlyRequired)];
  if (t === 'boolean') return s.default ?? true;
  if (t === 'integer' || t === 'number') {
    const n = name.toLowerCase();
    if (n.includes('port')) return 3000;
    if (s.minimum !== undefined && s.minimum > 1) return s.minimum;
    if (n === 'limit') return 20;
    return s.minimum ?? 1;
  }
  if (t === 'string' || s.enum || s.pattern) return exampleString(name, s, tag);
  return null;
}

// ---- Operations, in full ----

export interface ParamRow { name: string; in: string; type: string; required: boolean; notes: string[] }
export interface ResponseRow { status: string; meaning: string; fields: FieldRow[]; contentType?: string }
export interface OperationDetail extends ApiOperation {
  description: string;
  access: string;
  isPublic: boolean;
  permission: Permission[];
  params: ParamRow[];
  bodyType?: string;
  body: FieldRow[];
  bodyNote?: string;
  responses: ResponseRow[];
  errors: { status: string; meaning: string }[];
  curl: string;
}
export interface TagSection { tag: string; title: string; anchor: string; operations: OperationDetail[] }

const STATUS: Record<string, string> = { '200': 'OK', '201': 'Created', '202': 'Accepted', '204': 'No content' };

function curlFor(method: string, path: string, isPublic: boolean, params: ParamRow[], body: unknown, bodyType?: string): string {
  let url = `${HOSTED_BASE}${path.replace(/\{(\w+)\}/g, (_m, n) => (n === 'serviceType' ? 'application' : n === 'domain' ? 'northwind.dev' : fakeId(n)))}`;
  const q = params.filter((p) => p.in === 'query' && p.required);
  if (q.length) url += '?' + q.map((p) => `${p.name}=${encodeURIComponent(String(p.name.endsWith('Id') ? fakeId(p.name) : p.name === 'serviceType' ? 'application' : 'example'))}`).join('&');
  const lines = [method === 'get' ? `curl ${q.length ? `"${url}"` : url}` : `curl -X ${method.toUpperCase()} ${q.length ? `"${url}"` : url}`];
  if (!isPublic) {
    lines.push('  -H "x-api-key: $CLOUDGATE_KEY"');
    lines.push('  -H "x-organization-id: $CLOUDGATE_ORG_ID"');
  }
  if (bodyType === 'multipart/form-data') {
    lines.push('  -F "zip=@storefront.zip"');
  } else if (body !== undefined) {
    lines.push('  -H "content-type: application/json"');
    const json = JSON.stringify(body, null, 2).replace(/'/g, "'\\''");
    lines.push(`  -d '${json.split('\n').join('\n  ')}'`);
  }
  return lines.join(' \\\n');
}

// Routes that refuse a Personal key (403) and need a signed-in console session.
const sessionOnly = 'You, from a signed-in console session only: a Personal key is refused with 403.';
const SESSION_ONLY: Record<string, string> = {
  UsersController_createApiKey: sessionOnly,
  UsersController_listApiKeys: sessionOnly,
  UsersController_deleteApiKey: 'You, from a signed-in console session; a Personal key may delete only itself.',
  UsersController_enableTwoFactor: sessionOnly,
  UsersController_verifyTwoFactor: sessionOnly,
  UsersController_disableTwoFactor: sessionOnly,
  UsersController_revokeSession: sessionOnly,
  UsersController_updateProfile: 'You. Changing the sign-in email needs a signed-in console session; a Personal key is refused with 403.',
};

function detail({ method, path, op }: RawOp): OperationDetail {
  const tag = op.tags?.[0] ?? '';
  const isPublic = Array.isArray(op.security) && op.security.length === 0;
  const permission: Permission[] = op['x-cloudgate-permission'] ?? [];
  const access = isPublic
    ? 'Public: no key needed.'
    : SESSION_ONLY[op.operationId]
      ? SESSION_ONLY[op.operationId]
    : permission.length
      ? `${rolesFor(permission)}. Needs ${permission.map((p) => `\`${p.resource}: ${p.actions.join(', ')}\``).join(' and ')}, which a custom role can also grant.`
      : tag === 'Users'
        ? 'You: any signed-in person, with a Personal key or a console session.'
        : 'Any signed-in member. The route names no permission of its own; Cloudgate checks your role and your access to what it touches as it runs.';
  const params: ParamRow[] = (op.parameters ?? []).map((p: Json) => ({
    name: p.name,
    in: p.in,
    type: typeOf(p.schema ?? {}),
    required: !!p.required,
    notes: [...(p.description ? [p.description] : []), ...notesOf(p.schema ?? {})],
  }));
  const content: Json = op.requestBody?.content ?? {};
  const bodyType = Object.keys(content)[0];
  const bodySchema = bodyType ? content[bodyType].schema : undefined;
  const body = bodySchema ? fieldsOf(bodySchema) : [];
  let bodyNote: string | undefined;
  if (bodySchema && !body.length) bodyNote = `A ${typeOf(bodySchema)}.`;
  if (bodyType === 'multipart/form-data') bodyNote = 'A multipart form upload.';
  const bodyExample = bodySchema && bodyType === 'application/json' ? exampleFor(bodySchema, tag) : undefined;

  const responses: ResponseRow[] = Object.entries<Json>(op.responses ?? {}).map(([status, r]) => {
    const ct = r.content ? Object.keys(r.content)[0] : undefined;
    const schema = ct ? r.content[ct].schema : undefined;
    const meaning = r.description || (status === '204' ? 'Done. The answer has no body.' : status === '202' ? 'Accepted; the work finishes after the answer.' : 'The result, as JSON.');
    return { status, meaning, fields: schema && ct === 'application/json' ? fieldsOf(schema) : [], contentType: ct };
  });
  const errors: { status: string; meaning: string }[] = [];
  if (bodySchema || params.some((p) => p.in === 'query')) errors.push({ status: '400', meaning: 'Validation failed; `details` names each field.' });
  if (!isPublic) {
    errors.push({ status: '401', meaning: 'No key, or the key is not valid.' });
    if (SESSION_ONLY[op.operationId]) errors.push({ status: '403', meaning: 'Sent with a Personal key where a console session is needed.' });
    else if (permission.length) errors.push({ status: '403', meaning: 'Your role does not allow it, or you were not granted what it touches.' });
    else if (tag !== 'Users') errors.push({ status: '403', meaning: 'You may not reach what it touches.' });
  }
  if (params.some((p) => p.in === 'path')) errors.push({ status: '404', meaning: 'Nothing with that id in this Organization.' });

  return {
    method,
    path,
    tag,
    summary: op.summary ?? '',
    anchor: anchorFor(method, path),
    description: op.description ?? '',
    access,
    isPublic,
    permission,
    params,
    bodyType,
    body,
    bodyNote,
    responses,
    errors,
    curl: curlFor(method, path, isPublic, params, bodyExample, bodyType),
  };
}

export function apiSections(g: ApiGroup): TagSection[] {
  return g.tags
    .filter((t) => byTag.has(t))
    .map((t) => ({ tag: t, title: tagTitle(g, t), anchor: `tag-${t.toLowerCase()}`, operations: byTag.get(t)!.map(detail) }));
}

export { STATUS as statusText };
