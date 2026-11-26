// The docs collection: one .mdx file per page under src/content/docs. Its path is its URL under
// /docs (guide/servers.mdx is /docs/guide/servers). See docs/docs-authoring.md.
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { authorIds } from './data/authors';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    /** The page's one <h1>. */
    title: z.string(),
    /** <title> (50-60 characters with " | Cloudgate"); defaults to `title`. */
    seoTitle: z.string().optional(),
    /** Meta description, 140-160 characters, unique. */
    description: z.string(),
    /** One or two sentences under the <h1>: the answer to "what is this page for". */
    lede: z.string(),
    /** Sidebar section; see src/data/docs-nav.ts. */
    section: z.enum(['start', 'guides', 'guide', 'cli', 'mcp', 'api', 'self-host', 'help']),
    /** Sidebar sub-heading inside a section (the user guide uses these). */
    group: z.string().optional(),
    /** Position inside its group, smallest first. */
    order: z.number().default(100),
    /** Shorter label for the sidebar. */
    navTitle: z.string().optional(),
    /** Who or what the page applies to, shown as tags under the title: "Hosted only", "Business plan"... */
    badges: z.array(z.string()).default([]),
    /** A real ordered how-to on the page, emitted as HowTo JSON-LD. */
    howto: z
      .object({ name: z.string(), steps: z.array(z.object({ name: z.string(), text: z.string() })) })
      .optional(),
    /** Questions answered on the page, emitted as FAQPage JSON-LD and rendered at the end. */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    /** When the page's content last changed (ISO date); set it when you change a page's facts. */
    updated: z.string().default('2026-11-12'),
    /** The page already answers its `faq` in the body (the FAQ page): emit the JSON-LD, skip the block. */
    faqInBody: z.boolean().default(false),
  }),
});

// The blog: one Markdown file per post under src/content/blog; its file name is its URL under /blog.
// See docs/blog-authoring.md.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    /** The post's one <h1>, phrased as people search or ask. */
    title: z.string(),
    /** <title> (50-60 characters with " | Cloudgate"); defaults to `title`. */
    seoTitle: z.string().optional(),
    /** Meta description, 140-160 characters, unique. */
    description: z.string(),
    /** One or two sentences under the <h1> that answer the title outright. */
    lede: z.string(),
    /** Who wrote it: an id from src/data/authors.ts. */
    author: z.enum(authorIds),
    /** The day it was first published (YYYY-MM-DD). Never a future date. */
    published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** The day its content last changed in substance (YYYY-MM-DD). Never moved for a typo. */
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    /** The topic it belongs to on /blog; see src/data/blog.ts. */
    topic: z.enum(['releases', 'engineering', 'guides', 'ai', 'comparisons', 'data']),
    /** Pages on this site the post leads to, shown beside it: product pages, docs, compare pages. */
    related: z.array(z.object({ href: z.string(), title: z.string() })).default([]),
    /** Questions the post answers, emitted as FAQPage JSON-LD and rendered at the end. */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    /** While true the post is not built at all: no page, no list, no feed. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs, blog };
