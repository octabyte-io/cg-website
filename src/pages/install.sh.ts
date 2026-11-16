// Serves https://cloudgate.octabyte.io/install.sh, so a Self-hosted install is one command:
//
//     curl -fsSL https://cloudgate.octabyte.io/install.sh | sudo sh
//
// GitHub Pages cannot answer with an HTTP redirect, and an HTML redirect means nothing to curl, so
// the site copies the script from the cloudgate repository at build time. The repository stays the
// one source: this file holds no script of its own, and a build that cannot fetch it fails rather
// than publish a stale or empty installer. The deploy workflow rebuilds when the cloudgate repository sends
// `install-script-updated`, so a change there reaches this URL.
//
// The script is fetched at one commit, never at `main`: raw.githubusercontent.com caches a branch's
// file for five minutes, and the rebuild starts seconds after the push, so a fetch of `main` could
// publish the version before it. The commit is INSTALL_SCRIPT_SHA, which the deploy workflow takes
// from the event's client_payload.sha; any other build asks the GitHub API for main's head commit.
import type { APIRoute } from 'astro';
import { site } from '../data/site';

const repo = site.sourceUrl!.replace('https://github.com/', '');
const isSha = (value: string) => /^[0-9a-f]{40}$/.test(value);

async function mainHeadSha(): Promise<string> {
  const url = `https://api.github.com/repos/${repo}/commits/main`;
  const headers: Record<string, string> = { Accept: 'application/vnd.github.sha' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`install.sh: ${url} answered ${response.status}`);
  const sha = (await response.text()).trim();
  if (!isSha(sha)) throw new Error(`install.sh: ${url} did not return a commit SHA`);
  return sha;
}

export const GET: APIRoute = async () => {
  const pinned = process.env.INSTALL_SCRIPT_SHA?.trim();
  if (pinned && !isSha(pinned)) {
    throw new Error(`install.sh: INSTALL_SCRIPT_SHA is not a full commit SHA: ${pinned}`);
  }
  const sha = pinned || (await mainHeadSha());
  const source = `https://raw.githubusercontent.com/${repo}/${sha}/install.sh`;
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`install.sh: ${source} answered ${response.status}`);
  }
  const script = await response.text();
  if (!script.startsWith('#!/bin/sh')) {
    throw new Error(`install.sh: ${source} did not return a shell script`);
  }
  console.log(`install.sh: copied from ${repo} at ${sha}`);
  return new Response(script, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
