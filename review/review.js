(function () {
  'use strict';


  // ================================================================
  // CONFIGURAÇÃO
  // ================================================================

  var GOOGLE_REVIEW_URL =
    'https://g.page/r/Cb24nnV3W48CEAE/review';


  var GESTIO_REVIEW_EVENT_URL =
    'https://vfhbvpmyceptkgwbcthr.supabase.co/functions/v1/review-event';


  var GESTIO_REVIEW_ACCESS_URL =
    'https://vfhbvpmyceptkgwbcthr.supabase.co/functions/v1/review-access';



  // ================================================================
  // STATE
  // ================================================================

  var reviewToken =
    extractToken();


  var reviewIsActive =
    false;


  var selectedStars =
    0;


  var detailRatings = {
    food: 0,
    service: 0,
    atmosphere: 0
  };



  // ================================================================
  // DOM
  // ================================================================

  var page =
    document.getElementById('reviewPage');


  var reviewLoading =
    document.getElementById('reviewLoading');


  var reviewInvalid =
    document.getElementById('reviewInvalid');


  var reviewExpired =
    document.getElementById('reviewExpired');


  var reviewCompleted =
    document.getElementById('reviewCompleted');


  var reviewUnavailable =
    document.getElementById('reviewUnavailable');


  var reviewContent =
    document.getElementById('reviewContent');


  var starButtons =
    document.querySelectorAll('.review-star');


  var starsHint =
    document.getElementById('starsHint');


  var starRating =
    document.getElementById('starRating');


  var googleCta =
    document.getElementById('googleCta');


  var googleBtn =
    document.getElementById('googleBtn');


  var ctaMessage =
    document.getElementById('ctaMessage');


  var feedbackWrap =
    document.getElementById('feedbackWrap');


  var feedbackMessage =
    document.getElementById('feedbackMessage');


  var feedbackForm =
    document.getElementById('feedbackForm');


  var feedbackSubmit =
    document.getElementById('feedbackSubmit');


  var feedbackThanks =
    document.getElementById('feedbackThanks');


  var feedbackText =
    document.getElementById('feedbackText');


  var feedbackError =
    document.getElementById('feedbackError');


  var detailRatingGroups =
    document.querySelectorAll(
      '[data-rating-group]'
    );



  // ================================================================
  // TOKEN
  // ================================================================

  function extractToken() {

    var path =
      window.location.pathname;


    var parts =
      path
        .replace(/\/+$/, '')
        .split('/');


    var reviewIndex =
      parts.lastIndexOf('review');


    if (
      reviewIndex === -1 ||
      !parts[reviewIndex + 1]
    ) {
      return null;
    }


    var token =
      parts[reviewIndex + 1];


    if (
      !token ||
      token === 'index.html'
    ) {
      return null;
    }


    /*
     * Isto valida apenas o formato.
     *
     * O servidor é que decide se
     * o token existe ou não.
     */

    if (
      !/^[A-Za-z0-9_-]{3,128}$/.test(token)
    ) {
      return null;
    }


    return token;
  }



  // ================================================================
  // REVIEW ACCESS
  // ================================================================

  async function checkReviewAccess() {

    if (!reviewToken) {

      showReviewState(
        'invalid'
      );

      return false;
    }


    try {

      var response =
        await fetch(
          GESTIO_REVIEW_ACCESS_URL,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({
                token: reviewToken
              }),

            mode:
              'cors',

            cache:
              'no-store'
          }
        );


      /*
       * TOKEN NÃO EXISTE
       */

      if (
        response.status === 404
      ) {

        showReviewState(
          'invalid'
        );

        return false;
      }


      /*
       * ERRO TÉCNICO
       */

      if (!response.ok) {

        showReviewState(
          'unavailable'
        );

        return false;
      }


      var data =
        await response.json();


      /*
       * ACTIVE
       */

      if (
        data.status === 'active'
      ) {

        reviewIsActive =
          true;


        showReviewState(
          'active'
        );


        return true;
      }


      /*
       * COMPLETED
       */

      if (
        data.status === 'completed'
      ) {

        reviewIsActive =
          false;


        showReviewState(
          'completed'
        );


        return false;
      }


      /*
       * EXPIRED
       */

      if (
        data.status === 'expired'
      ) {

        reviewIsActive =
          false;


        showReviewState(
          'expired'
        );


        return false;
      }


      showReviewState(
        'invalid'
      );


      return false;

    } catch (error) {

      console.debug(
        '[SV Review] review-access failed:',
        error
      );


      showReviewState(
        'unavailable'
      );


      return false;
    }

  }



  // ================================================================
  // PAGE STATE
  // ================================================================

  function showReviewState(
    state
  ) {

    reviewLoading.hidden =
      true;


    reviewInvalid.hidden =
      true;


    reviewExpired.hidden =
      true;


    reviewCompleted.hidden =
      true;


    reviewUnavailable.hidden =
      true;


    reviewContent.hidden =
      true;


    if (
      state === 'active'
    ) {

      reviewContent.hidden =
        false;


      requestAnimationFrame(
        function () {

          page.classList.add(
            'loaded'
          );

        }
      );


      return;
    }


    /*
     * Ao sair da review ativa
     * removemos a classe de animação.
     */

    page.classList.remove(
      'loaded'
    );


    if (
      state === 'invalid'
    ) {

      reviewInvalid.hidden =
        false;


      return;
    }


    if (
      state === 'expired'
    ) {

      reviewExpired.hidden =
        false;


      return;
    }


    if (
      state === 'completed'
    ) {

      reviewCompleted.hidden =
        false;


      return;
    }


    reviewUnavailable.hidden =
      false;
  }



  // ================================================================
  // SERVER ERROR BODY
  // ================================================================

  async function readErrorData(
    response
  ) {

    try {

      return await response.json();

    } catch (error) {

      return null;

    }

  }



  // ================================================================
  // GESTIO EVENTS
  // ================================================================

  async function sendGestioEvent(
    eventName,
    extraData,
    useKeepalive
  ) {

    if (
      !reviewToken ||
      !reviewIsActive
    ) {

      var inactiveError =
        new Error(
          'Review is not active'
        );


      inactiveError.status =
        409;


      inactiveError.data = {
        status: 'completed'
      };


      throw inactiveError;
    }


    var payload = {
      token:
        reviewToken,

      event:
        eventName
    };


    if (extraData) {

      Object
        .keys(extraData)
        .forEach(
          function (key) {

            payload[key] =
              extraData[key];

          }
        );

    }


    var response =
      await fetch(
        GESTIO_REVIEW_EVENT_URL,
        {
          method:
            'POST',

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
      );


    if (!response.ok) {

      var errorData =
        await readErrorData(
          response
        );


      var error =
        new Error(
          'GestIO event failed'
        );


      error.status =
        response.status;


      error.data =
        errorData;


      throw error;
    }


    return response;
  }



  // ================================================================
  // HANDLE COMPLETED / EXPIRED CONFLICTS
  // ================================================================

  function handleReviewConflict(
    error
  ) {

    if (
      !error ||
      error.status !== 409
    ) {

      return false;
    }


    reviewIsActive =
      false;


    if (
      error.data &&
      error.data.status === 'expired'
    ) {

      showReviewState(
        'expired'
      );


      return true;
    }


    showReviewState(
      'completed'
    );


    return true;
  }



  // ================================================================
  // PAGE OPEN
  // ================================================================

  function trackReviewPageOpen() {

    sendGestioEvent(
      'review_page_open'
    )
    .catch(
      function (error) {

        /*
         * A página acabou de ser validada.
         *
         * Se entretanto ficou concluída
         * ou expirou, mostramos o estado.
         */

        handleReviewConflict(
          error
        );

      }
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



  // ================================================================
  // GENERAL RATING TRACKING
  // ================================================================

  function trackStarRating(
    stars
  ) {

    sendGestioEvent(
      'review_rating_selected',
      {
        rating:
          stars
      }
    )
    .catch(
      function (error) {

        handleReviewConflict(
          error
        );

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



  // ================================================================
  // DETAILED FEEDBACK REQUEST
  // ================================================================

  function sendDetailedFeedback(
    overallRating,
    foodRating,
    serviceRating,
    atmosphereRating,
    text
  ) {

    var payload = {

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
     */

    if (text) {

      payload.feedback =
        text;

    }


    return sendGestioEvent(
      'review_feedback_submitted',
      payload
    );

  }



  // ================================================================
  // STAR LABELS
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


      button.addEventListener(
        'mouseenter',
        function () {

          if (
            !reviewIsActive ||
            selectedStars > 0
          ) {
            return;
          }


          var value =
            parseInt(
              this.getAttribute(
                'data-star'
              ),
              10
            );


          highlightGeneralStars(
            value,
            'hover'
          );

        }
      );


      button.addEventListener(
        'mouseleave',
        function () {

          if (!reviewIsActive) {
            return;
          }


          clearGeneralHover();


          if (
            selectedStars > 0
          ) {

            highlightGeneralStars(
              selectedStars,
              'active'
            );

          }

        }
      );


      button.addEventListener(
        'click',
        function () {

          if (!reviewIsActive) {
            return;
          }


          /*
           * Só pode escolher uma vez
           * nesta página.
           */

          if (
            selectedStars > 0
          ) {
            return;
          }


          var value =
            parseInt(
              this.getAttribute(
                'data-star'
              ),
              10
            );


          if (
            value >= 1 &&
            value <= 5
          ) {

            selectGeneralRating(
              value
            );

          }

        }
      );

    }
  );



  // ================================================================
  // GENERAL STAR VISUALS
  // ================================================================

  function highlightGeneralStars(
    upTo,
    className
  ) {

    starButtons.forEach(
      function (button) {

        var value =
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
          value <= upTo
        ) {

          button.classList.add(
            className
          );

        }

      }
    );

  }



  function clearGeneralHover() {

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

  function selectGeneralRating(
    stars
  ) {

    selectedStars =
      stars;


    highlightGeneralStars(
      stars,
      'active'
    );


    if (starsHint) {

      starsHint.textContent =
        starLabels[stars] || '';

    }


    /*
     * Guardar imediatamente a
     * nota geral no GestIO.
     */

    trackStarRating(
      stars
    );


    /*
     * Esconder estrelas gerais.
     */

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


    /*
     * 4–5 → Google
     */

    if (
      stars >= 4
    ) {

      showGoogleCta(
        stars
      );

    }


    /*
     * 1–3 → feedback detalhado
     */

    else {

      showPrivateFeedback(
        stars
      );

    }

  }



  // ================================================================
  // GOOGLE CTA
  // ================================================================

  function showGoogleCta(
    stars
  ) {

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
  // PRIVATE FEEDBACK
  // ================================================================

  function showPrivateFeedback(
    stars
  ) {

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
        'Queremos melhorar. Ajuda-nos a perceber onde podemos melhorar.',

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

              if (!reviewIsActive) {
                return;
              }


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


              detailRatings[groupName] =
                value;


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
  // FEEDBACK SUBMIT
  // ================================================================

  if (feedbackForm) {

    feedbackForm.addEventListener(
      'submit',
      async function (event) {

        event.preventDefault();


        if (!reviewIsActive) {
          return;
        }


        if (
          selectedStars < 1 ||
          selectedStars > 3
        ) {
          return;
        }


        var foodRating =
          detailRatings.food;


        var serviceRating =
          detailRatings.service;


        var atmosphereRating =
          detailRatings.atmosphere;


        /*
         * As três avaliações são
         * obrigatórias.
         */

        if (
          foodRating < 1 ||
          serviceRating < 1 ||
          atmosphereRating < 1
        ) {

          feedbackError.textContent =
            'Avalia Comida, Serviço e Ambiente antes de enviar.';


          feedbackError.hidden =
            false;


          return;
        }


        /*
         * Comentário opcional.
         */

        var text =
          feedbackText
            ? feedbackText.value
                .trim()
                .slice(0, 2000)
            : '';


        feedbackError.hidden =
          true;


        feedbackSubmit.disabled =
          true;


        var originalButtonText =
          feedbackSubmit.textContent;


        feedbackSubmit.textContent =
          'A ENVIAR...';


        try {

          await sendDetailedFeedback(

            selectedStars,

            foodRating,

            serviceRating,

            atmosphereRating,

            text

          );


          /*
           * O backend confirmou que
           * foi guardado e concluído.
           */

          reviewIsActive =
            false;


          feedbackForm.style.display =
            'none';


          feedbackThanks.hidden =
            false;


          /*
           * Analytics sem:
           * - token
           * - comentário
           * - PII
           */

          if (
            typeof window.dataLayer !==
            'undefined'
          ) {

            window.dataLayer.push({

              event:
                'review_feedback_submit',

              review_stars:
                selectedStars,

              food_rating:
                foodRating,

              service_rating:
                serviceRating,

              atmosphere_rating:
                atmosphereRating

            });

          }


        } catch (error) {

          /*
           * Se o servidor disser que
           * entretanto ficou concluído
           * ou expirou, mostramos
           * o estado correto.
           */

          if (
            handleReviewConflict(
              error
            )
          ) {

            return;
          }


          /*
           * Erro técnico real.
           */

          console.debug(
            '[SV Review] feedback submit failed:',
            error
          );


          feedbackError.textContent =
            'Não foi possível enviar o feedback. Tenta novamente.';


          feedbackError.hidden =
            false;


          feedbackSubmit.disabled =
            false;


          feedbackSubmit.textContent =
            originalButtonText;

        }

      }
    );

  }



  // ================================================================
  // GOOGLE NAVIGATION
  // ================================================================

  function navigateToGoogleReview() {

    var isAndroid =
      /Android/i.test(
        navigator.userAgent
      );


    /*
     * ANDROID
     *
     * Tenta sair do browser interno
     * do WhatsApp e abrir Chrome.
     */

    if (isAndroid) {

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


    /*
     * iPhone / desktop / outros.
     */

    window.location.href =
      GOOGLE_REVIEW_URL;
  }



  // ================================================================
  // GOOGLE CLICK
  // ================================================================

  if (googleBtn) {

    googleBtn.href =
      GOOGLE_REVIEW_URL;


    googleBtn.addEventListener(
      'click',
      async function (event) {

        /*
         * Controlamos nós a navegação
         * para só sair depois de o servidor
         * registar o clique.
         */

        event.preventDefault();


        if (!reviewIsActive) {
          return;
        }


        googleBtn.setAttribute(
          'aria-disabled',
          'true'
        );


        try {

          await sendGestioEvent(
            'review_google_click',
            null,
            true
          );


          /*
           * Servidor confirmou:
           * completed_at + google_click
           */

          reviewIsActive =
            false;


          /*
           * Analytics.
           */

          if (
            typeof window.dataLayer !==
            'undefined'
          ) {

            window.dataLayer.push({
              event:
                'review_google_click'
            });

          }


          navigateToGoogleReview();


        } catch (error) {

          /*
           * Já concluído / expirado.
           */

          if (
            handleReviewConflict(
              error
            )
          ) {

            return;
          }


          /*
           * Erro técnico.
           *
           * Como não conseguimos confirmar
           * o clique no GestIO, mostramos
           * erro em vez de fingir que ficou
           * concluído.
           */

          console.debug(
            '[SV Review] Google click failed:',
            error
          );


          googleBtn.removeAttribute(
            'aria-disabled'
          );


          showReviewState(
            'unavailable'
          );

        }

      }
    );

  }



  // ================================================================
  // INIT
  // ================================================================

  async function initReview() {

    var accessGranted =
      await checkReviewAccess();


    if (!accessGranted) {
      return;
    }


    /*
     * Só contamos page_open depois
     * de confirmar que o token é real,
     * ativo e ainda não expirou.
     */

    trackReviewPageOpen();

  }


  initReview();


})();