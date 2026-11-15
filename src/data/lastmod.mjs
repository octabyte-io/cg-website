// The sitemap's <lastmod> for each page: the date of the last commit that touched the files the page
// is made from, read from git once per build (astro.config.mjs). A page whose files have no commit
// yet gets no lastmod rather than the build time. In a shallow clone every file would carry the
// latest commit's date, so there no page gets one (the deploy workflow checks out full history).
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { latestReleaseDate } from './changelog.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));

/** Files that make a page beyond its own page file: data and components only it uses. */
const extras = [
  { match: /^\/$/, files: ['src/components/home'] },
  { match: /^\/compare\/[^/]+$/, files: ['src/data/compare.ts', 'src/components/ComparePage.astro'] },
];

function commitDates() {
  /** @type {Map<string, number>} newest commit time per file, in seconds */
  const dates = new Map();
  try {
    if (execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: root, encoding: 'utf8' }).trim() !== 'false') {
      return dates;
    }
    const log = execFileSync('git', ['log', '--format=%x00%ct', '--name-only', '--no-renames', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    let date = 0;
    for (const line of log.split('\n')) {
      if (line.startsWith('\0')) date = Number(line.slice(1));
      else if (line && !dates.has(line)) dates.set(line, date);
    }
  } catch {
    // Not a git checkout: no lastmod at all.
  }
  return dates;
}

/** The source files of a public path such as '/', '/pricing' or '/docs/guide/servers'. */
function sourcesOf(path) {
  const p = path === '/' ? 'index' : path.replace(/^\//, '');
  const candidates = [`src/pages/${p}.astro`, `src/pages/${p}/index.astro`];
  if (p.startsWith('docs/')) candidates.push(`src/content/docs/${p.slice(5)}.mdx`);
  const own = candidates.filter((f) => existsSync(root + f));
  // A page from a dynamic route with no file of its own (an API reference group) uses the route.
  // It is made from the OpenAPI document.
  if (!own.length && p.startsWith('docs/api/')) {
    own.push('src/pages/docs/api/[group].astro', 'src/data/openapi.json', 'src/data/api-reference.ts');
  }
  return [...own, ...extras.filter((e) => e.match.test(path)).flatMap((e) => e.files)];
}

/** Returns lastmod(url) for the sitemap's serialize option. */
export function createLastmod() {
  const dates = commitDates();
  const changelog = latestReleaseDate();
  const newest = (source) => {
    let best = 0;
    for (const [file, date] of dates) {
      if ((file === source || file.startsWith(`${source}/`)) && date > best) best = date;
    }
    return best;
  };
  /** @param {string} url @returns {string | undefined} ISO date */
  return (url) => {
    const path = new URL(url).pathname.replace(/(.)\/$/, '$1');
    if (path === '/changelog') return changelog?.toISOString();
    if (!dates.size) return undefined;
    const best = Math.max(0, ...sourcesOf(path).map(newest));
    return best ? new Date(best * 1000).toISOString() : undefined;
  };
}
