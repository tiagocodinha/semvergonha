/* Pop-up Passagem de Ano 2027 — mostrado uma única vez por browser */
(function () {
  'use strict';

  var STORAGE_KEY = 'sv_pda2027_popup_seen';
  var EXPIRES = new Date('2027-01-01T06:00:00+00:00'); // deixa de aparecer depois do evento
  var DELAY_MS = 1200;

  var popup = document.getElementById('pdaPopup');
  if (!popup || new Date() > EXPIRES) return;

  function store(method, value) {
    try { return value === undefined ? localStorage.getItem(method) : localStorage.setItem(method, value); }
    catch (e) { return null; }
  }

  // Em testes (localhost / 127.0.0.1) ou com ?popup no URL aparece sempre
  var isTest = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]popup\b/.test(location.search);
  if (!isTest && store(STORAGE_KEY)) return;

  var lastFocus;

  function open() {
    store(STORAGE_KEY, '1');
    if (typeof window.clarity === 'function') window.clarity('event', 'popup_visto');
    lastFocus = document.activeElement;
    popup.hidden = false;
    document.documentElement.classList.add('pda-popup-open');
    requestAnimationFrame(function () { popup.classList.add('is-open'); });
    var closeBtn = popup.querySelector('.pda-popup__close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
    document.addEventListener('keydown', onKey);
  }

  function close() {
    popup.classList.remove('is-open');
    document.documentElement.classList.remove('pda-popup-open');
    document.removeEventListener('keydown', onKey);
    setTimeout(function () { popup.hidden = true; }, 350);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  popup.querySelectorAll('[data-pda-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });

  var cta = document.getElementById('pdaPopupCta');
  if (cta) {
    cta.addEventListener('click', function () {
      if (window.dataLayer) window.dataLayer.push({ event: 'pda2027_popup_saber_mais' });
      if (typeof window.clarity === 'function') window.clarity('event', 'popup_saber_mais');
    });
  }

  setTimeout(open, DELAY_MS);
})();
