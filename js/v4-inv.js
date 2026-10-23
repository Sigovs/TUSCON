/* Tucson Classic Motor Co. — v4 inventory pages (SRP + VDP).
   The pages are complete without this file: every card, photo, fact and link is in the HTML.
   This adds the filters, the photo viewer, the video, the full-screen view and the phone dock. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad3 = n => String(n).padStart(3, '0');

  /* ---- Lenis (as on the homepage), off under reduced motion ---- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ autoRaf: true, anchors: true, allowNestedScroll: true });
    window.__lenis = lenis;
  }

  /* ---- Header: hairline + reading progress ---- */
  const hd = $('[data-hd]'), prog = $('[data-hd-prog]');
  const onScroll = () => {
    const y = lenis ? lenis.scroll : scrollY;
    hd?.classList.toggle('is-scrolled', y > 8);
    if (prog) { const max = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`; }
  };
  lenis ? lenis.on('scroll', onScroll) : addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Menu ---- */
  const menu = $('#menu');
  if (menu && typeof menu.showModal === 'function') {
    $$('[data-menu-open]').forEach(b => b.addEventListener('click', () => { menu.showModal(); lenis?.stop(); }));
    $$('[data-menu-close]', menu).forEach(b => b.addEventListener('click', () => menu.close()));
    menu.addEventListener('close', () => lenis?.start());
    menu.addEventListener('click', e => { if (e.target === menu) menu.close(); });
  }

  /* ---- Pick lists: the native <select> popup cannot be styled or aligned, so the select stays hidden as the
          state carrier and a listbox is drawn on the box's own edges. Without JS the native select works. ---- */
  $$('.pick').forEach((pick, n) => {
    const sel = $('select', pick); if (!sel) return;
    const lab = $('.mono', pick), id = `pick${n}`;
    if (lab && !lab.id) lab.id = `${id}-l`;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pick__b';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    const val = document.createElement('span'); val.className = 'pick__v'; val.id = `${id}-v`; btn.append(val);
    btn.setAttribute('aria-labelledby', `${lab ? lab.id + ' ' : ''}${val.id}`);
    const list = document.createElement('ul'); list.className = 'pick__list'; list.setAttribute('role', 'listbox'); list.tabIndex = -1; list.hidden = true;
    if (lab) list.setAttribute('aria-labelledby', lab.id);
    const opts = [...sel.options].map((o, k) => { const li = document.createElement('li'); li.setAttribute('role', 'option'); li.id = `${id}-o${k}`; li.dataset.v = o.value; li.textContent = o.text; list.append(li); return li; });
    sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    pick.classList.add('is-pick'); pick.append(btn, list);
    let act = 0;
    const sync = () => opts.forEach((li, k) => { const on = li.dataset.v === sel.value; li.setAttribute('aria-selected', String(on)); if (on) { act = k; val.textContent = li.textContent; } });
    const mark = k => { act = Math.max(0, Math.min(opts.length - 1, k)); opts.forEach((li, j) => li.classList.toggle('is-active', j === act)); list.setAttribute('aria-activedescendant', opts[act].id); };
    const open = () => { if (!list.hidden) return; sync(); list.hidden = false; pick.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); mark(act); list.focus({ preventScroll: true }); };
    const close = focus => { if (list.hidden) return; list.hidden = true; pick.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); if (focus) btn.focus(); };
    const choose = k => { const v = opts[k].dataset.v; close(true); if (v !== sel.value) { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); } sync(); };
    btn.addEventListener('click', () => list.hidden ? open() : close(true));
    pick.addEventListener('click', e => { if (e.target === pick || e.target === lab) btn.click(); });
    btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); } });
    list.addEventListener('keydown', e => {
      const K = e.key;
      if (K === 'ArrowDown') { e.preventDefault(); mark(act + 1); }
      else if (K === 'ArrowUp') { e.preventDefault(); mark(act - 1); }
      else if (K === 'Home') { e.preventDefault(); mark(0); }
      else if (K === 'End') { e.preventDefault(); mark(opts.length - 1); }
      else if (K === 'Enter' || K === ' ') { e.preventDefault(); choose(act); }
      else if (K === 'Escape') { e.preventDefault(); close(true); }
      else if (K === 'Tab') close(false);
    });
    opts.forEach((li, k) => { li.addEventListener('mousemove', () => { if (act !== k) mark(k); }); li.addEventListener('click', () => choose(k)); });
    document.addEventListener('pointerdown', e => { if (!pick.contains(e.target)) close(false); });
    sel.addEventListener('change', sync);
    sel._sync = sync; sync();
  });

  /* =================================================================== SRP */
  const grid = $('[data-grid]');
  if (grid && $('[data-f-sort]')) {
    const cards = $$('[data-card]', grid);
    const brk = $('[data-break]', grid);
    const empty = $('[data-empty]'), live = $('[data-live]'), countN = $('[data-count-n]');
    const segs = $$('[data-f-st]'), eraSel = $('[data-f-era]'), sortSel = $('[data-f-sort]');
    const state = { st: 'all', era: 'all', sort: 'year-asc' };

    // restore from the URL so a filtered list can be shared and survives back/forward
    const q = new URLSearchParams(location.search);
    if (q.get('show')) state.st = q.get('show');
    if (q.get('era')) state.era = q.get('era');
    if (q.get('sort')) state.sort = q.get('sort');

    const apply = (animate) => {
      const vis = cards.filter(c => (state.st === 'all' || c.dataset.st === state.st) && (state.era === 'all' || c.dataset.era === state.era));
      const [key, dir] = state.sort.split('-');
      const num = c => key === 'price' ? (+c.dataset.price || (dir === 'asc' ? Infinity : -Infinity)) : +c.dataset.year;   // unpriced cars go last
      vis.sort((a, b) => (num(a) - num(b)) * (dir === 'asc' ? 1 : -1) || (+a.dataset.n - +b.dataset.n));
      cards.forEach(c => { c.hidden = !vis.includes(c); c.classList.remove('is-in'); });
      vis.forEach(c => grid.appendChild(c));
      // the editorial break sits after the sixth visible card, and only when there is a list to break
      if (brk) { brk.hidden = vis.length < 7; if (vis.length >= 7) grid.insertBefore(brk, vis[6]); }
      if (empty) empty.hidden = vis.length > 0;
      if (countN) countN.textContent = vis.length;
      if (live) live.textContent = `${vis.length} ${vis.length === 1 ? 'vehicle' : 'vehicles'} shown`;
      if (animate && !reduce) vis.forEach((c, i) => { c.style.animationDelay = `${Math.min(i, 8) * 40}ms`; c.classList.add('is-in'); });
      segs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fSt === state.st)));
      eraSel.value = state.era; sortSel.value = state.sort; eraSel._sync?.(); sortSel._sync?.();
      const p = new URLSearchParams();
      if (state.st !== 'all') p.set('show', state.st);
      if (state.era !== 'all') p.set('era', state.era);
      if (state.sort !== 'year-asc') p.set('sort', state.sort);
      history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
    };
    segs.forEach(b => b.addEventListener('click', () => { state.st = b.dataset.fSt; apply(true); }));
    eraSel.addEventListener('change', () => { state.era = eraSel.value; apply(true); });
    sortSel.addEventListener('change', () => { state.sort = sortSel.value; apply(true); });
    $('[data-reset]')?.addEventListener('click', () => { state.st = 'all'; state.era = 'all'; apply(true); });
    apply(false);
  }

  /* =================================================================== SRP · search on the side (client, 25 Oct)
     Keyword + Type / Era / Price checkboxes (several may be ticked; none ticked = all), sort above the list.
     State lives in the URL (?q=&type=car,bike&era=&price=&sort=) so a search can be shared. */
  const side = $('[data-side]');
  if (grid && side) {
    const cards = $$('[data-card]', grid), brk = $('[data-break]', grid);
    const form = $('[data-side-f]', side), qIn = $('[data-side-q]', side), sortSel = $('[data-side-sort]');
    const empty = $('[data-empty]'), live = $('[data-live]'), shownN = $('[data-shown-n]'), sideN = $('[data-side-n]'), chips = $('[data-chips]');
    const G = ['type', 'era', 'price'], KEY = { type: 'st', era: 'era', price: 'pb' };
    const state = { q: '', sort: 'year-asc', type: [], era: [], price: [] };
    const u = new URLSearchParams(location.search);
    if (u.get('q')) state.q = u.get('q');
    if (u.get('sort')) state.sort = u.get('sort');
    G.forEach(g => { if (u.get(g)) state[g] = u.get(g).split(','); });

    const paint = () => {
      qIn.value = state.q; sortSel.value = state.sort; sortSel._sync?.();
      $$('input[type="checkbox"]', form).forEach(b => { b.checked = state[b.name].includes(b.value); });
    };
    const apply = animate => {
      const words = state.q.toLowerCase().replace(/[“”"’']/g, '').split(/\s+/).filter(Boolean);
      const vis = cards.filter(c => G.every(g => !state[g].length || state[g].includes(c.dataset[KEY[g]])) && words.every(w => c.dataset.q.includes(w)));
      const [key, dir] = state.sort.split('-');
      const num = c => key === 'price' ? (+c.dataset.price || (dir === 'asc' ? Infinity : -Infinity)) : +c.dataset.year;
      vis.sort((a, b) => (num(a) - num(b)) * (dir === 'asc' ? 1 : -1) || (+a.dataset.n - +b.dataset.n));
      cards.forEach(c => { c.hidden = !vis.includes(c); c.classList.remove('is-in'); });
      vis.forEach(c => grid.appendChild(c));
      // the sell break comes after full rows only (Alex, 25 Oct: "fill everything"): 2 rows of tiles, or 4 rows of the list
      const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
      const at = cols * (cols > 1 ? 2 : 4);
      if (brk) { brk.hidden = vis.length <= at; if (vis.length > at) grid.insertBefore(brk, vis[at]); }
      if (empty) empty.hidden = vis.length > 0;
      if (shownN) shownN.textContent = vis.length;
      const n = G.reduce((t, g) => t + state[g].length, 0) + (words.length ? 1 : 0);
      if (sideN) sideN.textContent = n ? `${n} on · ${vis.length} shown` : '';
      // the active filters as small pills above the list; × removes one (Alex, 25 Oct)
      if (chips) {
        const X = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg>';
        const on = [];
        if (state.q) on.push({ k: 'q', label: `“${state.q}”` });
        G.forEach(g => state[g].forEach(v => on.push({ k: g, v, label: $(`input[name="${g}"][value="${v}"]`, form)?.closest('.opt')?.querySelector('.opt__l')?.textContent || v })));
        chips.innerHTML = on.map((c, n) => `<button type="button" class="chip" data-chip="${n}" aria-label="Remove ${c.label.replace(/"/g, '&quot;')}"><span>${c.label.replace(/</g, '&lt;')}</span>${X}</button>`).join('') +
          (on.length > 1 ? '<button type="button" class="chip chip--all" data-chip="all">Clear all</button>' : '');
        chips.hidden = !on.length;
        $$('[data-chip]', chips).forEach(b => b.addEventListener('click', () => {
          if (b.dataset.chip === 'all') return clear();
          const c = on[+b.dataset.chip];
          if (c.k === 'q') state.q = ''; else state[c.k] = state[c.k].filter(v => v !== c.v);
          paint(); apply(true);
        }));
      }
      if (live) live.textContent = `${vis.length} ${vis.length === 1 ? 'vehicle' : 'vehicles'} shown`;
      if (animate && !reduce) vis.forEach((c, i) => { c.style.animationDelay = `${Math.min(i, 6) * 40}ms`; c.classList.add('is-in'); });
      const p = new URLSearchParams();
      if (state.q) p.set('q', state.q);
      G.forEach(g => { if (state[g].length) p.set(g, state[g].join(',')); });
      if (state.sort !== 'year-asc') p.set('sort', state.sort);
      if (grid.classList.contains('srp__list')) p.set('view', 'list');
      history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
    };
    let t;
    qIn.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = qIn.value.trim(); apply(true); }, 160); });
    form.addEventListener('change', e => {
      const b = e.target; if (b.type !== 'checkbox') return;
      state[b.name] = $$(`input[name="${b.name}"]:checked`, form).map(x => x.value); apply(true);
    });
    sortSel.addEventListener('change', () => { state.sort = sortSel.value; apply(true); });
    const clear = () => { state.q = ''; G.forEach(g => { state[g] = []; }); paint(); apply(true); };
    form.addEventListener('reset', e => { e.preventDefault(); clear(); });
    $('[data-side-reset]')?.addEventListener('click', () => { clear(); qIn.focus(); });

    // view: tiles (default) or list — kept in the URL and remembered on this device
    const views = $$('[data-view]');
    const setView = (v, save) => {
      v = v === 'list' ? 'list' : 'tiles';
      grid.classList.toggle('srp__tiles', v === 'tiles'); grid.classList.toggle('srp__list', v === 'list');
      views.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
      const p = new URLSearchParams(location.search); v === 'list' ? p.set('view', 'list') : p.delete('view');
      history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
      if (save) try { localStorage.setItem('tcmc-view', v); } catch (e) {}
    };
    let v0 = u.get('view'); if (!v0) try { v0 = localStorage.getItem('tcmc-view'); } catch (e) {}
    views.forEach(b => b.addEventListener('click', () => { setView(b.dataset.view, true); apply(false); }));
    let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => apply(false), 150); });

    // phones: the panel folds behind its summary; from 900px it is always open
    const d = $('[data-side-d]', side), mq = matchMedia('(min-width:900px)');
    const fold = () => { if (mq.matches) d.open = true; else if (!state.q && G.every(g => !state[g].length)) d.open = false; };
    mq.addEventListener('change', fold); fold();
    d.addEventListener('toggle', () => { if (mq.matches && !d.open) d.open = true; });
    setView(v0); paint(); apply(false);
  }

  /* ---- Mail forms (the inquiry panel, the visit request). Mock-up: the button opens the visitor's email app with the message ---- */
  $$('[data-mail-form]').forEach(form => {
    const done = form.parentElement.querySelector('[data-mail-done]');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(form);
      const who = [`${f.get('first') || ''} ${f.get('last') || ''}`.trim(), f.get('email'), f.get('phone'), f.get('when') ? `When: ${f.get('when')}` : ''].filter(Boolean).join('\n');
      const body = `${f.get('message') || ''}\n\n${who}`.trim();
      location.href = `mailto:Info@TucsonClassics.com?subject=${encodeURIComponent(form.dataset.subject)}&body=${encodeURIComponent(body)}`;
      form.hidden = true; if (done) { done.hidden = false; done.scrollIntoView({ block: 'nearest' }); }
    });
  });

  /* ---- Finance in the record card: to the lenders, clear of the header (Lenis' own anchor handling stopped ~490px short here) ---- */
  $$('a[href="#finance"]').forEach(a => a.addEventListener('click', e => {
    const t = $('#finance'); if (!t) return;
    e.preventDefault(); e.stopPropagation();
    const y = t.getBoundingClientRect().top + scrollY - ($('[data-hd]')?.offsetHeight || 0) - 24;
    lenis ? lenis.scrollTo(y) : scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#finance');
  }));

  /* ---- Inquire: the slide-over panel ---- */
  const inq = $('[data-inq]');
  if (inq && typeof inq.showModal === 'function') {
    const form = $('[data-mail-form]', inq);
    const msg = form && $('textarea[name="message"]', form), msg0 = msg?.value;
    $$('[data-inq-open]').forEach(b => b.addEventListener('click', e => {
      if (msg) msg.value = b.dataset.inqMsg || msg0;   // Trade-in opens the same panel with its own message
      e.preventDefault(); inq.showModal(); lenis?.stop();
      if (form && !form.hidden) $('input', form)?.focus({ preventScroll: true });
    }));
    $$('[data-inq-close]', inq).forEach(b => b.addEventListener('click', () => inq.close()));
    inq.addEventListener('click', e => { if (e.target === inq) inq.close(); });
    inq.addEventListener('close', () => lenis?.start());
  }

  /* =================================================================== VDP */
  const viewer = $('[data-viewer]');
  const galEl = $('#gallery');
  if (viewer && galEl) {
    const G = JSON.parse(galEl.textContent);
    const N = G.srcs.length;
    const img = $('[data-stage-img]'), cur = $('[data-cur]');
    const thumbs = $$('[data-go]', $('.vthumbs'));
    const chips = $$('.vchaps .vchap');
    const video = $('[data-video]');
    const vids = G.videos || (G.video ? [G.video] : []), poster = $('[data-play] img');
    let i = G.start || 0, token = 0, vk = 0;

    // a photo's best source: our local 1400w when we made one, else the client's original
    const srcOf = k => G.local[k] || G.srcs[k];
    const preload = k => { const im = new Image(); im.src = srcOf((k + N) % N); };
    const chapterOf = k => { let c = 0; G.chapters.forEach(([, s], n) => { if (k >= s) c = n; }); return c; };

    const show = (k, opts = {}) => {
      i = (k + N) % N;
      video.hidden = true; video.querySelector('iframe')?.remove();
      const t = ++token;
      const next = new Image();
      if (!reduce) img.classList.add('is-swap');
      next.onload = next.onerror = () => {
        if (t !== token) return;                      // a newer request won
        img.srcset = G.local[i] ? `${G.local[i]} 1400w, ${G.srcs[i]} 2560w` : '';
        img.src = srcOf(i);
        img.alt = `Photograph ${i + 1} of ${N} of the ${G.name}`;
        img.classList.remove('is-swap');
      };
      next.src = srcOf(i);
      cur.textContent = pad3(i + 1);
      thumbs.forEach(b => +b.dataset.go === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
      const c = chapterOf(i);
      chips.forEach((b, n) => b.classList.toggle('is-on', n === c));
      preload(i + 1); preload(i - 1);
    };

    $('[data-prev]', viewer).addEventListener('click', () => show(i - 1));
    $('[data-next]', viewer).addEventListener('click', () => show(i + 1));
    $$('[data-go]', viewer).forEach(b => b.addEventListener('click', () => show(+b.dataset.go)));

    // the video lives in the same frame as the photographs (HANDOFF: "the video sits next to the photos")
    const showVideo = k => {
      vk = k; video.querySelector('iframe')?.remove();
      if (poster) poster.src = `https://i.ytimg.com/vi/${vids[vk]}/maxresdefault.jpg`;
      video.hidden = false;
      thumbs.forEach(b => b.removeAttribute('aria-current'));
    };
    $$('[data-show-video]').forEach(b => b.addEventListener('click', () => showVideo(+b.dataset.showVideo || 0)));
    $('[data-play]')?.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${vids[vk]}?autoplay=1&rel=0`;
      f.title = `Video ${vk + 1} of the ${G.name}`;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.referrerPolicy = 'strict-origin-when-cross-origin';   // the page sends no referrer (client CDN hotlink rule); YouTube refuses to play without one (error 153)
      video.appendChild(f);
    });

    // every car has a video (client, 25 Oct): called out on the photograph itself, not only as the first thumbnail
    if (vids.length) {
      const pill = document.createElement('button');
      pill.type = 'button'; pill.className = 'viewer__vpill';
      pill.innerHTML = `<span class="viewer__vpill-i"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.2v9.6L13 8z"/></svg></span><span>Play video${vids.length > 1 ? `s (${vids.length})` : ""}</span>`;
      pill.addEventListener('click', () => { showVideo(0); $('[data-play]')?.click(); });
      $('[data-stage]', viewer).appendChild(pill);
    }

    // swipe on touch
    let x0 = null;
    const stage = $('[data-stage]');
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (x0 === null || !video.hidden) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
    });
    stage.tabIndex = 0;
    stage.setAttribute('aria-label', `Photographs, ${N} in total. Use the arrow keys to move between them.`);
    stage.setAttribute('role', 'region');

    /* ---- full screen ---- */
    const lb = $('[data-lb]'), lbImg = $('[data-lb-img]'), lbCur = $('[data-lb-cur]');
    const lbChips = $$('.lb__chaps .vchap');
    let j = 0, lbToken = 0;
    const lbShow = k => {
      j = (k + N) % N;
      const t = ++lbToken, im = new Image();
      if (!reduce) lbImg.classList.add('is-swap');
      im.onload = im.onerror = () => { if (t !== lbToken) return; lbImg.src = G.srcs[j]; lbImg.alt = `Photograph ${j + 1} of ${N}`; lbImg.classList.remove('is-swap'); };
      im.src = G.srcs[j];
      lbCur.textContent = pad3(j + 1);
      const c = chapterOf(j);
      lbChips.forEach((b, n) => b.classList.toggle('is-on', n === c));
      [j + 1, j - 1].forEach(n => { const p = new Image(); p.src = G.srcs[(n + N) % N]; });
    };
    const lbOpen = k => { if (typeof lb.showModal !== 'function') return; lbShow(k); lb.showModal(); lenis?.stop(); };
    lb.addEventListener('close', () => { lenis?.start(); show(j); });
    $('[data-full]').addEventListener('click', () => lbOpen(i));
    img.addEventListener('click', () => lbOpen(i));
    img.style.cursor = 'zoom-in';
    $$('[data-open]').forEach(b => b.addEventListener('click', () => lbOpen(+b.dataset.open)));

    // the strip shows a few large thumbnails; the last visible one becomes "+N" and opens every photo full screen,
    // and the photo count beside it is a button to the same view (Alex, 25 Oct: "larger, fewer, single out the video")
    const lis = $$('.vthumbs li');
    const more = () => {
      lis.forEach(li => { li.classList.remove('is-more'); delete li.dataset.more; });
      const vis = lis.filter(li => li.offsetParent !== null), last = vis[vis.length - 1];
      const shownPhotos = vis.filter(li => li.querySelector('[data-go]')).length;
      if (last && last.querySelector('[data-go]') && N > shownPhotos) { last.classList.add('is-more'); last.dataset.more = `+${N - shownPhotos + 1}`; }
    };
    lis.forEach(li => li.addEventListener('click', e => { if (!li.classList.contains('is-more')) return; e.stopPropagation(); e.preventDefault(); lbOpen(+li.querySelector('[data-go]').dataset.go); }, true));
    more(); addEventListener('resize', more);
    const k = $('.vchaps__k');
    if (k) { const b = document.createElement('button'); b.type = 'button'; b.className = 'mono vchaps__k vchaps__all'; b.textContent = `View all ${N} photos`; b.addEventListener('click', () => lbOpen(i)); k.replaceWith(b); }
    $('[data-lb-prev]').addEventListener('click', () => lbShow(j - 1));
    $('[data-lb-next]').addEventListener('click', () => lbShow(j + 1));
    $('[data-lb-close]').addEventListener('click', () => lb.close());
    lbChips.forEach(b => b.addEventListener('click', () => lbShow(+b.dataset.go)));
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); lbShow(j + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); lbShow(j - 1); }
    });
    let lx = null;
    lb.addEventListener('touchstart', e => { lx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => { if (lx === null) return; const dx = e.changedTouches[0].clientX - lx; lx = null; if (Math.abs(dx) > 40) lbShow(j + (dx < 0 ? 1 : -1)); });

    /* ---- phone dock: appears once the record card's buttons have left the screen ---- */
    const dock = $('[data-dock]'), go = $('.rec__go'), close = $('.close__act');
    if (dock && go && 'IntersectionObserver' in window) {
      dock.hidden = false;
      let goOut = false, closeIn = false;
      const upd = () => dock.classList.toggle('is-on', goOut && !closeIn);
      new IntersectionObserver(([e]) => { goOut = !e.isIntersecting && e.boundingClientRect.top < 0; upd(); }).observe(go);
      if (close) new IntersectionObserver(([e]) => { closeIn = e.isIntersecting; upd(); }).observe(close);
    }
  }
})();
