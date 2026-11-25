// The blog as an RSS feed: one item per published post, newest first, with the post's full text.
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { site } from '../data/site';
import { authorById } from '../data/authors';
import { getPosts, postUrl, topics } from '../data/blog';

// Links in posts are site-relative; a feed reader needs them absolute.
const absolute = (html: string) => html.replace(/(href|src)="\/(?!\/)/g, `$1="${site.url}/`);

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const container = await AstroContainer.create();
  const items = await Promise.all(
    posts.map(async (p) => {
      const { Content } = await render(p);
      const html = await container.renderToString(Content);
      return {
        title: p.data.title,
        link: postUrl(p),
        pubDate: new Date(`${p.data.published}T12:00:00Z`),
        description: p.data.description,
        author: `${site.support} (${authorById(p.data.author).name})`,
        categories: [topics[p.data.topic].name],
        content: absolute(`<p>${p.data.lede}</p>${html}`),
      };
    }),
  );
  return rss({
    title: 'Cloudgate blog',
    description: "What's new in Cloudgate each month, deploy guides and engineering notes from the team that makes it.",
    site: site.url,
    trailingSlash: false,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>en</language><atom:link href="${site.url}/blog.xml" rel="self" type="application/rss+xml"/>`,
    items,
  });
};
