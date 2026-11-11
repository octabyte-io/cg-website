import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { site } from '../data/site';
import { templatesHome } from '../data/template-links';

// llms-full.txt: the whole site as plain text, so an AI assistant can read every page in one request.
// Each page is rendered from its own source with the Container API and its <main> turned into text,
// so this file never drifts from what the pages say.
const pages = import.meta.glob<{ default: any }>(['./*.astro', '!./404.astro'], { eager: true });

// The order assistants read the site in; a page not listed here is appended at the end.
const order = ['index', 'vibe-coding', 'ai-agents', 'features', 'cli', 'pricing', 'self-hosted'];

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');

const absolute = (href: string) => (href.startsWith('/') ? new URL(href, site.url).href : href);

/** Remove each element whose opening tag matches `open`, with everything inside it. */
function dropElements(html: string, open: RegExp): string {
  let out = html;
  for (let m = open.exec(out); m; m = open.exec(out)) {
    const tag = m[1];
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g');
    re.lastIndex = m.index + m[0].length;
    let depth = 1;
    let end = out.length;
    for (let t = re.exec(out); t; t = re.exec(out)) {
      depth += t[1] ? -1 : t[0].endsWith('/>') ? 0 : 1;
      if (!depth) { end = t.index + t[0].length; break; }
    }
    out = out.slice(0, m.index) + out.slice(end);
    open.lastIndex = 0;
  }
  return out;
}

/** HTML to readable plain text: headings as Markdown, links as "text (url)", lists as "- ". */
function toText(html: string): string {
  // Illustrations (the hero's mock console, agent session and terminal) are pictures of the product,
  // not facts about it, so leave them out along with anything hidden from screen readers.
  const main = dropElements(
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? html,
    /<(\w+)\b[^>]*(?:role="group"|aria-hidden="true")[^>]*>/,
  );
  return decode(
    main
      .replace(/<(script|style|svg|template)[\s\S]*?<\/\1>/g, '')
      .replace(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/g, '')
      .replace(/<[^>]+aria-hidden="true"[^>]*>[\s\S]*?<\/(span|div)>/g, '')
      .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g, (_, l, t) => `\n\n${'#'.repeat(+l)} ${t.replace(/<[^>]+>/g, '').trim()}\n\n`)
      .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, h, t) => {
        const label = t.replace(/<[^>]+>/g, '').trim();
        const url = absolute(decode(h));
        return url.startsWith('#') || !label ? `${label} ` : `${label} (${url}) `;
      })
      .replace(/<label[^>]*>/g, '\n')
      .replace(/<li[^>]*>/g, '\n- ')
      .replace(/<dt[^>]*>/g, '\n- ')
      .replace(/<\/dt>\s*<dd[^>]*>/g, ': ')
      .replace(/<tr[^>]*>/g, '\n')
      .replace(/<\/t[hd]>/g, ' | ')
      .replace(/<summary[^>]*>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<\/(p|div|section|article|pre|ul|ol|dl|table|figure|figcaption|details|header)>/g, '\n\n')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/ +([.,;:!?])(?=\s|$)/g, '$1')
    .replace(/^-\s*\n+(#+ )/gm, '$1')
    .replace(/^- *$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const GET: APIRoute = async () => {
  const container = await AstroContainer.create();
  const names = Object.keys(pages)
    .map((p) => p.replace(/^\.\/|\.astro$/g, ''))
    .sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99));

  const sections: string[] = [];
  for (const name of names) {
    const path = name === 'index' ? '/' : `/${name}`;
    const html = await container.renderToString(pages[`./${name}.astro`].default, {
      request: new Request(new URL(path, site.url)),
    });
    const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? name);
    sections.push(`---\n\nPage: ${title}\nURL: ${new URL(path, site.url).href}\n\n${toText(html)}`);
  }

  const body = `# ${site.name}: full site text

> ${site.description}

This is every page of ${site.url} as plain text, for AI assistants. The short index is ${site.url}/llms.txt. App templates live on their own website, ${templatesHome}; each deploys from ${site.getStarted}?template=<id>.

${sections.join('\n\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
