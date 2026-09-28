/* ============================================================
   SEM VERGONHA — Passagem de Ano (lista de interesse)
   Pagina autonoma: nao carrega nada do js/ do site.
   ============================================================ */
(function () {
  'use strict';

  var API = 'https://vwhjxgbmyvqslgojmdbt.supabase.co/functions/v1/nye-waitlist';


  /* ══════════════════════════════════════════════════════════
     1 · INDICATIVOS  —  'ISO|Pais|Codigo'
     Ordenados por nome; Portugal fica no topo em runtime.
     Nao usamos bandeiras emoji porque o Windows nao as desenha
     (mostra as duas letras), por isso o ISO vai como etiqueta.
     ══════════════════════════════════════════════════════════ */

  var COUNTRIES = ('' +
    'AF|Afeganistão|93,ZA|África do Sul|27,AL|Albânia|355,DE|Alemanha|49,' +
    'AD|Andorra|376,AO|Angola|244,AI|Anguila|1264,AG|Antígua e Barbuda|1268,' +
    'SA|Arábia Saudita|966,DZ|Argélia|213,AR|Argentina|54,AM|Arménia|374,' +
    'AW|Aruba|297,AU|Austrália|61,AT|Áustria|43,AZ|Azerbaijão|994,' +
    'BS|Bahamas|1242,BD|Bangladeche|880,BB|Barbados|1246,BH|Barém|973,' +
    'BE|Bélgica|32,BZ|Belize|501,BJ|Benim|229,BM|Bermudas|1441,' +
    'BY|Bielorrússia|375,BO|Bolívia|591,BA|Bósnia e Herzegovina|387,' +
    'BW|Botsuana|267,BR|Brasil|55,BN|Brunei|673,BG|Bulgária|359,' +
    'BF|Burquina Faso|226,BI|Burundi|257,BT|Butão|975,CV|Cabo Verde|238,' +
    'CM|Camarões|237,KH|Camboja|855,CA|Canadá|1,QA|Catar|974,' +
    'KZ|Cazaquistão|7,TD|Chade|235,CL|Chile|56,CN|China|86,CY|Chipre|357,' +
    'CO|Colômbia|57,KM|Comores|269,CG|Congo|242,CD|Congo (RD)|243,' +
    'KP|Coreia do Norte|850,KR|Coreia do Sul|82,CI|Costa do Marfim|225,' +
    'CR|Costa Rica|506,HR|Croácia|385,CU|Cuba|53,CW|Curaçau|599,' +
    'DK|Dinamarca|45,DM|Dominica|1767,EG|Egito|20,SV|El Salvador|503,' +
    'AE|Emirados Árabes Unidos|971,EC|Equador|593,ER|Eritreia|291,' +
    'SK|Eslováquia|421,SI|Eslovénia|386,ES|Espanha|34,SZ|Essuatíni|268,' +
    'US|Estados Unidos|1,EE|Estónia|372,ET|Etiópia|251,FJ|Fiji|679,' +
    'PH|Filipinas|63,FI|Finlândia|358,FR|França|33,GA|Gabão|241,' +
    'GM|Gâmbia|220,GH|Gana|233,GE|Geórgia|995,GI|Gibraltar|350,' +
    'GD|Granada|1473,GR|Grécia|30,GL|Groenlândia|299,GP|Guadalupe|590,' +
    'GU|Guame|1671,GT|Guatemala|502,GY|Guiana|592,GF|Guiana Francesa|594,' +
    'GN|Guiné|224,GW|Guiné-Bissau|245,GQ|Guiné Equatorial|240,HT|Haiti|509,' +
    'HN|Honduras|504,HK|Hong Kong|852,HU|Hungria|36,YE|Iémen|967,' +
    'KY|Ilhas Cayman|1345,CK|Ilhas Cook|682,FO|Ilhas Faroé|298,' +
    'MH|Ilhas Marshall|692,SB|Ilhas Salomão|677,TC|Ilhas Turcas e Caicos|1649,' +
    'VG|Ilhas Virgens Britânicas|1284,IN|Índia|91,ID|Indonésia|62,IR|Irão|98,' +
    'IQ|Iraque|964,IE|Irlanda|353,IS|Islândia|354,IL|Israel|972,IT|Itália|39,' +
    'JM|Jamaica|1876,JP|Japão|81,DJ|Jibuti|253,JO|Jordânia|962,XK|Kosovo|383,' +
    'KW|Kuwait|965,LA|Laos|856,LS|Lesoto|266,LV|Letónia|371,LB|Líbano|961,' +
    'LR|Libéria|231,LY|Líbia|218,LI|Listenstaine|423,LT|Lituânia|370,' +
    'LU|Luxemburgo|352,MO|Macau|853,MK|Macedónia do Norte|389,' +
    'MG|Madagáscar|261,MY|Malásia|60,MW|Maláui|265,MV|Maldivas|960,' +
    'ML|Mali|223,MT|Malta|356,MA|Marrocos|212,MQ|Martinica|596,' +
    'MU|Maurícia|230,MR|Mauritânia|222,MX|México|52,MM|Mianmar|95,' +
    'FM|Micronésia|691,MZ|Moçambique|258,MD|Moldávia|373,MC|Mónaco|377,' +
    'MN|Mongólia|976,ME|Montenegro|382,MS|Montserrate|1664,NA|Namíbia|264,' +
    'NR|Nauru|674,NP|Nepal|977,NI|Nicarágua|505,NE|Níger|227,NG|Nigéria|234,' +
    'NO|Noruega|47,NC|Nova Caledónia|687,NZ|Nova Zelândia|64,OM|Omã|968,' +
    'NL|Países Baixos|31,PW|Palau|680,PS|Palestina|970,PA|Panamá|507,' +
    'PG|Papua-Nova Guiné|675,PK|Paquistão|92,PY|Paraguai|595,PE|Peru|51,' +
    'PF|Polinésia Francesa|689,PL|Polónia|48,PR|Porto Rico|1787,' +
    'PT|Portugal|351,KE|Quénia|254,KG|Quirguistão|996,KI|Quiribáti|686,' +
    'GB|Reino Unido|44,CF|República Centro-Africana|236,CZ|República Checa|420,' +
    'DO|República Dominicana|1809,RE|Reunião|262,RO|Roménia|40,RW|Ruanda|250,' +
    'RU|Rússia|7,WS|Samoa|685,LC|Santa Lúcia|1758,KN|São Cristóvão e Neves|1869,' +
    'SM|São Marinho|378,ST|São Tomé e Príncipe|239,' +
    'VC|São Vicente e Granadinas|1784,SC|Seicheles|248,SN|Senegal|221,' +
    'SL|Serra Leoa|232,RS|Sérvia|381,SG|Singapura|65,SY|Síria|963,' +
    'SO|Somália|252,LK|Sri Lanca|94,SD|Sudão|249,SS|Sudão do Sul|211,' +
    'SE|Suécia|46,CH|Suíça|41,SR|Suriname|597,TH|Tailândia|66,TW|Taiwan|886,' +
    'TJ|Tajiquistão|992,TZ|Tanzânia|255,TL|Timor-Leste|670,TG|Togo|228,' +
    'TO|Tonga|676,TT|Trindade e Tobago|1868,TN|Tunísia|216,' +
    'TM|Turquemenistão|993,TR|Turquia|90,TV|Tuvalu|688,UA|Ucrânia|380,' +
    'UG|Uganda|256,UY|Uruguai|598,UZ|Usbequistão|998,VU|Vanuatu|678,' +
    'VA|Vaticano|379,VE|Venezuela|58,VN|Vietname|84,ZM|Zâmbia|260,' +
    'ZW|Zimbabué|263'
  ).split(',').map(function (row) {
    var p = row.split('|');
    return { iso: p[0], name: p[1], code: '+' + p[2] };
  });

  var VALID_CODES = {};
  COUNTRIES.forEach(function (c) { VALID_CODES[c.code] = true; });

  /* Nomes em ingles vindos do proprio browser (Intl.DisplayNames).
     Se nao existir, fica o nome portugues — melhor do que nada. */
  var enNames = null;
  try {
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      enNames = new Intl.DisplayNames(['en'], { type: 'region' });
    }
  } catch (e) { enNames = null; }

  function cName(c) {
    if (lang !== 'en') { return c.name; }
    if (c.iso === 'XK') { return 'Kosovo'; }
    try {
      var n = enNames && enNames.of(c.iso);
      return (n && n !== c.iso) ? n : c.name;
    } catch (e) { return c.name; }
  }

  /** Reordena por nome no idioma ativo, com Portugal sempre no topo. */
  function sortCountries() {
    COUNTRIES.sort(function (a, b) {
      if (a.iso === 'PT') { return -1; }
      if (b.iso === 'PT') { return 1; }
      return cName(a).localeCompare(cName(b), lang === 'en' ? 'en' : 'pt');
    });
  }


  /* ══════════════════════════════════════════════════════════
     2 · MENSAGENS E VALIDACAO
     ══════════════════════════════════════════════════════════ */

  /* ══════════════ IDIOMA ══════════════ */

  var lang = 'pt';
  try { lang = localStorage.getItem('sv_lang') === 'en' ? 'en' : 'pt'; } catch (e) {}

  /* Textos do HTML (data-i18n). O PT vive no proprio HTML. */
  var EN = {
    eyebrow: "New Year's Eve",
    title:   'Step into 2027.<br><em>Sem Vergonha.</em>',
    lead:    "We're putting together the send-off for 2026.<br>Join the list and we'll tell you everything soon.",
    f_first: 'First name',
    f_last:  'Last name',
    f_phone: 'Mobile',
    f_email: 'Email',
    f_birth: 'Date of birth',
    f_party: 'Number of people',
    ph_date: 'dd / mm / yyyy',
    cta:     "I'm interested",
    note:    'Joining this list is not a reservation.',
    consent: 'I want to be contacted about this event, to get more information and to follow my sign-up.',
    privacy: 'If you have any questions, just ask: ' +
             '<a href="mailto:hey@semvergonharestaurant.com">hey@semvergonharestaurant.com</a><br>' +
             'We handle your data as set out in our ' +
             '<a href="/politica-privacidade/">Privacy Policy</a>.',
    done_h:  "You're on the list.<br>We'll tell you everything soon!",
    foot:    'Sem Vergonha · Av. da República 6, Nazaré',
    foot_privacy: 'Privacy',
    foot_cookies: 'Cookies'
  };

  var PH_EN = { ph_search: 'Search', ph_phone: '87 123 4567' };

  var MSG_PT = {
    required: 'Preenche todos os campos.',
    name:     'Verifica o primeiro e o último nome.',
    code:     'Escolhe o indicativo do país.',
    phone:    'Indica um número de telemóvel válido.',
    email:    'Esse email não parece estar certo.',
    birth:    'Verifica a data de nascimento.',
    birthFut: 'A data de nascimento não pode ser no futuro.',
    party:    'Indica o número de pessoas.',
    consent:  'Precisas de aceitar para te podermos contactar.',
    network:  'Não conseguimos guardar a tua inscrição. Verifica a ligação e tenta outra vez.',
    generic:  'Algo correu mal ao guardar a tua inscrição. Tenta novamente daqui a pouco.',
    noResults: 'Sem resultados'
  };

  var MSG_EN = {
    required: 'Please fill in every field.',
    name:     'Please check your first and last name.',
    code:     'Please choose a country code.',
    phone:    'Please enter a valid mobile number.',
    email:    'That email address does not look right.',
    birth:    'Please check your date of birth.',
    birthFut: 'Your date of birth cannot be in the future.',
    party:    'Please choose the number of people.',
    consent:  'You need to accept so we can contact you.',
    network:  'We could not save your sign-up. Please check your connection and try again.',
    generic:  'Something went wrong saving your sign-up. Please try again in a moment.',
    noResults: 'No results'
  };

  function MSG(key) { return (lang === 'en' ? MSG_EN : MSG_PT)[key]; }

  var MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  var MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
  var DOWS_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  var DOWS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  /* Letras (com acentos), espacos, hifens e apostrofos. */
  var RE_NAME = /^[\p{L}][\p{L}\s'’-]*$/u;

  var form, btn, errBox, card, done;

  /* Guarda contra duplo clique: enquanto um pedido esta a caminho,
     nenhum outro parte. */
  var inFlight = false;

  /**
   * Identificador desta submissao. Acompanha o pedido e e unico na
   * base de dados, por isso se o mesmo clique chegar duas vezes (ou a
   * rede repetir), so entra uma linha. Inscricoes diferentes — mesmo
   * com o mesmo email — trazem ids diferentes e criam linhas proprias.
   */
  var submissionId = newId();

  function newId() {
    try {
      if (window.crypto && crypto.randomUUID) { return crypto.randomUUID(); }
    } catch (e) {}
    /* Reserva para contextos sem crypto.randomUUID (http antigo). */
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
  }

  function $(id) { return document.getElementById(id); }

  /**
   * Decide se um painel abre para baixo ou para cima.
   * Sendo absoluto, o painel nao aumenta a altura da pagina — se abrisse
   * sempre para baixo, num campo ja proximo do fundo ficaria cortado e
   * nao haveria scroll que o mostrasse.
   */
  function placePanel(panel, trigger) {
    panel.classList.remove('is-up');
    panel.style.maxHeight = '';

    var t = trigger.getBoundingClientRect();
    var h = panel.offsetHeight;
    var below = window.innerHeight - t.bottom - 14;
    var above = t.top - 14;

    if (h > below && above > below) {
      panel.classList.add('is-up');
      if (h > above) { panel.style.maxHeight = Math.max(200, above) + 'px'; }
    } else if (h > below) {
      panel.style.maxHeight = Math.max(200, below) + 'px';
    }
  }

  function monthNames() { return lang === 'en' ? MONTHS_EN : MONTHS_PT; }
  function dowNames()   { return lang === 'en' ? DOWS_EN : DOWS_PT; }

  /** Troca a pagina inteira de idioma, sem recarregar. */
  function applyLang(next) {
    lang = next;
    try { localStorage.setItem('sv_lang', lang); } catch (e) {}

    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-PT';

    /* Textos com data-i18n: o PT original fica guardado no primeiro arranque. */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!el.dataset.pt) { el.dataset.pt = el.innerHTML; }
      el.innerHTML = (lang === 'en' && EN[key]) ? EN[key] : el.dataset.pt;
    });

    /* A etiqueta da data tem data-i18n (o marcador dd/mm/aaaa), por isso o
       ciclo acima apagaria uma data ja escolhida. Repoe-la. */
    if ($('birthDate') && $('birthDate').value) {
      var chosen = new Date($('birthDate').value + 'T00:00:00');
      $('dateLabel').textContent = fmt(chosen);
      $('dateLabel').classList.remove('is-empty');
    }

    /* Placeholders */
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (!el.dataset.ptPh) { el.dataset.ptPh = el.placeholder; }
      el.placeholder = (lang === 'en' && PH_EN[key]) ? PH_EN[key] : el.dataset.ptPh;
    });

    /* Botao de idioma: mostra a lingua para onde se vai. */
    $('langCode').textContent = lang === 'pt' ? 'EN' : 'PT';
    $('langBtn').setAttribute('aria-label',
      lang === 'pt' ? 'Change language to English' : 'Mudar o idioma para português');

    /* Indicativos: nomes e ordem mudam com o idioma. */
    sortCountries();
    if (cc.selected) { ccSelect(cc.selected, true); }
    if (cc.open) { ccRender($('ccInput').value); }

    /* Calendario */
    $('calDows').innerHTML = dowNames().map(function (d) {
      return '<span>' + d + '</span>';
    }).join('');
    if ($('calMonth').options.length) {
      var keep = $('calMonth').value;
      $('calMonth').innerHTML = monthNames().map(function (n, i) {
        return '<option value="' + i + '">' + n + '</option>';
      }).join('');
      $('calMonth').value = keep;
    }

    /* Erro visivel: retraduzir ou esconder. */
    if (!errBox.hidden) { errBox.hidden = true; }
  }

  function fold(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function showError(msg) {
    errBox.textContent = msg;
    errBox.hidden = false;
  }

  function clearError() {
    errBox.hidden = true;
    form.querySelectorAll('.is-bad').forEach(function (el) {
      el.classList.remove('is-bad');
    });
  }

  /** Marca o campo e mostra a mensagem. Devolve sempre null. */
  function bad(name, msg) {
    var el;
    if (name === 'birthDate')      { el = $('dateBtn'); }
    else if (name === 'phoneCode') { el = $('ccInput'); }
    else                           { el = form.querySelector('[name="' + name + '"]'); }

    if (el) {
      el.classList.add('is-bad');
      try { el.focus(); } catch (e) {}
    }
    showError(msg);
    return null;
  }


  /* ══════════════════════════════════════════════════════════
     3 · INDICATIVO — combobox com pesquisa
     ══════════════════════════════════════════════════════════ */

  var cc = { open: false, active: -1, shown: [], selected: null };

  function ccLabel(c) { return c.iso + '  ' + c.code; }

  function ccSelect(c, keepOpen) {
    cc.selected = c;
    $('phoneCode').value = c.code;
    $('ccInput').value = ccLabel(c);
    $('ccInput').classList.remove('is-bad');
    if (!keepOpen) { ccClose(); }
  }

  function ccRender(query) {
    var list = $('ccList');
    var q = fold(query || '').trim();
    var digits = q.replace(/[^\d]/g, '');

    if (!q) {
      cc.shown = COUNTRIES;
    } else {
      /* Pontuacao por pertinencia: escrever "es" tem de dar Espanha
         primeiro, e nao Camaroes por conter "es" no meio. */
      cc.shown = COUNTRIES
        .map(function (c) {
          var name = fold(cName(c));
          var isoF = fold(c.iso);
          var score =
            isoF === q                                ? 0 :
            digits && c.code === '+' + digits         ? 1 :
            name.indexOf(q) === 0                     ? 2 :
            isoF.indexOf(q) === 0                     ? 3 :
            digits && c.code.indexOf(digits) === 1    ? 4 :
            name.indexOf(q) !== -1                    ? 5 : -1;
          return { c: c, score: score };
        })
        .filter(function (r) { return r.score !== -1; })
        .sort(function (a, b) {
          if (a.score !== b.score) { return a.score - b.score; }
          return cName(a.c).localeCompare(cName(b.c), lang === 'en' ? 'en' : 'pt');
        })
        .map(function (r) { return r.c; });
    }

    if (cc.shown.length === 0) {
      list.innerHTML = '<li class="pda-combo__empty">' + MSG('noResults') + '</li>';
      cc.active = -1;
      return;
    }

    list.innerHTML = cc.shown.map(function (c, i) {
      var on = cc.selected && c.code === cc.selected.code && c.iso === cc.selected.iso;
      return '<li class="pda-combo__opt' + (on ? ' is-sel' : '') + '" role="option" ' +
             'aria-selected="' + (on ? 'true' : 'false') + '" data-i="' + i + '">' +
               '<span class="pda-combo__iso">' + c.iso + '</span>' +
               '<span class="pda-combo__name">' + cName(c) + '</span>' +
               '<span class="pda-combo__code">' + c.code + '</span>' +
             '</li>';
    }).join('');

    /* Comeca no selecionado quando nao ha pesquisa. */
    cc.active = 0;
    if (!q && cc.selected) {
      cc.shown.forEach(function (c, i) {
        if (c.iso === cc.selected.iso) { cc.active = i; }
      });
    }
    ccHighlight(false);
  }

  function ccHighlight(scroll) {
    var list = $('ccList');
    list.querySelectorAll('.pda-combo__opt').forEach(function (el, i) {
      el.classList.toggle('is-active', i === cc.active);
    });
    if (scroll !== false && cc.active >= 0) {
      var el = list.querySelector('.pda-combo__opt.is-active');
      if (el) { el.scrollIntoView({ block: 'nearest' }); }
    }
  }

  function ccOpen() {
    if (cc.open) { return; }
    calClose();           /* nunca dois paineis abertos ao mesmo tempo */
    cc.open = true;
    $('ccWrap').classList.add('is-open');
    $('ccList').hidden = false;
    $('ccInput').setAttribute('aria-expanded', 'true');
    ccRender('');
    placePanel($('ccList'), $('ccInput'));
    var el = $('ccList').querySelector('.pda-combo__opt.is-active');
    if (el) { el.scrollIntoView({ block: 'center' }); }
  }

  function ccClose() {
    if (!cc.open) { return; }
    cc.open = false;
    $('ccWrap').classList.remove('is-open');
    $('ccList').hidden = true;
    $('ccInput').setAttribute('aria-expanded', 'false');
    /* Volta sempre a mostrar o que esta escolhido, nunca texto meio escrito. */
    if (cc.selected) { $('ccInput').value = ccLabel(cc.selected); }
  }

  function initCombo() {
    var input = $('ccInput');
    var list = $('ccList');

    ccSelect(COUNTRIES.filter(function (c) { return c.iso === 'PT'; })[0] || COUNTRIES[0], true);
    ccClose();

    input.addEventListener('focus', function () {
      ccOpen();
      input.select();
    });

    /* Escrever filtra: "por" → Portugal, "351" → +351, "es" → Espanha. */
    input.addEventListener('input', function () {
      if (!cc.open) { ccOpen(); }
      ccRender(input.value);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!cc.open) { ccOpen(); return; }
        if (cc.shown.length === 0) { return; }
        cc.active += (e.key === 'ArrowDown' ? 1 : -1);
        if (cc.active < 0) { cc.active = cc.shown.length - 1; }
        if (cc.active >= cc.shown.length) { cc.active = 0; }
        ccHighlight(true);
        return;
      }
      if (e.key === 'Enter') {
        if (cc.open && cc.active >= 0 && cc.shown[cc.active]) {
          e.preventDefault();
          ccSelect(cc.shown[cc.active]);
          $('ccWrap').parentNode.querySelector('[name="phoneNumber"]').focus();
        }
        return;
      }
      if (e.key === 'Escape') { ccClose(); return; }
      if (e.key === 'Tab') { ccClose(); }
    });

    list.addEventListener('mousedown', function (e) {
      /* mousedown em vez de click: evita o blur fechar antes de escolher. */
      var opt = e.target.closest('.pda-combo__opt');
      if (!opt) { return; }
      e.preventDefault();
      var c = cc.shown[parseInt(opt.getAttribute('data-i'), 10)];
      if (c) {
        ccSelect(c);
        form.querySelector('[name="phoneNumber"]').focus();
      }
    });

    input.addEventListener('blur', function () {
      setTimeout(ccClose, 60);
    });
  }


  /* ══════════════════════════════════════════════════════════
     4 · CALENDARIO
     ══════════════════════════════════════════════════════════ */

  var cal = { open: false, view: null, sel: null, max: null };

  function iso(d) {
    return d.getFullYear() + '-' +
           String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');
  }

  function fmt(d) {
    return String(d.getDate()).padStart(2, '0') + ' / ' +
           String(d.getMonth() + 1).padStart(2, '0') + ' / ' +
           d.getFullYear();
  }

  function calRender() {
    var y = cal.view.getFullYear();
    var m = cal.view.getMonth();

    $('calMonth').value = String(m);
    $('calYear').value = String(y);

    /* Segunda-feira como primeiro dia da semana. */
    var first = new Date(y, m, 1);
    var lead = (first.getDay() + 6) % 7;
    var days = new Date(y, m + 1, 0).getDate();

    var cells = [];
    for (var i = 0; i < lead; i++) { cells.push(null); }
    for (var d = 1; d <= days; d++) { cells.push(new Date(y, m, d)); }
    while (cells.length % 7 !== 0) { cells.push(null); }

    var today = iso(new Date());

    $('calGrid').innerHTML = cells.map(function (d) {
      if (!d) { return '<span class="pda-cal__pad"></span>'; }
      var key = iso(d);
      var future = d.getTime() > cal.max.getTime();
      var isSel = cal.sel && iso(cal.sel) === key;
      return '<button type="button" class="pda-cal__day' +
               (isSel ? ' is-sel' : '') + (key === today ? ' is-today' : '') + '" ' +
               'data-d="' + key + '"' + (future ? ' disabled' : '') + '>' +
               d.getDate() + '</button>';
    }).join('');
  }

  function calOpen() {
    if (cal.open) { return; }
    ccClose();            /* nunca dois paineis abertos ao mesmo tempo */
    cal.open = true;
    cal.view = cal.sel ? new Date(cal.sel) : new Date(1995, 0, 1);
    $('cal').hidden = false;
    $('dateBtn').setAttribute('aria-expanded', 'true');
    $('dateBtn').classList.remove('is-bad');
    calRender();
    placePanel($('cal'), $('dateBtn'));
  }

  function calClose() {
    if (!cal.open) { return; }
    cal.open = false;
    $('cal').hidden = true;
    $('dateBtn').setAttribute('aria-expanded', 'false');
  }

  function calPick(key) {
    cal.sel = new Date(key + 'T00:00:00');
    $('birthDate').value = key;
    var label = $('dateLabel');
    label.textContent = fmt(cal.sel);
    label.classList.remove('is-empty');
    errBox.hidden = true;
    calClose();
    $('dateBtn').focus();
  }

  function calShift(months) {
    cal.view = new Date(cal.view.getFullYear(), cal.view.getMonth() + months, 1);
    if (cal.view.getFullYear() < 1900) { cal.view = new Date(1900, 0, 1); }
    if (cal.view.getTime() > cal.max.getTime()) {
      cal.max = cal.max; /* nao passa do mes atual */
      cal.view = new Date(cal.max.getFullYear(), cal.max.getMonth(), 1);
    }
    calRender();
  }

  function initCalendar() {
    cal.max = new Date();
    cal.max.setHours(0, 0, 0, 0);

    $('calMonth').innerHTML = monthNames().map(function (n, i) {
      return '<option value="' + i + '">' + n + '</option>';
    }).join('');

    var thisYear = cal.max.getFullYear();
    var years = [];
    for (var y = thisYear; y >= 1900; y--) {
      years.push('<option value="' + y + '">' + y + '</option>');
    }
    $('calYear').innerHTML = years.join('');

    $('dateBtn').addEventListener('click', function () {
      if (cal.open) { calClose(); } else { calOpen(); }
    });

    $('calPrev').addEventListener('click', function () { calShift(-1); });
    $('calNext').addEventListener('click', function () { calShift(1); });

    $('calMonth').addEventListener('change', function () {
      cal.view = new Date(cal.view.getFullYear(), parseInt(this.value, 10), 1);
      calRender();
    });
    $('calYear').addEventListener('change', function () {
      cal.view = new Date(parseInt(this.value, 10), cal.view.getMonth(), 1);
      calRender();
    });

    $('calGrid').addEventListener('click', function (e) {
      var b = e.target.closest('.pda-cal__day');
      if (b && !b.disabled) { calPick(b.getAttribute('data-d')); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && cal.open) { calClose(); $('dateBtn').focus(); }
    });

    document.addEventListener('mousedown', function (e) {
      if (cal.open && !$('dateWrap').contains(e.target)) { calClose(); }
      if (cc.open && !$('ccWrap').contains(e.target)) { ccClose(); }
    });
  }


  /* ══════════════════════════════════════════════════════════
     5 · VALIDACAO E ENVIO
     ══════════════════════════════════════════════════════════ */

  function validate() {
    clearError();

    var d = new FormData(form);
    var firstName = String(d.get('firstName') || '').trim().replace(/\s+/g, ' ');
    var lastName  = String(d.get('lastName')  || '').trim().replace(/\s+/g, ' ');
    var phoneCode = String(d.get('phoneCode') || '').trim();
    var phoneRaw  = String(d.get('phoneNumber') || '').trim();
    var email     = String(d.get('email') || '').trim().toLowerCase();
    var birthDate = String(d.get('birthDate') || '').trim();
    var party     = String(d.get('partySize') || '');

    if (!firstName || !lastName || !phoneRaw || !email || !birthDate || !party) {
      return bad(!firstName ? 'firstName'
               : !lastName  ? 'lastName'
               : !phoneRaw  ? 'phoneNumber'
               : !email     ? 'email'
               : !birthDate ? 'birthDate'
               : 'partySize', MSG('required'));
    }

    if (firstName.length < 2 || !RE_NAME.test(firstName)) { return bad('firstName', MSG('name')); }
    if (lastName.length  < 2 || !RE_NAME.test(lastName))  { return bad('lastName',  MSG('name')); }

    if (!VALID_CODES[phoneCode]) { return bad('phoneCode', MSG('code')); }

    var digits = phoneRaw.replace(/\D/g, '');
    if (digits.length < 6 || digits.length > 15) { return bad('phoneNumber', MSG('phone')); }

    if (!RE_EMAIL.test(email) || email.length > 160) { return bad('email', MSG('email')); }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) { return bad('birthDate', MSG('birth')); }
    var bd = new Date(birthDate + 'T00:00:00Z');
    if (isNaN(bd.getTime()))          { return bad('birthDate', MSG('birth')); }
    if (bd.getTime() > Date.now())    { return bad('birthDate', MSG('birthFut')); }
    if (bd.getUTCFullYear() < 1900)   { return bad('birthDate', MSG('birth')); }

    /* "+12" = mais de 12 pessoas. */
    var more = party === '12+';
    var partySize = more ? 12 : parseInt(party, 10);
    if (!Number.isInteger(partySize) || partySize < 1 || partySize > 12) {
      return bad('partySize', MSG('party'));
    }

    /* Consentimento: sem ele não há fundamento para contactar. */
    if (!$('pdaConsent').checked) {
      $('pdaConsent').closest('.pda-consent').classList.add('is-bad');
      showError(MSG('consent'));
      return null;
    }

    return {
      submissionId: submissionId,
      /* Guardamos a frase exata que foi aceite, na língua em que
         foi mostrada — é isto que demonstra o consentimento. */
      consent: true,
      consentText: $('consentText').textContent.trim(),
      firstName: firstName,
      lastName: lastName,
      phoneCode: phoneCode,
      phoneNumber: digits,
      email: email,
      birthDate: birthDate,
      partySize: partySize,
      partySizeMore: more
    };
  }

  function setLoading(on) {
    btn.classList.toggle('pda-btn--loading', on);
    btn.disabled = on;
    form.querySelectorAll('input, select, button').forEach(function (el) {
      if (el !== btn) { el.disabled = on; }
    });
  }

  function showDone() {
    form.hidden = true;
    done.hidden = false;
    card.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function submit(e) {
    e.preventDefault();

    /* Primeira barreira ao duplo clique. */
    if (inFlight) { return; }

    var payload = validate();
    if (!payload) { return; }

    inFlight = true;
    setLoading(true);

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json()
          .catch(function () { return {}; })
          .then(function (body) { return { ok: res.ok, body: body }; });
      })
      .then(function (r) {
        if (!r.ok || !r.body || r.body.ok !== true) {
          throw new Error((r.body && r.body.error) || 'failed');
        }
        showDone();
      })
      .catch(function (err) {
        inFlight = false;
        setLoading(false);
        var offline = (typeof navigator !== 'undefined' && navigator.onLine === false);
        showError(offline || err.name === 'TypeError' ? MSG('network') : MSG('generic'));
        if (window.console) { console.error('[SV Passagem de Ano]', err); }
      });
  }


  /* ══════════════════════════════════════════════════════════
     6 · ARRANQUE
     ══════════════════════════════════════════════════════════ */

  function init() {
    form   = $('pdaForm');
    btn    = $('pdaBtn');
    errBox = $('pdaErr');
    card   = $('card');
    done   = $('pdaDone');

    if (!form) { return; }

    sortCountries();
    initCombo();
    initCalendar();

    $('langBtn').addEventListener('click', function () {
      applyLang(lang === 'pt' ? 'en' : 'pt');
    });

    /* Guarda o PT de origem e aplica a escolha guardada. */
    applyLang(lang);

    form.addEventListener('submit', submit);

    /* Enter num campo nao dispara dois envios. */
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && inFlight) { e.preventDefault(); }
    });

    /* Ao corrigir um campo, limpa o destaque de erro. */
    form.querySelectorAll('input, select').forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.classList.contains('is-bad')) {
          el.classList.remove('is-bad');
          errBox.hidden = true;
        }
      });
    });

    $('pdaConsent').addEventListener('change', function () {
      var caixa = this.closest('.pda-consent');
      if (this.checked && caixa.classList.contains('is-bad')) {
        caixa.classList.remove('is-bad');
        errBox.hidden = true;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
