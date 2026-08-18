(function () {
  'use strict';

  var COOKIE_KEY = 'sv_cookie_consent';

  function getConsent() {
    return localStorage.getItem(COOKIE_KEY);
  }

  function setConsent(value) {
    localStorage.setItem(COOKIE_KEY, value);
  }

  function hideBanner() {
    var banner = document.querySelector('.cookie-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(function () { banner.remove(); }, 500);
    }
  }

  function enableGTM() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'event': 'cookie_consent_granted' });
  }

  function init() {
    var consent = getConsent();

    if (consent === 'accepted') {
      enableGTM();
      return;
    }

    if (consent === 'rejected') {
      return;
    }

    var banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    setTimeout(function () {
      banner.classList.add('visible');
    }, 800);

    var acceptBtn = banner.querySelector('.cookie-banner__btn--accept');
    var rejectBtn = banner.querySelector('.cookie-banner__btn--reject');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setConsent('accepted');
        enableGTM();
        hideBanner();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        setConsent('rejected');
        hideBanner();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
