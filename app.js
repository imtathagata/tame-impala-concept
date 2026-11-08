(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const isHome = !!$('.wordmark');
  document.documentElement.classList.add('js');
  const motion = hasGsap && !reduce && isHome;
  if (motion) document.documentElement.classList.add('motion');
  if (hasGsap) { document.documentElement.classList.add('gsap'); gsap.registerPlugin(ScrollTrigger); ScrollTrigger.clearScrollMemory('manual'); }
  // the pinned hero needs a clean start; hash links still work
  if (isHome && !location.hash) { history.scrollRestoration = 'manual'; scrollTo(0, 0); }

  /* fast xorshift — the grain engine calls this hundreds of thousands of times a frame */
  let s32 = 2463534242;
  const rnd = () => { s32 ^= s32 << 13; s32 ^= s32 >>> 17; s32 ^= s32 << 5; return (s32 >>> 0) / 4294967296; };
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const ext = '<span class="sr"> (opens in new tab)</span>';

  /* ───────── Painters: what sits under the grain ───────── */
  function figure(c, x, foot, h, col) {
    const hr = h * .085;
    c.fillStyle = col;
    c.beginPath(); c.ellipse(x, foot - h + hr, hr * .86, hr, 0, 0, 7); c.fill();
    c.beginPath(); c.moveTo(x - h * .13, foot);
    c.bezierCurveTo(x - h * .15, foot - h * .5, x - h * .11, foot - h * .74, x, foot - h * .78);
    c.bezierCurveTo(x + h * .11, foot - h * .74, x + h * .15, foot - h * .5, x + h * .13, foot);
    c.closePath(); c.fill();
  }
  const scene = o => { const p = (c, w, h, t = 0) => {
    c.clearRect(0, 0, w, h);
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, o.top); g.addColorStop(1, o.bot);
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    if (o.glow) {
      const [gx, gy, gr] = o.at || [.35, .55, .55];
      const r = c.createRadialGradient(w * gx, h * gy, 0, w * gx, h * gy, Math.max(w, h) * gr);
      r.addColorStop(0, rgba(o.glow, .82 + .12 * Math.sin(t * .7))); r.addColorStop(1, rgba(o.glow, 0));
      c.fillStyle = r; c.fillRect(0, 0, w, h);
    }
    c.filter = `blur(${Math.max(1, w / 110)}px)`;
    (o.figs || []).forEach(([x, f, s], i) => {
      // each figure sways, drifts and breathes on its own rhythm
      const ph = i * 1.9 + x * 5;
      const dx = Math.sin(t * .55 + ph) * .022 + Math.sin(t * .21 + ph * 2) * .014;
      const ds = 1 + Math.sin(t * 1.15 + ph) * .018;
      figure(c, w * (x + dx), h * (f + Math.sin(t * 1.15 + ph) * .006), h * s * ds, o.fg || '#120709');
    });
    c.filter = 'none';
  }; p.live = true; return p; };
  const cover = o => (c, w, h) => {
    c.fillStyle = o.bg; c.fillRect(0, 0, w, h); c.fillStyle = o.fg;
    if (o.kind === 'sun') { c.beginPath(); c.arc(w * .5, h * .7, w * .34, 0, 7); c.fill(); }
    if (o.kind === 'arch') { c.beginPath(); c.moveTo(w * .24, h); c.lineTo(w * .24, h * .44); c.arc(w * .5, h * .44, w * .26, Math.PI, 0); c.lineTo(w * .76, h); c.fill(); }
    if (o.kind === 'waves') for (let i = 0; i < 10; i++) {
      c.beginPath();
      for (let x = 0; x <= w; x += 1) { const y = h * (.08 + i * .095) + Math.sin(x / w * 9.4 + i * .7) * h * .03; x ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.lineTo(w, h); c.lineTo(0, h); c.closePath(); c.fillStyle = i % 2 ? o.bg : o.fg; c.fill();
    }
    if (o.kind === 'figure') { c.filter = `blur(${w / 160}px)`; figure(c, w * .5, h * 1.02, h * .62, o.fg); c.filter = 'none'; }
    if (o.kind === 'stripes') for (let i = 0; i < 12; i++) c.fillRect(w * i / 12, 0, w / 12 * (.12 + .8 * i / 12), h);
    if (o.kind === 'ring') { c.lineWidth = w * .1; c.strokeStyle = o.fg; c.beginPath(); c.arc(w * .5, h * .5, w * .3, 0, 7); c.stroke(); }
  };
  const dot = col => (c, w, h) => { c.fillStyle = col; c.beginPath(); c.arc(w / 2, h / 2, w / 2, 0, 7); c.fill(); };

  /* ───────── Content ───────── */
  const STREAM = 'https://TameImpala.lnk.to/deadbeat';
  const STORE = 'http://TameImpala.lnk.to/TameImpalaStoreAW';
  const OFFICIAL = 'https://www.tameimpala.com/';
  const SCENES = {
    hero: scene({ top: '#5a160f', bot: '#e3632a', glow: '#f7a64a', at: [.32, .62, .6], figs: [[.38, 1.04, .58], [.5, 1.04, .7], [.62, 1.04, .64]] }),
    dusk: scene({ top: '#1d0f2a', bot: '#c2476b', glow: '#f7a64a', at: [.5, .78, .5], figs: [[.34, 1.04, .52], [.66, 1.04, .6]] }),
    crowd: scene({ top: '#120609', bot: '#a3301c', glow: '#ffcf6a', at: [.5, .2, .6], figs: [[.08, 1.08, .36], [.2, 1.07, .42], [.33, 1.08, .38], [.46, 1.06, .44], [.6, 1.08, .4], [.73, 1.07, .43], [.87, 1.08, .37]] }),
    room: scene({ top: '#2a2f4a', bot: '#c9a98a', glow: '#fff1d6', at: [.72, .35, .45], figs: [[.4, 1.03, .62]] }),
    remix: scene({ top: '#040406', bot: '#3b0c17', glow: '#d2224c', at: [.5, .55, .55], figs: [[.5, 1.06, .74]] }),
    store: scene({ top: '#efb4ac', bot: '#e3632a', glow: '#fff4e6', at: [.5, .4, .5], figs: [] }),
    v0: scene({ top: '#140a26', bot: '#6c3488', glow: '#ff8bd0', at: [.5, .45, .5], figs: [[.5, 1.04, .7]] }),
    v1: scene({ top: '#220a0a', bot: '#c23a2a', glow: '#ffc65e', at: [.7, .4, .45], figs: [[.32, 1.04, .66], [.44, 1.04, .6]] }),
    v2: scene({ top: '#f0b59c', bot: '#d9733f', glow: '#fff1d6', at: [.5, .3, .5], figs: [[.62, 1.02, .36]] }),
    v3: scene({ top: '#040406', bot: '#3b0c17', glow: '#d2224c', at: [.5, .7, .5], figs: [[.5, 1.06, .8]] }),
    v4: scene({ top: '#232742', bot: '#8a86c8', glow: '#f3f0ea', at: [.25, .3, .45], figs: [[.55, 1.04, .5], [.68, 1.04, .62], [.8, 1.04, .55]] }),
  };
  const ALBUMS = [
    { year: '2025', title: 'Deadbeat', meta: 'Latest album', tracks: ['Dracula', 'Loser', 'End of Summer'],
      desc: 'The new one. It’s the reason we’re back on the road, and we can’t wait to play it for you.', art: { kind: 'sun', bg: '#e3632a', fg: '#14070a' } },
    { year: '2020', title: 'The Slow Rush', meta: 'Fourth album', tracks: ['Borderline', 'Lost in Yesterday', 'One More Year'],
      desc: 'A record about time: how it slips away, and what you do with the bit you’ve got.', art: { kind: 'arch', bg: '#efb4ac', fg: '#7a2a1c' } },
    { year: '2015', title: 'Currents', meta: 'Third album', tracks: ['Let It Happen', 'The Less I Know the Better', 'Eventually'],
      desc: 'Where the guitars made room for synths, and a lot of you found us for the first time.', art: { kind: 'waves', bg: '#5b2b7a', fg: '#e9467a' } },
    { year: '2012', title: 'Lonerism', meta: 'Second album', tracks: ['Elephant', 'Apocalypse Dreams', 'Feels Like We Only Go Backwards'],
      desc: 'Made mostly alone, which is where the name came from.', art: { kind: 'figure', bg: '#9b8ccc', fg: '#16101f' } },
    { year: '2010', title: 'Innerspeaker', meta: 'Debut album', tracks: ['Solitude Is Bliss', 'Alter Ego', 'Lucidity'],
      desc: 'Where it all started: fuzz, drums and a home studio.', art: { kind: 'stripes', bg: '#e8d3b0', fg: '#a3461d' } },
  ];
  const AU = 'ninajirachi', EU = 'Wet Leg';
  const DATES = [
    ['2026-10-09', 'Brisbane Entertainment Centre', 'Boondall', 'Australia', AU, '7848a581-74ed-497d-ab95-8063912d1426'],
    ['2026-10-10', 'Brisbane Entertainment Centre', 'Boondall', 'Australia', AU, 'e1f352bc-3625-4a77-8a50-45818846b24c'],
    ['2026-10-11', 'Brisbane Entertainment Centre', 'Boondall', 'Australia', AU, 'd3ae083d-e198-4401-b50c-d4b5bda09601'],
    ['2026-10-14', 'Rod Laver Arena', 'Melbourne', 'Australia', AU, '236747c0-b23b-4243-a7f5-7f2d8f269498'],
    ['2026-10-15', 'Rod Laver Arena', 'Melbourne', 'Australia', AU, 'cd50e308-c468-4dc0-81a3-3d0649fe2cbc'],
    ['2026-10-16', 'Rod Laver Arena', 'Melbourne', 'Australia', AU, '1a1427b2-8e1a-4ba7-8514-4c8621e715a6'],
    ['2026-10-17', 'Rod Laver Arena', 'Melbourne', 'Australia', AU, 'a7e475d7-e318-4b85-9183-cba0a138c59c'],
    ['2026-10-19', 'Qudos Bank Arena', 'Sydney', 'Australia', AU, '3568d4e7-5f30-4b71-a62e-d93e85606a65'],
    ['2026-10-20', 'Qudos Bank Arena', 'Sydney', 'Australia', AU, '799f924b-fd34-41c7-9248-f496ae9a103b'],
    ['2026-10-21', 'Qudos Bank Arena', 'Sydney', 'Australia', AU, '41c3e311-9dff-4a81-b1b8-c93a8206ae49'],
    ['2026-10-24', 'RAC Arena', 'Perth', 'Australia', AU, 'e565800b-fea9-416e-b84c-bcbf673778d5'],
    ['2026-10-25', 'RAC Arena', 'Perth', 'Australia', AU, 'd822c98f-683d-4f0d-a3cd-16464d05d4ff'],
    ['2027-05-28', 'Co-op Live', 'Manchester', 'UK', EU, 'c8012f85-7e03-4f87-bc40-6f25306b9abb'],
    ['2027-05-29', 'Co-op Live', 'Manchester', 'UK', EU, '0fb659a1-5e98-4bcb-a44d-e1009dd43081'],
    ['2027-06-01', 'The O2', 'London', 'UK', EU, 'e864b7f9-e40f-4a54-9309-eee30031835d'],
    ['2027-06-02', 'The O2', 'London', 'UK', EU, 'bb346790-ea63-4caa-a63e-123d6379e3c2'],
    ['2027-06-03', 'The O2', 'London', 'UK', EU, '873596f3-8d92-41ba-977e-6edbdc8004e7'],
    ['2027-06-07', 'Rotterdam Ahoy', 'Rotterdam', 'Netherlands', EU, 'ef19961e-72cd-407b-91ae-329e110a532c'],
    ['2027-06-08', 'Rotterdam Ahoy', 'Rotterdam', 'Netherlands', EU, '9d9bb795-d5ad-4911-b041-05ad1a4077c8'],
    ['2027-06-09', 'Rotterdam Ahoy', 'Rotterdam', 'Netherlands', EU, '8cc40216-1400-446f-813d-97cfafeb9614'],
    ['2027-06-12', 'Accor Arena', 'Paris', 'France', EU, '413fd49a-8855-4e08-a91a-fe7ad76670c1'],
    ['2027-06-13', 'Accor Arena', 'Paris', 'France', EU, '282edd63-9531-48da-bf7d-5f5431dc8b89'],
    ['2027-06-17', 'LANXESS Arena', 'Cologne', 'Germany', EU, 'efc71b59-1076-4af8-9af3-e49576869913'],
    ['2027-06-30', "Open'er Festival", 'Gdynia', 'Poland', '', '846914ea-bc8b-4d91-a987-b41b66b25ac8'],
    ['2027-07-04', 'Rock Werchter', 'Werchter', 'Belgium', '', 'c70d50af-56c8-413d-b665-16100c4107ba'],
    ['2027-07-10', 'NOS Alive', 'Lisbon', 'Portugal', '', '410bdf00-e3af-402c-b36f-6d99168e9c1e'],
  ];
  const VIDEOS = [
    { t: 'Let It Happen', s: 'Currents · 2015', k: 'v0' },
    { t: 'The Less I Know the Better', s: 'Currents · 2015', k: 'v1' },
    { t: 'Borderline', s: 'The Slow Rush · 2020', k: 'v2' },
    { t: 'Dracula', s: 'Deadbeat · 2025', k: 'v3' },
    { t: 'Elephant', s: 'Lonerism · 2012', k: 'v4' },
  ];
  const ytSearch = t => 'https://www.youtube.com/results?search_query=' + encodeURIComponent('Tame Impala ' + t);
  // News items open the original source; this site keeps no copies of articles
  const NEWS = [
    { cat: 'Release', title: 'Deadbeat is out now', text: 'It’s yours now. Put it on loud, wherever you listen.', url: STREAM, src: 'tameimpala.lnk.to', k: 'hero' },
    { cat: 'Remix', title: 'Dracula (Jennie remix) is out', text: 'Same song, new night. Have a listen.', url: 'https://tameimpala.lnk.to/dracularemix', src: 'tameimpala.lnk.to', k: 'remix' },
    { cat: 'Tour', title: 'UK and Europe, see you in 2027', text: 'Manchester, London, Rotterdam, Paris and Cologne with Wet Leg, then the summer festivals.', url: OFFICIAL, src: 'tameimpala.com', k: 'dusk' },
    { cat: 'Tour', title: 'Thank you, Australia', text: 'Brisbane, Melbourne, Sydney and Perth with ninajirachi, October 2026.', url: OFFICIAL, src: 'tameimpala.com', k: 'crowd' },
    { cat: 'Tour', title: 'Hear first when we’re near you', text: 'Follow us on Seated and you’ll get a note when a show is announced close to home.', url: 'https://go.seated.com/notifications/welcome/561a010d-b8c6-4820-a059-97009cefed17', src: 'seated.com', k: 'room' },
    { cat: 'Store', title: 'Records, tees and tour things', text: 'It’s all in the official store.', url: STORE, src: 'tameimpala.lnk.to', k: 'store' },
  ];
  const painter = key => {
    const [k, v] = key.split(':');
    return k === 'cover' ? cover(ALBUMS[+v].art) : k === 'dot' ? dot(v) : SCENES[v];
  };

  /* ───────── Film: live grain over a painted base ───────── */
  const films = [];
  const filmIO = new IntersectionObserver(es => es.forEach(e => {
    const f = e.target._film; if (!f) return;
    f.vis = e.isIntersecting;
    if (f.vis && f.reveal < 1 && !f.revealing) revealFilm(f);
  }), { rootMargin: '100px' });

  class Film {
    constructor(cv, o) {
      Object.assign(this, { cv, paint: o.paint, scale: o.scale || 3, amp: o.grain ?? .3, res: o.res, reveal: reduce ? 1 : 0, vis: false, flash: null });
      this.ctx = cv.getContext('2d', { willReadFrequently: true });
      cv._film = this; films.push(this); filmIO.observe(cv); this.build();
    }
    build(force) {
      let w, h;
      if (this.res) ({ w, h } = this.res());
      else { w = this.cv.offsetWidth / this.scale; h = this.cv.offsetHeight / this.scale; } // layout size, ignores GSAP transforms
      w = Math.max(12, Math.round(w)); h = Math.max(12, Math.round(h));
      if (!force && w === this.w && h === this.h) return;
      this.w = w; this.h = h; this.cv.width = w; this.cv.height = h;
      this.off = document.createElement('canvas'); this.off.width = w; this.off.height = h;
      this.oc = this.off.getContext('2d', { willReadFrequently: true });
      this.paintBase();
      this.img = this.ctx.createImageData(w, h);
      this.draw();
    }
    paintBase() {
      this.paint(this.oc, this.w, this.h, reduce ? 0 : performance.now() / 1000);
      this.base = this.oc.getImageData(0, 0, this.w, this.h).data;
    }
    repaint(p) { this.paint = p; this.build(true); }
    draw() {
      if (this.paint.live && !reduce && this.base) this.paintBase();
      const { base, img, w, h, flash } = this, d = img.data, A = this.amp * 255, rv = this.reveal;
      let fx = 0, fy = 0, R2 = 0;
      if (flash) { const k = w / this.cv.clientWidth; fx = flash.x * k; fy = flash.y * k; R2 = (flash.r * k) ** 2; }
      for (let y = 0, i = 0; y < h; y++) for (let x = 0; x < w; x++, i += 4) {
        if (rv < 1 && rnd() > rv) { const v = rnd() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; continue; }
        let a = A;
        if (R2) { const dx = x - fx, dy = y - fy, dd = dx * dx + dy * dy; if (dd < R2) a *= .12 + .88 * dd / R2; }
        const n = (rnd() - .5) * a, c = a * .22;
        d[i] = base[i] + n + (rnd() - .5) * c;
        d[i + 1] = base[i + 1] + n + (rnd() - .5) * c;
        d[i + 2] = base[i + 2] + n + (rnd() - .5) * c;
        d[i + 3] = base[i + 3];
      }
      this.ctx.putImageData(img, 0, 0);
    }
  }
  function revealFilm(f) {
    f.revealing = true;
    if (hasGsap) gsap.to(f, { reveal: 1, duration: 1.3, ease: 'power2.inOut' });
    else f.reveal = 1;
  }
  // any canvas with data-paint="scene:x | cover:n | dot:#hex" becomes a live film
  const initFilms = (root = document) => $$('canvas[data-paint]', root).forEach(cv => {
    if (!cv._film) new Film(cv, { paint: painter(cv.dataset.paint), grain: +(cv.dataset.grain || .4), scale: +(cv.dataset.scale || 3) });
  });
  // ~12 fps, like film
  let last = 0;
  const tick = t => {
    requestAnimationFrame(tick);
    if (t - last < 80) return; last = t;
    for (const f of films) if (f.vis) f.draw();
  };
  if (!reduce) requestAnimationFrame(tick);

  /* ───────── Type ───────── */
  function fit(el) {
    if (!el) return;
    const p = el.parentElement, cs = getComputedStyle(p);
    const avail = p.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    el.style.fontSize = '100px';
    el.style.fontSize = (100 * avail / el.getBoundingClientRect().width) + 'px';
  }
  // ink metrics of the real glyphs, per 100px, so edges line up with letters, not boxes
  function ink() {
    const c = document.createElement('canvas').getContext('2d');
    c.font = '800 100px "Inter Tight"';
    if ('letterSpacing' in c) c.letterSpacing = '-5.5px';
    const T = c.measureText('Tame'), I = c.measureText('Impala'), H = c.measureText('TIH');
    return { tL: T.actualBoundingBoxLeft, tR: T.actualBoundingBoxRight, iL: I.actualBoundingBoxLeft, iR: I.actualBoundingBoxRight, cap: H.actualBoundingBoxAscent };
  }
  // every noise chip set in a title is exactly cap height
  const setCap = () => document.documentElement.style.setProperty('--cap-ratio', (ink().cap / 100).toFixed(4));

  const wm = $('.wordmark'), fw = $('.foot__word');
  const tame = $('.wm-tame'), imp = $('.wm-impala'), chipEl = $('.wordmark__chip');
  const GAP = .085; // visible gap either side of the photo, in em
  function fitWordmark() {
    if (!wm) return;
    const m = ink(), stacked = matchMedia('(max-width:720px)').matches;
    const set = fs => {
      const k = fs / 100;
      wm.style.fontSize = fs + 'px';
      chipEl.style.setProperty('--cap', m.cap * k + 'px');
      chipEl.style.marginLeft = (GAP * fs + m.tR * k - tame.offsetWidth) + 'px';
      chipEl.style.marginRight = stacked ? '0px' : (GAP * fs + m.iL * k) + 'px';
      wm.style.marginLeft = (m.tL * k) + 'px';
    };
    const p = wm.parentElement, cs = getComputedStyle(p);
    const avail = p.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    set(100);
    const inkW = stacked
      ? Math.max(tame.offsetWidth + chipEl.offsetWidth + parseFloat(chipEl.style.marginLeft), imp.offsetWidth)
      : (imp.offsetLeft + m.iR) - (tame.offsetLeft - m.tL);
    set(100 * avail / inkW);
  }
  const fitAll = () => { setCap(); fitWordmark(); fit(fw); fit($('.page-title')); };
  fitAll();
  document.fonts && document.fonts.ready.then(() => { fitAll(); films.forEach(f => f.build()); hasGsap && ScrollTrigger.refresh(); });

  /* ───────── Home hero films ───────── */
  const arch = $('.release__arch'), release = $('#deadbeat');
  let heroFilm;
  if (isHome) {
    // painted wide (the wordmark gap's shape); the arch crops the sides and keeps the figures centred
    const archRes = () => { const h = arch.offsetHeight / 3; return { w: h * 1.65, h }; };
    const heroRes = () => { const w = Math.min(640, Math.max(innerWidth, innerHeight * 1.65) / 3); return { w, h: w / 1.65 }; };
    heroFilm = motion
      ? new Film($('.morph .film'), { paint: SCENES.hero, grain: .42, res: heroRes })
      : new Film(chipEl, { paint: SCENES.hero, grain: .32, scale: 2.5 });
    const archFilm = new Film($('.release__film'), { paint: SCENES.hero, grain: .42, res: archRes });
    // cursor clears the static, inside the arch only
    arch.addEventListener('pointermove', e => {
      const r = arch.getBoundingClientRect();
      archFilm.flash = { x: e.clientX - r.left, y: e.clientY - r.top, r: Math.max(110, r.width * .26) };
    });
    arch.addEventListener('pointerleave', () => { archFilm.flash = null; });
  }
  $$('.disc').forEach(d => new Film(d, { paint: dot(d.dataset.disc), grain: .55, scale: 2 }));

  /* ───────── Recordings tabs (home) ───────── */
  const years = $('#years');
  if (years) {
    const info = $('#rec-info');
    const art = new Film($('#rec-art'), { paint: cover(ALBUMS[0].art), grain: .42, scale: 3 });
    const showAlbum = (i, focus) => {
      const a = ALBUMS[i];
      $$('.year', years).forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
      art.repaint(cover(a.art)); art.reveal = reduce ? 1 : .15; art.revealing = false; revealFilm(art);
      art.cv.setAttribute('aria-label', `Cover art for ${a.title} (concept artwork)`);
      info.setAttribute('aria-labelledby', 'yr-' + i);
      info.innerHTML = `<div class="fade">
        <h3>${a.title}</h3>
        <p class="rec__meta">${a.meta} · ${a.year}</p>
        <p class="rec__desc">${a.desc}</p>
        <ul class="rec__list">${a.tracks.map((t, k) => `<li>${t}<span>${String(k + 1).padStart(2, '0')}</span></li>`).join('')}</ul>
        <a class="line-btn" href="${STREAM}" target="_blank" rel="noopener">Listen to ${a.title} <i aria-hidden="true">↗</i>${ext}</a>
      </div>`;
      if (focus) $$('.year', years)[i].focus();
    };
    ALBUMS.forEach((a, i) => {
      const b = document.createElement('button');
      Object.assign(b, { type: 'button', className: 'year', id: 'yr-' + i, textContent: `${a.year} ${a.title}` });
      b.setAttribute('role', 'tab');
      b.addEventListener('click', () => showAlbum(i));
      b.addEventListener('keydown', e => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); showAlbum((i + k + ALBUMS.length) % ALBUMS.length, true); }
      });
      years.appendChild(b);
    });
    showAlbum(0);
  }

  /* ───────── Album list (music page) ───────── */
  const albumList = $('#albums');
  if (albumList) {
    albumList.innerHTML = ALBUMS.map((a, i) => `
      <li class="album">
        <canvas class="film album__art" data-paint="cover:${i}" data-grain=".42" role="img" aria-label="Cover art for ${a.title} (concept artwork)"></canvas>
        <p class="album__year">${a.year}<small>${a.meta}</small></p>
        <div class="album__main"><h3>${a.title}</h3><p>${a.desc}</p></div>
        <ul class="album__tracks" aria-label="Start with">${a.tracks.map(t => `<li>${t}</li>`).join('')}</ul>
        <a class="line-btn album__btn" href="${STREAM}" target="_blank" rel="noopener">Listen <i aria-hidden="true">↗</i><span class="sr"> to ${a.title} (opens in new tab)</span></a>
      </li>`).join('');
  }

  /* ───────── Tour table (home: first 8, tour page: all) ───────── */
  const dl = $('#dates');
  if (dl) {
    const more = $('#more'), limit = dl.dataset.limit === 'all' ? Infinity : 8;
    const today = new Date().toISOString().slice(0, 10);
    let view = 'upcoming', expanded = false;
    const fmt = (iso, o) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { timeZone: 'UTC', ...o });
    const renderDates = () => {
      const past = view === 'played';
      const rows = DATES.filter(d => past ? d[0] < today : d[0] >= today);
      const shown = expanded ? rows : rows.slice(0, limit);
      dl.innerHTML = shown.length ? shown.map(([iso, venue, city, cc, guest, id]) => `
        <div class="row" role="row">
          <span class="row__date" role="cell">${fmt(iso, { day: '2-digit', month: 'short' })}<small>${fmt(iso, { weekday: 'long' })} ${iso.slice(0, 4)}</small></span>
          <span class="row__venue" role="cell">${venue}</span>
          <span class="row__city" role="cell">${city}, ${cc}</span>
          <span class="row__guest" role="cell">${guest ? 'With ' + guest : ''}</span>
          ${past
            ? '<span class="tix tix--done" role="cell">Thank you<span class="sr">, played</span></span>'
            : `<a class="tix" role="cell" href="https://link.seated.com/${id}" target="_blank" rel="noopener" aria-label="Tickets for ${fmt(iso, { day: 'numeric', month: 'long' })}, ${city} (opens in new tab)">Tickets <i aria-hidden="true">↗</i></a>`}
        </div>`).join('') : `<p class="empty">${past ? 'Nothing played yet.' : 'No new dates just yet. Get an alert above and you’ll hear first.'}</p>`;
      dl.classList.toggle('is-past', past);
      if (!past) $$('.tour-count').forEach(el => { el.textContent = `${rows.length} ${rows.length === 1 ? 'show' : 'shows'} to come`; });
      if (more) {
        more.hidden = rows.length <= limit;
        more.textContent = expanded ? 'Show fewer' : `See all ${rows.length} shows`;
        more.setAttribute('aria-expanded', expanded);
      }
      hasGsap && ScrollTrigger.refresh();
    };
    $$('.filters button').forEach(b => b.addEventListener('click', () => {
      $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
      view = b.dataset.view; expanded = false; renderDates();
    }));
    more && more.addEventListener('click', () => { expanded = !expanded; renderDates(); });
    renderDates();
  }

  /* ───────── Video carousel (home) ───────── */
  const vidCanvas = $('#vid-film');
  if (vidCanvas) {
    let vi = 0;
    const vidFilm = new Film(vidCanvas, { paint: SCENES.v0, grain: .45, scale: 3 });
    $('#vid-total').textContent = VIDEOS.length;
    const showVideo = (i, dir = 1) => {
      vi = (i + VIDEOS.length) % VIDEOS.length;
      const v = VIDEOS[vi];
      vidFilm.repaint(SCENES[v.k]); vidFilm.reveal = reduce ? 1 : .1; vidFilm.revealing = false; revealFilm(vidFilm);
      const fr = $('#vid-frame');
      fr.href = ytSearch(v.t);
      fr.setAttribute('aria-label', `Watch ${v.t} on YouTube (opens in new tab)`);
      $('#vid-n').textContent = vi + 1; $('#vid-title').textContent = v.t; $('#vid-sub').textContent = v.s;
      if (hasGsap && !reduce) gsap.fromTo(['#vid-n', '#vid-title'], { yPercent: 40 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .6, ease: 'power3.out', stagger: .05 });
    };
    $('#vid-prev').addEventListener('click', () => showVideo(vi - 1, -1));
    $('#vid-next').addEventListener('click', () => showVideo(vi + 1, 1));
    showVideo(0);
  }

  /* ───────── Video grid (videos page) ───────── */
  const vgrid = $('#video-grid');
  if (vgrid) {
    vgrid.innerHTML = VIDEOS.map((v, i) => `
      <li class="vcard">
        <a class="vcard__link" href="${ytSearch(v.t)}" target="_blank" rel="noopener">
          <span class="vcard__frame"><canvas class="film" data-paint="scene:${v.k}" data-grain=".45" aria-hidden="true"></canvas><span class="vid__play" aria-hidden="true">Play ↗</span></span>
          <span class="vcard__row"><span class="vcard__n">${String(i + 1).padStart(2, '0')}</span><span class="vcard__t">${v.t}</span><span class="vcard__s">${v.s}</span></span>
          <span class="sr">Watch on YouTube (opens in new tab)</span>
        </a>
      </li>`).join('');
  }

  /* ───────── News (links out to the original source) ───────── */
  const news = $('#news-list');
  if (news) {
    const n = news.dataset.limit ? +news.dataset.limit : NEWS.length;
    news.innerHTML = NEWS.slice(0, n).map(a => `
      <li class="story">
        <a class="story__link" href="${a.url}" target="_blank" rel="noopener">
          <span class="story__thumb"><canvas class="film" data-paint="scene:${a.k}" data-grain=".42" aria-hidden="true"></canvas></span>
          <span class="story__cat">${a.cat}</span>
          <span class="story__body"><span class="story__t">${a.title}</span><span class="story__x">${a.text}</span></span>
          <span class="story__src">Read on ${a.src} <i aria-hidden="true">↗</i></span>
          ${ext}
        </a>
      </li>`).join('');
  }

  initFilms();

  /* ───────── Sign up (demo) ───────── */
  const form = $('#sign-form');
  if (form) {
    const email = $('#email'), msg = $('#email-msg');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      email.setAttribute('aria-invalid', !ok);
      msg.textContent = ok ? 'You’re in. Thanks for sticking around. (Fan concept: nothing was actually sent.)' : 'That email doesn’t look quite right. Try something like name@example.com.';
      if (!ok) email.focus();
    });
  }

  /* ───────── Mobile menu ───────── */
  const mb = $('.menu-btn'), sheet = $('#sheet');
  let themeBefore = 'light';
  const setMenu = open => {
    if (open) themeBefore = document.body.dataset.theme;
    sheet.hidden = !open; mb.setAttribute('aria-expanded', open); mb.textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
    document.body.dataset.theme = open ? 'light' : themeBefore;
  };
  mb.addEventListener('click', () => setMenu(sheet.hidden));
  $$('a', sheet).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) { setMenu(false); mb.focus(); } });

  /* ───────── Header + now-playing colour follow the section under them ───────── */
  const themeIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && sheet.hidden) document.body.dataset.theme = e.target.dataset.theme;
  }), { rootMargin: '0px 0px -94% 0px' });
  $$('main > [data-theme], footer[data-theme]').forEach(s => themeIO.observe(s));

  /* ───────── Sound: generated pad, off by default ───────── */
  const btn = $('#sound'), np = $('.np');
  let ctx, master;
  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 850; lp.Q.value = 2;
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .08; lg.gain.value = 450;
    lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    const dly = ctx.createDelay(1), fb = ctx.createGain(); dly.delayTime.value = .42; fb.gain.value = .45; dly.connect(fb); fb.connect(dly);
    // tape hiss, to match the picture
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const ns = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
    ns.buffer = nb; ns.loop = true; nf.type = 'highpass'; nf.frequency.value = 3000; ng.gain.value = .012;
    ns.connect(nf); nf.connect(ng); ng.connect(master); ns.start();
    [174.61, 220, 261.63, 329.63, 392, 523.25].forEach((f, i) => [-8, 7].forEach(det => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = i % 2 ? 'triangle' : 'sawtooth'; o.frequency.value = f; o.detune.value = det;
      g.gain.value = .045 / (1 + i * .25); o.connect(g); g.connect(lp); o.start();
    }));
    lp.connect(master); lp.connect(dly); dly.connect(master); master.connect(ctx.destination);
  }
  btn.addEventListener('click', async () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    if (on) { if (!ctx) build(); await ctx.resume(); master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(.5, ctx.currentTime + 2.5); }
    else if (ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1); setTimeout(() => btn.getAttribute('aria-pressed') !== 'true' && ctx.suspend(), 1100); }
    btn.setAttribute('aria-pressed', on);
    $('#sound-state').textContent = on ? 'on' : 'off';
    np.classList.toggle('on', on);
    $('#np-title').textContent = on ? 'A little haze, made in your browser' : 'Nothing yet';
  });

  /* ───────── Load: a beat of TV static ───────── */
  if (!reduce) {
    const st = document.createElement('canvas'); st.className = 'static'; st.setAttribute('aria-hidden', 'true');
    st.width = Math.ceil(innerWidth / 4); st.height = Math.ceil(innerHeight / 4);
    st.style.cssText = 'width:100%;height:100%;image-rendering:pixelated';
    document.body.appendChild(st);
    const sc = st.getContext('2d'), im = sc.createImageData(st.width, st.height);
    let frames = 0;
    const noise = () => {
      for (let i = 0; i < im.data.length; i += 4) { const v = rnd() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      sc.putImageData(im, 0, 0);
      if (++frames === (isHome ? 4 : 2)) st.style.opacity = '0';
      if (frames < 16) setTimeout(noise, 70); else st.remove();
    };
    noise();
  }

  /* ───────── Resize ───────── */
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fitAll(); films.forEach(f => f.build()); hasGsap && ScrollTrigger.refresh(); }, 150); });

  /* ───────── GSAP choreography ───────── */
  if (!hasGsap) return;
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    if (isHome) {
      const hero = $('.hero'), morph = $('.morph');
      const box = (el, root) => { let x = 0, y = 0, n = el; while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };
      const chip = () => box(chipEl, hero);   // the gap in the wordmark, where the film comes to rest
      const shade = p => { if (sheet.hidden) document.body.dataset.theme = p < .14 ? 'dark' : 'light'; };

      // 1. the film opens full screen; scrolling shrinks it into the wordmark while the words close in
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero, start: 'top top', end: '+=120%', scrub: .8, pin: true, invalidateOnRefresh: true,
          onUpdate: self => shade(self.progress), onRefresh: self => shade(self.progress)
        }
      })
        .to('.cue', { autoAlpha: 0, y: 12, duration: .12 }, 0)
        .fromTo(morph,
          { left: 0, top: 0, width: () => hero.offsetWidth, height: () => innerHeight },
          { left: () => chip().x, top: () => chip().y, width: () => chip().w, height: () => chip().h, duration: 1, ease: 'power3.inOut', immediateRender: true }, 0)
        .fromTo(tame, { x: () => -innerWidth * .7 }, { x: 0, duration: .9, ease: 'power3.out', immediateRender: true }, .1)
        .fromTo(imp, { x: () => innerWidth * .7 }, { x: 0, duration: .9, ease: 'power3.out', immediateRender: true }, .1)
        .fromTo(heroFilm, { amp: .42 }, { amp: .32, duration: 1 }, 0)
        .fromTo('.hero__intro', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .25, immediateRender: true }, .8)
        .to({}, { duration: .15 });   // a short hold on the finished wordmark before the page moves on

      // 2. the Deadbeat arch arrives with the ordinary scroll
      gsap.from('.release__text > *, .corner', { y: 24, autoAlpha: 0, duration: .8, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: release, start: 'top 55%' } });
    }

    // page titles: letters rise, the noise chip opens from a sliver
    if ($('.page-title')) {
      gsap.from('.page-title .pt-word', { yPercent: 60, autoAlpha: 0, duration: 1.1, ease: 'power3.out' });
      gsap.from('.title-chip', { scaleX: 0, transformOrigin: 'left center', duration: 1.1, delay: .2, ease: 'power3.inOut' });
    }

    // statement rows slide in from alternating sides, discs grow
    $$('.state__row').forEach((r, i) => {
      gsap.from(r.querySelectorAll('span'), { xPercent: i % 2 ? 18 : -18, ease: 'none', scrollTrigger: { trigger: r, start: 'top bottom', end: 'top 45%', scrub: .6 } });
      gsap.from(r.querySelectorAll('.disc'), { scale: 0, rotate: -90, ease: 'none', scrollTrigger: { trigger: r, start: 'top 95%', end: 'top 55%', scrub: .6 } });
    });

    // blocks rise into place
    $$('.sec-top, .years, .rec__grid, .tour__bar, .table, .vid__grid, .about__lead, .facts, .sign__form, .listen, .album, .vcard, .story, .latest__card, .step, .portrait').forEach(el =>
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));

    // marquee that reacts to scroll speed
    if ($('.band')) {
      const mq = gsap.to('.band__track', { xPercent: -50, duration: 46, ease: 'none', repeat: -1 });
      ScrollTrigger.create({
        trigger: '.band', start: 'top bottom', end: 'bottom top',
        onUpdate: self => gsap.to(mq, { timeScale: 1 + Math.min(6, Math.abs(self.getVelocity()) / 300), duration: .2, overwrite: true, onComplete: () => gsap.to(mq, { timeScale: 1, duration: 1 }) })
      });
    }

    gsap.from('.foot__word', { yPercent: 60, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: .6 } });
  });
})();
