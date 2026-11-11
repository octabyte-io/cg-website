// One place for the legal details every legal page repeats, so a name, an address or a date
// changes once. Facts about the product come from the cloudgate repository (ADR-0052, 0054, 0071,
// CONTEXT.md, backend/src/auth, backend/src/mail, backend/src/cloud/billing); anything the
// repositories cannot tell us is a plainly named value below and is listed in `legalTodo`.
import { site } from './site';

export const legal = {
  /** The company that runs the Hosted instance and sells its plans. */
  company: site.company.name,
  /** The registered legal name. Until confirmed, the trading name is used. */
  legalName: site.company.name,
  companyUrl: site.company.url,
  /** Registered office. Empty until confirmed; pages then leave the address out. */
  registeredAddress: '',
  /** Company registration number. Empty until confirmed; pages then leave it out. */
  companyNumber: '',
  /**
   * Governing law and courts. Empty until confirmed; the Terms then say the law of the country
   * where Octabyte is registered applies. (ADR-0071 notes Octabyte's Stripe account is in the UK,
   * which hints at England and Wales, but no document says so.)
   */
  governingLaw: '',
  /** Card payments, invoices and subscriptions (ADR-0054). */
  paymentProcessor: { name: 'Stripe', url: 'https://stripe.com' },
  /** Plans are priced and billed in US dollars (ADR-0054, ADR-0071). */
  currency: 'USD',
  emails: {
    support: site.support,
    /** No dedicated legal@ or privacy@ mailbox is known, so both default to support. */
    legal: site.support,
    privacy: site.support,
    abuse: site.support,
  },
  /** When these documents take effect, ISO date. */
  effectiveDate: '2026-11-11',
  /** When they were last changed, ISO date. */
  updatedDate: '2026-11-11',
} as const;

/** "11 November 2026" from an ISO date, the same on every page and in every time zone. */
export const formatLegalDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/** "Octabyte" or "Octabyte Ltd (company number 123)", whichever is known. */
export const legalEntity = () =>
  legal.companyNumber ? `${legal.legalName} (company number ${legal.companyNumber})` : legal.legalName;

/** How a document names us: `Octabyte ("we")`, or `Octabyte Ltd ("Octabyte", "we")` once they differ. */
export const definedParty = (...aliases: string[]) => {
  const names = legal.legalName === legal.company && !legal.companyNumber ? aliases : [legal.company, ...aliases];
  return `${legalEntity()} (${names.map((a) => `"${a}"`).join(', ')})`;
};

/** The governing-law sentence the Terms print. */
export const governingLawText = () =>
  legal.governingLaw
    ? `These Terms are governed by the law of ${legal.governingLaw}, and its courts have exclusive jurisdiction over any dispute about them.`
    : `These Terms are governed by the law of the country where ${legal.legalName} is registered, and its courts have exclusive jurisdiction over any dispute about them.`;

/** Every legal document, in the order the hub lists them. */
export const legalDocs = [
  {
    path: '/terms',
    name: 'Terms of Service',
    summary: 'The agreement for using the hosted Cloudgate console: accounts, plans, billing, your responsibilities and ours.',
  },
  {
    path: '/privacy',
    name: 'Privacy Policy',
    summary: 'What personal data the console and this website collect, why, how long we keep it, and your rights.',
  },
  {
    path: '/acceptable-use',
    name: 'Acceptable Use Policy',
    summary: 'What you may not do with Cloudgate, Bought Servers or the Gateway, and how to report abuse.',
  },
  {
    path: '/cookies',
    name: 'Cookie notice',
    summary: 'This website sets no cookies. The console uses only the cookies it needs to keep you signed in.',
  },
  {
    path: '/subprocessors',
    name: 'Subprocessors',
    summary: 'The companies that process personal data for us when we run the hosted console.',
  },
  {
    path: '/dpa',
    name: 'Data Processing Addendum',
    summary: 'How we process personal data on your behalf as your processor, for customers who need a signed DPA.',
  },
] as const;

/**
 * What the owner must confirm before these pages are relied on. Nothing here is printed on a page:
 * each item has a neutral fallback above.
 */
export const legalTodo: string[] = [
  'Registered company name (legal.legalName; the pages say "Octabyte" until set)',
  'Registered office address (legal.registeredAddress; left off the pages until set)',
  'Company registration number (legal.companyNumber; left off the pages until set)',
  'Governing law and courts (legal.governingLaw; the Terms say "the country where Octabyte is registered" until set)',
  'Dedicated legal@, privacy@ and abuse@ mailboxes, if wanted (all default to support@octabyte.io)',
  'Where the Hosted instance (cloudgate.octabyte.app) and its database are hosted, and in which country, for the Privacy Policy and Subprocessors page',
  'Whether Resend is the mail provider on the Hosted instance in production (ADR-0052 says so; the code also supports SMTP)',
  'Whether any error tracking, uptime or log service watches the Hosted instance itself (none is in the code)',
  'Refund stance: the Terms say paid fees are not refunded except a failed Bought Server (refunded in full, per ADR-0071) or where the law requires',
  'Whether sales tax or VAT is added to invoices (Checkout collects a billing address and tax ID; automatic tax is not turned on in the code)',
  'How long billing records are kept after an Organization is deleted (Stripe keeps its own; the Privacy Policy says "as long as tax and accounting law requires")',
  'Account (user) deletion: the console offers Delete Organization but no self-serve account delete; the Privacy Policy says to ask support',
  'Whether a signed DPA with Standard Contractual Clauses and the UK Addendum is actually offered',
  'Liability cap amount (the Terms say fees paid in the 12 months before the claim)',
  'Minimum age (the Privacy Policy says 16)',
  'Have a lawyer review all of these documents',
];
