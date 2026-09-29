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

  var reviewToken =
    extractToken();


  function extractToken() {

    var path =
      window.location.pathname;


    var parts =
      path
        .replace(/\/+$/, '')
        .split('/');


    // Exemplo:
    // /review/ABC123
    //
    // ['', 'review', 'ABC123']

    var token =
      parts.length >= 3
        ? parts[2]
        : null;


    if (
      !token ||
      token === 'review' ||
      token === 'index.html'
    ) {
      return null;
    }


    // Validação básica no browser.
    // A validação autoritativa é feita pelo GestIO.

    if (
      !/^[A-Za-z0-9_-]{3,64}$/.test(token)
    ) {
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

      Object
        .keys(extraData)
        .forEach(function (key) {

          payload[key] =
            extraData[key];

        });

    }


    try {

      fetch(
        GESTIO_REVIEW_EVENT_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(payload),

          mode:
            'cors',

          keepalive:
            useKeepalive === true
        }
      )
      .catch(function (error) {

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


    trackToGestio(
      'review_page_open'
    );


    if (
      typeof window.dataLayer !==
      'undefined'
    ) {

      window.dataLayer.push({
        event:
          'review_page_open'
      });

    }

  }



  function trackGoogleReviewClick() {

    console.debug(
      '[SV Review] google_click'
    );


    // keepalive porque vamos sair da página.

    trackToGestio(
      'review_google_click',
      null,
      true
    );


    if (
      typeof window.dataLayer !==
      'undefined'
    ) {

      window.dataLayer.push({
        event:
          'review_google_click'
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


    trackToGestio(
      'review_rating_selected',
      {
        rating: stars
      }
    );


    if (
      typeof window.dataLayer !==
      'undefined'
    ) {

      window.dataLayer.push({
        event:
          'review_star_rating',

        review_stars:
          stars
      });

    }

  }



  function trackFeedbackSubmit(
    overallRating,
    foodRating,
    serviceRating,
    atmosphereRating,
    text
  ) {

    console.debug(
      '[SV Review] feedback_submit',
      {
        rating:
          overallRating,

        food_rating:
          foodRating,

        service_rating:
          serviceRating,

        atmosphere_rating:
          atmosphereRating,

        has_feedback:
          !!text
      }
    );


    var gestioData = {

      rating:
        overallRating,

      food_rating:
        foodRating,

      service_rating:
        serviceRating,

      atmosphere_rating:
        atmosphereRating

    };


    /*
     * O comentário é opcional.
     *
     * Se estiver vazio, não enviamos a propriedade
     * `feedback`.
     */

    if (text) {

      gestioData.feedback =
        text;

    }


    trackToGestio(
      'review_feedback_submitted',
      gestioData
    );


    /*
     * GA4 / GTM
     *
     * Não enviamos:
     * - token
     * - comentário
     * - dados pessoais
     */

    if (
      typeof window.dataLayer !==
      'undefined'
    ) {

      window.dataLayer.push({

        event:
          'review_feedback_submit',

        review_stars:
          overallRating,

        food_rating:
          foodRating,

        service_rating:
          serviceRating,

        atmosphere_rating:
          atmosphereRating

      });

    }

  }



  // ================================================================
  // REVIEW STATE
  // ================================================================

  var selectedStars =
    0;


  var detailRatings = {

    food:
      0,

    service:
      0,

    atmosphere:
      0

  };



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


  var feedbackError =
    document.getElementById(
      'feedbackError'
    );


  var starRating =
    document.getElementById(
      'starRating'
    );


  var page =
    document.getElementById(
      'reviewPage'
    );


  var detailRatingGroups =
    document.querySelectorAll(
      '[data-rating-group]'
    );



  // ================================================================
  // GENERAL STAR LABELS
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
  // GENERAL STARS
  // ================================================================

  starButtons.forEach(
    function (button) {


      // --------------------------------------------------------------
      // HOVER
      // --------------------------------------------------------------

      button.addEventListener(
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
      // LEAVE
      // --------------------------------------------------------------

      button.addEventListener(
        'mouseleave',
        function () {

          clearHoverStars();


          if (
            selectedStars > 0
          ) {

            highlightStars(
              selectedStars,
              'active'
            );

          }

        }
      );


      // --------------------------------------------------------------
      // CLICK
      // --------------------------------------------------------------

      button.addEventListener(
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
  // GENERAL STAR HIGHLIGHT
  // ================================================================

  function highlightStars(
    upTo,
    className
  ) {

    starButtons.forEach(
      function (button) {

        var star =
          parseInt(
            button.getAttribute(
              'data-star'
            ),
            10
          );


        button.classList.remove(
          'active',
          'hover'
        );


        if (
          star <= upTo
        ) {

          button.classList.add(
            className
          );

        }

      }
    );

  }



  function clearHoverStars() {

    starButtons.forEach(
      function (button) {

        button.classList.remove(
          'hover'
        );

      }
    );

  }



  // ================================================================
  // SELECT GENERAL RATING
  // ================================================================

  function selectStars(stars) {

    selectedStars =
      stars;


    highlightStars(
      stars,
      'active'
    );


    if (starsHint) {

      starsHint.textContent =
        starLabels[stars] || '';

    }


    // Guardar nota geral no GestIO imediatamente.

    trackStarRating(
      stars
    );


    // Bloquear estrelas gerais depois da escolha.

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
    // 4–5 → GOOGLE
    // ============================================================

    if (
      stars >= 4
    ) {

      showGoogleCta(
        stars
      );

    }


    // ============================================================
    // 1–3 → DETAILED FEEDBACK
    // ============================================================

    else {

      showPrivateFeedback(
        stars
      );

    }

  }



  // ================================================================
  // GOOGLE FLOW — 4–5
  // ================================================================

  function showGoogleCta(stars) {

    if (feedbackWrap) {

      feedbackWrap.hidden =
        true;

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

      googleCta.hidden =
        false;

    }

  }



  // ================================================================
  // PRIVATE FEEDBACK — 1–3
  // ================================================================

  function showPrivateFeedback(stars) {

    if (googleCta) {

      googleCta.hidden =
        true;

    }


    if (feedbackThanks) {

      feedbackThanks.hidden =
        true;

    }


    if (feedbackError) {

      feedbackError.hidden =
        true;

    }


    if (feedbackForm) {

      feedbackForm.style.display =
        '';

    }


    var messages = {

      1:
        'Lamentamos que a experiência não tenha sido a melhor.',

      2:
        'Queremos melhorar. Conta-nos o que podemos fazer melhor.',

      3:
        'Obrigado! Ajuda-nos a perceber onde podemos melhorar.'

    };


    if (feedbackMessage) {

      feedbackMessage.textContent =
        messages[stars] ||
        messages[3];

    }


    if (feedbackWrap) {

      feedbackWrap.hidden =
        false;

    }

  }



  // ================================================================
  // DETAILED RATINGS
  // ================================================================

  detailRatingGroups.forEach(
    function (group) {

      var groupName =
        group.getAttribute(
          'data-rating-group'
        );


      var buttons =
        group.querySelectorAll(
          '.review-detail-star'
        );


      buttons.forEach(
        function (button) {

          button.addEventListener(
            'click',
            function () {

              var value =
                parseInt(
                  this.getAttribute(
                    'data-value'
                  ),
                  10
                );


              if (
                value < 1 ||
                value > 5
              ) {

                return;

              }


              /*
               * Guardar valor localmente.
               */

              detailRatings[groupName] =
                value;


              /*
               * Atualizar estrelas desta categoria.
               */

              buttons.forEach(
                function (starButton) {

                  var starValue =
                    parseInt(
                      starButton.getAttribute(
                        'data-value'
                      ),
                      10
                    );


                  starButton.classList.toggle(
                    'active',
                    starValue <= value
                  );

                }
              );


              /*
               * Assim que o utilizador interage,
               * escondemos eventual erro.
               */

              if (feedbackError) {

                feedbackError.hidden =
                  true;

              }

            }
          );

        }
      );

    }
  );



  // ================================================================
  // GOOGLE BUTTON
  // ================================================================

  if (googleBtn) {


    /*
     * Fallback normal.
     */

    googleBtn.href =
      GOOGLE_REVIEW_URL;



    googleBtn.addEventListener(
      'click',
      function (event) {


        // ------------------------------------------------------------
        // TRACK CLICK
        // ------------------------------------------------------------

        trackGoogleReviewClick();



        // ------------------------------------------------------------
        // ANDROID DETECTION
        // ------------------------------------------------------------

        var isAndroid =
          /Android/i.test(
            navigator.userAgent
          );



        // ------------------------------------------------------------
        // ANDROID
        //
        // Tenta sair do browser interno do WhatsApp
        // e abrir diretamente no Chrome.
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
        // Mantém o comportamento normal.
        // ------------------------------------------------------------

        googleBtn.href =
          GOOGLE_REVIEW_URL;

      }
    );

  }



  // ================================================================
  // SUBMIT DETAILED FEEDBACK
  // ================================================================

  if (feedbackForm) {

    feedbackForm.addEventListener(
      'submit',
      function (event) {

        event.preventDefault();



        // ------------------------------------------------------------
        // O FLUXO DE FEEDBACK SÓ É VÁLIDO PARA 1–3
        // ------------------------------------------------------------

        if (
          selectedStars < 1 ||
          selectedStars > 3
        ) {

          return;

        }



        // ------------------------------------------------------------
        // OBTER RATINGS
        // ------------------------------------------------------------

        var foodRating =
          detailRatings.food;


        var serviceRating =
          detailRatings.service;


        var atmosphereRating =
          detailRatings.atmosphere;



        // ------------------------------------------------------------
        // AS TRÊS CATEGORIAS SÃO OBRIGATÓRIAS
        // ------------------------------------------------------------

        if (
          foodRating < 1 ||
          serviceRating < 1 ||
          atmosphereRating < 1
        ) {

          if (feedbackError) {

            feedbackError.hidden =
              false;

          }


          return;

        }



        // ------------------------------------------------------------
        // COMMENT IS OPTIONAL
        // ------------------------------------------------------------

        var text =
          feedbackText
            ? feedbackText.value
                .trim()
                .slice(0, 2000)
            : '';



        // ------------------------------------------------------------
        // SEND TO GESTIO
        // ------------------------------------------------------------

        trackFeedbackSubmit(

          selectedStars,

          foodRating,

          serviceRating,

          atmosphereRating,

          text

        );



        // ------------------------------------------------------------
        // UI SUCCESS
        // ------------------------------------------------------------

        feedbackForm.style.display =
          'none';


        if (feedbackThanks) {

          feedbackThanks.hidden =
            false;

        }


        console.debug(
          '[SV Review] detailed_feedback_sent',
          {

            rating:
              selectedStars,

            food:
              foodRating,

            service:
              serviceRating,

            atmosphere:
              atmosphereRating,

            hasText:
              !!text

          }
        );

      }
    );

  }



  // ================================================================
  // PAGE ANIMATION
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