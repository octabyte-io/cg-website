// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

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
    }),
  ],
});
