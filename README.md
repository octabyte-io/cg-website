# cg-website

The public Cloudgate website, to be served at **https://cloudgate.octabyte.io** from GitHub Pages.
It is a static [Astro](https://astro.build) site: every page is plain HTML, with no client
JavaScript unless an interaction needs it.

## Commands

Node 22 or newer and pnpm.

| Command | What it does |
|---|---|
| `pnpm install` | Install dependencies. |
| `pnpm dev` | Local server at http://localhost:4321 with live reload. |
| `pnpm build` | Type-check (`astro check`) and build the site into `dist/`. |
| `pnpm preview` | Serve the built `dist/` locally. |

## Layout

```
src/
  pages/             one file per page; robots.txt, llms.txt and llms-full.txt are generated here
  layouts/Base.astro the page shell: <head>, header, footer
  components/        Seo (metadata and JSON-LD), Header, Footer, PageHero, Faq, CtaBand, Mark
  data/site.ts       addresses, prices and plans, in one place
  data/templates.json  a few catalogue apps for the home page's featured row
  styles/global.css  design tokens and shared classes; the only file with literal colours
public/              favicon, Open Graph image, template logos, CNAME
docs/design.md       the design plan: audience, tokens, layout rules, what to avoid
docs/product-facts.md  what the site may claim, traced to the cloudgate repository
```

Read `docs/design.md` and `docs/product-facts.md` before changing a page.

## Things to change in one place

- **Prices and plans:** `src/data/site.ts` (`plans`, `addOn`, `trialDays`).
- **Console address and deploy links:** `site.console`, `site.getStarted`, `deployUrl()`.
- **Templates website address:** `site.templatesSite` (https://cgt.octabyte.io). Template pages live
  only there; this site links to it and never repeats a template's page.
- **Source repository:** `site.sourceUrl` is `null` while the cloudgate repository is private.
  Set it to the repository's URL and the Self-host page shows the clone-and-install steps.

## Publishing

GitHub Pages is not turned on yet. When it is:

1. In the repository settings, under Pages, set the source to **GitHub Actions**.
2. Add a DNS `CNAME` record for `cloudgate.octabyte.io` pointing at `octabyte-io.github.io`.
   `public/CNAME` already names the domain.
3. Run the **Deploy to GitHub Pages** workflow, or add `push: { branches: [main] }` to
   `.github/workflows/deploy.yml` to deploy every change to `main`.
