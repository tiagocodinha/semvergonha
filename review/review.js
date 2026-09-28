(function () {
  'use strict';

  // ================================================================
  // CONFIGURAÇÃO
  // ================================================================

  // Link direto para escrever uma review no Google.
  // Utilizado em desktop.
  var GOOGLE_REVIEW_URL =
    'https://g.page/r/Cb24nnV3W48CEAE/review';

  // Link para abrir a ficha do Sem Vergonha no Google Maps.
  // Utilizado em dispositivos móveis para tentar abrir diretamente
  // a aplicação Google Maps.
  var GOOGLE_MAPS_URL =
    'https://www.google.com/maps/search/?api=1&query=Sem%20Vergonha%20Nazar%C3%A9';

  // Endpoint GestIO / Supabase para tracking das reviews.
  var GESTIO_REVIEW_EVENT_URL =
    'https://vfhbvpmyceptkgwbcthr.supabase.co/functions/v1/review-event';


  // ================================================================
  // TOKEN
  // ================================================================

  var reviewToken = extractToken();

  function extractToken() {
    var path = window.location.pathname;

    // Remove barras finais e divide o URL.
    var parts = path.replace(/\/+$/, '').split('/');

    // Exemplo:
    // /review/ABC123
    //
    // parts:
    // ['', 'review', 'ABC123']
    var token = parts.length >= 3 ? parts[2] : null;

    if (
      !token ||
      token === 'review' ||
      token === 'index.html'
    ) {
      return null;
    }

    // Validação básica no browser.
    // A validação autoritativa é feita pelo GestIO/Supabase.
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
    // Sem token não existe pedido de review identificável.
    if (!reviewToken) {
      return;
    }

    var payload = {
      token: reviewToken,
      event: eventName
    };

    // Adiciona dados opcionais ao payload.
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

          // Especialmente útil quando o utilizador
          // vai sair imediatamente da página.
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

    // GA4 / Google Tag Manager
    //
    // O token NÃO é enviado para Analytics.
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
    //
    // keepalive = true porque o utilizador
    // vai sair da página logo a seguir.
    trackToGestio(
      'review_google_click',
      null,
      true
    );

    // GA4 / Google Tag Manager
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

    // GA4 / Google Tag Manager
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
    //
    // O texto real do feedback vai apenas
    // para o GestIO/Supabase.
    trackToGestio(
      'review_feedback_submitted',
      {
        rating: stars,
        feedback: text
      }
    );

    // GA4 / Google Tag Manager
    //
    // Nunca enviamos o texto do feedback
    // para Analytics.
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

      // --------------------------------------------------------------
      // HOVER
      // --------------------------------------------------------------

      btn.addEventListener(
        'mouseenter',
        function () {
          var hoverStar =
            parseInt(
              this.getAttribute(
                'data-star'
              ),
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


      // --------------------------------------------------------------
      // SAÍDA DO HOVER
      // --------------------------------------------------------------

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


      // --------------------------------------------------------------
      // CLIQUE
      // --------------------------------------------------------------

      btn.addEventListener(
        'click',
        function () {
          var star =
            parseInt(
              this.getAttribute(
                'data-star'
              ),
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
            btn.getAttribute(
              'data-star'
            ),
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


    // --------------------------------------------------------------
    // LABEL
    // --------------------------------------------------------------

    if (starsHint) {
      starsHint.textContent =
        starLabels[stars] || '';
    }


    // --------------------------------------------------------------
    // TRACKING GESTIO
    // --------------------------------------------------------------

    trackStarRating(
      stars
    );


    // --------------------------------------------------------------
    // BLOQUEAR ESTRELAS DEPOIS DA ESCOLHA
    // --------------------------------------------------------------

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


    // --------------------------------------------------------------
    // FLUXO DA REVIEW
    // --------------------------------------------------------------
    //
    // 4–5 estrelas
    // → Google
    //
    // 1–3 estrelas
    // → feedback privado
    // --------------------------------------------------------------

    if (stars >= 4) {
      showGoogleCta(
        stars
      );
    } else {
      showPrivateFeedback(
        stars
      );
    }
  }


  // ================================================================
  // 4–5 ESTRELAS → GOOGLE
  // ================================================================

  function showGoogleCta(stars) {

    // Esconder feedback privado.
    if (feedbackWrap) {
      feedbackWrap.hidden = true;
    }


    var messages = {
      4: 'Boa! Partilha a tua experiência no Google.',
      5: 'Adoramos ouvir isso! Deixa-nos uma review no Google.'
    };


    if (ctaMessage) {
      ctaMessage.textContent =
        messages[stars] ||
        messages[4];
    }


    // Mostrar botão Google.
    if (googleCta) {
      googleCta.hidden = false;
    }
  }


  // ================================================================
  // 1–3 ESTRELAS → FEEDBACK PRIVADO
  // ================================================================

  function showPrivateFeedback(stars) {

    // Esconder botão Google.
    if (googleCta) {
      googleCta.hidden = true;
    }


    // Esconder mensagem de agradecimento,
    // caso estivesse visível.
    if (feedbackThanks) {
      feedbackThanks.hidden = true;
    }


    // Mostrar formulário.
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

    googleBtn.addEventListener(
      'click',
      function (event) {

        // Vamos controlar manualmente
        // para escolher desktop/mobile.
        event.preventDefault();


        // ------------------------------------------------------------
        // TRACKING
        // ------------------------------------------------------------

        trackGoogleReviewClick();


        // ------------------------------------------------------------
        // DETETAR MOBILE
        // ------------------------------------------------------------

        var isMobile =
          /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
          );


        // ------------------------------------------------------------
        // MOBILE → GOOGLE MAPS
        // ------------------------------------------------------------

        if (isMobile) {
          window.location.href =
            GOOGLE_MAPS_URL;
        }

        // ------------------------------------------------------------
        // DESKTOP → FORMULÁRIO DIRETO
        // ------------------------------------------------------------

        else {
          window.location.href =
            GOOGLE_REVIEW_URL;
        }
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


        // ------------------------------------------------------------
        // OBTER TEXTO
        // ------------------------------------------------------------

        var text =
          feedbackText
            ? feedbackText.value.trim()
            : '';


        // ------------------------------------------------------------
        // LIMITE LOCAL
        // ------------------------------------------------------------

        text =
          text.slice(
            0,
            2000
          );


        // ------------------------------------------------------------
        // SEM TEXTO
        // ------------------------------------------------------------

        if (!text) {
          return;
        }


        // ------------------------------------------------------------
        // FEEDBACK PRIVADO APENAS 1–3
        // ------------------------------------------------------------

        if (
          selectedStars < 1 ||
          selectedStars > 3
        ) {
          return;
        }


        // ------------------------------------------------------------
        // ENVIAR PARA GESTIO
        // ------------------------------------------------------------

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


        // ------------------------------------------------------------
        // ESCONDER FORMULÁRIO
        // ------------------------------------------------------------

        feedbackForm.style.display =
          'none';


        // ------------------------------------------------------------
        // MOSTRAR AGRADECIMENTO
        // ------------------------------------------------------------

        if (feedbackThanks) {
          feedbackThanks.hidden =
            false;
        }
      }
    );
  }


  // ================================================================
  // ANIMAÇÃO DA PÁGINA
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
  // TRACK PAGE OPEN
  // ================================================================

  trackReviewPageOpen();

})();