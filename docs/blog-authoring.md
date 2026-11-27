# Writing a blog post

The blog at `/blog` is where dated articles go: the monthly "What's new" roundup, release how-tos,
engineering notes, AI pieces, comparisons and measured studies. Docs pages stay in `src/content/docs`;
a framework or migration guide is a docs guide, not a post. The plan behind it is the weekly content
plan: two pieces a week, plus a monthly refresh of what already exists.

## A post is one Markdown file

`src/content/blog/<slug>.md`. The file name is the URL: `/blog/<slug>`. The frontmatter is checked by
`src/content.config.ts`:

| Field | What it is |
|---|---|
| `title` | The one `<h1>`, phrased the way people search or ask. |
| `seoTitle` | Optional `<title>`, 50-60 characters with " \| Cloudgate". |
| `description` | Meta description, 140-160 characters, unique. |
| `lede` | One or two sentences under the title that answer it outright. |
| `author` | An id from `src/data/authors.ts`: azeem, arfan, haider, taimur, musa or saladin. |
| `published` | `YYYY-MM-DD`, the day it goes live. Never a future date. |
| `updated` | `YYYY-MM-DD`, only when the content changed in substance. Never for a typo. |
| `topic` | `releases`, `guides`, `engineering`, `ai`, `comparisons` or `data` (`src/data/blog.ts`). |
| `related` | Pages on this site the post leads to, shown beside it. |
| `faq` | Questions the post answers; rendered at the end and emitted as FAQPage JSON-LD. |
| `draft` | `true` keeps it out of the build entirely. |

## What the site does with it

- The page shows the author, "Published" and, when set, "Updated", and its `BlogPosting` JSON-LD
  carries the same author and dates (Google's byline-date guidance: what readers see and what is
  marked up must match).
- It joins `/blog`, its author's page at `/blog/authors/<id>` (an author with no posts has no page),
  the feed at `/blog.xml`, `llms.txt`, the sitemap and the home page's "Latest" row, and gets its own
  share image. Nothing to wire by hand.

## Rules

- Use SearchFit (`content-brief`, then `on-page-seo`; `ai-visibility` for the lede and FAQ answers).
- Every product claim traces to `docs/product-facts.md` or the cloudgate repository, but the post
  never cites where a fact came from. State the fact itself in plain words.
- Never mention or link an ADR (architecture decision record), an internal doc (`CONTEXT.md`,
  `docs/...`, `product-facts.md`), a repository file path, or an issue or PR number. Not "per
  ADR-0084", not "the record weighs", not "see docs/adr". Write what was decided and why, directly.
- Answer first: the lede answers the title, and each `##` heading is a question or a plain claim
  with the answer in its first sentence.
- Link at least one product page, one docs page and one compare page or guide.
- Never repeat a template's page; those live only on cgt.octabyte.io.
- Move `updated` only when the facts changed. A date bump without a real change is what search
  engines penalise.
