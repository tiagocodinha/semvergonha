(function () {
  'use strict';

  // ================================================================
  // CONFIGURAÇÃO
  // ================================================================

  var GOOGLE_REVIEW_URL =
    'https://g.page/r/Cb24nnV3W48CEAE/review';

  var GESTIO_REVIEW_EVENT_URL =
    'https://vfhbvpmyceptkgwbcthr.supabase.co/functions/v1/review-event';


  // ================================================================
  // TOKEN
  // ================================================================

  var reviewToken = extractToken();

  function extractToken() {
    var path = window.location.pathname;
    var parts = path.replace(/\/+$/, '').split('/');

    // URL: /review/ABC123
    // parts = ['', 'review', 'ABC123']
    var token = parts.length >= 3 ? parts[2] : null;

    if (
      !token ||
      token === 'review' ||
      token === 'index.html'
    ) {
      return null;
    }

    // Validação básica no browser.
    // A validação real é feita pelo GestIO.
    if (!/^[A-Za-z0-9_-]{3,64}$/.test(token)) {
      return null;
    }

    return token;
  }


  // ================================================================
  // TRACKING → GESTIO
  // ================================================================

  function trackToGestio(
    eventName,
    extraData,
    useKeepalive
  ) {
    if (!reviewToken) {
      return;
    }

    var payload = {
      token: reviewToken,
      event: eventName
    };

    if (extraData) {
      Object.keys(extraData).forEach(
        function (key) {
          payload[key] = extraData[key];
        }
      );
    }

    try {
      fetch(
        GESTIO_REVIEW_EVENT_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(payload),

          mode: 'cors',

          keepalive: useKeepalive === true
        }
      ).catch(function (error) {
        console.debug(
          '[SV Review] GestIO tracking failed:',
          eventName,
          error
        );
      });
    } catch (error) {
      console.debug(
        '[SV Review] GestIO tracking error:',
        eventName,
        error
      );
    }
  }


  // ================================================================
  // ANALYTICS
  // ================================================================

  function trackReviewPageOpen() {
    console.debug(
      '[SV Review] page_open'
    );

    // GestIO
    trackToGestio(
      'review_page_open'
    );

    // GA4 / GTM
    if (
      typeof window.dataLayer !== 'undefined'
    ) {
      window.dataLayer.push({
        event: 'review_page_open'
      });
    }
  }


  function trackGoogleReviewClick() {
    console.debug(
      '[SV Review] google_click'
    );

    // GestIO
    // keepalive porque o utilizador vai sair da página.
    trackToGestio(
      'review_google_click',
      null,
      true
    );

    // GA4 / GTM
    if (
      typeof window.dataLayer !== 'undefined'
    ) {
      window.dataLayer.push({
        event: 'review_google_click'
      });
    }
  }


  function trackStarRating(stars) {
    console.debug(
      '[SV Review] star_rating',
      {
        stars: stars
      }
    );

    // GestIO
    trackToGestio(
      'review_rating_selected',
      {
        rating: stars
      }
    );

    // GA4 / GTM
    if (
      typeof window.dataLayer !== 'undefined'
    ) {
      window.dataLayer.push({
        event: 'review_star_rating',
        review_stars: stars
      });
    }
  }


  function trackFeedbackSubmit(
    stars,
    text
  ) {
    console.debug(
      '[SV Review] feedback_submit',
      {
        stars: stars,
        length: text.length
      }
    );

    // GestIO
    trackToGestio(
      'review_feedback_submitted',
      {
        rating: stars,
        feedback: text
      }
    );

    // GA4 / GTM
    // Não enviar o texto do feedback.
    if (
      typeof window.dataLayer !== 'undefined'
    ) {
      window.dataLayer.push({
        event: 'review_feedback_submit',
        review_stars: stars
      });
    }
  }


  // ================================================================
  // REVIEW FLOW
  // ================================================================

  var selectedStars = 0;


  // ================================================================
  // ELEMENTOS
  // ================================================================

  var starButtons =
    document.querySelectorAll(
      '.review-star'
    );

  var starsHint =
    document.getElementById(
      'starsHint'
    );

  var googleCta =
    document.getElementById(
      'googleCta'
    );

  var googleBtn =
    document.getElementById(
      'googleBtn'
    );

  var ctaMessage =
    document.getElementById(
      'ctaMessage'
    );

  var feedbackWrap =
    document.getElementById(
      'feedbackWrap'
    );

  var feedbackMessage =
    document.getElementById(
      'feedbackMessage'
    );

  var feedbackForm =
    document.getElementById(
      'feedbackForm'
    );

  var feedbackThanks =
    document.getElementById(
      'feedbackThanks'
    );

  var feedbackText =
    document.getElementById(
      'feedbackText'
    );

  var starRating =
    document.getElementById(
      'starRating'
    );

  var page =
    document.getElementById(
      'reviewPage'
    );


  // ================================================================
  // LABELS DAS ESTRELAS
  // ================================================================

  var starLabels = [
    '',
    'Mau',
    'Podia ser melhor',
    'Razoável',
    'Muito bom!',
    'Excelente!'
  ];


  // ================================================================
  // ESTRELAS
  // ================================================================

  starButtons.forEach(
    function (btn) {

      // Hover
      btn.addEventListener(
        'mouseenter',
        function () {
          var hoverStar =
            parseInt(
              this.getAttribute('data-star'),
              10
            );

          if (
            hoverStar >= 1 &&
            hoverStar <= 5
          ) {
            highlightStars(
              hoverStar,
              'hover'
            );
          }
        }
      );


      // Sair do hover
      btn.addEventListener(
        'mouseleave',
        function () {
          clearHoverStars();

          if (selectedStars > 0) {
            highlightStars(
              selectedStars,
              'active'
            );
          }
        }
      );


      // Clique
      btn.addEventListener(
        'click',
        function () {
          var star =
            parseInt(
              this.getAttribute('data-star'),
              10
            );

          if (
            star >= 1 &&
            star <= 5
          ) {
            selectStars(
              star
            );
          }
        }
      );

    }
  );


  // ================================================================
  // HIGHLIGHT DAS ESTRELAS
  // ================================================================

  function highlightStars(
    upTo,
    className
  ) {
    starButtons.forEach(
      function (btn) {
        var star =
          parseInt(
            btn.getAttribute('data-star'),
            10
          );

        btn.classList.remove(
          'active',
          'hover'
        );

        if (star <= upTo) {
          btn.classList.add(
            className
          );
        }
      }
    );
  }


  // ================================================================
  // LIMPAR HOVER
  // ================================================================

  function clearHoverStars() {
    starButtons.forEach(
      function (btn) {
        btn.classList.remove(
          'hover'
        );
      }
    );
  }


  // ================================================================
  // SELECIONAR ESTRELAS
  // ================================================================

  function selectStars(stars) {
    selectedStars = stars;

    highlightStars(
      stars,
      'active'
    );

    if (starsHint) {
      starsHint.textContent =
        starLabels[stars] || '';
    }


    // Registar no GestIO
    trackStarRating(
      stars
    );


    // Bloquear estrelas depois da escolha.
    if (starRating) {
      starRating.classList.add(
        'review-stars--locked'
      );
    }

    if (starsHint) {
      starsHint.classList.add(
        'review-stars-hint--locked'
      );
    }


    // ============================================================
    // FLUXO
    // ============================================================

    // 4–5 estrelas → Google
    if (stars >= 4) {
      showGoogleCta(
        stars
      );
    }

    // 1–3 estrelas → feedback privado
    else {
      showPrivateFeedback(
        stars
      );
    }
  }


  // ================================================================
  // 4–5 ESTRELAS → GOOGLE
  // ================================================================

  function showGoogleCta(stars) {

    if (feedbackWrap) {
      feedbackWrap.hidden = true;
    }

    var messages = {
      4:
        'Boa! Partilha a tua experiência no Google.',

      5:
        'Adoramos ouvir isso! Deixa-nos uma review no Google.'
    };

    if (ctaMessage) {
      ctaMessage.textContent =
        messages[stars] ||
        messages[4];
    }

    if (googleCta) {
      googleCta.hidden = false;
    }
  }


  // ================================================================
  // 1–3 ESTRELAS → FEEDBACK PRIVADO
  // ================================================================

  function showPrivateFeedback(stars) {

    // Google escondido.
    if (googleCta) {
      googleCta.hidden = true;
    }

    if (feedbackThanks) {
      feedbackThanks.hidden = true;
    }

    if (feedbackForm) {
      feedbackForm.style.display = '';
    }

    var messages = {
      1:
        'Lamentamos que a experiência não tenha sido a melhor.',

      2:
        'Queremos melhorar. Conta-nos o que aconteceu.',

      3:
        'Obrigado! Queremos perceber como podemos fazer melhor.'
    };

    if (feedbackMessage) {
      feedbackMessage.textContent =
        messages[stars] ||
        messages[3];
    }

    if (feedbackWrap) {
      feedbackWrap.hidden = false;
    }
  }


  // ================================================================
  // GOOGLE BUTTON
  // ================================================================

  if (googleBtn) {

    // Fallback normal.
    googleBtn.href =
      GOOGLE_REVIEW_URL;


    googleBtn.addEventListener(
      'click',
      function (event) {

        // Registar clique no GestIO primeiro.
        trackGoogleReviewClick();


        // ------------------------------------------------------------
        // DETETAR ANDROID
        // ------------------------------------------------------------

        var isAndroid =
          /Android/i.test(
            navigator.userAgent
          );


        // ------------------------------------------------------------
        // ANDROID
        //
        // Tenta sair do browser interno do WhatsApp
        // e abrir diretamente no Google Chrome.
        // ------------------------------------------------------------

        if (isAndroid) {

          event.preventDefault();

          var chromeIntent =
            'intent://g.page/r/Cb24nnV3W48CEAE/review' +
            '#Intent;' +
            'scheme=https;' +
            'package=com.android.chrome;' +
            'action=android.intent.action.VIEW;' +
            'category=android.intent.category.BROWSABLE;' +
            'S.browser_fallback_url=' +
            encodeURIComponent(
              GOOGLE_REVIEW_URL
            ) +
            ';end';


          window.location.href =
            chromeIntent;

          return;
        }


        // ------------------------------------------------------------
        // IPHONE / IPAD / DESKTOP / OUTROS
        //
        // Usa o link normal.
        // ------------------------------------------------------------

        googleBtn.href =
          GOOGLE_REVIEW_URL;
      }
    );
  }


  // ================================================================
  // FEEDBACK PRIVADO
  // ================================================================

  if (feedbackForm) {

    feedbackForm.addEventListener(
      'submit',
      function (event) {

        event.preventDefault();


        // Obter texto.
        var text =
          feedbackText
            ? feedbackText.value.trim()
            : '';


        // Limite local.
        text =
          text.slice(
            0,
            2000
          );


        if (!text) {
          return;
        }


        // Feedback privado apenas para 1–3 estrelas.
        if (
          selectedStars < 1 ||
          selectedStars > 3
        ) {
          return;
        }


        // Enviar para GestIO.
        trackFeedbackSubmit(
          selectedStars,
          text
        );


        console.debug(
          '[SV Review] feedback_text',
          {
            stars:
              selectedStars,

            length:
              text.length
          }
        );


        // Esconder formulário.
        feedbackForm.style.display =
          'none';


        // Mostrar agradecimento.
        if (feedbackThanks) {
          feedbackThanks.hidden =
            false;
        }
      }
    );
  }


  // ================================================================
  // ANIMAÇÃO
  // ================================================================

  if (page) {
    requestAnimationFrame(
      function () {
        page.classList.add(
          'loaded'
        );
      }
    );
  }


  // ================================================================
  // PAGE OPEN
  // ================================================================

  trackReviewPageOpen();

})();