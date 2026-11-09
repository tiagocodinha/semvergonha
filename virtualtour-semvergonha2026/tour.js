/* ============================================================
   SEM VERGONHA — VIRTUAL TOUR
   Pagina autonoma: nao carrega js/main.js nem js/i18n.js.
   As cenas vivem em scenes.js — aqui e so o motor.
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.SV_TOUR;
  var scenes = DATA.scenes;
  var byId = {};
  scenes.forEach(function (s, i) { s.index = i; byId[s.id] = s; });

  var EDIT = /[?&]edit\b/.test(location.search);
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COARSE = window.matchMedia && matchMedia('(pointer: coarse)').matches;

  function $(id) { return document.getElementById(id); }
  var body = document.body;
  var cover = $('cover'), tour = $('tour'), veil = $('veil');
  var info = $('info'), drawer = $('drawer'), missing = $('missing');

  /* ══════════════════════════════════════════════════════════
     IDIOMA  (PT por defeito, partilha a chave sv_lang do site)
     ══════════════════════════════════════════════════════════ */
  var EN = {
    'reserve': 'Book a Table',
    'nav.contacts': 'CONTACTS',
    'cover.label': 'Virtual Tour 360°',
    'cover.h1': 'Come in.<br>No shame.',
    'cover.p': 'Wander through the space, room by room, before you even get here.',
    'cover.cta': 'Start the tour',
    'cover.hint': 'Drag to look around · tap the circles to move on',
    'hint.drag': 'Drag to look around',
    'nav.prev': 'Previous',
    'nav.next': 'Next',
    'nav.restart': 'Start over',
    'drawer.label': 'The spaces',
    'drawer.close': 'Close',
    'ctrl.spaces': 'Spaces',
    'ctrl.rotate': 'Auto-rotate',
    'ctrl.gyro': 'Gyroscope',
    'ctrl.full': 'Fullscreen',
    'info.toggle': 'Show / hide description',
    'err.label': 'Coming soon',
    'err.p': 'This 360° image is not available yet.',
    'count.space': 'Space'
  };
  var lang = 'pt';
  try { lang = localStorage.getItem('sv_lang') === 'en' ? 'en' : 'pt'; } catch (e) {}
  var ptHtml = new Map();
  var ptAria = new Map();

  var PT = { 'count.space': 'Espaço' };
  function t(key) { return lang === 'en' && EN[key] ? EN[key] : (PT[key] || ''); }
  function L(o) { return o ? (o[lang] || o.pt || '') : ''; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function applyStatic() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!ptHtml.has(el)) ptHtml.set(el, el.innerHTML);
      if (lang === 'en' && EN[k]) el.innerHTML = EN[k]; else el.innerHTML = ptHtml.get(el);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria');
      if (!ptAria.has(el)) ptAria.set(el, el.getAttribute('aria-label'));
      el.setAttribute('aria-label', lang === 'en' && EN[k] ? EN[k] : ptAria.get(el));
    });
    document.querySelectorAll('.lang-toggle').forEach(function (b) { b.textContent = lang === 'pt' ? 'EN' : 'PT'; });
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-PT';
  }

  function setLang(next) {
    lang = next;
    try { localStorage.setItem('sv_lang', lang); } catch (e) {}
    applyStatic();
    if (current) { fillInfo(current); refreshHotspotText(); }
    buildProgress(); buildDrawer();
  }

  document.querySelectorAll('.lang-toggle').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); setLang(lang === 'pt' ? 'en' : 'pt'); });
  });

  /* ══════════════════════════════════════════════════════════
     NAV MOBILE
     ══════════════════════════════════════════════════════════ */
  var burger = $('burger'), mob = $('mobMenu');
  burger.addEventListener('click', function () {
    burger.classList.toggle('active');
    mob.classList.toggle('open');
  });
  mob.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { burger.classList.remove('active'); mob.classList.remove('open'); });
  });

  /* ══════════════════════════════════════════════════════════
     CAPA
     ══════════════════════════════════════════════════════════ */
  var slides = document.querySelectorAll('.tcover__slide');
  var dotsBox = $('coverDots'), slideNow = 0, slideTimer;
  slides.forEach(function (_, i) {
    var d = document.createElement('i'); if (i === 0) d.className = 'is-on'; dotsBox.appendChild(d);
  });
  function coverTo(n) {
    slides[slideNow].classList.remove('is-on'); dotsBox.children[slideNow].classList.remove('is-on');
    slideNow = n;
    slides[slideNow].classList.add('is-on'); dotsBox.children[slideNow].classList.add('is-on');
  }
  slideTimer = setInterval(function () { coverTo((slideNow + 1) % slides.length); }, 5000);

  // Aquece a primeira imagem 360 enquanto o visitante le a capa
  function preload(id) {
    var s = byId[id]; if (!s || s._pre) return;
    s._pre = new Image(); s._pre.src = DATA.base + s.image;
  }
  preload(scenes[0].id);
  if (location.hash && byId[location.hash.slice(1)]) preload(location.hash.slice(1));

  /* ══════════════════════════════════════════════════════════
     VIEWER
     ══════════════════════════════════════════════════════════ */
  var viewer = null, current = null, busy = false, autoOn = true, autoTimer, veilAt = 0, arriving = null;

  function arrow() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  }

  function buildGo(div, h) {
    div.innerHTML = '<span class="hs__ring">' + arrow() + '</span><span class="hs__label" data-to="' + h.to + '"></span>';
    div.querySelector('.hs__label').textContent = L(byId[h.to].title);
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.addEventListener('keydown', function (e) { if (e.key === 'Enter') goTo(h.to, { hotspot: h }); });
  }

  function buildInfo(div, h) {
    div.className += ' hs--info';
    div.innerHTML = '<span class="hs__ring"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>' +
      '<div class="hs__pop"><strong></strong><span></span></div>';
    div.setAttribute('data-scene', h._scene); div.setAttribute('data-idx', h._idx);
    fillPop(div);
  }

  function fillPop(div) {
    var d = byId[div.getAttribute('data-scene')].info[+div.getAttribute('data-idx')];
    div.querySelector('strong').textContent = L(d.title);
    div.querySelector('.hs__pop span').textContent = L(d.text);
  }

  function refreshHotspotText() {
    document.querySelectorAll('.hs__label[data-to]').forEach(function (el) { el.textContent = L(byId[el.getAttribute('data-to')].title); });
    document.querySelectorAll('.hs--info').forEach(fillPop);
  }

  function closeInfoHotspots(except) {
    document.querySelectorAll('.hs--info.is-open').forEach(function (el) { if (el !== except) el.classList.remove('is-open'); });
  }

  function sceneConfig(s) {
    var hs = (s.hotspots || []).map(function (h) {
      return {
        pitch: h.pitch, yaw: h.yaw, type: 'custom', cssClass: 'hs',
        createTooltipFunc: buildGo, createTooltipArgs: h,
        clickHandlerFunc: function () { goTo(h.to, { hotspot: h }); }
      };
    });
    (s.info || []).forEach(function (d, i) {
      d._scene = s.id; d._idx = i;
      hs.push({
        pitch: d.pitch, yaw: d.yaw, type: 'custom', cssClass: 'hs',
        createTooltipFunc: buildInfo, createTooltipArgs: d,
        clickHandlerFunc: function (e) {
          var el = (e.currentTarget && e.currentTarget.classList && e.currentTarget.classList.contains('hs')) ? e.currentTarget : e.target.closest('.hs');
          closeInfoHotspots(el); el.classList.toggle('is-open');
        }
      });
    });
    return {
      type: 'equirectangular', panorama: DATA.base + s.image,
      pitch: s.pitch || 0, yaw: s.yaw || 0, hfov: s.hfov || 100,
      hotSpots: hs
    };
  }

  function createViewer(first) {
    var cfg = {
      'default': {
        firstScene: first.id, sceneFadeDuration: 0, autoLoad: true,
        minHfov: 45, maxHfov: 120, showControls: false, compass: false,
        keyboardZoom: false, mouseZoom: true, friction: 0.12,
        autoRotateInactivityDelay: 6000
      },
      scenes: {}
    };
    scenes.forEach(function (s) { cfg.scenes[s.id] = sceneConfig(s); });
    // A primeira cena abre com a camara aberta e "aterra" a rodar
    cfg.scenes[first.id].hfov = 120;
    cfg.scenes[first.id].yaw = (first.yaw || 0) - 50;

    viewer = pannellum.viewer('pano', cfg);
    viewer.on('load', onLoad);
    viewer.on('error', onError);
    arriving = { scene: first, yaw: first.yaw || 0, hfov: first.hfov || 100, dur: 2600, first: true };
    $('pano').addEventListener('mousedown', hideHint, { once: true });
    $('pano').addEventListener('touchstart', hideHint, { once: true, passive: true });
    if (EDIT) setupEdit();
  }

  /* ── Transicao entre cenas ──────────────────────────────── */
  function showVeil(s) {
    $('veilCount').textContent = t('count.space') + ' ' + pad(s.index + 1);
    $('veilTitle').textContent = L(s.title);
    veil.classList.remove('is-out'); veil.classList.add('is-on');
    veilAt = Date.now();
  }
  function hideVeil() {
    veil.classList.remove('is-on'); veil.classList.add('is-out');
  }

  function goTo(id, opts) {
    opts = opts || {};
    var s = byId[id];
    if (!s || busy || !viewer) return;
    if (current && s.id === current.id) { closeDrawer(); return; }
    busy = true;
    closeDrawer(); closeInfoHotspots(); stopAuto(); hideHint(); missing.hidden = true;

    var zoomMs = (opts.hotspot && !REDUCED) ? 850 : 0;
    if (zoomMs) viewer.lookAt(opts.hotspot.pitch, opts.hotspot.yaw, 52, zoomMs);

    setTimeout(function () {
      showVeil(s);
      setTimeout(function () {
        var yaw = (opts.hotspot && typeof opts.hotspot.arrive === 'number') ? opts.hotspot.arrive : (s.yaw || 0);
        arriving = { scene: s, yaw: yaw, hfov: s.hfov || 100, dur: REDUCED ? 0 : 1700 };
        viewer.loadScene(s.id, s.pitch || 0, yaw, REDUCED ? arriving.hfov : (zoomMs ? 62 : 85));
      }, REDUCED ? 0 : 800);
    }, Math.max(0, zoomMs - 120));
  }

  function onLoad() {
    if (!arriving) return;
    var a = arriving; arriving = null;
    missing.hidden = true;
    setCurrent(a.scene, a.first);
    var wait = a.first ? 0 : Math.max(0, 1250 - (Date.now() - veilAt));   // deixa ler o nome do espaco
    setTimeout(function () {
      if (!a.first) hideVeil();
      if (a.dur) viewer.lookAt(a.scene.pitch || 0, a.yaw, a.hfov, a.dur);
      setTimeout(function () { busy = false; }, a.first ? 300 : 900);
      setTimeout(function () { if (a.first) showHint(); startAuto(); }, a.dur + 600);
    }, wait);
  }

  function onError() {
    // Imagem ainda nao existe: mostra aviso mas deixa navegar
    var a = arriving; arriving = null;
    if (a) setCurrent(a.scene, a.first);
    missing.hidden = false;
    hideVeil();
    setTimeout(function () { busy = false; }, 400);
  }

  function setCurrent(s, instant) {
    var changed = current !== s;
    current = s;
    if (changed) {
      info.classList.add('is-swap');
      setTimeout(function () { fillInfo(s); info.classList.remove('is-swap'); }, instant ? 0 : 350);
    }
    document.querySelectorAll('.tprogress button, .tspace').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-id') === s.id);
    });
    try { history.replaceState(null, '', '#' + s.id); } catch (e) {}
    // Aquece as cenas vizinhas
    (s.hotspots || []).forEach(function (h) { preload(h.to); });
    if (scenes[s.index + 1]) preload(scenes[s.index + 1].id);
  }

  /* ── Cartao de descricao ────────────────────────────────── */
  function fillInfo(s) {
    $('infoCount').textContent = t('count.space') + ' ' + pad(s.index + 1) + ' / ' + pad(scenes.length);
    $('infoTitle').textContent = L(s.title);
    $('infoText').textContent = L(s.text);
    var tags = $('infoTags'); tags.innerHTML = '';
    (s.tags || []).forEach(function (tg) { var li = document.createElement('li'); li.textContent = L(tg); tags.appendChild(li); });
    var first = s.index === 0, last = s.index === scenes.length - 1;
    $('btnPrev').hidden = first;
    $('btnNext').hidden = last;
    $('btnReserve').hidden = !last;
    $('btnRestart').hidden = !last;
  }

  $('btnNext').addEventListener('click', function () { if (current && scenes[current.index + 1]) goTo(scenes[current.index + 1].id); });
  $('btnPrev').addEventListener('click', function () { if (current && scenes[current.index - 1]) goTo(scenes[current.index - 1].id); });
  $('btnRestart').addEventListener('click', function () { goTo(scenes[0].id); });
  $('infoToggle').addEventListener('click', function () { info.classList.toggle('is-collapsed'); });
  if (window.matchMedia && matchMedia('(max-width: 768px)').matches) info.classList.add('is-collapsed');

  /* ── Progresso + gaveta ─────────────────────────────────── */
  function buildProgress() {
    var ol = $('progress'); ol.innerHTML = '';
    scenes.forEach(function (s) {
      var li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button'; b.setAttribute('data-id', s.id); b.title = L(s.title); b.setAttribute('aria-label', L(s.title));
      if (current && current.id === s.id) b.className = 'is-on';
      b.addEventListener('click', function () { goTo(s.id); });
      li.appendChild(b); ol.appendChild(li);
    });
  }

  var drawerImages = false;
  function buildDrawer() {
    var list = $('drawerList'); list.innerHTML = '';
    scenes.forEach(function (s) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tspace'; b.setAttribute('data-id', s.id);
      if (current && current.id === s.id) b.className += ' is-on';
      b.innerHTML = '<span><i>' + pad(s.index + 1) + '</i><b></b></span>';
      b.querySelector('b').textContent = L(s.title);
      if (drawerImages) b.style.backgroundImage = 'url("' + DATA.base + (s.thumb || s.image) + '")';
      b.addEventListener('click', function () { goTo(s.id); });
      list.appendChild(b);
    });
  }
  function openDrawer() {
    if (!drawerImages) { drawerImages = true; buildDrawer(); }
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer() { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); }
  $('btnSpaces').addEventListener('click', function () { drawer.classList.contains('is-open') ? closeDrawer() : openDrawer(); });
  $('drawerClose').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  $('pano').addEventListener('click', function (e) { if (!e.target.closest('.hs--info')) closeInfoHotspots(); closeDrawer(); });

  /* ── Controlos ──────────────────────────────────────────── */
  $('btnZoomIn').addEventListener('click', function () { if (viewer) viewer.setHfov(viewer.getHfov() - 15, 300); });
  $('btnZoomOut').addEventListener('click', function () { if (viewer) viewer.setHfov(viewer.getHfov() + 15, 300); });

  var btnRotate = $('btnRotate');
  function startAuto() { if (autoOn && viewer && !REDUCED && !busy) { clearTimeout(autoTimer); autoTimer = setTimeout(function () { if (autoOn && !busy) viewer.startAutoRotate(-2.5); }, 500); } }
  function stopAuto() { clearTimeout(autoTimer); if (viewer) viewer.stopAutoRotate(); }
  btnRotate.addEventListener('click', function () {
    autoOn = !autoOn; btnRotate.setAttribute('aria-pressed', autoOn);
    if (autoOn) startAuto(); else stopAuto();
  });
  if (REDUCED) { autoOn = false; btnRotate.setAttribute('aria-pressed', 'false'); }

  var btnGyro = $('btnGyro');
  if (COARSE && 'DeviceOrientationEvent' in window) {
    btnGyro.hidden = false;
    btnGyro.addEventListener('click', function () {
      if (!viewer) return;
      if (viewer.isOrientationActive()) { viewer.stopOrientation(); btnGyro.setAttribute('aria-pressed', 'false'); }
      else { stopAuto(); viewer.startOrientation(); btnGyro.setAttribute('aria-pressed', 'true'); }
    });
  }

  var btnFull = $('btnFull'), root = document.documentElement;
  var fsEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled;
  if (!fsEnabled) btnFull.hidden = true;
  btnFull.addEventListener('click', function () {
    var on = document.fullscreenElement || document.webkitFullscreenElement;
    if (on) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
  });
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      btnFull.setAttribute('aria-pressed', !!(document.fullscreenElement || document.webkitFullscreenElement));
    });
  });

  /* ── Dica ───────────────────────────────────────────────── */
  var hintTimer;
  function showHint() { $('hint').classList.add('is-on'); hintTimer = setTimeout(hideHint, 6000); }
  function hideHint() { clearTimeout(hintTimer); $('hint').classList.remove('is-on'); }

  /* ── Modo de edicao (?edit): clica para ler yaw / pitch ── */
  function setupEdit() {
    var down = null, toast = $('toast'), tt;
    var pano = $('pano');
    pano.addEventListener('mousedown', function (e) { down = [e.clientX, e.clientY]; });
    pano.addEventListener('mouseup', function (e) {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
      var c = viewer.mouseEventToCoords(e);
      var txt = 'yaw: ' + c[1].toFixed(1) + ', pitch: ' + c[0].toFixed(1);
      console.log(txt);
      toast.textContent = txt + '  (copiado)'; toast.hidden = false;
      try { navigator.clipboard.writeText(txt); } catch (err) {}
      clearTimeout(tt); tt = setTimeout(function () { toast.hidden = true; }, 4000);
    });
  }

  /* ══════════════════════════════════════════════════════════
     ARRANQUE
     ══════════════════════════════════════════════════════════ */
  function start() {
    clearInterval(slideTimer);
    cover.classList.add('is-leaving');
    tour.classList.add('is-active'); tour.setAttribute('aria-hidden', 'false');
    body.classList.remove('is-intro');
    var h = location.hash.slice(1);
    createViewer(byId[h] || scenes[0]);
  }
  $('startBtn').addEventListener('click', start);

  applyStatic();
  buildProgress();
})();
