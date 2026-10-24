/* index_experiment_3 — The Parade. Lenis on the GSAP ticker; a convoy under the name; on wide screens the cars drive through
   a pinned stage — the next colour opens out of the next car while the last one drives off. Reduced motion: every car is its own
   still section, nothing hidden. */
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

  /* the convoy: every car, twice, so the loop has no seam */
  const cars = $$('[data-car]');
  const convoy = $('[data-convoy]');
  if (convoy) {
    const imgs = cars.map((c) => `<img src="${c.querySelector('.car__cut').getAttribute('src')}" alt="" loading="lazy" decoding="async">`).join('');
    convoy.innerHTML = imgs + imgs;
  }

  if (!reduce) {
    gsap.from('.open__l', { yPercent: 100, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.05 });
    gsap.from('.open__row', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 0.4 });
    gsap.from('.convoy', { xPercent: 30, opacity: 0, duration: 1.6, ease: 'expo.out', delay: 0.3 });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (min-height: 620px)', () => {
      root.classList.add('is-parade');
      const stage = $('[data-stage]');
      const rail = $$('[data-jump]');
      const n = cars.length;
      const cut = (c) => c.querySelector('.car__cut');
      const parts = (c) => [c.querySelector('.car__info'), c.querySelector('.car__buy')];

      gsap.set(cars, { visibility: 'hidden' });
      gsap.set(cars[0], { visibility: 'visible' });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      /* the first car rolls in as the stage arrives */
      tl.fromTo(cut(cars[0]), { x: '70vw' }, { x: 0, duration: 0.6, ease: 'power3.out' }, 0)
        .fromTo(cars[0].querySelector('.car__yr'), { xPercent: 12 }, { xPercent: -6, duration: 1.2 }, 0);
      for (let i = 0; i < n - 1; i++) {
        const a = cars[i], b = cars[i + 1], t = 0.8 + i * 1.2;
        tl.set(b, { visibility: 'visible' }, t)
          /* the last one drives off, leaning into it */
          .to(cut(a), { x: '-85vw', skewX: -8, duration: 0.55, ease: 'power2.in' }, t)
          .to(parts(a), { y: -40, opacity: 0, duration: 0.3 }, t)
          .to(a.querySelector('.car__shadow'), { x: '-85vw', duration: 0.55, ease: 'power2.in' }, t)
          /* the next colour opens out of where the next car will stop */
          .fromTo(b, { clipPath: 'circle(0% at 82% 64%)' }, { clipPath: 'circle(150% at 82% 64%)', duration: 0.7, ease: 'power2.inOut' }, t + 0.1)
          .fromTo(cut(b), { x: '75vw', rotate: 0 }, { x: 0, duration: 0.6, ease: 'power3.out' }, t + 0.25)
          .fromTo(cut(b), { rotate: 0 }, { rotate: -1.2, duration: 0.12, ease: 'power1.out', yoyo: true, repeat: 1 }, t + 0.8)
          .fromTo(b.querySelector('.car__shadow'), { x: '75vw' }, { x: 0, duration: 0.6, ease: 'power3.out' }, t + 0.25)
          .fromTo(parts(b), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.08 }, t + 0.5)
          .fromTo(b.querySelector('.car__yr'), { xPercent: 14 }, { xPercent: -6, duration: 1.4 }, t + 0.1)
          .fromTo('.parade__streaks i', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.25, stagger: 0.03 }, t)
          .to('.parade__streaks i', { scaleX: 0, opacity: 0, duration: 0.25, stagger: 0.03 }, t + 0.3)
          .set(a, { visibility: 'hidden' }, t + 0.8);
      }
      tl.to({}, { duration: 0.4 });

      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: () => '+=' + innerHeight * (n - 0.4) * 1.0, pin: true, scrub: 0.6, animation: tl,
        invalidateOnRefresh: true,
        onUpdate: (s) => {
          const t = s.progress * tl.duration();
          const idx = Math.max(0, Math.min(n - 1, Math.floor((t - 1.3) / 1.2) + 1));
          rail.forEach((r, k) => r.setAttribute('aria-current', k === idx ? 'true' : 'false'));
        },
      });

      /* the rail and every #car-NN link land on that car's resting frame */
      const restAt = (k) => st.start + ((k === 0 ? 0.65 : 0.8 + (k - 1) * 1.2 + 0.95) / tl.duration()) * (st.end - st.start);
      const onJump = (e) => {
        const a = e.target.closest('a[href^="#car-"]'); if (!a) return;
        e.preventDefault(); e.stopPropagation();
        const k = parseInt(a.getAttribute('href').slice(5), 10) - 1;
        lenis.scrollTo(restAt(k), { duration: 1.2 });
      };
      document.addEventListener('click', onJump, true);
      /* keyboard: focusing a link inside a car brings that car to rest */
      const onFocus = (e) => { const c = e.target.closest('[data-car]'); if (c) { const k = cars.indexOf(c); const y = restAt(k); if (Math.abs(lenis.scroll - y) > 4) lenis.scrollTo(y, { immediate: true }); } };
      stage.addEventListener('focusin', onFocus);

      return () => {
        root.classList.remove('is-parade');
        document.removeEventListener('click', onJump, true);
        stage.removeEventListener('focusin', onFocus);
        gsap.set(cars, { clearProps: 'visibility,clipPath' });
      };
    });

    /* phones and narrow windows: each car is its own field and drives in as it scrolls up */
    mm.add('(max-width: 899px), (max-height: 619px)', () => {
      cars.forEach((c) => {
        gsap.fromTo(c.querySelector('.car__cut'), { x: '45vw' }, { x: 0, ease: 'power2.out', scrollTrigger: { trigger: c, start: 'top 85%', end: 'top 25%', scrub: 0.5 } });
        gsap.fromTo(c.querySelector('.car__yr'), { xPercent: 10 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });

    gsap.utils.toArray('.tile').forEach((t, i) => gsap.from(t, { y: 50, opacity: 0, duration: 0.8, ease: 'expo.out', delay: (i % 4) * 0.06, scrollTrigger: { trigger: t, start: 'top 92%' } }));
    gsap.from('.sell__h', { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.sell', start: 'top 70%' } });
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
