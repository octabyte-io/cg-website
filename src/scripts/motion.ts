// Motion: scroll reveals, in-view play and the cursor spotlight. See "Motion (v3)" in docs/design.md.
// Everything here only adds classes and custom properties; the CSS in global.css does the moving,
// and without this script (or with reduced motion) every element shows its final state.

const reveal = '[data-reveal], [data-reveal-stagger], [data-play]';
const DECAY = 0.88;

function arm(): void {
  // Stagger: the second child waits one step (~70ms), and each gap after that is a little shorter
  // than the one before, so a group arrives as a wave rather than a metronome and a long list never
  // keeps its last item waiting (the total stays under ~8 steps however many children there are).
  for (const parent of document.querySelectorAll<HTMLElement>('[data-reveal-stagger]')) {
    const step = Number(parent.dataset.revealStagger) || 70;
    Array.from(parent.children).forEach((child, i) => {
      const delay = (step * (1 - DECAY ** i)) / (1 - DECAY);
      (child as HTMLElement).style.setProperty('--reveal-delay', `${Math.round(delay)}ms`);
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
  if (!el.hasAttribute('data-play')) return;
  // An illustration inside a staggered group starts playing when its own tile has arrived.
  const wait = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
  if (wait) setTimeout(() => el.classList.add('is-playing'), wait);
  else el.classList.add('is-playing');
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

// Loops rest off screen: a [data-play] illustration or a [data-loop] surface gets .is-offscreen
// while it is out of view, and the CSS pauses its animations (they resume where they stopped).
function rest(): void {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) e.target.classList.toggle('is-offscreen', !e.isIntersecting);
    },
    { rootMargin: '120px 0px' },
  );
  document.querySelectorAll<HTMLElement>('[data-play], [data-loop]').forEach((el) => io.observe(el));
}

// Contents that follow the reader: in a [data-spy] nav, the link to the section being read gets
// aria-current="location". Read on scroll at most once a frame; only a change touches the DOM.
function spy(): void {
  for (const nav of document.querySelectorAll<HTMLElement>('[data-spy]')) {
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const pairs = links
      .map((a) => [a, document.getElementById(decodeURIComponent(a.hash.slice(1)))] as const)
      .filter((p): p is readonly [HTMLAnchorElement, HTMLElement] => p[1] !== null);
    if (!pairs.length) continue;
    let current: HTMLAnchorElement | null = null;
    let frame = 0;
    const update = (): void => {
      frame = 0;
      const line = innerHeight * 0.3;
      let next: HTMLAnchorElement | null = null;
      for (const [a, target] of pairs) {
        if (target.getBoundingClientRect().top <= line) next = a;
        else break;
      }
      // At the very bottom the last section may never reach the line: it is the one being read.
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) next = pairs[pairs.length - 1][0];
      if (next === current) return;
      current?.removeAttribute('aria-current');
      next?.setAttribute('aria-current', 'location');
      current = next;
      // A contents list that scrolls on its own keeps the marked link in its view.
      if (next && nav.scrollHeight > nav.clientHeight + 1) {
        const top = next.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop;
        if (top < nav.scrollTop || top + next.offsetHeight > nav.scrollTop + nav.clientHeight) {
          nav.scrollTop = top - nav.clientHeight / 3;
        }
      }
    };
    addEventListener('scroll', () => (frame ||= requestAnimationFrame(update)), { passive: true });
    update();
  }
}

arm();
spotlight();
rest();
spy();
