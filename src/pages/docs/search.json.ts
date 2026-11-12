import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { sections } from '../../data/docs-nav';
import { docHref } from '../../data/docs-nav';
import { apiGroups, apiOperations } from '../../data/api-reference';

// The docs search index, fetched by the search dialog the first time it opens.
// t title, u url, s section, d description, h headings [text, id], k extra keywords.
export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  const sectionTitle = (id: string) => sections.find((s) => s.id === id)?.title ?? 'Docs';
  const pages = await Promise.all(
    docs.map(async (e) => {
      const { headings } = await render(e);
      return {
        t: e.data.title,
        u: docHref(e.id),
        s: e.id === 'index' ? 'Docs' : sectionTitle(e.data.section),
        d: e.data.description,
        h: headings.filter((h) => h.depth <= 3).map((h) => [h.text, h.slug]),
        k: [e.data.navTitle, e.data.group, ...e.data.badges].filter(Boolean).join(' '),
      };
    }),
  );
  const api = apiGroups.flatMap((g) =>
    apiOperations(g).map((op) => ({
      t: `${op.method.toUpperCase()} ${op.path}`,
      u: `/docs/api/${g.slug}`,
      s: `API reference, ${g.title}`,
      d: op.summary,
      h: [[op.summary || `${op.method.toUpperCase()} ${op.path}`, op.anchor]],
      k: op.tag,
    })),
  );
  return new Response(JSON.stringify([...pages, ...api]), { headers: { 'Content-Type': 'application/json' } });
};
