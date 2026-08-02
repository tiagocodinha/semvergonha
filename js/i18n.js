(function () {
  'use strict';

  var EN = {
    'reserve': 'Book a Table',
    'nav.contacts': 'CONTACTS',
    'mob.phone_note': 'Call to national mobile network',
    'footer.hours': 'Hours',
    'footer.contact': 'Contact',
    'footer.follow': 'Follow us',
    'footer.everyday': 'Every day',
    'footer.rights': '&copy; 2026 Sem Vergonha. All rights reserved.',
    'footer.tagline': 'Restaurant & Cocktail Bar',

    'hero.sub': 'Restaurant & Cocktail Bar',
    'hero.menu': 'Menu',
    'intro.label': 'Dine & Party',
    'intro.h2': 'Where dinner<br>becomes the night.',
    ‘intro.p1’: ‘Sem Vergonha is not just a restaurant. And it doesn\’t need to be a nightclub for the night to happen. Here, you come to dine, stay for drinks and lose track of time without even noticing.’,
    ‘intro.p2’: ‘Born from the spirit of the <strong>”Muro da Pouca Vergonha”</strong>, a place of gathering, conversation and a touch of boldness.’,
    'intro.badge1': 'Sharing kitchen',
    'intro.badge2': 'Signature cocktails',
    'cards.label': 'Discover',
    'cards.h2': 'Our universe.',
    'cards.p': 'Explore what Sem Vergonha has to offer.',
    'cards.food_h3': 'Here, every dish tells a story.',
    'cards.contacts_h3': 'Come visit us.',
    'info.hours': 'Hours',
    'info.opening': 'Opening',
    'info.july': 'July 2026',

    'fd.hero_h1': 'At the table or the bar. Any hour.',
    'fd.hero_p': 'Signature dishes, sharing plates and cocktails for every moment of the day.',
    'fd.tab_comida': 'Food',
    'fd.sidebar_couvert': 'Couvert',
    'fd.sidebar_entradas': 'Starters',
    'fd.sidebar_pratos': 'Mains',
    'fd.sidebar_sides': 'Sides',
    'fd.sidebar_sobremesas': 'Desserts',
    'fd.cat_couvert': 'Couvert',
    'fd.cat_entradas': 'Starters',
    'fd.cat_pratos': 'Mains',
    'fd.cat_sides': 'Sides',
    'fd.cat_sobremesas': 'Desserts',
    'fd.cat_aguas': 'Water',
    'fd.cat_refri': 'Soft Drinks',
    'fd.cat_cafe': 'Coffee & Tea',
    'fd.cat_cerveja': 'Beer / Cider',
    'fd.cat_sangria': 'Sangria',
    'fd.cat_licor': 'Aperitif / Liqueur',
    'fd.cat_brandy': 'Brandy / Aguardente',
    'fd.allergen_title': 'Allergens',
    'fd.a1': 'Gluten',
    'fd.a2': 'Crustaceans',
    'fd.a3': 'Eggs',
    'fd.a4': 'Fish',
    'fd.a5': 'Peanuts',
    'fd.a6': 'Soy',
    'fd.a7': 'Dairy',
    'fd.a8': 'Tree nuts',
    'fd.a9': 'Celery',
    'fd.a10': 'Mustard',
    'fd.a11': 'Sesame',
    'fd.a12': 'Sulphites',
    'fd.a13': 'Lupin',
    'fd.a14': 'Molluscs',
    'fd.note1': 'If you have any food allergy or intolerance, please inform our staff. We will be happy to provide detailed information about the allergens present in our dishes.',
    'fd.note2': 'No dish, food product or drink, including the couvert, may be charged if not requested by the customer or if left unused.',
    'fd.note2_ck': 'No dish, food product or drink, including the couvert, may be charged if not requested by the customer or if left unused.',
    'fd.note1_ck': 'If you suffer from any food intolerance or food allergy please inform our staff.',
    'fd.sidebar_aguas': 'Water',
    'fd.sidebar_refri': 'Soft Drinks',
    'fd.sidebar_cafe': 'Coffee & Tea',
    'fd.sidebar_cerveja': 'Beer',
    'fd.sidebar_sangria': 'Sangria',
    'fd.sidebar_gin': 'Gin',
    'fd.sidebar_vodka': 'Vodka',
    'fd.sidebar_whiskey': 'Whiskey',
    'fd.sidebar_rum': 'Rum & Tequila',
    'fd.sidebar_licor': 'Liqueurs',
    'fd.sidebar_brandy': 'Brandy',
    'fd.sidebar_shots': 'Shots',

    'ct.hero_label': 'Contacts',
    ‘ct.hero_h1’: ‘Show up shamelessly.’,
    ‘ct.hero_p’: ‘We\’re in Nazaré, facing the sea. Book a table or just drop by for a cocktail.’,
    'ct.address': 'Address',
    'ct.email': 'Email',
    'ct.hours': 'Hours',
    'ct.hours_desc': '12h00 — 02h00<br>Every day',
    'ct.phone': 'Phone',
    'ct.phone_note': 'Call to national mobile network'
  };

  var stored = new Map();

  function collectOriginals() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      stored.set(el, el.innerHTML);
    });
  }

  function applyLang(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (lang === 'en' && EN[key]) {
        el.innerHTML = EN[key];
      } else if (lang === 'pt' && stored.has(el)) {
        el.innerHTML = stored.get(el);
      }
    });
    document.documentElement.lang = lang;
    localStorage.setItem('sv_lang', lang);

    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.textContent = lang === 'pt' ? 'EN' : 'PT';
    });
  }

  function toggle() {
    var current = localStorage.getItem('sv_lang') || 'pt';
    applyLang(current === 'pt' ? 'en' : 'pt');
  }

  document.addEventListener('DOMContentLoaded', function () {
    collectOriginals();

    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggle();
      });
    });

    // i18n disabled temporarily — always PT
    // var lang = localStorage.getItem('sv_lang');
    // if (lang && lang !== 'pt') { applyLang(lang); }
  });

  window.svI18n = { toggle: toggle, applyLang: applyLang };
})();
