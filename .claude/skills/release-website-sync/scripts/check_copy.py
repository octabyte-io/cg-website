#!/usr/bin/env python3
"""Checks the website's published copy after a release sync. Run from the cg-website root.

    python3 .claude/skills/release-website-sync/scripts/check_copy.py 0.3.14 [--cli 0.1.2]

FAIL (exit 1): things that must never ship.
  - ADR / decision-record references, issue or PR numbers and links, internal repo documents and
    source paths in published copy (src/content, src/pages, src/components, src/data except
    openapi.json, which is generated and reported separately).
  - SearchFit promotion anywhere in src/ or public/.
  - The server version anchors (schema.ts softwareVersion, the llms.txt "latest ... version" line)
    not at the new version; the CLI anchor in docs/product-facts.md not at --cli when given.
  - A <Screenshot name="..."> with no dark/light image or no manifest entry.

REVIEW (printed, exit 0): things a person should look at.
  - Every other mention of an older server or CLI version (many are rightful history: "since 0.3.9").
  - "open source" (fine when it describes a competitor, never Cloudgate).
  - Screenshot images that no page uses, manifest entries with no image.
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path.cwd()
if not (ROOT / "src/data/schema.ts").exists():
    sys.exit("run this from the cg-website root")

ap = argparse.ArgumentParser()
ap.add_argument("version", help="the new server version, e.g. 0.3.14")
ap.add_argument("--cli", help="the current CLI version, e.g. 0.1.2")
args = ap.parse_args()
new_v = args.version.lstrip("v")

PUBLISHED = [ROOT / "src/content", ROOT / "src/pages", ROOT / "src/components", ROOT / "src/data", ROOT / "src/layouts"]
EXTS = {".md", ".mdx", ".astro", ".ts", ".tsx", ".mjs", ".js", ".json"}
GENERATED = {ROOT / "src/data/openapi.json"}

fails, reviews = [], []


def files(roots, exts=EXTS):
    for root in roots:
        if root.is_file():
            yield root
            continue
        for p in sorted(root.rglob("*")):
            if p.is_file() and p.suffix in exts:
                yield p


def rel(p):
    return str(p.relative_to(ROOT))


RULES = [
    ("ADR or decision record", re.compile(r"\bADR[- ]?\d{1,4}\b|docs/adr|\bdecision records?\b|\bADRs?\b")),
    ("issue or PR link", re.compile(r"github\.com/octabyte-io/[\w.-]+/(issues|pull)/\d+")),
    ("issue or PR number", re.compile(r"(?:^|[\s(\[,;])#\d{2,4}(?:[–-]#?\d{2,4})?\b(?![0-9a-fA-F])")),
    ("internal repo document", re.compile(r"\bCONTEXT\.md\b|\bCODING_STANDARDS\b|product-facts\.md|\bdocs/(?:deploy|testing|design|adr)[\w/.-]*")),
    ("repo source path", re.compile(r"\b(?:frontend|backend|cli)/src/[\w/.-]+|\bfrontend/docs/[\w/.-]+")),
]
# Lines that legitimately look like the rules: CSS colours, code comments that explain the site itself.
CSS_COLOUR = re.compile(r"#[0-9a-fA-F]{3,8}\b\s*[;,)]|color|fill|stroke|background|gradient|mask|shadow|border|^\s*[a-z-]+\s*:\s")

for p in files(PUBLISHED):
    if p in GENERATED:
        continue
    text = p.read_text(encoding="utf-8", errors="replace")
    for n, line in enumerate(text.splitlines(), 1):
        stripped = line.strip()
        is_comment = stripped.startswith(("//", "/*", "*", "<!--", "{/*"))
        for label, rx in RULES:
            if not rx.search(line):
                continue
            if label == "issue or PR number" and p.suffix not in {".md", ".mdx"} and CSS_COLOUR.search(line):
                continue
            # Code comments in .ts/.astro are not published copy; report them for review instead.
            # Data modules hold both printed strings and notes for maintainers (legalTodo); a person decides.
            in_data = p.suffix in {".ts", ".mjs", ".js", ".json"} and not rel(p).startswith("src/pages/")
            if p.suffix in {".md", ".mdx"} or not (is_comment or in_data):
                fails.append(f"{label}: {rel(p)}:{n}: {stripped[:160]}")
            else:
                reviews.append(f"{label} (comment or data module: is it printed?): {rel(p)}:{n}: {stripped[:160]}")

# The generated API reference: anything ADR-like there comes from backend descriptions; filter it in build.py.
oa = ROOT / "src/data/openapi.json"
if oa.exists():
    hits = len(re.findall(r"\bADR-\d{1,4}\b|\(#\d{2,4}\)", oa.read_text(encoding="utf-8")))
    if hits:
        fails.append(f"src/data/openapi.json has {hits} ADR/issue references from backend descriptions; strip them in scripts/api-reference/build.py")

# SearchFit promotion.
for p in files([ROOT / "src", ROOT / "public"], EXTS | {".html", ".txt", ".xml"}):
    if re.search(r"searchfit", p.read_text(encoding="utf-8", errors="replace"), re.I):
        fails.append(f"SearchFit promotion: {rel(p)}")

# Version anchors.
schema = (ROOT / "src/data/schema.ts").read_text()
m = re.search(r"softwareVersion:\s*'([^']+)'", schema)
if not m or m.group(1) != new_v:
    fails.append(f"src/data/schema.ts softwareVersion is {m.group(1) if m else 'missing'}, expected {new_v}")
llms = (ROOT / "src/pages/llms.txt.ts").read_text()
m = re.search(r"latest Cloudgate server version is ([0-9.]+[0-9])", llms)
if m and m.group(1) != new_v:
    fails.append(f"src/pages/llms.txt.ts says the latest server version is {m.group(1)}, expected {new_v}")
facts = (ROOT / "docs/product-facts.md").read_text()
site_cli = re.search(r"\*\*([0-9]+\.[0-9]+\.[0-9]+)\*\* is the current release", facts)
cli_v = args.cli.lstrip("v") if args.cli else (site_cli.group(1) if site_cli else None)
if args.cli and (not site_cli or site_cli.group(1) != cli_v):
    fails.append(f"docs/product-facts.md says the CLI is {site_cli.group(1) if site_cli else '?'}, expected {cli_v}")


def vt(v):
    return tuple(int(x) for x in v.split("."))


major_minor = ".".join(new_v.split(".")[:2])
server_rx = re.compile(r"(?<![\d.])v?(" + re.escape(major_minor) + r"\.\d+)(?![\d])")
for p in files([ROOT / "src/pages", ROOT / "src/content/docs", ROOT / "src/components", ROOT / "src/data"]):
    if p in GENERATED:
        continue
    for n, line in enumerate(p.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
        for v in server_rx.findall(line):
            if vt(v) < vt(new_v):
                reviews.append(f"older server version {v}: {rel(p)}:{n}: {line.strip()[:140]}")
        if cli_v:
            for v in re.findall(r"(?<![\d.])(0\.[01]\.\d+)(?![\d])", line):
                if "cli" in line.lower() or "cloudgate@" in line or "npm" in line:
                    if vt(v) < vt(cli_v):
                        reviews.append(f"older CLI version {v}: {rel(p)}:{n}: {line.strip()[:140]}")
        if re.search(r"open[- ]source", line, re.I):
            reviews.append(f"'open source' (Cloudgate is source-available): {rel(p)}:{n}: {line.strip()[:140]}")

# Screenshots.
screens = ROOT / "public/docs/screens"
manifest = {e["name"] for e in json.loads((screens / "manifest.json").read_text())}
used = set()
for p in files([ROOT / "src"], {".mdx", ".md", ".astro", ".ts"}):
    for name in re.findall(r"<Screenshot[^>]*\bname=\"([^\"]+)\"", p.read_text(encoding="utf-8")):
        used.add(name)
        missing = [t for t in ("dark", "light") if not (screens / f"{name}-{t}.webp").exists()]
        if missing:
            fails.append(f"screenshot {name} used in {rel(p)} has no {'/'.join(missing)} image")
        if name not in manifest:
            fails.append(f"screenshot {name} used in {rel(p)} has no manifest entry")
images = {re.sub(r"-(dark|light)\.webp$", "", f.name) for f in screens.glob("*.webp")}
for name in sorted(images - used):
    reviews.append(f"screenshot image not used by any page: public/docs/screens/{name}-*.webp")
for name in sorted(manifest - images):
    reviews.append(f"manifest entry with no image: {name}")

for line in reviews:
    print("REVIEW", line)
for line in fails:
    print("FAIL  ", line)
print(f"\n{len(fails)} to fix, {len(reviews)} to review")
sys.exit(1 if fails else 0)
