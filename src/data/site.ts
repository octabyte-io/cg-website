// One place for the facts every page repeats, so a price or an address changes once.
// Sources: the cloudgate repository (README, CONTEXT.md, CHANGELOG.md, docs/adr 0048, 0054, 0071, 0073).

export const site = {
  name: 'Cloudgate',
  url: 'https://cloudgate.octabyte.io',
  tagline: 'Deploy to your own servers and your own cloud.',
  description:
    'Cloudgate is a deployment platform you point at your own servers and your own AWS or Google Cloud account. Deploy apps, databases, Compose stacks and AI models with domains, TLS, backups and monitoring built in.',
  console: 'https://cloudgate.octabyte.app',
  signUp: 'https://cloudgate.octabyte.app/sign-up',
  signIn: 'https://cloudgate.octabyte.app/sign-in',
  getStarted: 'https://cloudgate.octabyte.app/get-started',
  // The cloudgate source repository is private today, so the site links to nothing inside it.
  // Set this when it goes public and the Self-host page shows the clone-and-install steps.
  sourceUrl: null as string | null,
  templatesRepo: 'https://github.com/octabyte-io/cg-templates',
  templatesSite: 'https://cgt.octabyte.io/',
  npm: 'https://www.npmjs.com/package/@octabyte-io/cloudgate',
  support: 'support@octabyte.io',
  company: { name: 'Octabyte', url: 'https://octabyte.io' },
} as const;

/** The console's deploy wizard for one catalogue template (ADR-0073). */
export const deployUrl = (templateId: string) =>
  `${site.getStarted}?template=${encodeURIComponent(templateId)}`;

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 15,
    blurb: 'For one team running its own apps.',
    includes: [
      '3 Servers and 3 Cloud Environments',
      'Unlimited members, Projects and Environments',
      'Apps, databases, Compose stacks and AI models',
      'Domains, TLS, backups, metrics and uptime checks',
      'Preview deployments and rollbacks',
      'Agents and the MCP endpoint',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 35,
    blurb: 'For companies with an identity provider.',
    includes: [
      'Everything in Starter',
      'SSO sign-in for your proven domains',
      'SCIM provisioning',
      'Custom roles',
      'Forward auth in front of your apps',
      'Pay for more Organizations on one plan',
    ],
  },
] as const;

export const addOn = { price: 5, what: 'one more Server and one more Cloud Environment' } as const;
export const trialDays = 30;
