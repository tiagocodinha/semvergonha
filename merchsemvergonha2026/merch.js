/* ============================================================
   SEM VERGONHA — MERCH
   Pagina autonoma: nao carrega js/main.js nem js/i18n.js para
   nao interferir com o resto do site. Tudo o que precisa esta aqui.
   ============================================================ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1 · CONFIGURACAO   ← é AQUI que mexes no dia-a-dia
     ══════════════════════════════════════════════════════════ */

  var CONFIG = {

    /* ---- Endpoint da Supabase Edge Function -------------------
       Projeto dedicado ao merch (separado do /review/).           */
    API: 'https://vwhjxgbmyvqslgojmdbt.supabase.co/functions/v1/merch-order',

    /* ---- Portes (tem de ser IGUAL ao servidor) ----------------
       Os valores aqui servem so para MOSTRAR. Quem manda no preco
       cobrado e a Edge Function — nunca confiar no browser.       */
    shipping: {
      fee: 4.50,          // portes para Portugal Continental
      freeFrom: 50.00     // gratis a partir deste subtotal (null = nunca)
    },

    /** Maximo por tamanho+cor, e total de pecas por encomenda. */
    maxPerSize: 5,
    maxItems: 10,

    /* ---- Catalogo (tem de ser IGUAL ao servidor) --------------
       A foto vive na COR, nao no produto: so temos fotos do branco.
       image: '/assets/tshirt1'  → usa tshirt1-{500,800,1200}.{webp,jpg}
       image: null                    → desenha o placeholder na cor  */
    products: [
      {
        id: 'tee-vergonha',
        name:   { pt: 'T-Shirt • A Vergonha é inimiga da Perfeição',
                  en: 'T-Shirt • A Vergonha é inimiga da Perfeição' },
        desc:   { pt: 'Corte oversize em algodão. Logo pequeno à frente, ilustração nas costas.',
                  en: 'Oversized cut in cotton. Small logo on the front, illustration on the back.' },
        tag:    { pt: 'Edição Limitada', en: 'Limited Edition' },
        price: 24.90,
        colors: [
          { id: 'branco',   name: { pt: 'Branco',   en: 'White' }, hex: '#fbfaf8',
            image: '/assets/tshirt1' },
          { id: 'castanho', name: { pt: 'Castanho', en: 'Brown' }, hex: '#755c55',
            image: null }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        soldOut: []   // ex: ['S', 'XXL']
      },
      {
        id: 'tee-amigos',
        name:   { pt: 'T-Shirt • Amigos Amigos Vergonha à Parte',
                  en: 'T-Shirt • Amigos Amigos Vergonha à Parte' },
        desc:   { pt: 'Corte oversize em algodão. Logo pequeno à frente, ilustração nas costas.',
                  en: 'Oversized cut in cotton. Small logo on the front, illustration on the back.' },
        tag:    { pt: 'Edição Limitada', en: 'Limited Edition' },
        price: 27.90,
        colors: [
          { id: 'branco',   name: { pt: 'Branco',   en: 'White' }, hex: '#fbfaf8',
            image: '/assets/tshirt2' },
          { id: 'castanho', name: { pt: 'Castanho', en: 'Brown' }, hex: '#755c55',
            image: null }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        soldOut: []
      }
    ]
  };


  /* ══════════════════════════════════════════════════════════
     2 · TRADUCOES
     ══════════════════════════════════════════════════════════ */

  var EN = {
    'reserve': 'Book a Table',
    'nav.contacts': 'CONTACTS',
    'footer.hours': 'Hours',
    'footer.contact': 'Contact',
    'footer.follow': 'Follow us',
    'footer.everyday': 'Every day',
    'footer.rights': '&copy; 2026 Sem Vergonha. All rights reserved.',
    'footer.tagline': 'Restaurant &amp; Cocktail Bar',
    'footer.cookies': 'Cookie Policy',
    'footer.phone_note': '(Call to national mobile network)',

    'merch.hero_label': 'Official Store',
    'merch.hero_h1': 'Wear<br>Sem Vergonha.',
    'merch.hero_p': 'Made with the same care as our plates. Limited edition, heavyweight cotton, built to outlast a night in Nazaré.',
    'merch.hero_cta': 'See the collection',
    'merch.pill2': 'Limited edition',

    'merch.prod_label': 'T-Shirts',
    'merch.prod_h2': 'The collection.',
    'merch.prod_p': 'Two Portuguese sayings, twisted our way. Pick yours and your size — we handle the rest.',
    'merch.prod_note': 'Prices include VAT. Limited stock — when it is gone, it is gone.',

    'merch.faq_label': 'Before you buy',
    'merch.faq_h2': 'Quick questions.',
    'merch.faq_q1': 'How do I get my t-shirt?',
    'merch.faq_a1': 'You choose at checkout: pick up at the restaurant (Av. da República 6, Nazaré) at no cost, or delivery by post within mainland Portugal.',
    'merch.faq_q2': 'How long does it take?',
    'merch.faq_a2': 'Pick-up: we email you as soon as it is ready, usually within 2 to 3 working days. Delivery: 3 to 5 working days after payment is confirmed.',
    'merch.faq_q3': 'Can I exchange the size?',
    'merch.faq_a3': 'Yes. You have 14 days to exchange it, as long as it is unworn and still has the tag. Email us and we will sort it out.',
    'merch.faq_q4': 'Is the payment secure?',
    'merch.faq_a4': 'It is. Payments are processed by Paybyrd in a PCI-DSS certified environment. We never see or store your card details.',
    'merch.faq_q5': 'Do I need an invoice with a tax number?',
    'merch.faq_a5': 'You can add your tax number at checkout, in the optional field. The invoice goes out by email.',
    'merch.faq_contact': 'Still have a question? Write to us at <a href="mailto:hey@semvergonharestaurant.com">hey@semvergonharestaurant.com</a>',

    'merch.color': 'Colour',
    'merch.sizes': 'Sizes',
    'merch.sizes_hint': 'Switch colour to add other sizes to the same order.',
    'merch.size_guide': 'Size guide',
    'merch.size_err': 'Pick at least one size.',
    'merch.sel': 'Your selection',
    'merch.st_size': 'Size',
    'merch.st_chest': 'Chest (cm)',
    'merch.st_len': 'Length (cm)',
    'merch.st_note': 'Measurements taken flat, 2 cm tolerance. Unisex fit.',
    'merch.continue': 'Continue',
    'merch.back': 'Back',

    'merch.checkout_h': 'Your details',
    'merch.f_name': 'Full name *',
    'merch.f_email': 'Email *',
    'merch.f_phone': 'Mobile *',
    'merch.f_delivery': 'Delivery',
    'merch.del_pickup': 'Pick up at the restaurant',
    'merch.del_pickup_d': 'Av. da República 6, Nazaré · Free',
    'merch.del_ship': 'Delivery by post',
    'merch.f_addr': 'Address *',
    'merch.f_zip': 'Postcode *',
    'merch.f_city': 'City *',
    'merch.f_vat': 'Tax number (optional)',
    'merch.f_notes': 'Notes (optional)',
    'merch.sum_subtotal': 'Subtotal',
    'merch.sum_ship': 'Shipping',
    'merch.sum_total': 'Total',
    'merch.f_terms': 'I confirm this order carries an obligation to pay and that I have read the <a href=\"/politica-privacidade/\" target=\"_blank\" rel=\"noopener\">Privacy Policy</a>.',
    'merch.pay': 'Pay',
    'merch.secure': 'Secure payment processed by Paybyrd. Multibanco, MB WAY and card.',
    'merch.res_back': 'Back to the store',

    /* strings dinamicas */
    'js.buy': 'Buy',
    'js.free': 'Free',
    'js.ship_free_from': '{fee} · free over {from}',
    'js.ship_flat': '{fee} · mainland Portugal',
    'js.soldout': 'Sold out',
    'js.remove': 'Remove',
    'js.items_one': '1 item',
    'js.items_many': '{n} items',
    'js.max_items': 'Up to {n} items per order. Email us for larger orders.',
    'js.pay_amount': 'Pay {total}',
    'js.err_required': 'Please fill in every required field.',
    'js.err_email': 'That email address does not look right.',
    'js.err_phone': 'Please enter a valid phone number.',
    'js.err_zip': 'Postcode should look like 2450-104.',
    'js.err_vat': 'A Portuguese tax number has 9 digits.',
    'js.err_terms': 'You need to accept the terms to continue.',
    'js.err_network': 'We could not reach the payment service. Please check your connection and try again.',
    'js.err_generic': 'Something went wrong creating your order. Please try again in a moment.',
    'js.res_wait_t': 'Confirming your payment…',
    'js.res_wait_p': 'Just a second while we check with the bank.',
    'js.res_ok_t': 'All set. Thank you!',
    'js.res_ok_p': 'Your payment went through. You will get a confirmation email shortly with everything you need.',
    'js.res_pending_t': 'Almost there',
    'js.res_pending_p': 'We are still waiting for the payment to clear — Multibanco can take a few minutes. We will email you as soon as it is confirmed.',
    'js.res_fail_t': 'The payment did not go through',
    'js.res_fail_p': 'Nothing was charged. You can try again, or email us at hey@semvergonharestaurant.com and we will help.',
    'js.res_ref': 'Order {ref}',
    'js.cfg_title': 'Merch not configured yet',
    'js.cfg_text': 'Set <code>CONFIG.API</code> in <code>/merchsemvergonha2026/merch.js</code> to your Supabase Edge Function URL. Payments are disabled until then.'
  };

  var lang = 'pt';
  try { lang = localStorage.getItem('sv_lang') === 'en' ? 'en' : 'pt'; } catch (e) {}

  var originals = new Map();

  function t(key, vars) {
    var s = (lang === 'en' && EN[key]) ? EN[key] : PT(key);
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split('{' + k + '}').join(vars[k]);
      });
    }
    return s;
  }

  /* Fallback PT das strings dinamicas (as estaticas vivem no HTML). */
  var PT_DYN = {
    'js.buy': 'Comprar',
    'js.free': 'Grátis',
    'js.ship_free_from': '{fee} · grátis acima de {from}',
    'js.ship_flat': '{fee} · Portugal Continental',
    'js.soldout': 'Esgotado',
    'js.remove': 'Remover',
    'js.items_one': '1 artigo',
    'js.items_many': '{n} artigos',
    'js.max_items': 'Máximo de {n} artigos por encomenda. Para mais, escreve-nos.',
    'js.pay_amount': 'Pagar {total}',
    'js.err_required': 'Preenche todos os campos obrigatórios.',
    'js.err_email': 'Esse email não parece estar certo.',
    'js.err_phone': 'Indica um número de telefone válido.',
    'js.err_zip': 'O código postal deve ser do tipo 2450-104.',
    'js.err_vat': 'O NIF tem 9 dígitos.',
    'js.err_terms': 'Precisas de aceitar as condições para continuar.',
    'js.err_network': 'Não conseguimos falar com o serviço de pagamentos. Verifica a ligação e tenta outra vez.',
    'js.err_generic': 'Algo correu mal ao criar a encomenda. Tenta novamente daqui a pouco.',
    'js.res_wait_t': 'A confirmar o pagamento…',
    'js.res_wait_p': 'Um segundo, estamos a verificar com o banco.',
    'js.res_ok_t': 'Está feito. Obrigado!',
    'js.res_ok_p': 'O pagamento foi aceite. Vais receber um email de confirmação daqui a pouco com tudo o que precisas.',
    'js.res_pending_t': 'Quase lá',
    'js.res_pending_p': 'Ainda estamos à espera que o pagamento seja liquidado — o Multibanco pode demorar uns minutos. Avisamos-te por email assim que estiver confirmado.',
    'js.res_fail_t': 'O pagamento não foi concluído',
    'js.res_fail_p': 'Não foi cobrado nada. Podes tentar de novo, ou escrever-nos para hey@semvergonharestaurant.com que ajudamos.',
    'js.res_ref': 'Encomenda {ref}',
    'js.cfg_title': 'Merch ainda não configurado',
    'js.cfg_text': 'Define <code>CONFIG.API</code> em <code>/merchsemvergonha2026/merch.js</code> com o URL da tua Supabase Edge Function. Até lá, os pagamentos estão desativados.'
  };
  function PT(key) { return PT_DYN[key] || key; }

  function collectOriginals() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (!originals.has(el)) { originals.set(el, el.innerHTML); }
    });
  }

  function applyLang(next) {
    lang = next;
    collectOriginals();
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (lang === 'en' && EN[key]) { el.innerHTML = EN[key]; }
      else if (originals.has(el)) { el.innerHTML = originals.get(el); }
    });
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-PT';
    try { localStorage.setItem('sv_lang', lang); } catch (e) {}
    document.querySelectorAll('.lang-toggle').forEach(function (b) {
      b.textContent = lang === 'pt' ? 'EN' : 'PT';
    });
    renderGrid();
    if (state.product) { renderSheet(); }
    refreshSummary();
  }

  function L(obj) { return (obj && (obj[lang] || obj.pt)) || ''; }


  /* ══════════════════════════════════════════════════════════
     3 · UTILITARIOS
     ══════════════════════════════════════════════════════════ */

  /* Todos os calculos correm em centimos para nao acumular erro de virgula. */
  function toCents(eurValue) { return Math.round(eurValue * 100); }

  function money(cents) {
    var v = cents / 100;
    try {
      return new Intl.NumberFormat(lang === 'en' ? 'en-IE' : 'pt-PT',
        { style: 'currency', currency: 'EUR' }).format(v);
    } catch (e) {
      return v.toFixed(2).replace('.', ',') + ' €';
    }
  }

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function teePlaceholder(hex) {
    return '' +
      '<div class="mph">' +
        '<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<path class="mph__tee" style="--ph-fill:' + esc(hex) + '" ' +
            'd="M97 26C112 44 144 44 159 26L196 40 224 92 188 112V222C148 233 108 233 68 222V112L32 92 60 40Z"/>' +
          '<path d="M98 132c7.5-8 15-8 22.5 0s15 8 22.5 0 15-8 22.5 0" fill="none" ' +
            'stroke="rgba(94,73,64,.4)" stroke-width="3.5" stroke-linecap="round"/>' +
          '<path d="M98 148c7.5-8 15-8 22.5 0s15 8 22.5 0 15-8 22.5 0" fill="none" ' +
            'stroke="rgba(94,73,64,.22)" stroke-width="3" stroke-linecap="round"/>' +
        '</svg>' +
      '</div>';
  }

  /** A foto pertence a cor. Sem foto, desenha o placeholder nessa cor. */
  function mediaFor(product, color) {
    var c = color || product.colors[0];
    if (c && c.image) {
      var b = esc(c.image);
      var alt = esc(L(product.name) + ' — ' + L(c.name));
      return '<picture>' +
               '<source type="image/webp" srcset="' + b + '-500.webp 500w, ' + b + '-800.webp 800w, ' + b + '-1200.webp 1200w" ' +
                 'sizes="(max-width: 780px) 100vw, 560px">' +
               '<img src="' + b + '-800.jpg" ' +
                 'srcset="' + b + '-500.jpg 500w, ' + b + '-800.jpg 800w, ' + b + '-1200.jpg 1200w" ' +
                 'sizes="(max-width: 780px) 100vw, 560px" ' +
                 'width="1200" height="800" loading="lazy" decoding="async" ' +
                 'alt="' + alt + '">' +
             '</picture>';
    }
    return teePlaceholder((c && c.hex) || '#fffaf6');
  }

  function shippingFee(subtotalCents) {
    var s = CONFIG.shipping;
    if (s.freeFrom !== null && s.freeFrom !== undefined && subtotalCents >= toCents(s.freeFrom)) {
      return 0;
    }
    return toCents(s.fee);
  }

  var apiReady = CONFIG.API.indexOf('<PROJECT-REF>') === -1;


  /* ══════════════════════════════════════════════════════════
     4 · NAV + REVEAL (versao minima, so para esta pagina)
     ══════════════════════════════════════════════════════════ */

  function initChrome() {
    var nav = $('nav');
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle('scrolled', window.scrollY > 40);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var burger = $('burger');
    var mob = $('mobMenu');
    if (burger && mob) {
      burger.addEventListener('click', function () {
        burger.classList.toggle('active');
        mob.classList.toggle('open');
      });
      mob.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.classList.remove('active');
          mob.classList.remove('open');
        });
      });
    }

    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        applyLang(lang === 'pt' ? 'en' : 'pt');
      });
    });

    var els = document.querySelectorAll('[data-r]');
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      els.forEach(function (el) { obs.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('visible'); });
    }
  }


  /* ══════════════════════════════════════════════════════════
     5 · GRELHA DE PRODUTOS
     ══════════════════════════════════════════════════════════ */

  function renderGrid() {
    var grid = $('mgrid');
    if (!grid) { return; }

    grid.classList.toggle('mgrid--single', CONFIG.products.length === 1);

    grid.innerHTML = CONFIG.products.map(function (p) {
      var swatches = p.colors.map(function (c) {
        return '<span class="mcard__swatch" style="background:' + esc(c.hex) + '" title="' + esc(L(c.name)) + '"></span>';
      }).join('');

      return '' +
        '<article class="mcard" tabindex="0" role="button" data-product="' + esc(p.id) + '" ' +
                 'aria-label="' + esc(L(p.name)) + '">' +
          '<div class="mcard__media">' +
            (p.tag ? '<span class="mcard__tag">' + esc(L(p.tag)) + '</span>' : '') +
            mediaFor(p, p.colors[0]) +
          '</div>' +
          '<div class="mcard__body">' +
            '<h3 class="mcard__name">' + esc(L(p.name)) + '</h3>' +
            '<p class="mcard__desc">' + esc(L(p.desc)) + '</p>' +
            '<div class="mcard__swatches">' + swatches + '</div>' +
            '<div class="mcard__foot">' +
              '<span class="mcard__price">' + money(toCents(p.price)) + '</span>' +
              '<button type="button" class="mcard__cta">' + esc(t('js.buy')) + '</button>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');

    grid.querySelectorAll('.mcard').forEach(function (card) {
      var id = card.getAttribute('data-product');
      card.addEventListener('click', function () { openSheet(id); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(id); }
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     6 · SHEET DE COMPRA
     ══════════════════════════════════════════════════════════ */

  /**
   * state.lines guarda a encomenda deste produto:
   *   { 'castanho|S': 2, 'areia|M': 1, 'preto|L': 1 }
   * state.color e apenas a cor em edicao — as quantidades das outras
   * cores mantem-se ao trocar.
   */
  var state = { product: null, color: null, lines: {}, step: 1 };
  var lastFocus = null;

  function key(color, size) { return color + '|' + size; }

  /** Linhas com quantidade > 0, pela ordem do catalogo (cor, depois tamanho). */
  function orderLines() {
    var p = state.product;
    if (!p) { return []; }
    var out = [];
    p.colors.forEach(function (c) {
      p.sizes.forEach(function (s) {
        var qty = state.lines[key(c.id, s)] || 0;
        if (qty > 0) {
          out.push({ color: c.id, colorName: L(c.name), size: s, qty: qty });
        }
      });
    });
    return out;
  }

  function totalUnits() {
    return orderLines().reduce(function (n, l) { return n + l.qty; }, 0);
  }

  function subtotalCents() {
    if (!state.product) { return 0; }
    return toCents(state.product.price) * totalUnits();
  }

  function setQty(color, size, qty) {
    var k = key(color, size);
    var current = state.lines[k] || 0;
    var next = Math.max(0, Math.min(CONFIG.maxPerSize, qty));

    /* Nao deixa passar o total maximo da encomenda. */
    if (next > current && totalUnits() - current + next > CONFIG.maxItems) {
      next = Math.max(current, CONFIG.maxItems - (totalUnits() - current));
      flashMaxItems();
    }

    if (next === 0) { delete state.lines[k]; } else { state.lines[k] = next; }

    if (next > 0) { $('sizeErr').hidden = true; }
    renderSheet();
  }

  /** Texto normal do aviso de tamanhos, na lingua ativa. */
  function sizeErrDefault() {
    var el = $('sizeErr');
    if (lang === 'en' && EN['merch.size_err']) { return EN['merch.size_err']; }
    return originals.get(el) || 'Escolhe pelo menos um tamanho.';
  }

  var maxTimer = null;
  function flashMaxItems() {
    var el = $('sizeErr');
    el.innerHTML = t('js.max_items', { n: CONFIG.maxItems });
    el.hidden = false;
    clearTimeout(maxTimer);
    maxTimer = setTimeout(function () {
      el.hidden = true;
      el.innerHTML = sizeErrDefault();
    }, 3200);
  }

  function openSheet(productId) {
    var p = CONFIG.products.filter(function (x) { return x.id === productId; })[0];
    if (!p) { return; }

    state.product = p;
    state.color = p.colors[0].id;
    state.lines = {};

    renderSheet();
    goToStep(1);

    lastFocus = document.activeElement;
    var sheet = $('msheet');
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('m-locked');

    var closeBtn = sheet.querySelector('.msheet__close');
    if (closeBtn) { closeBtn.focus(); }
  }

  function closeSheet() {
    var sheet = $('msheet');
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('m-locked');
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  function currentColor() {
    if (!state.product) { return null; }
    return state.product.colors.filter(function (c) { return c.id === state.color; })[0]
        || state.product.colors[0];
  }

  function renderSheet() {
    var p = state.product;
    if (!p) { return; }
    var col = currentColor();

    $('sheetMedia').innerHTML = mediaFor(p, col);
    $('msheetTitle').textContent = L(p.name);
    $('sheetDesc').textContent = L(p.desc);
    $('sheetPrice').textContent = money(toCents(p.price));
    $('activeColorName').textContent = L(col.name);

    /* Cores — o numero de pecas ja escolhidas aparece no chip */
    $('sheetColors').innerHTML = p.colors.map(function (c) {
      var n = p.sizes.reduce(function (sum, s) {
        return sum + (state.lines[key(c.id, s)] || 0);
      }, 0);
      return '<button type="button" class="mchip' + (c.id === state.color ? ' is-on' : '') + '" ' +
             'data-color="' + esc(c.id) + '" aria-pressed="' + (c.id === state.color) + '">' +
               '<span class="mchip__dot" style="background:' + esc(c.hex) + '"></span>' +
               esc(L(c.name)) +
               (n > 0 ? '<span class="mchip__badge">' + n + '</span>' : '') +
             '</button>';
    }).join('');

    $('sheetColors').querySelectorAll('[data-color]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.color = b.getAttribute('data-color');
        renderSheet();
      });
    });

    /* Tamanhos — uma linha por tamanho, com contador proprio */
    var units = totalUnits();

    $('sheetSizes').innerHTML = p.sizes.map(function (s) {
      var out = (p.soldOut || []).indexOf(s) !== -1;
      var qty = state.lines[key(state.color, s)] || 0;

      if (out) {
        return '<div class="msizerow msizerow--out">' +
                 '<span class="msizerow__size">' + esc(s) + '</span>' +
                 '<span class="msizerow__out">' + esc(t('js.soldout')) + '</span>' +
               '</div>';
      }

      var canAdd = qty < CONFIG.maxPerSize && units < CONFIG.maxItems;

      return '<div class="msizerow' + (qty > 0 ? ' is-on' : '') + '">' +
               '<span class="msizerow__size">' + esc(s) + '</span>' +
               '<span class="mstep">' +
                 '<button type="button" data-dec="' + esc(s) + '" aria-label="' +
                   esc(s) + ' −"' + (qty === 0 ? ' disabled' : '') + '>&minus;</button>' +
                 '<output>' + qty + '</output>' +
                 '<button type="button" data-inc="' + esc(s) + '" aria-label="' +
                   esc(s) + ' +"' + (canAdd ? '' : ' disabled') + '>+</button>' +
               '</span>' +
             '</div>';
    }).join('');

    $('sheetSizes').querySelectorAll('[data-inc]').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = b.getAttribute('data-inc');
        setQty(state.color, s, (state.lines[key(state.color, s)] || 0) + 1);
      });
    });
    $('sheetSizes').querySelectorAll('[data-dec]').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = b.getAttribute('data-dec');
        setQty(state.color, s, (state.lines[key(state.color, s)] || 0) - 1);
      });
    });

    renderSelection();
  }

  /** Bloco "A tua seleção": todas as linhas, de todas as cores. */
  function renderSelection() {
    var lines = orderLines();
    var box = $('sheetSelection');

    if (lines.length === 0) {
      box.hidden = true;
      $('toStep2').disabled = true;
      return;
    }

    box.hidden = false;
    $('toStep2').disabled = false;

    var unitCents = toCents(state.product.price);

    $('selLines').innerHTML = lines.map(function (l) {
      return '<li class="msel__line">' +
               '<span>' + esc(l.colorName) + ' · ' + esc(l.size) +
                 ' <em>× ' + l.qty + '</em></span>' +
               '<b>' + money(unitCents * l.qty) + '</b>' +
               '<button type="button" class="msel__rm" data-rm="' +
                 esc(l.color) + '|' + esc(l.size) + '" aria-label="' +
                 esc(t('js.remove')) + '">' +
                 '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
               '</button>' +
             '</li>';
    }).join('');

    $('selLines').querySelectorAll('[data-rm]').forEach(function (b) {
      b.addEventListener('click', function () {
        var parts = b.getAttribute('data-rm').split('|');
        setQty(parts[0], parts[1], 0);
      });
    });

    var units = totalUnits();
    $('selCount').textContent = units === 1
      ? t('js.items_one')
      : t('js.items_many', { n: units });
    $('selSubtotal').textContent = money(subtotalCents());
  }

  function goToStep(n) {
    state.step = n;
    $('step1').hidden = n !== 1;
    $('step2').hidden = n !== 2;
    $('stepsBar').style.width = n === 2 ? '100%' : '0';
    $('stepDot2').classList.toggle('is-on', n === 2);
    var panel = $('msheet').querySelector('.msheet__panel');
    if (panel) { panel.scrollTop = 0; }
    if (n === 2) { refreshSummary(); }
  }

  function refreshSummary() {
    /* Texto do custo de envio na opcao de entrega — nao depende do produto */
    var sc = $('shipCost');
    if (sc) {
      var s = CONFIG.shipping;
      sc.textContent = (s.freeFrom !== null && s.freeFrom !== undefined)
        ? t('js.ship_free_from', { fee: money(toCents(s.fee)), from: money(toCents(s.freeFrom)) })
        : t('js.ship_flat', { fee: money(toCents(s.fee)) });
    }

    var p = state.product;
    if (!p) { return; }

    var lines = orderLines();
    var unitCents = toCents(p.price);
    var subtotal = subtotalCents();
    var ship = isShipping() ? shippingFee(subtotal) : 0;
    var total = subtotal + ship;

    var items = $('sumItems');
    if (items) {
      items.innerHTML = lines.map(function (l) {
        return '<div class="msum__line">' +
                 '<span>' + esc(L(p.name)) + ' · ' + esc(l.colorName) + ' · ' +
                   esc(l.size) + ' × ' + l.qty + '</span>' +
                 '<b>' + money(unitCents * l.qty) + '</b>' +
               '</div>';
      }).join('');
    }

    if ($('sumSubtotal')) { $('sumSubtotal').textContent = money(subtotal); }
    if ($('sumShip')) { $('sumShip').textContent = ship === 0 ? t('js.free') : money(ship); }
    if ($('sumTotal')) { $('sumTotal').textContent = money(total); }
    if ($('payLabel')) { $('payLabel').textContent = t('js.pay_amount', { total: money(total) }); }
  }

  function isShipping() {
    var r = document.querySelector('input[name="delivery"]:checked');
    return !!r && r.value === 'shipping';
  }


  /* ══════════════════════════════════════════════════════════
     7 · VALIDACAO + PAGAMENTO
     ══════════════════════════════════════════════════════════ */

  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  var RE_ZIP_PT = /^\d{4}-\d{3}$/;

  function showFormError(msg) {
    var box = $('formErr');
    box.textContent = msg;
    box.hidden = false;
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function clearFormError() { $('formErr').hidden = true; }

  function validate(form) {
    clearFormError();
    form.querySelectorAll('.is-bad').forEach(function (el) { el.classList.remove('is-bad'); });
    $('mform').querySelector('.mcheck').classList.remove('is-bad');

    var d = new FormData(form);
    var shipping = isShipping();

    var required = ['name', 'email', 'phone'];
    if (shipping) { required = required.concat(['address', 'postalCode', 'city']); }

    var missing = required.filter(function (k) { return !String(d.get(k) || '').trim(); });
    if (missing.length) {
      missing.forEach(function (k) {
        var el = form.querySelector('[name="' + k + '"]');
        if (el) { el.classList.add('is-bad'); }
      });
      showFormError(t('js.err_required'));
      return null;
    }

    var email = String(d.get('email')).trim();
    if (!RE_EMAIL.test(email)) {
      form.querySelector('[name="email"]').classList.add('is-bad');
      showFormError(t('js.err_email'));
      return null;
    }

    var phone = String(d.get('phone')).trim();
    if (phone.replace(/[^\d]/g, '').length < 9) {
      form.querySelector('[name="phone"]').classList.add('is-bad');
      showFormError(t('js.err_phone'));
      return null;
    }

    var postalCode = String(d.get('postalCode') || '').trim();
    if (shipping && !RE_ZIP_PT.test(postalCode)) {
      form.querySelector('[name="postalCode"]').classList.add('is-bad');
      showFormError(t('js.err_zip'));
      return null;
    }

    var vat = String(d.get('vat') || '').trim();
    if (vat && !/^\d{9}$/.test(vat)) {
      form.querySelector('[name="vat"]').classList.add('is-bad');
      showFormError(t('js.err_vat'));
      return null;
    }

    if (!d.get('terms')) {
      $('mform').querySelector('.mcheck').classList.add('is-bad');
      showFormError(t('js.err_terms'));
      return null;
    }

    return {
      items: orderLines().map(function (l) {
        return {
          productId: state.product.id,
          color: l.color,
          size: l.size,
          qty: l.qty
        };
      }),
      delivery: shipping ? 'shipping' : 'pickup',
      locale: lang === 'en' ? 'en-GB' : 'pt-PT',
      customer: {
        name: String(d.get('name')).trim(),
        email: email,
        phone: phone,
        vat: vat || null
      },
      address: shipping ? {
        line1: String(d.get('address')).trim(),
        postalCode: postalCode,
        city: String(d.get('city')).trim(),
        country: 'PT'
      } : null,
      notes: String(d.get('notes') || '').trim() || null
    };
  }

  function initForm() {
    var form = $('mform');
    if (!form) { return; }

    form.querySelectorAll('input[name="delivery"]').forEach(function (r) {
      r.addEventListener('change', function () {
        $('shipFields').hidden = !isShipping();
        refreshSummary();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var payload = validate(form);
      if (!payload) { return; }

      if (!apiReady) {
        showFormError(t('js.cfg_title'));
        return;
      }

      var btn = $('payBtn');
      btn.classList.add('mbtn--loading');
      btn.disabled = true;

      fetch(CONFIG.API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().then(function (body) { return { ok: res.ok, body: body }; });
        })
        .then(function (r) {
          if (!r.ok || !r.body || !r.body.checkoutUrl) {
            throw new Error((r.body && r.body.error) || 'no_checkout_url');
          }
          /* Redireciona para o checkout seguro da Paybyrd. */
          window.location.href = r.body.checkoutUrl;
        })
        .catch(function (err) {
          btn.classList.remove('mbtn--loading');
          btn.disabled = false;
          var offline = (typeof navigator !== 'undefined' && navigator.onLine === false);
          showFormError(offline || err.name === 'TypeError'
            ? t('js.err_network')
            : t('js.err_generic'));
          if (window.console) { console.error('[SV Merch]', err); }
        });
    });
  }


  /* ══════════════════════════════════════════════════════════
     8 · ECRA DE RESULTADO (volta da Paybyrd)
     ══════════════════════════════════════════════════════════ */

  var ICONS = {
    ok:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    wait: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    bad:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };

  function showResult(kind, title, text, ref) {
    var box = $('mresult');
    var icon = $('resultIcon');

    icon.className = 'mresult__icon mresult__icon--' + (kind === 'ok' ? 'ok' : kind === 'bad' ? 'bad' : 'wait');
    icon.innerHTML = ICONS[kind === 'ok' ? 'ok' : kind === 'bad' ? 'bad' : 'wait'];

    $('resultTitle').textContent = title;
    $('resultText').textContent = text;

    var refEl = $('resultRef');
    if (ref) {
      refEl.textContent = t('js.res_ref', { ref: ref });
      refEl.hidden = false;
    } else {
      refEl.hidden = true;
    }

    box.hidden = false;
    document.body.classList.add('m-locked');
  }

  function handleReturn() {
    var params = new URLSearchParams(window.location.search);
    var ref = params.get('ref');
    if (!ref) { return false; }

    showResult('wait', t('js.res_wait_t'), t('js.res_wait_p'), ref);

    if (!apiReady) { return true; }

    fetch(CONFIG.API + '?ref=' + encodeURIComponent(ref))
      .then(function (res) { return res.json(); })
      .then(function (body) {
        var status = (body && body.status) || 'pending';
        if (status === 'paid') {
          showResult('ok', t('js.res_ok_t'), t('js.res_ok_p'), ref);
        } else if (status === 'failed' || status === 'cancelled' || status === 'expired') {
          showResult('bad', t('js.res_fail_t'), t('js.res_fail_p'), ref);
        } else {
          showResult('wait', t('js.res_pending_t'), t('js.res_pending_p'), ref);
        }
      })
      .catch(function () {
        showResult('wait', t('js.res_pending_t'), t('js.res_pending_p'), ref);
      });

    return true;
  }


  /* ══════════════════════════════════════════════════════════
     9 · AVISO DE CONFIGURACAO EM FALTA
     ══════════════════════════════════════════════════════════ */

  function configBanner() {
    if (apiReady) { return; }
    var el = document.createElement('div');
    el.className = 'mconfig';
    el.innerHTML = '<div><b>' + t('js.cfg_title') + '</b>' + t('js.cfg_text') + '</div>';
    document.body.appendChild(el);
    if (window.console) {
      console.warn('[SV Merch] CONFIG.API ainda tem o placeholder <PROJECT-REF>. Pagamentos desativados.');
    }
  }


  /* ══════════════════════════════════════════════════════════
     10 · ARRANQUE
     ══════════════════════════════════════════════════════════ */

  function init() {
    collectOriginals();
    if (lang === 'en') { applyLang('en'); }

    initChrome();
    renderGrid();
    initForm();
    refreshSummary();
    configBanner();

    /* Sheet */
    var sheet = $('msheet');
    sheet.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeSheet);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) { closeSheet(); }
    });

    $('sizeGuideBtn').addEventListener('click', function () {
      var tbl = $('sizeTable');
      tbl.hidden = !tbl.hidden;
    });

    $('toStep2').addEventListener('click', function () {
      if (totalUnits() === 0) {
        $('sizeErr').innerHTML = sizeErrDefault();
        $('sizeErr').hidden = false;
        $('sheetSizes').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
      goToStep(2);
    });

    $('backTo1').addEventListener('click', function () { goToStep(1); });

    handleReturn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
