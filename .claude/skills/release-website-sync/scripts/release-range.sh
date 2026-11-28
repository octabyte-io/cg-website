#!/usr/bin/env bash
# Works out which Cloudgate releases the website does not cover yet, and writes a report of what
# changed in them: CHANGELOG sections, CLI CHANGELOG sections, commits, and changed files grouped by
# area. Run from the cg-website root.
#
#   release-range.sh                 # from the site's version to the newest release
#   release-range.sh v0.3.14         # ... to a named release
#   release-range.sh v0.3.12 v0.3.14 # an explicit range
#
# Env: CLOUDGATE_DIR (default ../cloudgate), OUT (default $TMPDIR/release-range-<to>.md)
set -euo pipefail

SITE=$(pwd)
CG=${CLOUDGATE_DIR:-$SITE/../cloudgate}
[ -f "$SITE/src/data/schema.ts" ] || { echo "run this from the cg-website root" >&2; exit 2; }
[ -d "$CG/.git" ] || { echo "no cloudgate checkout at $CG (set CLOUDGATE_DIR)" >&2; exit 2; }

git -C "$CG" fetch --tags --quiet origin 2>/dev/null || echo "warning: could not fetch cloudgate tags; using local ones" >&2

# The version the site covers: schema.ts softwareVersion, cross-checked with the changelog's newest heading.
site_version=$(grep -oE "softwareVersion: *'[^']+'" "$SITE/src/data/schema.ts" | grep -oE "[0-9]+\.[0-9]+\.[0-9]+[^']*" || true)
changelog_version=$(grep -m1 -oE '^## [0-9]+\.[0-9]+\.[0-9]+' "$SITE/src/content/changelog.md" | cut -c4- || true)
site_cli=$(grep -oE '\*\*[0-9]+\.[0-9]+\.[0-9]+\*\* is the current release' "$SITE/docs/product-facts.md" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || true)

# Stable server tags, newest first (vX.Y.Z only; rc and cli-v tags excluded).
stable_tags=$(git -C "$CG" tag --list 'v*' | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | sort -V -r)
rc_tags=$(git -C "$CG" tag --list 'v*-rc.*' | sort -V -r)
newest_dated=$(grep -m1 -oE '^## [0-9]+\.[0-9]+\.[0-9]+ \([0-9-]+\)' "$CG/CHANGELOG.md" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || true)

resolve_ref() { # version or tag -> a ref that exists (stable tag, else its newest rc)
  local v=${1#v}
  if git -C "$CG" rev-parse -q --verify "refs/tags/v$v" >/dev/null; then echo "v$v"; return; fi
  local rc; rc=$(echo "$rc_tags" | grep -E "^v$v-rc\." | head -1 || true)
  if [ -n "$rc" ]; then echo "$rc"; return; fi
  echo ""
}

from=${1:-}
to=${2:-}
if [ -n "$from" ] && [ -z "$to" ]; then to=$from; from=""; fi
from=${from:-v$site_version}
if [ -z "$to" ]; then
  # Newest shipped release: the newest dated CHANGELOG version if it has a tag or rc, else the newest stable tag.
  if [ -n "$newest_dated" ] && [ -n "$(resolve_ref "$newest_dated")" ]; then to="v$newest_dated"; else to=$(echo "$stable_tags" | head -1); fi
fi

from_ref=$(resolve_ref "$from"); to_ref=$(resolve_ref "$to")
[ -n "$from_ref" ] || { echo "no tag for the site's version $from in cloudgate" >&2; exit 1; }
[ -n "$to_ref" ] || { echo "no tag or release candidate for $to in cloudgate" >&2; exit 1; }

OUT=${OUT:-${TMPDIR:-/tmp}/release-range-${to#v}.md}
from_v=${from#v}; to_v=${to#v}

section_range() { # print CHANGELOG sections with versions in (from, to]
  awk -v from="$1" -v to="$2" '
    function cmp(a, b,   x, y, i) { split(a, x, "."); split(b, y, "."); for (i = 1; i <= 3; i++) { if (x[i]+0 < y[i]+0) return -1; if (x[i]+0 > y[i]+0) return 1 } return 0 }
    /^## / { v = $2; keep = (v ~ /^[0-9]+\.[0-9]+\.[0-9]+$/ && cmp(v, from) > 0 && cmp(v, to) <= 0) }
    keep { print }
  ' "$3"
}

{
  echo "# Release range for the website"
  echo
  echo "- Site covers: schema.ts **$site_version**, changelog.md **${changelog_version:-?}**, CLI in product-facts **${site_cli:-?}**"
  echo "- Range: **$from_ref .. $to_ref** ($(git -C "$CG" rev-list --count "$from_ref..$to_ref") commits)"
  [ "$to_ref" != "v$to_v" ] && echo "- Note: no v$to_v tag yet; using release candidate $to_ref (a version is promoted from its rc's commit)."
  [ "$site_version" != "${changelog_version:-$site_version}" ] && echo "- Warning: schema.ts and changelog.md disagree on the site's version."
  newer_rc=$(echo "$rc_tags" | head -1)
  [ -n "$newer_rc" ] && echo "- Newest release candidate: $newer_rc (not shipped unless CHANGELOG dates it)"
  echo "- Newest stable tags: $(echo "$stable_tags" | head -3 | tr '\n' ' ')"
  echo "- cloudgate main is $(git -C "$CG" rev-parse --short origin/main 2>/dev/null || git -C "$CG" rev-parse --short HEAD); $(git -C "$CG" rev-list --count "$to_ref..origin/main" 2>/dev/null || echo '?') commits after $to_ref (unreleased: do not document)"
  echo
  echo "## Server CHANGELOG sections in range"
  echo
  section_range "$from_v" "$to_v" "$CG/CHANGELOG.md"
  echo
  echo "## CLI CHANGELOG sections newer than ${site_cli:-the site version}"
  echo
  if [ -n "$site_cli" ]; then section_range "$site_cli" "999.0.0" "$CG/cli/CHANGELOG.md"; else echo "(could not read the site's CLI version)"; fi
  echo "CLI tags: $(git -C "$CG" tag --list 'cli-v*' | sort -V -r | head -3 | tr '\n' ' ')"
  echo
  echo "## Commits"
  echo
  echo '```'
  git -C "$CG" log --no-merges --format='%h %ad %s' --date=short "$from_ref..$to_ref"
  echo '```'
  echo
  echo "## Files changed, by area"
  echo
  echo "Diffstat excludes tests. Open the source of every area that a reader can see."
  echo
  area() { # title, pathspecs...
    local title=$1; shift
    local stat; stat=$(git -C "$CG" diff --stat=200 "$from_ref..$to_ref" -- "$@" ':(exclude)*.test.ts' ':(exclude)*.test.tsx' ':(exclude)*.spec.ts' ':(exclude)*.e2e-spec.ts' | sed '$d' || true)
    [ -z "$stat" ] && return
    echo "### $title"; echo; echo '```'; echo "$stat"; echo '```'; echo
  }
  area "Console routes" frontend/src/app
  area "Console features" frontend/src/features
  area "Console shared components and lib" frontend/src/components frontend/src/lib
  area "Backend" backend/src
  area "Database migrations" backend/drizzle
  area "API contract (regenerate the API reference if this changed)" backend/openapi.json api-schemas
  area "CLI" cli/src cli/package.json
  area "Install and deploy" install.sh deploy
  area "Glossary and docs" CONTEXT.md README.md docs SECURITY.md
} > "$OUT"

echo "Report: $OUT"
echo "Range: $from_ref .. $to_ref"
