// Bring a link into the middle of the box that scrolls it, without moving the page or animating:
// it runs as a menu or sidebar appears, so the reader never sees it travel. A box that already shows
// everything is left alone.
export function centreIn(box: HTMLElement, el: HTMLElement | null): void {
  if (!el || box.scrollHeight <= box.clientHeight + 1) return;
  const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
  box.scrollTop = top - (box.clientHeight - el.offsetHeight) / 2;
}
