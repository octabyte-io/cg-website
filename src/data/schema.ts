// JSON-LD builders shared by pages. Pass the result to <Base schema={[...]}>.
import { site, plans, trialDays } from './site';

const strip = (html: string) => html.replace(/<[^>]+>/g, '');

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: strip(i.a) },
  })),
});

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: new URL(c.path, site.url).href,
  })),
});

export const softwareSchema = () => ({
  '@type': 'SoftwareApplication',
  '@id': `${site.url}/#software`,
  name: site.name,
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'Deployment platform',
  operatingSystem: 'Linux (Ubuntu 24.04) for self-hosting; any browser for the hosted console',
  url: site.url,
  description: site.description,
  publisher: { '@id': `${site.url}/#organization` },
  offers: [
    ...plans.map((p) => ({
      '@type': 'Offer',
      name: `${p.name} (hosted)`,
      price: p.price,
      priceCurrency: 'USD',
      url: `${site.url}/pricing`,
      description: `${p.blurb} Monthly, with a ${trialDays}-day free trial.`,
    })),
    {
      '@type': 'Offer',
      name: 'Self-hosted',
      price: 0,
      priceCurrency: 'USD',
      url: `${site.url}/self-hosted`,
      description: 'Free to self-host under the Elastic License 2.0.',
    },
  ],
});
