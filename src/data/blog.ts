// The blog's posts in one place: sorted, dated and described for the hub, the post pages, the
// author pages, the feed, llms.txt and the home page's "Latest" row.
import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from './site';
import { authorById } from './authors';

export type Post = CollectionEntry<'blog'>;

export const topics: Record<Post['data']['topic'], { name: string; blurb: string }> = {
  releases: { name: "What's new", blurb: 'Each month of Cloudgate releases in one place, and what to do on upgrade.' },
  guides: { name: 'Guides', blurb: 'How to do one real job with Cloudgate, step by step.' },
  engineering: { name: 'Engineering', blurb: 'Why Cloudgate is built the way it is, from its design decisions.' },
  ai: { name: 'AI agents and models', blurb: 'Agents that deploy over MCP, and open models on your own GPUs.' },
  comparisons: { name: 'Comparisons', blurb: 'Honest comparisons with other ways to deploy and host apps.' },
  data: { name: 'Measured', blurb: 'Numbers we measured ourselves, with how we measured them.' },
};

/** Every published post, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.published.localeCompare(a.data.published) || a.id.localeCompare(b.id));
}

export const postUrl = (p: Post) => `/blog/${p.id}`;
export const authorUrl = (id: string) => `/blog/authors/${id}`;

/** The date a post last changed in substance: `updated`, or `published` when it never has. */
export const modifiedOf = (p: Post) => p.data.updated ?? p.data.published;

/** "25 November 2026", the way dates read across the site. */
export const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** The author as schema.org reads them: a Person at Octabyte, with their page on this site. */
export const personSchema = (id: string) => {
  const a = authorById(id);
  return {
    '@type': 'Person',
    '@id': `${site.url}${authorUrl(id)}#person`,
    name: a.name,
    url: `${site.url}${authorUrl(id)}`,
    worksFor: { '@type': 'Organization', name: site.company.name, url: site.company.url },
  };
};

/** BlogPosting JSON-LD: the same dates and author the page shows (Google's byline-date guidance). */
export const blogPostingSchema = (p: Post) => {
  const url = `${site.url}${postUrl(p)}`;
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    headline: p.data.title,
    description: p.data.description,
    image: `${site.url}/og${postUrl(p)}.png`,
    datePublished: p.data.published,
    dateModified: modifiedOf(p),
    author: personSchema(p.data.author),
    publisher: { '@id': `${site.url}/#organization` },
    articleSection: topics[p.data.topic].name,
    inLanguage: 'en',
    isPartOf: { '@id': `${site.url}/blog#blog` },
  };
};
