/* Tucson Classic Motor Co. — homepage v2 behaviour.
   Motion role: SUPPORT. The one temporal idea is the inventory sheet laid over the held cover (pure CSS sticky);
   GSAP only seasons it. With scripts off, or reduced motion, the page is complete and still. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const gsap = window.gsap, ST = window.ScrollTrigger;

  /* ---- Lenis on the GSAP ticker (one loop, DNA90). Not constructed under reduced motion. ---- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    const withGsap = !!(gsap && ST);
    lenis = new window.Lenis({ autoRaf: !withGsap, anchors: true, allowNestedScroll: true, stopInertiaOnNavigate: true });
    if (withGsap) {
      gsap.registerPlugin(ST);
      lenis.on('scroll', ST.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    window.__lenis = lenis;
  }

  /* ---- MOTION (SUPPORT). Content is visible by default; every state below is set by script only,
     so a failed script or reduced motion leaves a complete, still page. ---- */
  if (!reduce && gsap && ST) {
    const EASE = 'expo.out';
    const once = (trigger, start = 'top 85%') => ({ trigger, start, once: true });

    // 0 · Hero arrival — the two lines rise out of their masks, then the facts and the two routes
    const hero = $('[data-hero]');
    if (hero) {
      gsap.timeline({ delay: .15 })
        .from($$('[data-hline]', hero), { yPercent: 110, duration: 1.3, ease: EASE, stagger: .14 })
        .from($$('.cover__k, .cover__p, .cover__go', hero), { y: 24, opacity: 0, duration: 1, ease: EASE, stagger: .09 }, '-=.9')
        .from('[data-cover-ph] img', { scale: 1.08, duration: 2.4, ease: 'power2.out' }, 0);
    }

    // split display titles into masked words first — both the entrance ladder and the pin-stops use them
    $$('[data-split]').forEach(h => { h.innerHTML = h.textContent.trim().split(/\s+/).map(w => `<span class="w"><span>${w}</span></span>`).join(' '); });

    // 1 · PIN-STOP (the Czinger "pinx" pattern): the section docks, HOLDS while it reads, then its headline
    //     leaves line by line, the rest follows, the photograph scales back a touch and darkens. Fully reversible.
    //     Desktop only — on a phone these sections are taller than the screen and a pin would cut them.
    const pinx = (el, { len, lines = [], words = [], rest, media, dimHost, dim = .45 }) => {
      if (!el) return;
      let veil = null;
      if (dimHost) { veil = document.createElement('div'); veil.className = 'pinx__dim'; veil.setAttribute('aria-hidden', 'true'); dimHost.appendChild(veil); }
      const tl = gsap.timeline({ defaults: { ease: 'power1.in' },
        scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${len * innerHeight}`, pin: true, pinSpacing: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true } });
      tl.to({}, { duration: 1 }, 0);                                                              // 0 → 1
      if (lines.length) tl.fromTo(lines, { yPercent: 0 }, { yPercent: -115, duration: .2, stagger: .05, immediateRender: false }, .45);   // hold 0–0.45
      // split titles: their inner spans belong to the entrance, so the exit moves the word wrappers (ownership kept apart)
      if (words.length) tl.fromTo(words, { y: 0, opacity: 1 }, { y: -48, opacity: 0, duration: .2, stagger: .04, immediateRender: false }, .45);
      if (rest.length) tl.fromTo(rest, { y: 0, opacity: 1 }, { y: -24, opacity: 0, duration: .2, stagger: .03, immediateRender: false }, .56);
      if (media.length) tl.fromTo(media, { scale: 1 }, { scale: .965, duration: .55, ease: 'none', immediateRender: false }, .45);
      if (veil) tl.fromTo(veil, { opacity: 0 }, { opacity: dim, duration: .55, ease: 'none' }, .45);
      return () => { veil && veil.remove(); };
    };
    gsap.matchMedia().add('(min-width: 900px)', () => {
      const cover = $('[data-cover]');
      cover.classList.add('is-pinned');                                   // the pin replaces the CSS sticky
      const undo = [
        pinx(cover, { len: 1.1, lines: $$('[data-hline]'), rest: $$('.cover__k, .cover__p, .cover__go'), media: [],   /* the hero photograph never shrinks */ dimHost: $('[data-cover-ph]'), dim: .6 }),
        pinx($('.about'), { len: 1.1, words: $$('.about [data-split] .w'), rest: $$('.about__lead, .about__p, .about__c .plate'), media: [$('.about__ph')], dimHost: $('.about__ph'), dim: .35 }),
        pinx($('.sell'), { len: 1.2, words: $$('.sell [data-split] .w'), rest: $$('.sell__body > *'), media: [$('.sell__ph')], dimHost: $('.sell__ph'), dim: .45 }),
      ];
      return () => { cover.classList.remove('is-pinned'); undo.forEach(f => f && f()); };
    });

    // 2 · Lists arrive as lists
    $$('[data-stagger]').forEach(list => {
      gsap.from(list.children, { y: 44, opacity: 0, duration: 1, ease: EASE, stagger: .09, scrollTrigger: once(list) });
    });
    const head = $('.coll__head');
    if (head) gsap.from($$(':scope > :not([data-split])', head), { y: 36, opacity: 0, duration: 1, ease: EASE, stagger: .1, scrollTrigger: once(head) });
    // Titles: every word rides up out of its own mask, one step after the other (a ladder)
    $$('[data-split]').forEach(h => {
      gsap.from($$('.w>span', h), { yPercent: 115, duration: 1.15, ease: EASE, stagger: .075, scrollTrigger: once(h, 'top 88%') });
    });
    $$('[data-split-lines]').forEach(h => {
      gsap.from($$('[data-wl]', h), { yPercent: 115, duration: 1.15, ease: EASE, stagger: .12, scrollTrigger: once(h, 'top 88%') });
    });

    // Images: they come up from below, tied to the scroll
    $$('.car__img[data-rise]').forEach((el, i) => {
      gsap.fromTo(el, { y: 150 + i * 36, opacity: .2 }, { y: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '.rail', start: 'top bottom', end: 'top 42%', scrub: .4 } });
    });
    const rmm = gsap.matchMedia();
    // desktop: the photo is a full-height half of the section — it rises a long way
    rmm.add('(min-width: 900px)', () => $$('figure[data-rise]').forEach(el => {
      gsap.fromTo(el, { y: 180 }, { y: 0, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'top 20%', scrub: .4 } });
    }));
    // phone: the photo opens its section, so it rises inside its own frame (no gap above it)
    rmm.add('(max-width: 899px)', () => $$('figure[data-rise] img').forEach(img => {
      gsap.fromTo(img, { yPercent: 14, scale: 1.18 }, { yPercent: 0, scale: 1.18, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'top 30%', scrub: .4 } });
    }));

    // 3 · The enamel chapter: the title rises out of its masks, the photo is unveiled from below
    const sell = $('.sell');
    if (sell) {
      gsap.from($$('[data-line]', sell), { yPercent: 108, duration: 1.2, ease: EASE, stagger: .12, scrollTrigger: once(sell, 'top 70%') });
      gsap.from($$('.sell__body > *', sell), { y: 32, opacity: 0, duration: 1, ease: EASE, stagger: .08, scrollTrigger: once('.sell__body', 'top 85%') });
    }
    $$('[data-reveal]').forEach(fig => {
      const img = fig.querySelector('img');
      gsap.timeline({ scrollTrigger: once(fig, 'top 82%') })
        .fromTo(fig, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: EASE })
        .from(img, { scale: 1.3, duration: 1.8, ease: EASE }, 0);
    });
    $$('[data-parallax] img').forEach(img => {
      gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, { yPercent: 7, scale: 1.16, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    const about = $('.about__c');
    if (about) gsap.from($$(':scope > :not([data-split])', about), { y: 40, opacity: 0, duration: 1.1, ease: EASE, stagger: .1, scrollTrigger: once(about) });
    $$('.sec-head').forEach(h => gsap.from($$(':scope > :not([data-split])', h), { y: 36, opacity: 0, duration: 1, ease: EASE, stagger: .1, scrollTrigger: once(h) }));

    // 360 section — scroll turns the car: the pinned scroll drives the video's time (every frame is a keyframe)
    const brk = $('[data-break]');
    const vid = $('[data-brk-vid]');
    if (brk && vid) {
      const narrowV = matchMedia('(max-width: 899px)').matches;
      vid.src = narrowV ? vid.dataset.srcMob : vid.dataset.srcDesk;
      vid.pause();
      // paint the first frame (front three-quarter) instead of the poster as soon as the video can seek
      vid.addEventListener('loadeddata', () => { if (vid.currentTime === 0) vid.currentTime = 0.001; }, { once: true });
      let want = 0, raf = 0;
      const seek = () => { raf = 0; if (vid.readyState >= 1 && Math.abs(vid.currentTime - want) > .01) vid.currentTime = want; };
      const turn = p => {
        const d = vid.duration || 8.04;
        want = Math.min(d - .05, Math.max(0, p * d));
        if (!raf) raf = requestAnimationFrame(seek);
      };
      const notes = $$('.brk__l'), rail = null;
      let cur = 0;
      const note = p => {
        if (rail) rail.style.transform = `scaleY(${p})`;
        const k = Math.min(notes.length - 1, Math.floor(p * notes.length * .999));
        if (k === cur) return;
        notes.forEach((n, i) => { n.classList.toggle('is-on', i === k); n.classList.toggle('is-past', i < k); });
        cur = k;
      };
      const bmm = gsap.matchMedia();
      bmm.add('(min-width: 900px)', () => {
        const st = { p: 0 };
        gsap.timeline({ defaults: { ease: 'none' },
          scrollTrigger: { trigger: brk, start: 'top top', end: '+=240%', pin: '[data-brk-stage]', scrub: .4, anticipatePin: 1 } })
          .to(st, { p: 1, duration: .82, onUpdate: () => { turn(st.p); note(st.p); } }, 0)
          .to('[data-brk-hint]', { opacity: 0, duration: .12 }, .08)
          .to({}, { duration: .18 });                       // the stop: the car rests, side-on, before the page moves on
      });
      bmm.add('(max-width: 899px)', () => {
        ST.create({ trigger: brk, start: 'top bottom', end: 'bottom top', scrub: .3, onUpdate: self => turn(self.progress) });
      });
    }

    // 4 · The address card slides onto the map
    const card = $('[data-slide]');
    if (card) gsap.from(card, { x: -90, opacity: 0, duration: 1.3, ease: EASE, scrollTrigger: once('.visit', 'top 70%') });

    // 5 · The page closes on the name, letter by letter, as the last screen arrives
    const word = $('[data-word]');
    if (word) {
      word.innerHTML = [...word.textContent].map(c => c === ' ' ? ' ' : `<span class="ch">${c}</span>`).join('');
      gsap.from($$('.ch', word), { yPercent: 110, ease: 'none', stagger: .04,
        scrollTrigger: { trigger: word, start: 'top bottom', end: 'bottom bottom', scrub: .5 } });
    }

    // pins were created out of page order (hero/about/sell before the break) — sort so each pin's spacer is counted by the ones after it
    ST.sort(); ST.refresh();
    addEventListener('load', () => { ST.sort(); ST.refresh(); });
  }

  /* ---- Header gets its hairline once the page has moved ---- */
  const hd = $('[data-hd]');
  let lastY = 0;
  const onScroll = () => {
    if (!hd) return;
    const y = lenis ? lenis.scroll : scrollY;
    const cover = document.querySelector('[data-cover]');
    const over = cover && y < cover.offsetHeight - 90;
    hd.classList.toggle('is-over', !!over);
    hd.classList.toggle('is-scrolled', !over && y > 8);
    lastY = y;
  };
  lenis ? lenis.on('scroll', onScroll) : addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Menu ---- */
  const menu = $('#menu');
  if (menu && typeof menu.showModal === 'function') {
    $$('[data-menu-open]').forEach(b => b.addEventListener('click', () => { menu.showModal(); lenis?.stop(); }));
    $$('[data-menu-close]', menu).forEach(b => b.addEventListener('click', e => {
      const id = b.getAttribute('href');
      menu.close(); lenis?.start();
      if (id && id.startsWith('#')) {
        e.preventDefault();
        const t = document.querySelector(id);
        if (t) requestAnimationFrame(() => { const y = t.getBoundingClientRect().top + (lenis ? lenis.scroll : scrollY) - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hd")) || 64) - 8; lenis ? lenis.scrollTo(y) : scrollTo(0, y); });
        history.replaceState(null, '', id);
      }
    }));
    menu.addEventListener('close', () => lenis?.start());
    menu.addEventListener('click', e => { if (e.target === menu) menu.close(); });
  }

  /* ---- Rail: arrows, keyboard, drag on desktop, progress line and counter ---- */
  const rail = $('[data-rail]'), prev = $('[data-rail-prev]'), next = $('[data-rail-next]');
  const prog = $('[data-prog]'), count = $('[data-count]');
  if (rail) {
    const cards = $$('.car', rail);
    const pad = n => String(n).padStart(2, '0');
    const step = () => (cards[0]?.getBoundingClientRect().width || 400) + (parseFloat(getComputedStyle(rail).columnGap) || 32);
    const go = dir => rail.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const p = max > 0 ? rail.scrollLeft / max : 1;
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max - 2;
      const visible = Math.max(1, Math.round(rail.clientWidth / step()));
      const first = Math.min(cards.length, Math.round(rail.scrollLeft / step()) + 1);
      if (prog) prog.style.transform = `scaleX(${Math.max(visible / cards.length, p)})`;
      if (count) count.textContent = `${pad(first)} — ${pad(cards.length)}`;
    };
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    rail.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    rail.addEventListener('keydown', e => {
      if (e.target !== rail) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    // drag to scroll with a mouse; touch keeps native swipe
    let down = null, moved = false;
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = { x: e.clientX, left: rail.scrollLeft }; moved = false;
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (Math.abs(dx) > 4) { moved = true; rail.classList.add('is-drag'); }
      if (moved) rail.scrollLeft = down.left - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return;
      down = null; rail.classList.remove('is-drag');
      if (moved) { const i = Math.round(rail.scrollLeft / step()); rail.scrollTo({ left: i * step(), behavior: reduce ? 'auto' : 'smooth' }); }
    });
    rail.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);
    rail.addEventListener('dragstart', e => e.preventDefault());
    update();
  }

  /* ---- Search: decade → the live site's registration[min]/[max]; empty fields are not sent ---- */
  const form = $('[data-search]');
  form?.addEventListener('submit', () => {
    const dec = $('[data-decade]', form);
    if (dec?.value) {
      const [min, max] = dec.value.split('-');
      for (const [n, v] of [['registration[min]', min], ['registration[max]', max]]) {
        const i = Object.assign(document.createElement('input'), { type: 'hidden', name: n, value: v });
        i.dataset.tmp = ''; form.appendChild(i);
      }
    }
    if (dec) dec.disabled = true;
    $$('select, input[type=text]', form).forEach(f => { if (!f.value.trim()) f.disabled = true; });
    setTimeout(() => { $$('[disabled]', form).forEach(f => f.disabled = false); $$('[data-tmp]', form).forEach(f => f.remove()); }, 0);
  });

  /* ---- Map: real and usable; loads near the screen; zoom/drag only after a click (never on touch) ---- */
  const mapEl = $('[data-map]');
  if (mapEl && window.L) {
    const L = window.L, AT = [32.2502854, -110.9344675];
    const init = () => {
      const narrow = matchMedia('(max-width: 899px)').matches;
      const map = L.map(mapEl, { center: AT, zoom: narrow ? 17 : 18, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false });
      map.zoomControl.setPosition('bottomright');
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
      L.marker(AT, { keyboard: false, title: 'Tucson Classic Motor Co., 2540 E. Grant Rd.', icon: L.divIcon({ className: '', iconSize: [30, 30], iconAnchor: [15, 15], html: '<span class="pin" aria-hidden="true"></span><span class="pin-label">Tucson Classic Motor Co.</span>' }) }).addTo(map);
      if (!narrow) map.panBy([-Math.min(300, mapEl.clientWidth * .18), -40], { animate: false });
      map.once('click', () => { mapEl.setAttribute('data-lenis-prevent', ''); map.scrollWheelZoom.enable(); if (!L.Browser.mobile) map.dragging.enable(); $('[data-map-hint]')?.classList.add('is-off'); });
      mapEl.querySelector('.map__fallback')?.remove();
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); init(); } }, { rootMargin: '600px 0px' });
      io.observe(mapEl);
    } else init();
  }
})();
