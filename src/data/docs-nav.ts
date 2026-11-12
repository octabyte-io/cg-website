// The docs sidebar: sections in order, and inside the user guide the groups in order. Pages place
// themselves with `section`, `group` and `order` in their frontmatter; generated pages (the API
// reference groups) are added in getDocsNav().
import { getCollection, type CollectionEntry } from 'astro:content';
import { apiGroups } from './api-reference';

export const sections = [
  { id: 'start', title: 'Start here' },
  { id: 'guide', title: 'User guide' },
  { id: 'cli', title: 'CLI' },
  { id: 'mcp', title: 'MCP and agents' },
  { id: 'api', title: 'API reference' },
  { id: 'self-host', title: 'Self-hosting' },
  { id: 'help', title: 'Help' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

/** User-guide groups, in sidebar order. A page whose group is not listed goes last. */
export const guideGroups = ['Deploy', 'Where it runs', 'Services', 'Data', 'Operate', 'Team and access', 'Account'];

export interface NavLink { title: string; href: string }
export interface NavGroup { title?: string; links: NavLink[] }
export interface NavSection { id: SectionId; title: string; groups: NavGroup[] }

export const docHref = (id: string) => (id === 'index' ? '/docs' : `/docs/${id.replace(/\/index$/, '')}`);

const byOrder = (a: CollectionEntry<'docs'>, b: CollectionEntry<'docs'>) =>
  a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);

export async function getDocsNav(): Promise<NavSection[]> {
  const all = (await getCollection('docs')).filter((e) => e.id !== 'index');
  return sections.map((s) => {
    const entries = all.filter((e) => e.data.section === s.id).sort(byOrder);
    const link = (e: CollectionEntry<'docs'>): NavLink => ({ title: e.data.navTitle ?? e.data.title, href: docHref(e.id) });
    let groups: NavGroup[];
    if (s.id === 'guide') {
      const names = [...new Set(entries.map((e) => e.data.group ?? 'More'))].sort(
        (a, b) => (guideGroups.indexOf(a) + 1 || 99) - (guideGroups.indexOf(b) + 1 || 99),
      );
      groups = names.map((g) => ({ title: g, links: entries.filter((e) => (e.data.group ?? 'More') === g).map(link) }));
    } else {
      groups = [{ links: entries.map(link) }];
    }
    if (s.id === 'api') {
      groups.push({
        title: 'Endpoints',
        links: apiGroups.map((g) => ({ title: g.title, href: `/docs/api/${g.slug}` })),
      });
    }
    return { id: s.id, title: s.title, groups: groups.filter((g) => g.links.length) };
  });
}

/** Every docs page in reading order, for previous/next links. */
export async function getReadingOrder(): Promise<NavLink[]> {
  const nav = await getDocsNav();
  return [{ title: 'Documentation', href: '/docs' }, ...nav.flatMap((s) => s.groups.flatMap((g) => g.links))];
}
