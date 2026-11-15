// The changelog as an RSS feed: one item per release (a "## " heading in src/content/changelog.md),
// linking to that release on /changelog, with the release's notes as the item's content.
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { compiledContent, getHeadings } from '../content/changelog.md';
import { releaseDate } from '../data/changelog.mjs';
import { site } from '../data/site';

// Links in the notes are site-relative; a feed reader needs them absolute.
const absolute = (html: string) => html.replace(/(href|src)="\/(?!\/)/g, `$1="${site.url}/`);

// HTML to plain text, for the summary (the feed escapes it again).
const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

export const GET: APIRoute = async () => {
  const html = await compiledContent();
  const releases = getHeadings().filter((h) => h.depth === 2);
  // Each release's notes run from its <h2> to the next one.
  const sections = html.split(/(?=<h2[\s>])/).filter((s) => s.startsWith('<h2'));

  return rss({
    title: 'Cloudgate changelog',
    description: 'What changed in Cloudgate and the Cloudgate CLI, release by release.',
    // The channel's link is the changelog page; item links resolve against it.
    site: `${site.url}/changelog`,
    trailingSlash: false,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>en</language><atom:link href="${site.url}/changelog.xml" rel="self" type="application/rss+xml"/>`,
    items: releases.map((r, i) => {
      const notes = absolute((sections[i] ?? '').replace(/^<h2[^>]*>[\s\S]*?<\/h2>\s*/, ''));
      // The summary is the release's opening paragraph, as plain text.
      const intro = notes.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? '';
      return {
        title: r.text,
        link: `/changelog#${r.slug}`,
        pubDate: releaseDate(r.text),
        description: text(intro),
        content: notes,
      };
    }),
  });
};
