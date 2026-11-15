// Per-page social share images (Open Graph and Twitter), 1200x630, drawn at build time.
//
// How it works: Seo.astro points every indexable page's og:image at /og/<page path>.png
// (`ogImagePath`). After the build, the `ogImages` integration (astro.config.mjs) reads each built
// page, takes its og:title and its BreadcrumbList, and draws the card with satori and
// resvg over a background drawn once, compressed by sharp (already Astro's image library), into
// dist/og/. A new page needs nothing: if it renders <Seo> (every layout does) it gets its card.
// The home page and noindex pages keep the hand-made public/og/default.png; a page can also pass
// its own `image` to <Base>. Colours come from src/styles/global.css; fonts are static instances of
// the site's variable fonts in src/og/fonts (scripts/og-fonts.py makes them).
import { readFile, readdir, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { availableParallelism } from 'node:os';

export const OG_DEFAULT = '/og/default.png';
const SITE_NAME = 'Cloudgate';

/** The share image path for a page's public path ('/' or '/x/y'). */
export function ogImagePath(path) {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/og/${clean}.png` : OG_DEFAULT;
}

/**
 * What the card says: the page title without the " | Cloudgate" suffix, and an eyebrow from the
 * breadcrumb trail (the sections between Home and the page, or the page's own name on a top-level
 * page when it differs from the headline). Seo.astro uses it for og:image:alt, the integration to
 * draw the card, so the alt text always matches the image.
 * @param {string} fullTitle
 * @param {string[]} trail breadcrumb names, Home first
 */
export function cardText(fullTitle, trail = []) {
  const headline = fullTitle.replace(new RegExp(`\\s*\\|\\s*${SITE_NAME}$`), '').trim();
  const middle = trail.slice(1, -1);
  const own = trail.length === 2 ? trail[1] : '';
  const eyebrow = middle.length
    ? middle.join(' / ')
    : own && !headline.toLowerCase().startsWith(own.toLowerCase()) && !headline.toLowerCase().includes(own.toLowerCase())
      ? own
      : '';
  const named = headline.includes(SITE_NAME);
  const alt = named ? (eyebrow ? `${eyebrow}: ${headline}` : headline) : `${SITE_NAME}${eyebrow ? ` ${eyebrow}` : ''}: ${headline}`;
  return { headline, eyebrow, alt };
}

// ---------------------------------------------------------------------------------------------
// Drawing

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');

async function tokens() {
  const css = await readFile(join(root, 'src/styles/global.css'), 'utf8');
  const first = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));
  /** @type {Record<string, string>} */
  const t = {};
  for (const m of first.matchAll(/--([\w-]+):\s*([^;]+);/g)) t[m[1]] = m[2].trim();
  return t;
}

/** The beam through the keyhole, as a blurred SVG band, rasterised once as the card background. */
function backgroundSvg(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t['beam-a']}" stop-opacity="0.15"/>
      <stop offset="0.35" stop-color="${t['beam-a']}" stop-opacity="0.75"/>
      <stop offset="0.7" stop-color="${t['beam-b']}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${t['beam-c']}" stop-opacity="0.25"/>
    </linearGradient>
    <filter id="b" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="46"/></filter>
  </defs>
  <rect width="1200" height="630" fill="${t['night-2']}"/>
  <polygon points="900,-60 1060,-60 960,700 760,700" fill="url(#g)" filter="url(#b)" opacity="0.8"/>
</svg>`;
}

async function markDataUri(t) {
  const svg = (await readFile(join(root, 'public/cloudgate-mark.svg'), 'utf8')).replace(/#6d57e0/g, t['slice-1']);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/** Satori nodes without JSX. */
const h = (type, style, children) => ({ type, props: { style, children } });

function cardTree({ headline, eyebrow, url }, t, mark) {
  const size = headline.length <= 26 ? 88 : headline.length <= 44 ? 74 : 62;
  return h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      padding: '72px 80px 64px',
      color: t['night-ink'],
      fontFamily: 'Geist',
    },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: 22 }, [
        { type: 'img', props: { src: mark, width: 80, height: 51, style: { width: 80, height: 51 } } },
        h('div', { fontSize: 36, fontWeight: 600, letterSpacing: '-0.01em' }, SITE_NAME),
      ]),
      h('div', { display: 'flex', gap: 10, marginTop: 64 }, [
        h('div', { width: 64, height: 9, borderRadius: 5, backgroundColor: t['slice-1'] }, ''),
        h('div', { width: 64, height: 9, borderRadius: 5, backgroundColor: t['slice-2'] }, ''),
        h('div', { width: 64, height: 9, borderRadius: 5, backgroundColor: t['slice-3'] }, ''),
      ]),
      eyebrow
        ? h('div', { marginTop: 30, fontSize: 30, fontWeight: 600, color: t['night-brand'] }, eyebrow)
        : h('div', { marginTop: 14 }, ''),
      h(
        'div',
        {
          marginTop: 14,
          maxWidth: 940,
          fontFamily: 'Bricolage Grotesque',
          fontWeight: 650,
          fontSize: size,
          lineHeight: 1.06,
          letterSpacing: '-0.025em',
          display: 'block',
          lineClamp: 3,
        },
        headline,
      ),
      h('div', { marginTop: 'auto', fontSize: 26, color: t['night-muted'] }, url),
    ],
  );
}

/** Make a renderer: loads fonts, tokens, the mark and the background once. */
export async function createRenderer() {
  const [{ default: satori }, { Resvg }, { default: sharp }] = await Promise.all([
    import('satori'),
    import('@resvg/resvg-js'),
    import('sharp'),
  ]);
  const font = (f) => readFile(join(here, 'fonts', f));
  const [display, text, textBold, t] = await Promise.all([
    font('bricolage-grotesque-650.ttf'),
    font('geist-400.ttf'),
    font('geist-600.ttf'),
    tokens(),
  ]);
  const fonts = [
    { name: 'Bricolage Grotesque', data: display, weight: 650, style: 'normal' },
    { name: 'Geist', data: text, weight: 400, style: 'normal' },
    { name: 'Geist', data: textBold, weight: 600, style: 'normal' },
  ];
  // The beam is the slow part to draw (a large blur), so it is drawn once and each card's text and
  // mark are laid over it.
  const bg = new Resvg(backgroundSvg(t)).render().asPng();
  const mark = await markDataUri(t);
  /** @param {{ headline: string, eyebrow: string, url: string }} card */
  return async (card) => {
    const svg = await satori(cardTree(card, t, mark), { width: 1200, height: 630, fonts });
    const fg = new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();
    // resvg writes large, lightly compressed PNGs (~250 KB); sharp brings a card to ~50 KB.
    const { data, info } = await sharp(bg).composite([{ input: fg }]).raw().toBuffer({ resolveWithObject: true });
    return sharp(data, { raw: info }).removeAlpha().png({ compressionLevel: 9, effort: 10 }).toBuffer();
  };
}

// ---------------------------------------------------------------------------------------------
// Reading built pages

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const meta = (html, prop) => {
  const m = html.match(new RegExp(`<meta property="${prop}" content="([^"]*)"`));
  return m ? decode(m[1]) : undefined;
};

/** Breadcrumb names (Home first) from the page's JSON-LD. */
export function trailFromHtml(html) {
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      const nodes = data['@graph'] ?? [data];
      const crumbs = nodes.find((n) => n['@type'] === 'BreadcrumbList');
      if (crumbs) return crumbs.itemListElement.map((i) => i.name);
    } catch {}
  }
  return [];
}

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const exists = (p) => access(p).then(() => true, () => false);

/** @returns {import('astro').AstroIntegration} */
export default function ogImages() {
  return {
    name: 'cloudgate-og-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const started = performance.now();
        const render = await createRenderer();
        /** @type {{ target: string, card: { headline: string, eyebrow: string, url: string } }[]} */
        const jobs = [];
        for await (const file of htmlFiles(out)) {
          const html = await readFile(file, 'utf8');
          const image = meta(html, 'og:image');
          if (!image) continue;
          const { pathname } = new URL(image);
          if (pathname === OG_DEFAULT || !pathname.startsWith('/og/')) continue;
          const target = join(out, decodeURIComponent(pathname));
          // An image the page brings itself (public/og/...) is left alone.
          if (await exists(target)) continue;
          const { headline, eyebrow } = cardText(meta(html, 'og:title') ?? SITE_NAME, trailFromHtml(html));
          const url = (meta(html, 'og:url') ?? '').replace(/^https?:\/\//, '');
          jobs.push({ target, card: { headline, eyebrow, url } });
        }
        // PNG compression runs on sharp's thread pool, so draw a few cards at once.
        const workers = Math.max(2, availableParallelism());
        let next = 0;
        await Promise.all(
          Array.from({ length: workers }, async () => {
            while (next < jobs.length) {
              const { target, card } = jobs[next++];
              await mkdir(dirname(target), { recursive: true });
              await writeFile(target, await render(card));
            }
          }),
        );
        logger.info(`${jobs.length} share images in ${Math.round(performance.now() - started)}ms`);
      },
    },
  };
}
