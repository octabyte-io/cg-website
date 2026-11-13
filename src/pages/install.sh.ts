// Serves https://cloudgate.octabyte.io/install.sh, so a Self-hosted install is one command:
//
//     curl -fsSL https://cloudgate.octabyte.io/install.sh | sudo sh
//
// GitHub Pages cannot answer with an HTTP redirect, and an HTML redirect means nothing to curl, so
// the site copies the script from the cloudgate repository at build time. The repository stays the
// one source: this file holds no script of its own, and a build that cannot fetch it fails rather
// than publish a stale or empty installer. The deploy workflow rebuilds when the cloudgate repository sends
// `install-script-updated`, so a change there reaches this URL.
import type { APIRoute } from 'astro';
import { site } from '../data/site';

export const INSTALL_SCRIPT_SOURCE = `${site.sourceUrl!.replace('https://github.com/', 'https://raw.githubusercontent.com/')}/main/install.sh`;

export const GET: APIRoute = async () => {
  const response = await fetch(INSTALL_SCRIPT_SOURCE);
  if (!response.ok) {
    throw new Error(`install.sh: ${INSTALL_SCRIPT_SOURCE} answered ${response.status}`);
  }
  const script = await response.text();
  if (!script.startsWith('#!/bin/sh')) {
    throw new Error(`install.sh: ${INSTALL_SCRIPT_SOURCE} did not return a shell script`);
  }
  return new Response(script, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
