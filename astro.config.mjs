// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import ogImages from './src/og/og.mjs';
import { createLastmod } from './src/data/lastmod.mjs';

// Each page's last change, from git (src/data/lastmod.mjs).
const lastmod = createLastmod();

// Served from GitHub Pages under its own domain (public/CNAME), so no `base`.
export default defineConfig({
  site: 'https://cloudgate.octabyte.io',
  trailingSlash: 'never',
  build: { format: 'file' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  markdown: {
    // Code blocks sit on the night surface in both themes (docs/design.md), so one dark theme fits.
    shikiConfig: { theme: 'github-dark-default', wrap: false },
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith('/404'),
      serialize: (item) => {
        const date = lastmod(item.url);
        return date ? { ...item, lastmod: date } : item;
      },
    }),
    // Each page's share card, drawn from its built HTML into dist/og/ (src/og/og.mjs).
    ogImages(),
  ],
});
