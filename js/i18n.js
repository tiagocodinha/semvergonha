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
    'footer.cookies': 'Cookie Policy',
    'footer.phone_note': '(Call to national mobile network)',

    'hero.sub': 'Restaurant & Cocktail Bar',
    'hero.menu': 'Menu',
    'intro.label': 'From Day to Night',
    'intro.h2': 'To Eat.<br>To Drink.<br>To Stay.',
    'intro.p1': 'Some come for lunch and stay for coffee. Some drop by for a cocktail and end up ordering from the menu. Some book dinner and lose track of time.',
    'intro.p2': 'At Sem Vergonha there\'s no right way to be. There\'s a table, a bar, the sea ahead and time to enjoy.',
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

    'fd.hero_h1': 'At the table or the bar.<br>Any hour.',
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
    'fd.cat_classicos': 'Classic Cocktails',
    'fd.sidebar_classicos': 'Classics',

    'fd.ck_ff_d': 'Gin · St-Germain · Raspberry · Lime',
    'fd.ck_bv_d': 'Bacardí · Giffard · Vanilla · Passion Fruit · Lime · Sugar Syrup · Sparkling Foam',
    'fd.ck_ml_d': 'Patrón Silver · Limoncello · Chilli · Mango · Lime · Agave',
    'fd.ck_mm_d': 'Grey Goose · Ginger Beer · Lime · Ginger Foam',
    'fd.ck_im_d': 'Grey Goose · Green Apple · Lime · Sugar Syrup · Mint',
    'fd.ck_sh_d': 'The Foxtale 0% · Ginger Beer · Passion Fruit · Lime · Ginger Foam',

    'fd.couvert1': 'Bread · Chef\'s Butter',

    'fd.e1': 'Tuna Tostada',
    'fd.e1d': 'Avocado · Kimchi',
    'fd.e2': 'Signature Oyster <em>2 pcs</em>',
    'fd.e3': 'Classic Oyster <em>2 pcs</em>',
    'fd.e4': 'Oxtail Croquette <em>2 pcs</em>',
    'fd.e4d': 'Confit Garlic Mayo · Mustard Pickle',
    'fd.e5': 'Beef Tartare',
    'fd.e5d': 'Toasted Brioche · Cured Egg Yolk',
    'fd.e6': 'Chicken Heart Skewer <em>2 pcs</em>',
    'fd.e6d': 'Gochujang · Preserved Lemon',
    'fd.e7': 'Oyster Mushroom Skewer <em>2 pcs</em>',
    'fd.e7d': 'Gochujang · Preserved Lemon (Vegetarian)',

    'fd.p1': 'Seared Tuna',
    'fd.p2': 'Grilled Bimi',
    'fd.p2d': 'Hummus · Sumac · Mixed Nuts',
    'fd.p3': 'Shrimp',
    'fd.p3d': 'Head Sauce · Kaffir Lime',
    'fd.p4': 'Grilled Squid',
    'fd.p4d': 'Own Ink Sauce',
    'fd.p5': 'Cockles',
    'fd.p5d': 'Seaweed · Smoked Butter',
    'fd.p6': 'Black Pork Skewer',
    'fd.p7': 'Grilled Steak',
    'fd.p7d': 'Beef Jus',
    'fd.p8d': 'Brioche · Shrimp · Confit Garlic · Togarashi',

    'fd.si1': 'Double-Fried Potatoes',
    'fd.si1d': 'Confit Garlic Mayo · Parmesan',
    'fd.si2': 'Fried Rice',
    'fd.si3': 'Lettuce Heart',
    'fd.si3d': 'Citrus · Mixed Nuts · Tahini',

    'fd.de1': 'French Toast',
    'fd.de1d': 'Custard · Lemon Ice Cream',
    'fd.de2': 'Chocolate Nestum',
    'fd.de2d': 'Passion Fruit · Hazelnut · Miso',
    'fd.de3d': 'Coconut · Grilled Pineapple · Lime',

    'fd.b_luso1': 'Luso Water <em>1L</em>',
    'fd.b_luso2': 'Luso Water <em>50cl</em>',
    'fd.b_luso3': 'Luso Water Takeaway <em>50cl</em>',
    'fd.b_castello': 'Castello Sparkling Water <em>25cl</em>',
    'fd.b_pedras1': 'Pedras Sparkling Water <em>25cl</em>',
    'fd.b_pedras2': 'Pedras Lemon Sparkling Water <em>25cl</em>',
    'fd.b_icetea_d': 'Mango · Peach · Lemon',
    'fd.b_tonica': 'Tonic Water',
    'fd.b_icetea': 'Iced Tea <em>33cl</em>',
    'fd.b_limonada': 'Lemonade',
    'fd.b_sumo': 'Fresh Orange Juice',
    'fd.b_cafe': 'Espresso',
    'fd.b_descaf': 'Decaf',
    'fd.b_cafeduplo': 'Double Espresso',
    'fd.b_cha': 'Tea / Infusion',
    'fd.b_cha_d': 'Lemon Balm · Chamomile · Green · Black · Red Berries · Mint',
    'fd.b_dw8': 'Dewar\'s 8 Years Caribbean Smooth',
    'fd.b_dw12': 'Dewar\'s 12 Years',
    'fd.b_dw15': 'Dewar\'s 15 Years',
    'fd.b_bac8': 'Bacardí 8 Years',
    'fd.b_bandida': 'Bandida do Pomar Cider <em>40cl</em>',
    'fd.b_amendoa': 'Bitter Almond',
    'fd.b_absinto': 'Absinthe',

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
    'fd.note2': 'No dish, food product or beverage, including the couvert, may be charged unless it has been requested by the customer or consumed or otherwise rendered unusable by them.',
    'fd.note2_ck': 'No dish, food product or beverage, including the couvert, may be charged unless it has been requested by the customer or consumed or otherwise rendered unusable by them.',
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

    'ck.banner_title': 'Cookies',
    'ck.banner_text': 'We use cookies to improve your experience and analyse website traffic. <a href="cookies/">Learn more</a>',
    'ck.accept': 'Accept',
    'ck.reject': 'Reject',
    'ck.title': 'Cookie Policy',
    'ck.updated': 'Last updated: August 2026',
    'ck.what_h': 'What are cookies?',
    'ck.what_p': 'Cookies are small text files stored on your device when you visit our website. They are used to improve your browsing experience and to help us understand how the website is used.',
    'ck.types_h': 'What cookies do we use?',
    'ck.th_cookie': 'Cookie',
    'ck.th_type': 'Type',
    'ck.th_purpose': 'Purpose',
    'ck.th_duration': 'Duration',
    'ck.type_necessary': 'Necessary',
    'ck.type_functional': 'Functional',
    'ck.type_analytics': 'Analytics',
    'ck.purpose_consent': 'Stores your cookie consent choice',
    'ck.purpose_lang': 'Remembers your language preference (PT/EN)',
    'ck.purpose_ga': 'Google Analytics — collects anonymous website usage statistics',
    'ck.purpose_gid': 'Google Tag Manager — helps measure campaign and website performance',
    'ck.dur_permanent': 'Permanent',
    'ck.dur_ga': '2 years',
    'ck.dur_gid': '24 hours to 90 days',
    'ck.manage_h': 'How to manage cookies?',
    'ck.manage_p1': 'You can change or withdraw your consent at any time by clicking the button below.',
    'ck.reset_btn': 'Reset cookie preferences',
    'ck.manage_p2': 'You can also configure your browser to block or delete cookies. Check your browser settings for more information. Note that blocking cookies may affect the website\'s functionality.',
    'ck.third_h': 'Third-party cookies',
    'ck.third_p': 'We use Google Tag Manager and Google Analytics to understand how visitors interact with our website. These services may set their own cookies. For more information, see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google\'s Privacy Policy</a>.',
    'ck.contact_h': 'Contact',
    'ck.contact_p': 'For questions about our cookie policy, contact us at <a href="mailto:hey@semvergonharestaurant.com">hey@semvergonharestaurant.com</a>.',

    'ct.hero_label': 'Contacts',
    'ct.hero_h1': 'Show up shamelessly.',
    'ct.hero_p': 'We\'re in Nazaré, facing the sea. Book a table or just drop by for a cocktail.',
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

    var lang = localStorage.getItem('sv_lang');
    if (lang && lang !== 'pt') { applyLang(lang); }
  });

  window.svI18n = { toggle: toggle, applyLang: applyLang };
})();
