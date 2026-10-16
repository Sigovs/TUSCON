/* Tucson Classic Motor Co. — homepage behaviour.
   Everything here is enhancement: with scripts off the page is complete (links, form GET, static map image). */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- Lenis: the scroll layer (DNA90). Not constructed under reduced motion. ---- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ autoRaf: true, anchors: { offset: -72 }, allowNestedScroll: true, stopInertiaOnNavigate: true });
    window.__lenis = lenis;
  }

  /* ---- Compact bar: shown only after the hero has fully left the screen ---- */
  const bar = $('[data-bar]');
  const hero = $('.hero');
  if (bar && hero && 'IntersectionObserver' in window) {
    const barLinks = $$('a, button', bar);
    new IntersectionObserver(([e]) => {
      const on = !e.isIntersecting;
      bar.classList.toggle('is-on', on);
      bar.setAttribute('aria-hidden', String(!on));
      barLinks.forEach(el => on ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1'));
    }, { threshold: 0 }).observe(hero);
  }

  /* ---- Mobile menu (native <dialog>: Esc and focus handling come with it) ---- */
  const menu = $('#menu');
  if (menu && typeof menu.showModal === 'function') {
    const open = () => { menu.showModal(); lenis?.stop(); };
    const close = () => { menu.close(); };
    $$('[data-menu-open]').forEach(b => b.addEventListener('click', open));
    $$('[data-menu-close]', menu).forEach(b => b.addEventListener('click', close));
    menu.addEventListener('close', () => lenis?.start());
    menu.addEventListener('click', e => { if (e.target === menu) close(); });
  }

  /* ---- Inventory rail: arrows step one card; disabled at the ends; the visitor keeps native swipe ---- */
  const rail = $('[data-rail]');
  const prev = $('[data-rail-prev]');
  const next = $('[data-rail-next]');
  if (rail && prev && next) {
    const step = () => {
      const card = rail.querySelector('.card');
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 24;
      return card ? card.getBoundingClientRect().width + gap : rail.clientWidth * .8;
    };
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    };
    const go = dir => rail.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    rail.addEventListener('keydown', e => {
      if (e.target !== rail) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    update();
  }

  /* ---- Search: decade -> the live site's registration[min]/[max]; empty fields are not sent ---- */
  const form = $('[data-search]');
  if (form) {
    form.addEventListener('submit', () => {
      const dec = $('[data-decade]', form);
      if (dec && dec.value) {
        const [min, max] = dec.value.split('-');
        for (const [n, v] of [['registration[min]', min], ['registration[max]', max]]) {
          const i = document.createElement('input');
          i.type = 'hidden'; i.name = n; i.value = v; i.dataset.tmp = '';
          form.appendChild(i);
        }
      }
      if (dec) dec.disabled = true;
      $$('select, input[type=text]', form).forEach(f => { if (!f.value.trim()) f.disabled = true; });
      setTimeout(() => {   // restore the form if the visitor comes back (bfcache)
        $$('[disabled]', form).forEach(f => f.disabled = false);
        $$('[data-tmp]', form).forEach(f => f.remove());
      }, 0);
    });
  }

  /* ---- Map: a real, usable map. Loaded when it approaches the screen; wheel/drag only after a click ---- */
  const mapEl = $('[data-map]');
  if (mapEl && window.L) {
    const LATLNG = [32.2502854, -110.9344675];   // 2540 E. Grant Rd. (OpenStreetMap / Nominatim)
    const init = () => {
      const isNarrow = window.matchMedia('(max-width: 899px)').matches;
      const map = window.L.map(mapEl, {
        center: LATLNG, zoom: isNarrow ? 15 : 16, scrollWheelZoom: false,
        dragging: !window.L.Browser.mobile, tap: false, zoomControl: true, attributionControl: true
      });
      map.zoomControl.setPosition('bottomright');
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      const icon = window.L.divIcon({
        className: '', iconSize: [28, 28], iconAnchor: [14, 14],
        html: '<span class="pin" aria-hidden="true"></span><span class="pin-label">Tucson Classic Motor Co.</span>'
      });
      window.L.marker(LATLNG, { icon, keyboard: false, title: 'Tucson Classic Motor Co., 2540 E. Grant Rd.' }).addTo(map);
      // keep the pin clear of the docked address panel on wide screens
      if (!isNarrow) map.panBy([-Math.min(260, mapEl.clientWidth * .16), 0], { animate: false });
      const hint = $('[data-map-hint]');
      map.once('click', () => {
        map.scrollWheelZoom.enable();
        if (!window.L.Browser.mobile) map.dragging.enable();   // on touch, one-finger swipes keep scrolling the page
        hint?.classList.add('is-off');
      });
      mapEl.querySelector('.map__fallback')?.remove();
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); init(); } }, { rootMargin: '600px 0px' });
      io.observe(mapEl);
    } else init();
  }
})();
