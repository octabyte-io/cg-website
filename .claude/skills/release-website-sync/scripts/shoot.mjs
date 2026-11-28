// Console screenshot helper for the website's docs (public/docs/screens).
//
// Each shot is taken twice, dark and light, at deviceScaleFactor 2, cropped to an element (with a
// little padding) or to the viewport, converted to WebP and written as <name>-dark.webp and
// <name>-light.webp. Its manifest entry (name, title, route, description, width, height) is merged
// into public/docs/screens/manifest.json by name when close() runs, so retaking a shot keeps its
// place in the manifest and a new shot is appended.
//
// Use it from a script of your own (keep that script in the scratchpad, not in the repo):
//
//   import { openCapture } from '/home/user/cg-website/.claude/skills/release-website-sync/scripts/shoot.mjs';
//   const cap = await openCapture({ storageState: '/path/to/state.json' });
//   await cap.shoot('servers-list', '/servers', {
//     title: 'Servers', description: 'The Servers list with three Ready Servers',
//     waitFor: 'text=web-1', crop: 'main',
//   });
//   await cap.close();
//
// Options of openCapture:
//   baseURL       the console (default http://localhost:3000)
//   storageState  a signed-in Playwright storage state file (see references/screenshots.md)
//   site          the cg-website checkout (default: found from this file's location)
//   outDir        where the WebP files go (default <site>/public/docs/screens)
//   manifest      the manifest to merge into (default <outDir>/manifest.json)
//   rawDir        where raw PNGs are kept for you to look at (default $TMPDIR/cg-shots-raw)
//   mocks         API answers to fake for every shot: [{ url, method?, status?, json | body | patch }]
//                 `url` is a Playwright glob or RegExp, e.g. '**/backend/settings/about'.
//                 `json` replaces the answer; `patch(json)` takes the real answer and returns a
//                 changed one, e.g. { url: '**/backend/settings/about', patch: (a) => ({ ...a, mode: 'hosted' }) }
//
// Options of shoot(name, route, opts):
//   title, description  manifest text (required for a new shot; kept from the old entry otherwise)
//   manifestRoute       the route as the docs frame shows it, with [ids] placeholders
//                       (default: `route` with long ids replaced by [id])
//   waitFor             a selector or 'text=...' that must be visible before the shot
//   setup(page, theme)  clicks, typing, opening a dialog; runs after waitFor
//   crop                'viewport' (default), 'full', a selector string, or (page) => Locator
//   pad                 CSS px around the cropped element (default 16)
//   viewport            { width, height } (default 1440x900)
//   settle              ms to wait before shooting, for charts and fonts (default 500)
//   mocks               extra fake answers for this shot only (checked before the global ones)
//
// The shot fails, rather than writing a bad image, when the page shows "Something went wrong",
// "Application error" or a Next.js error overlay.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultSite = path.resolve(here, '../../../..');

const BAD_TEXT = ['Something went wrong', 'Application error', 'Unhandled Runtime Error'];

function guessManifestRoute(route) {
  return route
    .split('?')[0]
    .split('/')
    .map((part) => (/^[0-9a-f-]{16,}$|^[A-Za-z0-9_-]{20,}$/.test(part) ? '[id]' : part))
    .join('/');
}

export async function openCapture(options = {}) {
  const site = options.site ?? defaultSite;
  const requireFromSite = createRequire(path.join(site, 'package.json'));
  const sharp = requireFromSite('sharp');
  const { chromium } = createRequire(import.meta.url)('playwright');

  const baseURL = options.baseURL ?? 'http://localhost:3000';
  const outDir = options.outDir ?? path.join(site, 'public/docs/screens');
  const manifestPath = options.manifest ?? path.join(outDir, 'manifest.json');
  const rawDir = options.rawDir ?? path.join(os.tmpdir(), 'cg-shots-raw');
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });

  const browser = await chromium.launch();
  const entries = new Map();
  const written = [];

  async function applyMocks(context, mocks) {
    for (const mock of mocks) {
      await context.route(mock.url, async (route) => {
        if (mock.method && route.request().method() !== mock.method.toUpperCase()) return route.fallback();
        if (mock.patch) {
          const response = await route.fetch();
          const json = mock.patch(await response.json());
          return route.fulfill({ response, json });
        }
        const body = mock.json !== undefined ? JSON.stringify(mock.json) : (mock.body ?? '');
        return route.fulfill({
          status: mock.status ?? 200,
          contentType: mock.json !== undefined ? 'application/json' : (mock.contentType ?? 'text/plain'),
          body,
        });
      });
    }
  }

  async function shoot(name, route, opts = {}) {
    const viewport = opts.viewport ?? { width: 1440, height: 900 };
    const pad = opts.pad ?? 16;
    let size;
    for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({
        baseURL,
        viewport,
        deviceScaleFactor: 2,
        colorScheme: theme,
        reducedMotion: 'reduce',
        storageState: options.storageState,
      });
      // next-themes reads localStorage "theme" before the first paint.
      await context.addInitScript((t) => {
        try { localStorage.setItem('theme', t); } catch {}
      }, theme);
      // Playwright runs the most recently added route first, so per-shot mocks win.
      await applyMocks(context, options.mocks ?? []);
      await applyMocks(context, opts.mocks ?? []);

      const page = await context.newPage();
      await page.goto(route, { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: 'nextjs-portal, [data-nextjs-toast], [data-next-badge-root] { display: none !important; }' });
      if (opts.waitFor) await page.locator(opts.waitFor).first().waitFor({ state: 'visible', timeout: 20000 });
      if (opts.setup) await opts.setup(page, theme);
      await page.waitForTimeout(opts.settle ?? 500);

      const text = await page.locator('body').innerText();
      const bad = BAD_TEXT.find((t) => text.includes(t));
      if (bad) {
        await context.close();
        throw new Error(`${name} (${theme}): the page shows "${bad}"; not writing it`);
      }

      const rawFile = path.join(rawDir, `${name}-${theme}.png`);
      const crop = opts.crop ?? 'viewport';
      if (crop === 'viewport') {
        await page.screenshot({ path: rawFile });
      } else if (crop === 'full') {
        await page.screenshot({ path: rawFile, fullPage: true });
      } else {
        const locator = typeof crop === 'function' ? crop(page) : page.locator(crop).first();
        await locator.scrollIntoViewIfNeeded();
        const box = await locator.boundingBox();
        if (!box) throw new Error(`${name} (${theme}): crop target not found`);
        const pageSize = await page.evaluate(() => ({
          w: document.documentElement.scrollWidth,
          h: document.documentElement.scrollHeight,
        }));
        const x = Math.max(0, box.x - pad);
        const y = Math.max(0, box.y - pad);
        const clip = {
          x,
          y,
          width: Math.min(pageSize.w - x, box.width + pad * 2),
          height: Math.min(pageSize.h - y, box.height + pad * 2),
        };
        await page.screenshot({ path: rawFile, clip, fullPage: true });
      }
      await context.close();

      const outFile = path.join(outDir, `${name}-${theme}.webp`);
      const info = await sharp(rawFile).webp({ quality: 88, effort: 6 }).toFile(outFile);
      size = { width: info.width, height: info.height };
      written.push(outFile);
    }

    const previous = readManifest().find((e) => e.name === name) ?? {};
    const entry = {
      ...previous,
      name,
      title: opts.title ?? previous.title ?? name,
      route: opts.manifestRoute ?? previous.route ?? guessManifestRoute(route),
      description: opts.description ?? previous.description ?? '',
      width: size.width,
      height: size.height,
    };
    entries.set(name, entry);
    console.log(`shot ${name}: ${size.width}x${size.height} (raw PNGs in ${rawDir})`);
    return entry;
  }

  function readManifest() {
    return fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : [];
  }

  async function close() {
    await browser.close();
    if (!entries.size) return;
    const manifest = readManifest();
    for (const entry of entries.values()) {
      const i = manifest.findIndex((e) => e.name === entry.name);
      if (i >= 0) manifest[i] = entry;
      else manifest.push(entry);
    }
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`manifest: ${entries.size} entr${entries.size === 1 ? 'y' : 'ies'} merged into ${manifestPath}`);
  }

  return { shoot, close, written, browser };
}
