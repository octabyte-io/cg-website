// Docs interactions: heading links, copy buttons, tabs, screenshot zoom, the contents marker and
// search. Each only adds behaviour on top of complete HTML: without this script every panel shows,
// every screenshot is visible and every page is reachable from the sidebar.

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Close a <dialog> after its exit animation (or at once with reduced motion). */
function closeAnimated(d: HTMLDialogElement, ms: number): void {
  if (!d.open || d.classList.contains('is-closing')) return;
  if (reduced) return d.close();
  d.classList.add('is-closing');
  setTimeout(() => {
    d.classList.remove('is-closing');
    d.close();
  }, ms);
}

// ---- Heading links ----
for (const h of document.querySelectorAll<HTMLElement>('.doc-body :is(h2, h3)[id]')) {
  if (h.closest('summary')) continue;
  const a = document.createElement('a');
  a.className = 'h-anchor';
  a.href = `#${h.id}`;
  a.textContent = '#';
  a.setAttribute('aria-label', `Link to “${h.textContent?.trim()}”`);
  h.append(a);
}

// ---- Tables scroll inside a frame ----
for (const t of document.querySelectorAll<HTMLTableElement>('.doc-body table')) {
  if (t.parentElement?.classList.contains('table-scroll')) continue;
  const w = document.createElement('div');
  w.className = 'table-scroll';
  t.replaceWith(w);
  w.append(t);
}

// ---- Copy buttons on code ----
const copyIcon =
  '<svg class="copy" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M7 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1.5v-1.8H16a.2.2 0 0 0 .2-.2V4a.2.2 0 0 0-.2-.2H7a.2.2 0 0 0-.2.2v.5H5V4a2 2 0 0 1 2-2ZM4 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 1.8a.2.2 0 0 0-.2.2v8c0 .1.1.2.2.2h9a.2.2 0 0 0 .2-.2V8a.2.2 0 0 0-.2-.2H4Z"/></svg>' +
  '<svg class="ok" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="m8 13.4 7.6-7.6 1.3 1.3L8 16 3.1 11.1l1.3-1.3L8 13.4Z"/></svg>';
for (const pre of document.querySelectorAll<HTMLPreElement>('.doc-body pre')) {
  const wrap = document.createElement('div');
  wrap.className = 'code-wrap';
  const lang = pre.dataset.language;
  if (lang && !['plaintext', 'text', 'txt'].includes(lang)) wrap.dataset.lang = lang;
  pre.replaceWith(wrap);
  wrap.append(pre);
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-btn';
  btn.setAttribute('aria-label', 'Copy code');
  btn.innerHTML = copyIcon;
  let timer = 0;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ''));
      btn.classList.add('is-done');
      btn.setAttribute('aria-label', 'Copied');
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        btn.classList.remove('is-done');
        btn.setAttribute('aria-label', 'Copy code');
      }, 1600);
    } catch {}
  });
  wrap.append(btn);
}

// ---- Tabs ----
const TAB_KEY = 'cg-docs-tabs';
let remembered: Record<string, string> = {};
try {
  remembered = JSON.parse(localStorage.getItem(TAB_KEY) ?? '{}');
} catch {}
const tabSets: { group: string; select: (label: string, animate: boolean) => void }[] = [];
document.querySelectorAll<HTMLElement>('.tabs').forEach((root, n) => {
  const list = root.querySelector<HTMLElement>('.tabs-list');
  const panels = Array.from(root.querySelectorAll<HTMLElement>(':scope > .tabs-panels > .tab-panel'));
  if (!list || panels.length < 2) return;
  const group = root.dataset.tabs ?? '';
  const ink = document.createElement('span');
  ink.className = 'tabs-ink';
  const buttons = panels.map((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.role = 'tab';
    b.id = `tab-${n}-${i}`;
    b.textContent = p.dataset.label ?? `Option ${i + 1}`;
    p.role = 'tabpanel';
    p.id = `panel-${n}-${i}`;
    p.setAttribute('aria-labelledby', b.id);
    b.setAttribute('aria-controls', p.id);
    list.append(b);
    return b;
  });
  list.append(ink);
  list.hidden = false;
  const select = (label: string, animate: boolean) => {
    const i = Math.max(0, panels.findIndex((p) => p.dataset.label === label));
    buttons.forEach((b, j) => {
      b.setAttribute('aria-selected', String(i === j));
      b.tabIndex = i === j ? 0 : -1;
    });
    panels.forEach((p, j) => {
      p.classList.toggle('is-active', i === j);
      if (!animate) p.style.animation = 'none';
      else p.style.removeProperty('animation');
    });
    const b = buttons[i];
    ink.style.setProperty('--x', `${b.offsetLeft}px`);
    ink.style.setProperty('--s', String(b.offsetWidth / 100));
  };
  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      const label = b.textContent ?? '';
      if (group) {
        remembered[group] = label;
        try {
          localStorage.setItem(TAB_KEY, JSON.stringify(remembered));
        } catch {}
        tabSets.filter((t) => t.group === group).forEach((t) => t.select(label, true));
      } else select(label, true);
    }),
  );
  list.addEventListener('keydown', (e) => {
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (at < 0 || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    const next = buttons[(at + (e.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length];
    next.focus();
    next.click();
  });
  root.classList.add('is-ready');
  select((group && remembered[group]) || buttons[0].textContent || '', false);
  tabSets.push({ group, select });
  // Fonts can change a label's width after first paint: place the ink again once they are in.
  document.fonts?.ready.then(() => {
    const cur = buttons.find((b) => b.getAttribute('aria-selected') === 'true');
    if (cur) {
      ink.style.setProperty('--x', `${cur.offsetLeft}px`);
      ink.style.setProperty('--s', String(cur.offsetWidth / 100));
    }
  });
});

// ---- Screenshot zoom ----
const zoom = document.querySelector<HTMLDialogElement>('.shot-dialog');
const zoomImg = zoom?.querySelector('img');
if (zoom && zoomImg) {
  document.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest?.<HTMLButtonElement>('[data-zoom]');
    if (!btn) return;
    const img = Array.from(btn.querySelectorAll('img')).find((i) => i.offsetParent !== null) ?? btn.querySelector('img');
    if (!img) return;
    zoomImg.src = img.currentSrc || img.src;
    zoomImg.alt = img.alt;
    zoom.showModal();
  });
  zoom.addEventListener('click', (e) => {
    e.preventDefault();
    closeAnimated(zoom, 160);
  });
  zoom.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeAnimated(zoom, 160);
  });
}

// ---- Small screens: following a link in the menu shuts it ----
const menu = document.querySelector<HTMLDetailsElement>('.docs-menu');
const narrow = matchMedia('(max-width: 1023px)');
menu?.addEventListener('click', (e) => {
  if (narrow.matches && (e.target as Element).closest('a')) menu.open = false;
});
narrow.addEventListener('change', () => {
  if (menu && !narrow.matches) menu.open = true;
});

// ---- Contents marker: slides to the link motion.ts marks as the one being read ----
const toc = document.querySelector<HTMLElement>('.doc-toc');
const marker = toc?.querySelector<HTMLElement>('.doc-toc-marker');
if (toc && marker) {
  const place = () => {
    const a = toc.querySelector<HTMLElement>('a[aria-current="location"]');
    marker.style.setProperty('--o', a ? '1' : '0');
    if (!a) return;
    marker.style.setProperty('--y', `${a.offsetTop}px`);
    marker.style.setProperty('--h', String(a.offsetHeight / 100));
  };
  new MutationObserver(place).observe(toc, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  place();
  requestAnimationFrame(() => toc.classList.add('is-ready'));
}

// ---- Search ----
/** Title, url, section, description, headings as [text, id], extra keywords. */
interface Doc { t: string; u: string; s: string; d?: string; h?: [string, string][]; k?: string }
const dialog = document.querySelector<HTMLDialogElement>('.docs-search');
const input = dialog?.querySelector<HTMLInputElement>('input');
const results = dialog?.querySelector<HTMLUListElement>('.docs-search-results');
const empty = dialog?.querySelector<HTMLElement>('.docs-search-empty');
let index: Doc[] | null = null;
// A copy of the site served from a folder (a preview) sets data-root and data-ext on the dialog.
const link = (u: string) => `${dialog?.dataset.root ?? '/'}${u.slice(1)}${dialog?.dataset.ext ?? ''}`;
let picked = 0;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const highlight = (text: string, terms: string[]) => {
  let out = esc(text);
  for (const t of terms) {
    if (t.length < 2) continue;
    out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
  }
  return out;
};

function search(q: string): { doc: Doc; heading?: [string, string]; score: number }[] {
  if (!index) return [];
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const out: { doc: Doc; heading?: [string, string]; score: number }[] = [];
  for (const doc of index) {
    const title = doc.t.toLowerCase();
    const hay = `${title} ${doc.d ?? ''} ${doc.k ?? ''} ${(doc.h ?? []).map((h) => h[0]).join(' ')}`.toLowerCase();
    if (!terms.every((t) => hay.includes(t))) continue;
    let score = 0;
    for (const t of terms) {
      if (title.startsWith(t)) score += 8;
      else if (title.includes(t)) score += 5;
      if ((doc.k ?? '').toLowerCase().includes(t)) score += 3;
      if ((doc.d ?? '').toLowerCase().includes(t)) score += 1;
    }
    const heading = (doc.h ?? []).find((h) => terms.some((t) => h[0].toLowerCase().includes(t)));
    if (heading) score += 2;
    out.push({ doc, heading, score });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 12);
}

function render(): void {
  if (!input || !results || !empty) return;
  const q = input.value.trim();
  const hits = search(q);
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  picked = 0;
  results.innerHTML = hits
    .map((h, i) => {
      const slug = h.heading ? `#${h.heading[1]}` : '';
      const where = h.heading ? `${h.doc.s}, ${h.heading[0]}` : h.doc.s;
      return `<li role="presentation"><a role="option" id="r-${i}" href="${link(h.doc.u)}${slug}" aria-selected="${i === 0}"><span class="r-title">${highlight(h.doc.t, terms)}</span><span class="r-where">${highlight(where, terms)}</span></a></li>`;
    })
    .join('');
  empty.hidden = !(q && hits.length === 0);
  input.setAttribute('aria-activedescendant', hits.length ? 'r-0' : '');
}

function move(by: number): void {
  if (!results || !input) return;
  const items = Array.from(results.querySelectorAll<HTMLAnchorElement>('a'));
  if (!items.length) return;
  items[picked]?.setAttribute('aria-selected', 'false');
  picked = (picked + by + items.length) % items.length;
  const a = items[picked];
  a.setAttribute('aria-selected', 'true');
  a.scrollIntoView({ block: 'nearest' });
  input.setAttribute('aria-activedescendant', a.id);
}

async function openSearch(): Promise<void> {
  if (!dialog || !input || dialog.open) return;
  dialog.showModal();
  input.select();
  if (!index) {
    try {
      index = await (await fetch(dialog.dataset.index ?? '/docs/search.json')).json();
    } catch {
      index = [];
    }
    render();
  }
}

if (dialog && input && results) {
  document.querySelectorAll('[data-search-open]').forEach((b) => b.addEventListener('click', openSearch));
  document.addEventListener('keydown', (e) => {
    const typing = (e.target as Element).closest?.('input, textarea, [contenteditable]');
    if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
      e.preventDefault();
      openSearch();
    }
  });
  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') (e.preventDefault(), move(1));
    else if (e.key === 'ArrowUp') (e.preventDefault(), move(-1));
    else if (e.key === 'Enter') {
      const a = results.querySelectorAll<HTMLAnchorElement>('a')[picked];
      if (a) {
        e.preventDefault();
        location.href = a.href;
      }
    }
  });
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeAnimated(dialog, 140);
  });
  dialog.addEventListener('submit', (e) => {
    e.preventDefault();
    closeAnimated(dialog, 140);
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeAnimated(dialog, 140);
  });
  results.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) dialog.close();
  });
}
