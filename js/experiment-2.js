/* index_experiment_2 — Issue No. 12. Lenis on the GSAP ticker; the cover turns like a page; the spreads land in a pile;
   the masthead and the shouts are stamped on; scissors run the coupon. Under reduced motion: nothing moves, nothing is hidden. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.09 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* words into spans, so they can be stamped one by one */
  const words = (el, hotLast = 0) => {
    const w = el.textContent.trim().split(/\s+/);
    el.innerHTML = w.map((x, i) => `<span class="w${i >= w.length - hotLast ? ' hot' : ''}">${x}</span>`).join(' ');
  };
  $$('.spread__shout').forEach((el) => words(el));
  const shout = $('[data-shout]'); if (shout) words(shout, 3);
  const mast = $('.cover__mast span[aria-hidden]');
  if (mast) mast.innerHTML = [...mast.textContent].map((c) => (c === ' ' ? ' ' : `<span class="ch">${c}</span>`)).join('');

  if (!reduce) {
    /* the cover arrives: letters stamped, the print slapped down, the burst pops */
    gsap.from('.cover__mast .ch', { yPercent: -60, rotate: () => gsap.utils.random(-14, 14), opacity: 0, duration: 0.7, ease: 'back.out(2.2)', stagger: 0.035, delay: 0.1 });
    gsap.from('.cover__fig', { scale: 1.18, rotate: -9, opacity: 0, duration: 0.9, ease: 'back.out(1.4)', delay: 0.45 });
    gsap.from('.cl', { x: (i) => (i < 2 ? -40 : 40), opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.08, delay: 0.8 });
    gsap.from('.burst--cover', { scale: 0, rotate: -90, duration: 0.8, ease: 'back.out(2)', delay: 1.05 });

    const mm = gsap.matchMedia();

    /* wide screens: the cover turns like a page and the spreads pile up */
    mm.add('(min-width: 900px) and (min-height: 640px)', () => {
      root.classList.add('is-flip', 'is-stack');
      ScrollTrigger.refresh();

      const cover = $('[data-cover]');
      const turn = gsap.timeline({ scrollTrigger: { trigger: '[data-opening]', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      turn.to(cover, { rotateY: -112, ease: 'power2.in', duration: 1 }, 0)
        .to(cover, { '--shade': 0.55, ease: 'power1.in', duration: 1 }, 0)
        .from('.toc__i', { y: 40, opacity: 0.0, rotate: 0, stagger: 0.04, duration: 0.5, ease: 'power2.out' }, 0.45);

      /* "Contents" links land on the turned page, not on the closed cover */
      const toContents = (e) => {
        e.preventDefault(); e.stopPropagation();
        const st = turn.scrollTrigger; lenis.scrollTo(st.end - 2, { duration: 1.4 });
        setTimeout(() => $('.toc a')?.focus({ preventScroll: true }), 1450);
      };
      const tocLinks = $$('a[href="#contents"]');
      tocLinks.forEach((a) => a.addEventListener('click', toContents, true));
      /* a keyboard user tabbing into the contents turns the cover first */
      const onFocus = () => { const st = turn.scrollTrigger; if (lenis.scroll < st.end - 4) lenis.scrollTo(st.end - 2, { immediate: true }); };
      $('#contents').addEventListener('focusin', onFocus);

      /* each page lands on the last: it arrives tilted and settles; the one beneath dims */
      const spreads = $$('[data-spread]');
      spreads.forEach((s, i) => {
        if (i > 0) {
          gsap.fromTo(s, { rotate: 2.4, transformOrigin: '0% 100%' }, { rotate: 0, ease: 'none',
            scrollTrigger: { trigger: s, start: 'top bottom', end: 'top top', scrub: true } });
        }
        const next = spreads[i + 1];
        if (next) {
          gsap.fromTo(s, { '--dim': 0 }, { '--dim': 0.45, ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } });
          gsap.fromTo(s.querySelector('.spread__page'), { scale: 1 }, { scale: 0.94, ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } });
        }
      });

      return () => {
        root.classList.remove('is-flip', 'is-stack');
        tocLinks.forEach((a) => a.removeEventListener('click', toContents, true));
        $('#contents').removeEventListener('focusin', onFocus);
      };
    });

    /* every width: the shout is stamped, the price pops, the second print is slapped on */
    $$('[data-spread]').forEach((s) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 55%', once: true } });
      tl.from(s.querySelectorAll('.spread__shout .w'), { scale: 1.8, rotate: () => gsap.utils.random(-10, 10), opacity: 0, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.09 })
        .from(s.querySelector('.burst'), { scale: 0, rotate: -120, duration: 0.7, ease: 'back.out(2)' }, 0.25);
      const inset = s.querySelector('.spread__inset');
      if (inset) tl.from(inset, { y: 80, rotate: 18, opacity: 0, duration: 0.7, ease: 'back.out(1.5)' }, 0.35);
    });

    /* the ad: the dealer's line stamps in word by word as it rises; scissors run the coupon's edge */
    gsap.from('[data-shout] .w', { opacity: 0.08, y: 30, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: '[data-adpage]', start: 'top 75%', end: 'top 10%', scrub: true } });
    const coupon = $('[data-coupon]'), sc = $('[data-scissors]');
    gsap.fromTo(sc, { x: 0 }, { x: () => coupon.clientWidth - sc.offsetWidth, ease: 'none',
      scrollTrigger: { trigger: coupon, start: 'top 85%', end: 'bottom 40%', scrub: true, invalidateOnRefresh: true } });

    /* classifieds: the boxed ads set like type */
    gsap.utils.toArray('.ad').forEach((a, i) => gsap.from(a, { y: 30, opacity: 0, duration: 0.6, ease: 'expo.out', delay: (i % 4) * 0.05, scrollTrigger: { trigger: a, start: 'top 94%' } }));
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
