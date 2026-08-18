(function () {
  'use strict';

  var COOKIE_KEY = 'sv_cookie_consent';

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

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

  function grantConsent() {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted'
    });
  }

  function denyConsent() {
    gtag('consent', 'update', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied'
    });
  }

  function init() {
    var consent = getConsent();

    if (consent === 'accepted') {
      grantConsent();
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
        grantConsent();
        hideBanner();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        setConsent('rejected');
        denyConsent();
        hideBanner();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
