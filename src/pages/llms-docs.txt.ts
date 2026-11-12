import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getDocsNav, docHref } from '../data/docs-nav';
import { site } from '../data/site';

// llms-docs.txt: every docs page as Markdown in sidebar order, so an AI assistant can read the whole
// documentation in one request. Components become plain text: a <Screenshot> becomes its alt text,
// a <Step title> a numbered line, a <Callout> a quoted note; the API endpoint pages are linked only.
const toText = (body: string) =>
  body
    .replace(/<Screenshot[^>]*\balt="([^"]*)"[^>]*\/>/g, '[Screenshot: $1]')
    .replace(/<Step\s+title="([^"]*)"\s*>/g, '\n**Step: $1**\n')
    .replace(/<Tab\s+label="([^"]*)"\s*>/g, '\n**$1**\n')
    .replace(/<Callout[^>]*type="(\w+)"[^>]*?(?:title="([^"]*)")?[^>]*>/g, (_, t, title) => `\n> **${title ?? t}:** `)
    .replace(/<Card\s+href="([^"]*)"\s+title="([^"]*)"[^>]*>/g, `- [$2](${site.url}$1): `)
    .replace(/<\/?(Steps|Step|Tabs|Tab|Callout|CardGrid|Card|Badge)\b[^>]*>/g, '')
    .replace(/\]\(\//g, `](${site.url}/`)
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const GET: APIRoute = async () => {
  const entries = await getCollection('docs');
  const order = (await getDocsNav()).flatMap((s) => s.groups.flatMap((g) => g.links.map((l) => l.href)));
  const pos = (id: string) => {
    const i = order.indexOf(docHref(id));
    return i < 0 ? 999 : i;
  };
  const pages = entries
    .sort((a, b) => pos(a.id) - pos(b.id))
    .map((e) => `# ${e.data.title}\n\nURL: ${site.url}${docHref(e.id)}\n\n${e.data.lede}\n\n${toText(e.body ?? '')}${
      e.data.faq?.length ? `\n\n## Questions\n\n${e.data.faq.map((f) => `### ${f.q}\n\n${f.a.replace(/<[^>]+>/g, '')}`).join('\n\n')}` : ''
    }`);
  const body = `# ${site.name} documentation\n\n> ${site.description}\n\nThe API endpoint reference is at ${site.url}/docs/api.\n\n${pages.join('\n\n---\n\n')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
