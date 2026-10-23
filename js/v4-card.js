/* Tucson Classic Motor Co. — v4 card gallery: the photograph on a car card turns with the two arrows on its sides.
   Without this file the card shows its cover and the arrows stay hidden. Frames beyond the cover load on first use. */
(() => {
  document.querySelectorAll('[data-gal]').forEach(g => {
    const fr = [...g.querySelectorAll('.car__f')]; if (fr.length < 2) return;
    const prev = g.querySelector('[data-gal-prev]'), next = g.querySelector('[data-gal-next]'), cur = g.querySelector('[data-gal-cur]');
    let i = 0, warm = 0;
    const load = k => { const f = fr[k]; if (!f.dataset.src) return; f.srcset = f.dataset.srcset || ''; f.src = f.dataset.src; delete f.dataset.src; delete f.dataset.srcset; };
    const show = k => {
      i = (k + fr.length) % fr.length; load(i); load((i + 1) % fr.length);
      fr.forEach((f, n) => f.classList.toggle('is-on', n === i));
      if (cur) cur.textContent = i + 1;
    };
    const on = (b, d) => b?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); show(i + d); });
    on(prev, -1); on(next, 1);
    g.classList.add('is-gal');
    // warm the second frame once the pointer settles on the card, so the first arrow press is instant
    g.closest('.car__a')?.addEventListener('pointerenter', () => { clearTimeout(warm); warm = setTimeout(() => load(1), 250); });
    // swipe on touch — not inside the homepage rail, where a swipe scrolls the rail itself
    if (g.closest('[data-rail]')) return;
    let x0 = null;
    g.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    g.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); });
  });
})();
