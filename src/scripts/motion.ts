// Motion: scroll reveals, in-view play and the cursor spotlight. See "Motion (v3)" in docs/design.md.
// Everything here only adds classes and custom properties; the CSS in global.css does the moving,
// and without this script (or with reduced motion) every element shows its final state.

const reveal = '[data-reveal], [data-reveal-stagger], [data-play]';

function arm(): void {
  // Stagger: each child of [data-reveal-stagger] waits ~70ms more than the one before.
  for (const parent of document.querySelectorAll<HTMLElement>('[data-reveal-stagger]')) {
    const step = Number(parent.dataset.revealStagger) || 70;
    Array.from(parent.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--reveal-delay', `${i * step}ms`);
    });
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal-delay]')) {
    el.style.setProperty('--reveal-delay', `${Number(el.dataset.revealDelay) || 0}ms`);
  }

  const targets = document.querySelectorAll<HTMLElement>(reveal);
  if (!('IntersectionObserver' in window)) {
    targets.forEach(show);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // Tall blocks may never reach 15% of their own height: a fifth of the viewport counts too.
        if (e.intersectionRatio >= 0.15 || e.intersectionRect.height > innerHeight * 0.2) {
          show(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: [0, 0.15, 0.3], rootMargin: '0px 0px -10% 0px' },
  );
  targets.forEach((el) => io.observe(el));
}

function show(el: HTMLElement): void {
  el.classList.add('is-in');
  if (el.hasAttribute('data-play')) el.classList.add('is-playing');
}

// Spotlight: the card under a fine pointer gets --mx/--my, once per frame at most.
function spotlight(): void {
  if (!matchMedia('(pointer: fine)').matches) return;
  let frame = 0;
  let card: HTMLElement | null = null;
  let x = 0;
  let y = 0;
  document.addEventListener(
    'pointermove',
    (e) => {
      card = (e.target as Element).closest?.<HTMLElement>('[data-spotlight]') ?? null;
      x = e.clientX;
      y = e.clientY;
      if (!card || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${x - r.left}px`);
        card.style.setProperty('--my', `${y - r.top}px`);
      });
    },
    { passive: true },
  );
}

arm();
spotlight();
