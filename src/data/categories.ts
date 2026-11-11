// The template catalogue's categories, in the catalogue's own order and words
// (cg-templates site/src/categories.ts). A template's `category` in templates.json is one of these ids.

export interface Category {
  id: string;
  name: string;
  /** One sentence for the category's lede, in plain language. */
  lede: string;
  /** schema.org applicationCategory for the apps in it. */
  schemaCategory: string;
}

export const categories: Category[] = [
  { id: 'websites', name: 'Websites', lede: 'Self-hosted website builders and blogs, so you own your site with no monthly platform fee.', schemaCategory: 'WebApplication' },
  { id: 'team-chat', name: 'Team chat', lede: 'Self-hosted team chat with channels, calls and your full message history on your own server.', schemaCategory: 'CommunicationApplication' },
  { id: 'automation', name: 'Automation', lede: 'Open-source workflow automation that connects your tools and runs repetitive work, with no task limits.', schemaCategory: 'BusinessApplication' },
  { id: 'analytics', name: 'Analytics', lede: 'Privacy-friendly, self-hosted website analytics and dashboards, with no data handed to an ad company.', schemaCategory: 'BusinessApplication' },
  { id: 'docs-wikis', name: 'Docs & wikis', lede: 'Self-hosted wikis, team docs and spreadsheet-style databases, kept in one place you control.', schemaCategory: 'BusinessApplication' },
  { id: 'files-photos', name: 'Files & photos', lede: 'Self-hosted cloud storage and photo backup that syncs files across your devices, on your own disk.', schemaCategory: 'MultimediaApplication' },
  { id: 'passwords', name: 'Passwords', lede: 'A self-hosted password manager to share your team’s logins safely, with no per-person subscription.', schemaCategory: 'SecurityApplication' },
  { id: 'customers-sales', name: 'Customers & sales', lede: 'Open-source tools for customer chat, bookings and newsletters, with no fee per agent or subscriber.', schemaCategory: 'BusinessApplication' },
  { id: 'monitoring', name: 'Monitoring', lede: 'Self-hosted uptime monitoring that alerts you when a website goes down, before your customers notice.', schemaCategory: 'UtilitiesApplication' },
  { id: 'developer-tools', name: 'Developer tools', lede: 'Self-hosted Git hosting and developer tools, so your code, reviews and builds stay on your server.', schemaCategory: 'DeveloperApplication' },
];

export const categoryById = new Map(categories.map((c) => [c.id, c]));
