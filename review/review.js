(function () {
  'use strict';

  // ================================================================
  // CONFIGURAÇÃO — Colocar aqui o URL final do Google Reviews
  // ================================================================
  // Para obter o URL:
  // 1. Pesquisa "Sem Vergonha Nazaré" no Google
  // 2. Clica em "Escrever uma avaliação"
  // 3. Copia o URL completo
  // Exemplo: https://search.google.com/local/writereview?placeid=XXXXX
  var GOOGLE_REVIEW_URL = 'COLOCAR_URL_GOOGLE_AQUI';
  // ================================================================

  // ── Token extraction ──
  var reviewToken = extractToken();

  function extractToken() {
    var path = window.location.pathname;
    var parts = path.replace(/\/+$/, '').split('/');
    // URL: /review/ABC123 → parts = ['', 'review', 'ABC123']
    var token = parts.length >= 3 ? parts[2] : null;

    if (!token || token === 'review' || token === 'index.html') {
      return null;
    }

    // Validate: 3-64 chars, alphanumeric + hyphens/underscores
    if (!/^[A-Za-z0-9_-]{3,64}$/.test(token)) {
      return null;
    }

    return token;
  }

  // ── Analytics stubs ──
  // TODO: Antes de produção, decidir se o token pode ser enviado ao GA4.
  // O token identifica uma visita/mesa, não uma pessoa diretamente,
  // mas pode ser correlacionado com dados internos.
  // NUNCA enviar: nome, email, telefone, ou dados pessoais.

  function trackReviewPageOpen() {
    console.debug('[SV Review] page_open', { token: reviewToken || '(none)' });

    // GA4 / GTM — envia evento se dataLayer existir
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'review_page_open',
        review_token: reviewToken || undefined
      });
    }

    // TODO: Substituir por chamada ao Supabase/GestIO no futuro
    // trackToSupabase('review_page_open', { token: reviewToken });
  }

  function trackGoogleReviewClick() {
    console.debug('[SV Review] google_click', { token: reviewToken || '(none)' });

    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'review_google_click',
        review_token: reviewToken || undefined
      });
    }

    // TODO: Substituir por chamada ao Supabase/GestIO no futuro
    // trackToSupabase('review_google_click', { token: reviewToken });
  }

  function trackStarRating(stars) {
    console.debug('[SV Review] star_rating', { token: reviewToken || '(none)', stars: stars });

    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'review_star_rating',
        review_token: reviewToken || undefined,
        review_stars: stars
      });
    }

    // TODO: Substituir por chamada ao Supabase/GestIO no futuro
    // trackToSupabase('review_star_rating', { token: reviewToken, stars: stars });
  }

  function trackFeedbackSubmit(stars) {
    console.debug('[SV Review] feedback_submit', { token: reviewToken || '(none)', stars: stars });

    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'review_feedback_submit',
        review_token: reviewToken || undefined,
        review_stars: stars
      });
    }

    // TODO: Substituir por chamada ao Supabase/GestIO no futuro
    // trackToSupabase('review_feedback_submit', { token: reviewToken, stars: stars, feedback: text });
  }

  // ── Review gating ──
  var selectedStars = 0;
  var starButtons = document.querySelectorAll('.review-star');
  var starsHint = document.getElementById('starsHint');
  var googleCta = document.getElementById('googleCta');
  var googleBtn = document.getElementById('googleBtn');
  var ctaMessage = document.getElementById('ctaMessage');
  var feedbackWrap = document.getElementById('feedbackWrap');
  var feedbackMessage = document.getElementById('feedbackMessage');
  var feedbackForm = document.getElementById('feedbackForm');
  var feedbackThanks = document.getElementById('feedbackThanks');

  var starLabels = [
    '',
    'Mau',
    'Podia ser melhor',
    'Razoável',
    'Muito bom!',
    'Excelente!'
  ];

  // Hover effect
  starButtons.forEach(function (btn) {
    btn.addEventListener('mouseenter', function () {
      var hoverStar = parseInt(this.getAttribute('data-star'));
      highlightStars(hoverStar, 'hover');
    });

    btn.addEventListener('mouseleave', function () {
      clearHoverStars();
      if (selectedStars > 0) {
        highlightStars(selectedStars, 'active');
      }
    });

    btn.addEventListener('click', function () {
      var star = parseInt(this.getAttribute('data-star'));
      selectStars(star);
    });
  });

  function highlightStars(upTo, className) {
    starButtons.forEach(function (btn) {
      var s = parseInt(btn.getAttribute('data-star'));
      btn.classList.remove('active', 'hover');
      if (s <= upTo) {
        btn.classList.add(className);
      }
    });
  }

  function clearHoverStars() {
    starButtons.forEach(function (btn) {
      btn.classList.remove('hover');
    });
  }

  function selectStars(stars) {
    selectedStars = stars;
    highlightStars(stars, 'active');
    starsHint.textContent = starLabels[stars] || '';

    trackStarRating(stars);

    // Hide stars after selection to prevent gaming the gating
    var starRating = document.getElementById('starRating');
    starRating.classList.add('review-stars--locked');
    starsHint.classList.add('review-stars-hint--locked');

    if (stars >= 4) {
      showGoogleCta(stars);
    } else {
      showPrivateFeedback(stars);
    }
  }

  function showGoogleCta(stars) {
    feedbackWrap.hidden = true;

    var messages = {
      4: 'Boa! Partilha a tua experiência no Google.',
      5: 'Adoramos ouvir isso! Deixa-nos uma review no Google.'
    };
    ctaMessage.textContent = messages[stars] || messages[4];
    googleCta.hidden = false;
  }

  function showPrivateFeedback(stars) {
    googleCta.hidden = true;
    feedbackThanks.hidden = true;
    feedbackForm.style.display = '';

    var messages = {
      1: 'Lamentamos que a experiência não tenha sido a melhor.',
      2: 'Queremos melhorar. Conta-nos o que aconteceu.',
      3: 'Obrigado! Queremos perceber como podemos fazer melhor.'
    };
    feedbackMessage.textContent = messages[stars] || messages[3];
    feedbackWrap.hidden = false;
  }

  // ── Google button ──
  googleBtn.addEventListener('click', function (e) {
    if (GOOGLE_REVIEW_URL === 'COLOCAR_URL_GOOGLE_AQUI' || !GOOGLE_REVIEW_URL) {
      e.preventDefault();
      console.warn('[SV Review] Google Review URL not configured. Set GOOGLE_REVIEW_URL in review.js');
      return;
    }

    trackGoogleReviewClick();
    this.href = GOOGLE_REVIEW_URL;
  });

  // ── Private feedback form ──
  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var text = document.getElementById('feedbackText').value.trim();
    if (!text) return;

    trackFeedbackSubmit(selectedStars);

    // TODO: No futuro, enviar o feedback para Supabase/GestIO
    // sendFeedback({ token: reviewToken, stars: selectedStars, text: text });
    console.debug('[SV Review] feedback_text', { stars: selectedStars, length: text.length });

    feedbackForm.style.display = 'none';
    feedbackThanks.hidden = false;
  });

  // ── Animate in ──
  var page = document.getElementById('reviewPage');
  requestAnimationFrame(function () {
    page.classList.add('loaded');
  });

  // ── Track page open ──
  trackReviewPageOpen();

})();
