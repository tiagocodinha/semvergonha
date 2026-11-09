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

  var HFOV_MAX = 140;   // zoom-out maximo: e o que se usa ao abrir e ao trocar de cena
  var EDIT = /[?&]edit\b/.test(location.search);
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COARSE = window.matchMedia && matchMedia('(pointer: coarse)').matches;

  function $(id) { return document.getElementById(id); }
  var body = document.body;
  var cover = $('cover'), tour = $('tour');
  var info = $('info'), drawer = $('drawer'), missing = $('missing');

  /* ══════════════════════════════════════════════════════════
     IDIOMA  (PT por defeito, partilha a chave sv_lang do site)
     ══════════════════════════════════════════════════════════ */
  var EN = {
    'reserve': 'Book a Table',
    'nav.contacts': 'CONTACTS',
    'cover.label': 'Virtual Tour 360°',
    'cover.h1': 'Come in.<br>No shame.',
    'cover.cta': 'Start the tour',
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
  function autoCover() { clearInterval(slideTimer); slideTimer = setInterval(function () { coverTo((slideNow + 1) % slides.length); }, 5000); }
  slides.forEach(function (_, i) {
    var d = document.createElement('button');
    d.type = 'button'; d.setAttribute('aria-label', 'Foto ' + (i + 1));
    if (i === 0) d.className = 'is-on';
    d.addEventListener('click', function () { coverTo(i); autoCover(); });
    dotsBox.appendChild(d);
  });
  function coverTo(n) {
    slides[slideNow].classList.remove('is-on'); dotsBox.children[slideNow].classList.remove('is-on');
    slideNow = n;
    slides[slideNow].classList.add('is-on'); dotsBox.children[slideNow].classList.add('is-on');
  }
  autoCover();

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
  var viewer = null, current = null, busy = false, autoOn = true, autoTimer, arriving = null;

  function arrow() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }

  function buildGo(div, h) {
    div.innerHTML = '<span class="hs__disc"><i></i><i></i></span>' +
      '<span class="hs__pill"><span class="hs__go">' + arrow() + '</span>' +
      '<span class="hs__txt"><em></em><b class="hs__name" data-to="' + h.to + '"></b></span></span>';
    div.querySelector('em').textContent = pad(byId[h.to].index + 1);
    div.querySelector('.hs__name').textContent = L(byId[h.to].title);
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
    document.querySelectorAll('.hs__name[data-to]').forEach(function (el) { el.textContent = L(byId[el.getAttribute('data-to')].title); });
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
      pitch: s.pitch || 0, yaw: s.yaw || 0, hfov: s.hfov || HFOV_MAX,
      hotSpots: hs
    };
  }

  function createViewer(first) {
    var cfg = {
      'default': {
        firstScene: first.id, sceneFadeDuration: 1400, autoLoad: true,
        minHfov: 45, maxHfov: HFOV_MAX, showControls: false, compass: false,
        keyboardZoom: false, mouseZoom: true, friction: 0.12,
        autoRotateInactivityDelay: 6000
      },
      scenes: {}
    };
    scenes.forEach(function (s) { cfg.scenes[s.id] = sceneConfig(s); });
    // A primeira cena abre com a camara aberta e "aterra" a rodar
    cfg.scenes[first.id].hfov = HFOV_MAX;
    var intro = (first.index === 0 && !location.hash.slice(1) && !REDUCED) ? first.intro : null;
    cfg.scenes[first.id].yaw = intro ? intro.from.yaw : (first.yaw || 0) - 50;
    if (intro) cfg.scenes[first.id].pitch = intro.from.pitch;

    viewer = pannellum.viewer('pano', cfg);
    viewer.on('load', onLoad);
    viewer.on('error', onError);
    arriving = { scene: first, yaw: first.yaw || 0, hfov: first.hfov || HFOV_MAX, dur: intro ? intro.duration : 2600, first: true, intro: intro };
    $('pano').addEventListener('mousedown', hideHint, { once: true });
    $('pano').addEventListener('touchstart', hideHint, { once: true, passive: true });
    if (EDIT) setupEdit();
  }

  /* ── Transicao entre cenas ──────────────────────────────── */
  function goTo(id, opts) {
    opts = opts || {};
    var s = byId[id];
    if (!s || busy || !viewer) return;
    if (current && s.id === current.id) { closeDrawer(); return; }
    busy = true;
    closeDrawer(); closeInfoHotspots(); stopAuto(); hideHint(); missing.hidden = true;

    // Cross-fade directo para a nova cena (sceneFadeDuration); a camara chega
    // ja no maximo zoom-out e roda suavemente ate a direcao final.
    var yaw = (opts.hotspot && typeof opts.hotspot.arrive === 'number') ? opts.hotspot.arrive : (s.yaw || 0);
    arriving = { scene: s, yaw: yaw, hfov: s.hfov || HFOV_MAX, dur: REDUCED ? 0 : 2200 };
    viewer.loadScene(s.id, s.pitch || 0, REDUCED ? yaw : yaw - 28, HFOV_MAX);
  }

  function onLoad() {
    if (!arriving) return;
    var a = arriving; arriving = null;
    missing.hidden = true;
    setCurrent(a.scene, a.first);
    setTimeout(function () {
      if (a.dur) viewer.lookAt(a.scene.pitch || 0, a.yaw, a.hfov, a.dur);
      if (a.intro && a.intro.message) showWelcome(a.intro);
      setTimeout(function () { busy = false; }, a.first ? 300 : 1300);
      setTimeout(function () { if (a.first) showHint(); startAuto(); }, a.dur + 600);
    }, 0);
  }

  // Mensagem de boas-vindas da animacao de abertura: entra, fica messageTime ms e sai
  function showWelcome(intro) {
    var el = $('welcome');
    el.textContent = L(intro.message);
    el.classList.add('is-on');
    setTimeout(function () { el.classList.remove('is-on'); el.classList.add('is-out'); }, intro.messageTime || 3000);
  }

  function onError() {
    // Imagem ainda nao existe: mostra aviso mas deixa navegar
    var a = arriving; arriving = null;
    if (a) setCurrent(a.scene, a.first);
    missing.hidden = false;
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
    var first = s.index === 0, last = s.index === scenes.length - 1;
    $('btnPrev').hidden = first;
    $('btnNext').hidden = last;
    $('btnReserve').hidden = !last;
    $('btnRestart').hidden = !last;
  }

  $('btnNext').addEventListener('click', function () { if (current && scenes[current.index + 1]) goTo(scenes[current.index + 1].id); });
  $('btnPrev').addEventListener('click', function () { if (current && scenes[current.index - 1]) goTo(scenes[current.index - 1].id); });
  $('btnRestart').addEventListener('click', function () { goTo(scenes[0].id); });

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
      if (drawerImages) {
        b.style.backgroundImage = 'url("' + DATA.base + (s.thumb || s.image) + '")';
        // foto normal (thumb) preenche o cartao; sem thumb usa um recorte da imagem 360
        if (s.thumb) b.style.backgroundSize = 'cover';
        if (s.thumbPos) { b.style.backgroundRepeat = 'repeat-x'; b.style.backgroundPosition = s.thumbPos; }
        else if (!s.thumb) thumbView(b, s);
      }
      b.addEventListener('click', function () { goTo(s.id); });
      list.appendChild(b);
    });
  }
  // Miniatura = recorte da imagem 360 centrado numa vista (por defeito, a vista de abertura da cena;
  // podes mudar com thumbYaw / thumbPitch no scenes.js). Tamanho do recorte: 260% da largura.
  function thumbView(el, s) {
    var yaw = typeof s.thumbYaw === 'number' ? s.thumbYaw : (s.yaw || 0);
    var pitch = typeof s.thumbPitch === 'number' ? s.thumbPitch : (s.pitch || 0);
    var S = 2.6, R = 0.3;                                   // zoom do recorte; altura caixa / altura imagem
    var c = ((yaw + 180) % 360 + 360) % 360 / 360;          // posicao horizontal da vista na imagem (0..1)
    var px = (c * S - 0.5) / (S - 1) * 100;                 // pode sair de 0..100: a imagem repete-se na horizontal
    var cv = (90 - Math.max(-90, Math.min(90, pitch))) / 180;
    var py = Math.max(0, Math.min(1, (cv - 0.5 * R) / (1 - R))) * 100;
    el.style.backgroundRepeat = 'repeat-x';
    el.style.backgroundPosition = px.toFixed(1) + '% ' + py.toFixed(1) + '%';
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
