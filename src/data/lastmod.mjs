// The sitemap's <lastmod> for each page: the date of the last commit that touched the files the page
// is made from, read from git once per build (astro.config.mjs). A page whose files have no commit
// yet gets no lastmod rather than the build time. In a shallow clone every file would carry the
// latest commit's date, so there no page gets one (the deploy workflow checks out full history).
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { latestReleaseDate } from './changelog.mjs';

const ownRoot = fileURLToPath(new URL('../..', import.meta.url));

/** Files that make a page beyond its own page file: data and components only it uses. */
const extras = [
  { match: /^\/$/, files: ['src/components/home'] },
  { match: /^\/compare\/[^/]+$/, files: ['src/data/compare.ts', 'src/components/ComparePage.astro'] },
];

/** @param {string} root */
function commitDates(root) {
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

/**
 * The source files of a public path such as '/', '/pricing' or '/docs/guide/servers'.
 * @param {string} root @param {string} path
 */
function sourcesOf(root, path) {
  const p = path === '/' ? 'index' : path.replace(/^\//, '');
  const candidates = [`src/pages/${p}.astro`, `src/pages/${p}/index.astro`];
  if (p.startsWith('docs/')) candidates.push(`src/content/docs/${p.slice(5)}.mdx`);
  // A blog post is its Markdown file; the hub and the author pages change with every post.
  if (/^blog\/[^/]+$/.test(p) && p !== 'blog/authors') candidates.push(`src/content/blog/${p.slice(5)}.md`, `src/content/blog/${p.slice(5)}.mdx`);
  if (p === 'blog' || p.startsWith('blog/authors/')) candidates.push('src/content/blog', 'src/data/authors.ts');
  const own = candidates.filter((f) => existsSync(root + f));
  // A page from a dynamic route with no file of its own (an API reference group) uses the route.
  // It is made from the OpenAPI document.
  if (!own.length && p.startsWith('docs/api/')) {
    own.push('src/pages/docs/api/[group].astro', 'src/data/openapi.json', 'src/data/api-reference.ts');
  }
  return [...own, ...extras.filter((e) => e.match.test(path)).flatMap((e) => e.files)];
}

/**
 * Returns lastmod(url) for the sitemap's serialize option.
 * @param {string} [projectRoot] the repository root; default: two folders above this file
 */
export function createLastmod(projectRoot) {
  const root = projectRoot ? projectRoot.replace(/\/?$/, '/') : ownRoot;
  const dates = commitDates(root);
  const changelog = latestReleaseDate(readFileSync(`${root}src/content/changelog.md`, 'utf8'));
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
    const best = Math.max(0, ...sourcesOf(root, path).map(newest));
    return best ? new Date(best * 1000).toISOString() : undefined;
  };
}

let shared;
/**
 * The same date for one public path ('/', '/pricing', '/docs/guide/servers'), for a page's JSON-LD
 * dateModified, so search engines read the date the sitemap gives. Reads git once per build.
 * @param {string} path @returns {string | undefined} ISO date
 */
export function lastmodOf(path) {
  // Pages render from a bundle under dist/, where this module's own URL no longer points into src/,
  // so read git and the changelog from the project root the build runs in.
  shared ??= createLastmod(process.cwd());
  return shared(new URL(path || '/', 'https://cloudgate.octabyte.io').href);
}
