(function () {
  'use strict';

  // Reservas via CoverManager (popup com iframe).
  // Qualquer elemento com a classe .umai-reserve abre o popup.
  // /reservation/ redireciona para /?reserve=1, que também abre o popup.

  var CM_SLUG = 'restaurante-sem-vergonha';
  var CM_BASE = 'https://www.covermanager.com/reservation/module_restaurant/' + CM_SLUG + '/';
  var CM_RESIZER = 'https://www.covermanager.com/js/iframeResizer/iframeResizer.min.js';

  var overlay = null;
  var iframe = null;
  var closeBtn = null;
  var lastFocus = null;
  var resizerPromise = null;

  function currentLang() {
    var lang = 'pt';
    try { lang = localStorage.getItem('sv_lang') || 'pt'; } catch (e) {}
    return lang === 'en' ? 'english' : 'portuguese';
  }

  function loadResizer() {
    if (window.iFrameResize) return Promise.resolve();
    if (resizerPromise) return resizerPromise;
    resizerPromise = new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = CM_RESIZER;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { resizerPromise = null; resolve(); };
      document.head.appendChild(s);
    });
    return resizerPromise;
  }

  function injectStyles() {
    if (document.getElementById('sv-reservas-css')) return;
    var css =
      '.sv-res{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.6);}' +
      '.sv-res.is-open{display:flex;}' +
      '.sv-res__box{position:relative;width:100%;max-width:640px;max-height:100%;overflow:auto;background:#fff;border-radius:6px;box-shadow:0 20px 60px rgba(0,0,0,.4);-webkit-overflow-scrolling:touch;}' +
      '.sv-res__close{position:sticky;top:0;float:right;z-index:2;display:flex;align-items:center;justify-content:center;width:38px;height:38px;margin:10px 10px -48px 0;border:0;border-radius:50%;background:#755c55;color:#f6ede4;cursor:pointer;padding:0;box-shadow:0 2px 8px rgba(0,0,0,.25);transition:background .2s,transform .25s;}' +
      '.sv-res__close svg{display:block;width:16px;height:16px;}' +
      '.sv-res__close:hover,.sv-res__close:focus-visible{background:#5e4940;transform:rotate(90deg);outline:none;}' +
      '.sv-res__frame{display:block;width:100%;height:550px;min-height:550px;border:0;}' +
      '@media(max-width:600px){.sv-res{padding:0;}.sv-res__box{max-width:none;height:100%;border-radius:0;}}';
    var style = document.createElement('style');
    style.id = 'sv-reservas-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function build() {
    if (overlay) return;
    injectStyles();

    overlay = document.createElement('div');
    overlay.className = 'sv-res';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Reservas');

    var box = document.createElement('div');
    box.className = 'sv-res__box';

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'sv-res__close';
    closeBtn.setAttribute('aria-label', 'Fechar');
    closeBtn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>';

    iframe = document.createElement('iframe');
    iframe.className = 'sv-res__frame';
    iframe.id = CM_SLUG;
    iframe.title = 'Reservas';
    iframe.setAttribute('allow', 'payment');
    iframe.setAttribute('frameborder', '0');

    box.appendChild(closeBtn);
    box.appendChild(iframe);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('mousedown', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  function open() {
    build();

    var src = CM_BASE + currentLang();
    if (iframe.getAttribute('data-src') !== src) {
      iframe.setAttribute('data-src', src);
      iframe.src = src;
      loadResizer().then(function () {
        if (window.iFrameResize) window.iFrameResize({}, iframe);
      });
    }

    lastFocus = document.activeElement;
    overlay.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.umai-reserve').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
    });

    if (new URLSearchParams(window.location.search).get('reserve') === '1') {
      history.replaceState(null, '', window.location.pathname);
      open();
    }
  });

  window.svReservas = { open: open, close: close };
})();
