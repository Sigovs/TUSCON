/* index_experiment v4 — after dark on Grant Road. Lenis on the GSAP ticker; the push-in; the floor sideways; the words light up. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.085 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* split the quote into words; the last three burn sodium-orange */
  const qp = $('[data-words-p]');
  if (qp) {
    const words = qp.textContent.trim().split(/\s+/);
    qp.innerHTML = words.map((w, i) => `<span class="w${i >= words.length - 3 ? ' hot' : ''}">${w}</span>`).join(' ');
  }

  if (reduce) { $$('.words__q .w').forEach((w) => (w.style.opacity = 1)); }
  else {
    /* 1 · the push-in: the camera drives toward the car under the light; the name parts to let it through */
    const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-night]', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    tl.to('[data-night-img]', { scale: 1.75, ease: 'power1.in' }, 0)
      .to('.night__l1', { xPercent: -60, opacity: 0, ease: 'power2.in' }, 0)
      .to('.night__l2', { xPercent: 60, opacity: 0, ease: 'power2.in' }, 0)
      .to('[data-night-sub]', { opacity: 0, y: -40 }, 0)
      .fromTo('[data-night-say]', { opacity: 1 }, { opacity: 0, y: -30 }, 0.1);
    /* entrance on load */
    gsap.from('.night__h span[aria-hidden]', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.1 });
    gsap.from('[data-night-img]', { scale: 1.2, duration: 2.4, ease: 'expo.out' });

    /* 2 · the floor runs sideways on wide screens */
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const track = $('[data-track]');
      const dist = () => track.scrollWidth - innerWidth;
      const tw = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '[data-floor]', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.5, invalidateOnRefresh: true,
          onUpdate: (s) => { $('[data-bar]').style.width = (s.progress * 100).toFixed(1) + '%'; } },
      });
      $$('.pan__yr').forEach((y) => gsap.fromTo(y, { xPercent: 18 }, { xPercent: -18, ease: 'none',
        scrollTrigger: { trigger: y.parentElement, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }));
    });

    /* 3 · the words light up as you read them */
    gsap.to('.words__q .w', { opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: '[data-words]', start: 'top 70%', end: 'center 45%', scrub: true } });
    gsap.fromTo('[data-words-img]', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '[data-words]', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* 5 · the desert drifts; the line rises */
    gsap.fromTo('[data-sell-img]', { yPercent: -10 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '[data-sell]', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('[data-sell-h]', { y: 120, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-sell]', start: 'top 65%' } });
    gsap.utils.toArray('.card').forEach((c, i) => gsap.from(c, { y: 60, opacity: 0, duration: 0.9, ease: 'expo.out', delay: (i % 4) * 0.06, scrollTrigger: { trigger: c, start: 'top 92%' } }));
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
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !proj.hidden) closeProj(); });
})();
