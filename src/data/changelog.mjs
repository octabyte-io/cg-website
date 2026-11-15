// Release dates from src/content/changelog.md, shared by the changelog feed (src/pages/changelog.xml.ts)
// and the sitemap's lastmod (astro.config.mjs). A release is a "## " heading; its date, when it has
// one, is in brackets at the end: "## 0.2.0: the platform (13 November 2026)".
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const changelogFile = fileURLToPath(new URL('../content/changelog.md', import.meta.url));

/** @param {string} heading @returns {Date | undefined} */
export function releaseDate(heading) {
  const m = heading.match(/\((\d{1,2} [A-Z][a-z]+ \d{4})\)\s*$/);
  if (!m) return undefined;
  const d = new Date(`${m[1]} 12:00 UTC`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** The newest dated release in the changelog. */
export function latestReleaseDate(markdown = readFileSync(changelogFile, 'utf8')) {
  const dates = [...markdown.matchAll(/^## (.+)$/gm)].map((m) => releaseDate(m[1])).filter(Boolean);
  return dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;
}
