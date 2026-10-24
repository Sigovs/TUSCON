/* index_experiment_4 — Viewfinder. Lenis on the GSAP ticker; the frame draws itself; twelve frames to pick from with a rolling price;
   on the floor the record holds while the photographs develop into colour; a thumbnail follows the sale table.
   Reduced motion: swaps are instant, nothing is hidden. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  gsap.registerPlugin(ScrollTrigger);
  const CARS = JSON.parse($('#cars').textContent);

  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.085 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const num = (p) => parseInt(String(p).replace(/[^0-9]/g, ''), 10);
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

  /* ── 1 · the viewfinder picker ─────────────────────────────────────────── */
  const img = $('[data-vf-img]'), car = $('[data-vf-car]');
  const R = { lot: $('[data-r-lot]'), price: $('[data-r-price]'), name: $('[data-r-name]'), line: $('[data-r-line]'), href: $('[data-r-href]') };
  const ticks = $$('[data-pick]');
  let cur = 0, busy = null;
  const shown = { v: num(CARS[0].price) };

  const preload = (src) => new Promise((ok) => { const i = new Image(); i.onload = i.onerror = () => ok(); i.src = src; });
  addEventListener('load', () => CARS.forEach((c) => preload(c.cut)), { once: true });

  async function pick(i) {
    i = (i + CARS.length) % CARS.length;
    if (i === cur && !busy) return;
    cur = i;
    const c = CARS[i];
    ticks.forEach((t, k) => t.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
    R.lot.textContent = c.lot; R.name.textContent = `${c.year} ${c.name}`; R.line.textContent = c.line; R.href.href = c.href;
    const target = num(c.price);
    if (reduce || !Number.isFinite(target)) {
      img.src = c.cut; img.alt = c.title + ', side view'; R.price.textContent = c.price; shown.v = target; return;
    }
    busy?.kill();
    gsap.to(shown, { v: target, duration: 0.9, ease: 'power3.out', onUpdate: () => (R.price.textContent = money(shown.v)), onComplete: () => (R.price.textContent = c.price) });
    await preload(c.cut);
    if (cur !== i) return;
    busy = gsap.timeline()
      .to(car, { opacity: 0, x: -40, filter: 'blur(6px)', duration: 0.3, ease: 'power2.in' })
      .to('.vf__smoke', { opacity: 1, duration: 0.3 }, 0)
      .add(() => { img.src = c.cut; img.alt = c.title + ', side view'; })
      .fromTo(car, { x: 50, opacity: 0, filter: 'blur(6px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out' })
      .to('.vf__smoke', { opacity: 0.65, duration: 1.2 }, '<');
  }
  ticks.forEach((t) => t.addEventListener('click', () => pick(+t.dataset.pick)));
  $$('[data-step]').forEach((b) => b.addEventListener('click', () => pick(cur + +b.dataset.step)));
  $('[data-picker]').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); pick(cur + (e.key === 'ArrowRight' ? 1 : -1));
    if (e.target.matches('[data-pick]')) ticks[cur].focus();
  });

  /* ── 2 · on the floor: the record follows the photograph in view ───────── */
  const N = { lot: $('[data-n-lot]'), q: $('[data-n-q]'), price: $('[data-n-price]') };
  const shots = $$('[data-shot]');
  const setNow = (k) => {
    const s = shots[k];
    N.lot.textContent = s.querySelector('.shot__lot').textContent + ' · ' + s.querySelector('.shot__h').textContent;
    N.q.textContent = s.querySelector('.shot__q p').textContent;
    N.price.textContent = s.querySelector('.shot__price').textContent;
  };
  setNow(0);
  shots.forEach((s, k) => ScrollTrigger.create({
    trigger: s, start: 'top 62%', end: 'bottom 38%',
    onToggle: (st) => {
      s.classList.toggle('is-on', st.isActive);
      if (st.isActive) {
        if (reduce) setNow(k);
        else gsap.timeline().to('[data-now] > *', { opacity: 0, y: -8, duration: 0.18, stagger: 0.03 }).add(() => setNow(k)).to('[data-now] > *', { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
      }
    },
  }));

  /* ── 3 · the sale table: a print follows the pointer ───────────────────── */
  const thumb = $('[data-thumb-img]');
  if (fine && !reduce && thumb) {
    const qx = gsap.quickTo(thumb, 'x', { duration: 0.45, ease: 'power3.out' });
    const qy = gsap.quickTo(thumb, 'y', { duration: 0.45, ease: 'power3.out' });
    $$('.tbl tbody tr').forEach((tr) => {
      tr.addEventListener('mouseenter', () => { thumb.src = tr.dataset.thumb; gsap.to(thumb, { opacity: 1, duration: 0.25 }); });
      tr.addEventListener('mouseleave', () => gsap.to(thumb, { opacity: 0, duration: 0.25 }));
      tr.addEventListener('mousemove', (e) => { qx(e.clientX + 24); qy(e.clientY - 80); });
    });
  }

  if (!reduce) {
    /* the opening: the bed lights up, the frame draws itself, the vehicle comes out of the smoke */
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('[data-vf-bg]', { scale: 1.1, filter: 'brightness(.3)', duration: 2.6 }, 0)
      .from('.frame__l--t, .frame__l--b', { scaleX: 0, transformOrigin: '50% 50%', duration: 1.4 }, 0.3)
      .from('.frame__l--x1, .frame__l--x2', { scaleY: 0, transformOrigin: '50% 50%', duration: 1.4 }, 0.4)
      .from('.frame__c', { opacity: 0, scale: 1.6, duration: 0.8, stagger: 0.06 }, 0.8)
      .from('.frame__d', { scale: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(3)' }, 1.0)
      .from(car, { opacity: 0, y: 24, filter: 'blur(10px)', duration: 1.6 }, 0.7)
      .from('.readout', { opacity: 0, x: -24, duration: 1 }, 1.1)
      .from('.vf__foot > *, .top', { opacity: 0, y: 16, duration: 1, stagger: 0.08 }, 1.2);
    gsap.fromTo(shown, { v: 0 }, { v: shown.v, duration: 1.6, delay: 1.1, ease: 'power3.out', onUpdate: () => (R.price.textContent = money(shown.v)), onComplete: () => (R.price.textContent = CARS[cur].price) });

    /* leaving the viewfinder: the camera eases back into the room */
    gsap.to('[data-vf-bg]', { yPercent: 8, scale: 1.04, ease: 'none', scrollTrigger: { trigger: '[data-vf]', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(car, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '[data-vf]', start: 'top top', end: 'bottom top', scrub: true } });

    gsap.utils.toArray('.shot__img').forEach((im) => gsap.fromTo(im, { scale: 1.06 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'center center', scrub: true } }));
    gsap.from('.tbl tbody tr', { opacity: 0, y: 14, duration: 0.6, stagger: 0.04, ease: 'power2.out', scrollTrigger: { trigger: '.tbl', start: 'top 80%' } });
    gsap.fromTo('[data-sell-bg]', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.sell', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.sell__in', { opacity: 0, scale: 0.96, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.sell', start: 'top 60%' } });
  }

  /* projector */
  const proj = $('[data-projector]'), frame = $('[data-projector-frame]'), closeBtn = $('[data-projector-close]');
  let opener = null;
  const closeProj = () => { proj.hidden = true; frame.replaceChildren(); lenis?.start(); opener?.focus(); };
  $$('[data-yt]').forEach((btn) => btn.addEventListener('click', () => {
    opener = btn;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`;
    f.title = `Walk-around video: ${btn.dataset.title}`;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(f); proj.hidden = false; lenis?.stop(); closeBtn.focus();
  }));
  closeBtn.addEventListener('click', closeProj);
  proj.addEventListener('click', (e) => { if (e.target === proj) closeProj(); });
  addEventListener('keydown', (e) => {
    if (proj.hidden) return;
    if (e.key === 'Escape') closeProj();
    if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === closeBtn ? frame.querySelector('iframe') : closeBtn)?.focus(); }
  });
})();
