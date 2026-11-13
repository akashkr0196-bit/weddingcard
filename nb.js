/* Traditional Mandap - new page: fills every part from window.__TMN, then reveals it while scrolling. */
(function () {
  var D = window.__TMN || {}, T = D.t || {};
  var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  function has(v) { return String(v || '').trim() !== ''; }
  function put(e, v) { e.textContent = v || ''; if (String(v || '').indexOf('\n') >= 0) e.style.whiteSpace = 'pre-line'; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function hideIfEmpty(e, v) { if (!has(v)) e.hidden = true; }

  /* entrance texts (tap hint etc.) */
  $$('[data-tm]').forEach(function (e) { var v = T[e.getAttribute('data-tm')]; if (typeof v === 'string') e.textContent = v; });

  /* whose name comes first: groom's side prints the groom first, bride's side the bride */
  var gF = D.order !== 'bride', A = gF ? D.groom : D.bride, B = gF ? D.bride : D.groom;
  var F = { relA: gF ? T.sonOf : T.daughterOf, relB: gF ? T.daughterOf : T.sonOf, parA: gF ? T.gParents : T.bParents, parB: gF ? T.bParents : T.gParents, grandA: gF ? T.gGrand : T.bGrand, grandB: gF ? T.bGrand : T.gGrand };
  $$('#nb [data-t]').forEach(function (e) { var v = T[e.getAttribute('data-t')]; if (typeof v === 'string') { put(e, v); hideIfEmpty(e, v); } });
  $$('#nb [data-n]').forEach(function (e) { e.textContent = (e.getAttribute('data-n') === '1' ? A : B) || ''; });
  $$('#nb [data-f]').forEach(function (e) { var v = F[e.getAttribute('data-f')]; put(e, v); hideIfEmpty(e, v); });
  if (document.title === 'Wedding Invitation' && A && B) document.title = A + ' & ' + B + ' · Wedding Invitation';   /* a saved card already has its own title */

  /* ===== save the date: the date hides under a gold card that guests scratch ===== */
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var iso = String(D.iso || ''), m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/), sDay = '', sDate = '';
  if (m) { var u = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); sDay = DAY[u.getUTCDay()]; sDate = (+m[3]) + ' ' + MON[+m[2] - 1] + ' ' + m[1]; }
  if (has(T.dateText)) { sDay = ''; sDate = T.dateText; }   /* typed date text wins */
  put($('#sDay'), sDay); hideIfEmpty($('#sDay'), sDay); put($('#sDateBig'), sDate);
  var when = new Date(iso), days = isNaN(when) ? -1 : Math.ceil((when - Date.now()) / 864e5);
  if (!has(sDate)) $('#sDate').hidden = true;

  var cv = $('#scr'), cx = cv.getContext('2d'), CW = cv.width, CH = cv.height, done = false, down = false, touched = false, lx = 0, ly = 0, lastChk = 0, lastSnd = 0, AC = null;
  function paint() {
    cx.globalCompositeOperation = 'source-over';
    var g = cx.createLinearGradient(0, 0, CW, CH);
    g.addColorStop(0, '#B58E5A'); g.addColorStop(.3, '#F1DDB4'); g.addColorStop(.55, '#C39A62'); g.addColorStop(.78, '#F7E9C9'); g.addColorStop(1, '#B58E5A');
    cx.fillStyle = g; cx.fillRect(0, 0, CW, CH);
    cx.strokeStyle = 'rgba(255,250,235,.22)'; cx.lineWidth = 1.2;
    for (var i = 0; i < 90; i++) { var y = Math.random() * CH, x = Math.random() * CW; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + 40 + Math.random() * 90, y + (Math.random() - .5) * 6); cx.stroke(); }
    cx.strokeStyle = 'rgba(90,26,38,.35)'; cx.lineWidth = 2; cx.strokeRect(22, 22, CW - 44, CH - 44);
    cx.fillStyle = '#5A1A26'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.font = 'italic 600 60px "Cormorant Garamond", Georgia, serif'; cx.fillText(T.scratchTop || 'Scratch here', CW / 2, CH / 2 - 18);
    cx.font = 'italic 500 28px "Cormorant Garamond", Georgia, serif'; cx.fillText(T.scratchSub || 'to see the wedding date', CW / 2, CH / 2 + 38);
    cx.fillStyle = 'rgba(255,248,230,.9)';
    [[70, 70, 7], [CW - 74, 86, 5], [96, CH - 78, 5], [CW - 96, CH - 70, 7]].forEach(function (s) { cx.beginPath(); for (var k = 0; k < 8; k++) { var r = k % 2 ? s[2] * .35 : s[2] * 1.6, a = k * Math.PI / 4; cx.lineTo(s[0] + Math.cos(a) * r, s[1] + Math.sin(a) * r); } cx.fill(); });
  }
  paint(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!touched && !done) paint(); });

  /* little sounds made in the browser (no files): a soft scratch and a happy pop */
  function au() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) {} return AC; }
  function noise(d) { var n = Math.floor(AC.sampleRate * d), b = AC.createBuffer(1, n, AC.sampleRate), a = b.getChannelData(0); for (var i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; return b; }
  function env(g, t, pk, d) { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(pk, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + d); }
  function tone(t, f, d, v) { var o = AC.createOscillator(), g = AC.createGain(); o.type = 'triangle'; o.frequency.value = f; env(g, t, v, d); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + .02); }
  function cheer() {
    if (!au()) return; var t = AC.currentTime + .02;
    var s = AC.createBufferSource(); s.buffer = noise(.2); var bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; var g = AC.createGain(); env(g, t, .5, .14); s.connect(bp); bp.connect(g); g.connect(AC.destination); s.start(t);
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) { tone(t + .16 + i * .085, f, .5, .13); });
  }
  function scr() { var n = performance.now(); if (n - lastSnd < 70 || !au()) return; lastSnd = n; var t = AC.currentTime, s = AC.createBufferSource(); s.buffer = noise(.06); var hp = AC.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500; var g = AC.createGain(); env(g, t, .04, .05); s.connect(hp); hp.connect(g); g.connect(AC.destination); s.start(t); }

  /* gold and blush confetti */
  var pc = $('#nbPop'), px = pc.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), parts = [], raf = 0;
  function rs() { pc.width = innerWidth * dpr; pc.height = innerHeight * dpr; px.setTransform(dpr, 0, 0, dpr, 0, 0); } rs(); addEventListener('resize', rs);
  var PC = ['#C9A06A', '#E9D3A6', '#DDA79D', '#6D1424', '#F6DFD5', '#FFFFFF', '#B58E5A'];
  function shoot(ox, oy, ang, sp, n, pow) { for (var i = 0; i < n; i++) { var a = ang + (Math.random() - .5) * sp, v = pow * (.45 + Math.random() * .65); parts.push({ x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 5 + Math.random() * 7, h: 3 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - .5) * .35, c: PC[i % PC.length], s: Math.random() < .25, ph: Math.random() * 6, life: 0 }); } }
  function frame() {
    px.clearRect(0, 0, innerWidth, innerHeight); parts = parts.filter(function (p) { return p.y < innerHeight + 30 && p.life < 240; });
    parts.forEach(function (p) { p.life++; p.vy += .22; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.ph += .2; px.save(); px.translate(p.x, p.y); px.rotate(p.r); px.fillStyle = p.c; px.globalAlpha = Math.min(1, (240 - p.life) / 60);
      if (p.s) { px.beginPath(); px.arc(0, 0, p.w / 2.2, 0, 7); px.fill(); } else { px.scale(1, Math.cos(p.ph)); px.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); } px.restore(); });
    if (parts.length) raf = requestAnimationFrame(frame); else { px.clearRect(0, 0, innerWidth, innerHeight); raf = 0; }
  }
  function party() {
    cheer(); if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    var r = $('#scw').getBoundingClientRect(), x0 = r.left + r.width / 2, y0 = r.top + r.height / 2, W = innerWidth, H = innerHeight;
    shoot(x0, y0, -Math.PI / 2, Math.PI * 1.1, 70, 10); shoot(0, H, -Math.PI / 3, .7, 50, 15); shoot(W, H, -2 * Math.PI / 3, .7, 50, 15);
    if (!raf) raf = requestAnimationFrame(frame);
    if (window.__petalBurst) window.__petalBurst(x0, y0, 40);
  }
  /* a little scratch is enough */
  function cleared() { var d = cx.getImageData(0, 0, CW, CH).data, k = 0, t = 0; for (var i = 3; i < d.length; i += 64) { t++; if (d[i] < 128) k++; } return k / t; }
  function reveal() {
    if (done) return; done = true; down = false;
    cv.style.opacity = 0; cv.style.pointerEvents = 'none'; $('#scw').classList.add('hit');
    $('#scrBtn').textContent = T.again || 'Celebrate again';
    if (days > 0 && has(T.daysLeft)) { var dl = $('#daysLeft'); dl.textContent = T.daysLeft.replace('{n}', days); dl.hidden = false; }
    party();
  }
  function P(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * CW / r.width, (e.clientY - r.top) * CH / r.height]; }
  function S(e) {
    if (!down || done) return; var p = P(e); touched = true;
    cx.globalCompositeOperation = 'destination-out'; cx.lineCap = cx.lineJoin = 'round'; cx.lineWidth = 70;
    cx.beginPath(); cx.moveTo(lx, ly); cx.lineTo(p[0], p[1]); cx.stroke(); lx = p[0]; ly = p[1]; scr();
    var n = performance.now(); if (n - lastChk > 80) { lastChk = n; if (cleared() > .1) reveal(); }
  }
  cv.addEventListener('pointerdown', function (e) { down = true; try { cv.setPointerCapture(e.pointerId); } catch (x) {} au(); var p = P(e); lx = p[0]; ly = p[1]; S(e); });
  cv.addEventListener('pointermove', S);
  cv.addEventListener('pointerup', function () { down = false; }); cv.addEventListener('pointercancel', function () { down = false; });
  $('#scrBtn').addEventListener('click', function () { au(); if (done) party(); else reveal(); });
  window.__nbScratch = reveal;

  /* functions */
  function maps(e) {
    var q = String(e.map || '').trim();
    return /^https?:\/\//.test(q) ? q : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([e.venue, e.addr].filter(has).join(', '));
  }
  var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z"/></svg>';
  var evs = (D.events || []).filter(function (e) { return e && has(e.name); }), box = $('#evs');
  evs.forEach(function (e, i) {
    var c = el('article', 'ec');
    c.appendChild(el('span', 'no', String(i + 1).padStart(2, '0')));
    c.insertAdjacentHTML('beforeend', '<svg class="orn" viewBox="0 0 300 40" aria-hidden="true"><use href="#fl"/></svg>');
    c.appendChild(el('h3', '', e.name));
    if (has(e.date)) c.appendChild(el('p', 'when', e.date));
    if (has(e.time)) c.appendChild(el('p', 'time', e.time));
    if (has(e.venue) || has(e.addr)) {
      c.appendChild(el('i', 'line'));
      if (has(e.venue)) c.appendChild(el('p', 'ven', e.venue));
      if (has(e.addr)) c.appendChild(el('p', 'adr', e.addr));
      var a = el('a', 'mapb'); a.href = maps(e); a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = PIN; a.appendChild(document.createTextNode(T.mapBtn || 'Open in Google Maps')); c.appendChild(a);
    }
    box.appendChild(c);
  });
  if (!evs.length) $('#sEvents').hidden = true;

  /* ===== genda ki ladi: while you scroll, a gold thread runs down beside the functions, marigolds
     pop onto it one by one, and each function card lights up when the thread reaches it.
     Light on the phone: one path, one moving picture, a few class changes, and only while it is on screen. ===== */
  (function () {
    var vn = $('#vn'); if (!vn || !evs.length) return;
    var svg = vn.querySelector('.vstem'), gold = vn.querySelector('.vgold'), base = svg.querySelector('.vbase'), grow = gold.querySelector('.vgrow'), clip = vn.querySelector('.vclip'), vin = vn.querySelector('.vin'), beadBox = vn.querySelector('.vbeads'), head = vn.querySelector('.vhead'), VH = 0;
    var cards = [].slice.call(vn.querySelectorAll('.ec')), LUT = [], STEP = 2, len = 0, beads = [], nodes = [], active = false, queued = false, last = -1;
    gold.insertAdjacentHTML('afterbegin', '<defs><linearGradient id="vnGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9D3A6"/><stop offset=".5" stop-color="#B58E5A"/><stop offset="1" stop-color="#D9B677"/></linearGradient></defs>');
    function draw() {
      var H = vn.offsetHeight, X = 20, pts = [[X, 0]]; VH = H; if (!H) { len = 0; return; }
      cards.forEach(function (c, i) { pts.push([X + (i % 2 ? -7 : 7), c.offsetTop + 58]); });
      pts.push([X, H]);
      var d = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var i = 1; i < pts.length; i++) { var a = pts[i - 1], b = pts[i], my = (a[1] + b[1]) / 2; d += ' C' + a[0] + ' ' + my + ' ' + b[0] + ' ' + my + ' ' + b[0] + ' ' + b[1]; }
      [svg, gold].forEach(function (g) { g.setAttribute('viewBox', '0 0 44 ' + H); }); base.setAttribute('d', d); grow.setAttribute('d', d);
      len = grow.getTotalLength();
      LUT = []; for (var t = 0; t <= len; t += STEP) { var q = grow.getPointAtLength(t); LUT.push([q.x, q.y]); }
      /* small marigolds every 38px along the thread, a big one where each card begins */
      beadBox.textContent = ''; beads = []; nodes = [];
      var k = 1, rot = [0, 40, -30, 70, -60, 20];
      cards.forEach(function (c, ci) {
        var y = pts[ci + 1][1], at = 0; while (at < LUT.length - 1 && LUT[at][1] < y) at++;
        nodes.push(at * STEP);
      });
      for (var L = 30; L < len - 10; L += 38) {
        var near = nodes.some(function (n) { return Math.abs(n - L) < 26; }); if (near) continue;
        var p = LUT[Math.round(L / STEP)], b = el('img', 'vb'); b.src = 'assets/genda.webp'; b.alt = '';
        b.style.left = p[0] + 'px'; b.style.top = p[1] + 'px'; b.style.setProperty('--rr', rot[k++ % rot.length] + 'deg'); beadBox.appendChild(b); beads.push([L, b]);
      }
      nodes.forEach(function (n) {
        var p = LUT[Math.round(n / STEP)], b = el('img', 'vb big'); b.src = 'assets/genda.webp'; b.alt = '';
        b.style.left = p[0] + 'px'; b.style.top = p[1] + 'px'; beadBox.appendChild(b); beads.push([n, b]);
      });
      beads.sort(function (a, b) { return a[0] - b[0]; });
      last = -1; move();
    }
    function move() {
      queued = false; if (!len) return;
      var r = vn.getBoundingClientRect(), vh = innerHeight; if (!r.height || !vh || !LUT.length) return;   /* hidden (the editor's preview tab is closed): wait for the resize */
      var p = Math.min(1, Math.max(0, (vh * .62 - r.top) / r.height)), at = len * p;
      if (Math.abs(at - last) < .5) return; last = at;
      var q = LUT[Math.min(LUT.length - 1, Math.round(at / STEP))];
      clip.style.transform = 'translate3d(0,' + (q[1] - VH).toFixed(1) + 'px,0)'; vin.style.transform = 'translate3d(0,' + (VH - q[1]).toFixed(1) + 'px,0)';
      head.style.transform = 'translate3d(' + q[0] + 'px,' + q[1] + 'px,0) rotate(' + (Math.sin(p * 18) * 14).toFixed(1) + 'deg)';
      head.classList.toggle('show', p > 0 && p < 1);
      for (var i = 0; i < beads.length; i++) { var on = at >= beads[i][0]; if (beads[i][1]._on !== on) { beads[i][1]._on = on; beads[i][1].classList.toggle('on', on); } }
      cards.forEach(function (c, i) { var on = at >= nodes[i] - 14; if (c._on !== on) { c._on = on; c.classList.toggle('lit', on); } });
    }
    function ask() { if (active && !queued) { queued = true; requestAnimationFrame(move); } }
    addEventListener('scroll', ask, { passive: true });
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(draw, 150); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { active = es[0].isIntersecting; if (active) ask(); }, { rootMargin: '200px 0px' }).observe(vn); else active = true;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    addEventListener('load', draw);
    draw();
    window.__nbVine = function (p) { active = true; window.scrollTo(0, vn.getBoundingClientRect().top + scrollY - innerHeight * .62 + vn.offsetHeight * p); move(); };
  })();

  /* ===== photos: "collage" (album prints at angles) or "stack" (polaroids to tap through) ===== */
  var pics = [D.photo].concat(D.gallery || []).filter(has).slice(0, 12);
  var phStyle = ((location.search.match(/[?&]ph=(\w+)/) || [])[1]) || D.phStyle || 'collage';
  var caps = String(T.phWords || '').split('|').map(function (x) { return x.trim(); }).filter(Boolean);
  function view(src) { var v = el('div', 'nb-view'), im = el('img'); im.src = src; im.alt = ''; v.appendChild(im); v.onclick = function () { v.remove(); }; document.body.appendChild(v); }
  function print(src, cls) {
    var f = el('figure', 'pf ' + (cls || '')), im = el('img'); im.src = src; im.alt = ''; im.loading = 'lazy'; im.draggable = false;
    f.appendChild(im); f.appendChild(el('i', 'k a')); f.appendChild(el('i', 'k b'));
    f.addEventListener('click', function () { view(src); }); return f;
  }
  if (!pics.length) $('#sPhotos').hidden = true;
  else if (phStyle === 'stack') {
    /* B. polaroid stack */
    var pst = $('#pst'), order = [], R = [-5, 4, -2, 6, -6, 3, -4, 5, -3, 2, -5, 4];
    pst.hidden = false;
    pics.forEach(function (src, i) {
      var c = el('div', 'pc'), im = el('img'); im.src = src; im.alt = 'Photo ' + (i + 1); im.draggable = false; c.appendChild(im);
      c.appendChild(el('i', 'tape')); if (caps.length) c.appendChild(el('span', 'cap', caps[i % caps.length]));
      pst.appendChild(c); order.push(c);
    });
    var spr = el('img', 'spr'); spr.src = 'assets/rose-bouquet.webp'; spr.alt = ''; pst.appendChild(spr);
    var pnum = $('#pstN'), top = 0;
    function lay() {
      order.forEach(function (c, k) {   /* k = 0 is the top print */
        c.style.zIndex = 50 - k; c.style.setProperty('--r', (k === 0 ? R[0] * .4 : R[k % R.length]) + 'deg');
        c.style.setProperty('--x', (k === 0 ? 0 : (k % 2 ? 6 : -6)) + 'px'); c.style.setProperty('--y', (k === 0 ? 0 : k * 3) + 'px');
        c.style.visibility = k > 4 ? 'hidden' : '';
      });
      if (order.length > 1) { pnum.hidden = false; pnum.textContent = (top % order.length + 1) + ' / ' + order.length; }
    }
    function next(dir) {
      if (order.length < 2) { view(order[0].querySelector('img').src); return; }
      var c = order[0]; c.style.setProperty('--x', (dir < 0 ? -140 : 140) + '%'); c.style.setProperty('--r', (dir < 0 ? -24 : 24) + 'deg'); c.classList.add('fly');
      setTimeout(function () { order.push(order.shift()); top++; c.classList.remove('fly'); c.style.transition = 'none'; lay(); void c.offsetWidth; c.style.transition = ''; }, 480);
    }
    var sx = 0, sy = 0, dn = false;
    pst.addEventListener('pointerdown', function (e) { dn = true; sx = e.clientX; sy = e.clientY; });
    addEventListener('pointerup', function (e) { if (!dn) return; dn = false; var dx = e.clientX - sx; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - sy)) next(dx < 0 ? -1 : 1); else if (Math.abs(dx) < 8 && Math.abs(e.clientY - sy) < 8) next(1); });
    lay();
    if (order.length > 1 && has(T.phHintStack)) { $('#phHint').hidden = false; put($('#phHint'), T.phHintStack); }
    window.__nbNext = next;
  } else {
    /* A. album collage, in groups of four: tall, wide, (words), wide, tall, (words) */
    var cl = $('#cl'); cl.hidden = false;
    pics.forEach(function (src, i) {
      var s = i % 4, f = print(src, 's' + (s + 1) + ' rv'); cl.appendChild(f);
      if (i === 0) { var a = el('img', 'spr a'); a.src = 'assets/rose-bouquet.webp'; a.alt = ''; f.appendChild(a); }
      if ((s === 1 || s === 3) && caps.length) cl.appendChild(el('p', 'cw rv' + (s === 3 ? ' r' : ''), caps[Math.floor(i / 2) % caps.length]));
    });
    var last = cl.querySelectorAll('.pf'); last = last[last.length - 1];
    if (pics.length > 2) { var b = el('img', 'spr b'); b.src = 'assets/rose-bouquet.webp'; b.alt = ''; last.appendChild(b); }
  }

  /* the couple in the gold frame at the end: their own photo if given, else the painting */
  if (has(D.endPhoto)) $('#endPhoto').src = D.endPhoto;

  /* ===== RSVP ===== */
  var rbox = $('#rsvpBox'), cnt = 1;
  $$('#rsvpBox [data-t]').forEach(function (e) { var v = T[e.getAttribute('data-t')]; if (typeof v === 'string') put(e, v); });
  function openR() { rbox.hidden = false; $('#rsvpForm').hidden = false; $('#rsvpDone').hidden = true; setTimeout(function () { $('#rName').focus(); }, 50); }
  function closeR() { rbox.hidden = true; }
  $('#rsvpOpen').addEventListener('click', openR);
  $('#rsvpClose').addEventListener('click', closeR); $('#rsvpClose2').addEventListener('click', closeR);
  rbox.addEventListener('click', function (e) { if (e.target === rbox) closeR(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !rbox.hidden) closeR(); });
  $('#rMinus').addEventListener('click', function () { cnt = Math.max(1, cnt - 1); $('#rCount').textContent = cnt; });
  $('#rPlus').addEventListener('click', function () { cnt = Math.min(15, cnt + 1); $('#rCount').textContent = cnt; });
  $$('input[name=rAtt]').forEach(function (r) { r.addEventListener('change', function () { $('#rGuestRow').hidden = $('input[name=rAtt]:checked').value !== 'Yes'; }); });
  $('#rSend').addEventListener('click', function () {
    var nm = $('#rName').value.trim(); if (!nm) { $('#rName').focus(); return; }
    var yes = $('input[name=rAtt]:checked').value === 'Yes';
    if (window.__WV_RSVP) fetch(window.__WV_RSVP, { method: 'POST', body: JSON.stringify({ fullName: nm, attendingStatus: yes ? 'Yes' : 'No', numberOfGuests: yes ? cnt : 0, message: $('#rMsg').value.trim() }) }).catch(function () {});
    $('#rsvpForm').hidden = true; $('#rsvpDone').hidden = false;
    if (yes && window.__petalBurst) window.__petalBurst(innerWidth / 2, innerHeight / 2, 36);
  });
  window.__nbRsvp = openR;

  /* family names: one person per "·", one row per new line; a name never breaks in the middle */
  var fl = $('#famList');
  String(T.family || '').split('\n').forEach(function (line, n) {
    if (n) fl.appendChild(document.createElement('br'));
    var parts = line.split('·').map(function (x) { return x.trim(); }).filter(Boolean);
    parts.forEach(function (p, i) {
      if (i) { fl.appendChild(document.createTextNode(' ')); fl.appendChild(el('i', 'sep', '·')); fl.appendChild(document.createTextNode(' ')); }
      fl.appendChild(el('b', '', p));
    });
  });
  if (!has(T.family)) { fl.hidden = true; $('[data-t=loveLine]').hidden = true; }
  /* a dot that lands at the end or start of a row is hidden, so rows never start or end with "·" */
  function seps() {
    var s = [].slice.call(fl.querySelectorAll('.sep'));
    s.forEach(function (e) { e.style.display = ''; });
    s.forEach(function (e) { var a = e.previousSibling && e.previousSibling.previousSibling, b = e.nextSibling && e.nextSibling.nextSibling;
      if (a && b && a.getBoundingClientRect && b.getBoundingClientRect && Math.abs(a.getBoundingClientRect().top - b.getBoundingClientRect().top) > 4) e.style.display = 'none'; });
  }
  seps(); addEventListener('resize', seps); if (document.fonts && document.fonts.ready) document.fonts.ready.then(seps);

  /* the "&" of the monogram in a plain italic, the script font's & looks odd */
  $$('#nb .seal span').forEach(function (e) {
    var v = e.textContent; e.textContent = '';
    v.split('&').forEach(function (p, i) { if (i) e.appendChild(el('i', '', '&')); e.appendChild(document.createTextNode(p.trim())); });
  });

  /* phone numbers: tap to call */
  var TEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>';
  var tels = $('#tels'), nTel = 0;
  [['p1n', 'p1'], ['p2n', 'p2']].forEach(function (k) {
    var num = String(T[k[1]] || '').trim(); if (!num) return; nTel++;
    var a = el('a', 'tel'); a.href = 'tel:' + num.replace(/[^\d+]/g, ''); a.innerHTML = TEL;
    if (has(T[k[0]])) a.appendChild(el('small', '', T[k[0]]));
    a.appendChild(el('span', '', num)); tels.appendChild(a);
  });
  if (!nTel) { tels.hidden = true; $('[data-t=callLine]').hidden = true; $('#telRule').hidden = true; }
  if (!has(T.family)) $('#telRule').hidden = true;

  /* reveal while scrolling */
  var rv = $$('#nb .rv'), first = $$('#sFamily .rv');
  window.__nbShowAll = function () { rv.forEach(function (e) { e.classList.add('in'); }); };
  if (!('IntersectionObserver' in window)) { rv.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  /* the invitation rises line by line as the Ganesh ji scene fades away; lower lines wait for the scroll */
  function showFirst() {
    var k = 0;
    first.forEach(function (e) { if (e.getBoundingClientRect().top < innerHeight) { e.style.transitionDelay = (k++ * .10).toFixed(2) + 's'; e.classList.add('in'); } else io.observe(e); });
  }
  var en = document.getElementById('wiEnter');
  if (document.getElementById('weddingIntro') && en) en.addEventListener('click', function () { setTimeout(showFirst, 100); });
  else showFirst();
  rv.forEach(function (e) { if (first.indexOf(e) < 0) io.observe(e); });
})();
