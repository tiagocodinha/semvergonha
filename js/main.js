(function () {
  'use strict';

  // ── NAV SCROLL + FLOATING BUTTON ──
  var nav = document.getElementById('nav');
  var floatingBtn = document.querySelector('.floating-reserve');
  var lastScrollY = 0;

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('nav--faded', y > 10);

    if (floatingBtn) {
      if (y > lastScrollY && y > 10) {
        floatingBtn.classList.add('floating-reserve--visible');
      } else {
        floatingBtn.classList.remove('floating-reserve--visible');
      }
    }

    lastScrollY = y;
  }, { passive: true });

  // ── MOBILE MENU ──
  var burger = document.getElementById('burger');
  var mob = document.getElementById('mobMenu');
  burger.addEventListener('click', function () {
    burger.classList.toggle('active');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      burger.classList.remove('active');
      mob.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.offsetTop - 72, behavior: 'smooth' });
      }
    });
  });

  // ── HERO SLIDER ──
  var slides = document.querySelectorAll('.hero__slide');
  var dots = document.querySelectorAll('.hero__dot');
  var current = 0;
  var total = slides.length;

  function goToSlide(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = n;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  // Auto-advance every 5s
  var autoSlide = setInterval(function () {
    goToSlide((current + 1) % total);
  }, 5000);

  // Dot clicks
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      clearInterval(autoSlide);
      goToSlide(parseInt(this.getAttribute('data-slide')));
      autoSlide = setInterval(function () {
        goToSlide((current + 1) % total);
      }, 5000);
    });
  });

  // ── SCROLL REVEAL ──
  var revealEls = document.querySelectorAll('[data-r]');
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function (el) { revealObs.observe(el); });

  // ── FOOD GALLERY ARROWS ──
  document.querySelectorAll('.food-gallery').forEach(function (g) {
    var track = g.querySelector('.food-gallery__track');
    if (!track) return;
    function arrow(dir, label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'food-gallery__arrow food-gallery__arrow--' + (dir < 0 ? 'prev' : 'next');
      b.setAttribute('aria-label', label);
      b.textContent = dir < 0 ? '‹' : '›';
      b.addEventListener('click', function () {
        var item = track.querySelector('.food-gallery__item');
        var step = item ? item.offsetWidth + 16 : track.clientWidth / 2;
        track.scrollBy({ left: dir * step, behavior: 'smooth' });
      });
      g.appendChild(b);
      return b;
    }
    var prev = arrow(-1, 'Anterior'), next = arrow(1, 'Seguinte');
    function update() {
      prev.hidden = track.scrollLeft < 8;
      next.hidden = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    }
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // ── ALLERGEN TOOLTIP ──
  // Hover no desktop, toque no telemóvel. O nome vem da legenda da página,
  // por isso já está traduzido e acompanha a mudança de idioma.
  var tip = null, tipTimer = null, tipFor = null;

  function allergenName(icon) {
    var m = icon.className.match(/\ba(\d+)\b/);
    if (!m) return '';
    var ref = document.querySelector('.allergen-legend .a' + m[1]);
    var label = ref && ref.parentNode.querySelector('[data-i18n]');
    return label ? label.textContent.trim() : '';
  }

  function hideTip() {
    clearTimeout(tipTimer);
    if (tip) tip.classList.remove('show');
    tipFor = null;
  }

  function showTip(icon, autoHide) {
    var name = allergenName(icon);
    if (!name) return;
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'allergen-tip';
      tip.setAttribute('role', 'tooltip');
      document.body.appendChild(tip);
    }
    clearTimeout(tipTimer);
    tip.textContent = name;
    var r = icon.getBoundingClientRect();
    tip.style.left = '0px';
    var w = tip.offsetWidth;
    var x = r.left + r.width / 2 - w / 2;
    x = Math.max(8, Math.min(x, document.documentElement.clientWidth - w - 8));
    tip.style.left = x + 'px';
    tip.style.top = (r.top - tip.offsetHeight - 8) + 'px';
    tip.classList.add('show');
    tipFor = icon;
    if (autoHide) tipTimer = setTimeout(hideTip, 2500);
  }

  document.querySelectorAll('.menu__allergens .a').forEach(function (icon) {
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('role', 'img');
  });

  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  document.addEventListener('mouseover', function (e) {
    if (!canHover) return;
    var icon = e.target.closest && e.target.closest('.menu__allergens .a');
    if (icon) showTip(icon); else if (tipFor) hideTip();
  });
  document.addEventListener('focusin', function (e) {
    // Só para teclado: num toque o foco abria a etiqueta e o click logo a seguir fechava-a
    var icon = e.target.closest && e.target.closest('.menu__allergens .a');
    if (icon && icon.matches(':focus-visible')) showTip(icon);
  });
  document.addEventListener('focusout', hideTip);
  document.addEventListener('click', function (e) {
    var icon = e.target.closest && e.target.closest('.menu__allergens .a');
    if (!icon) { hideTip(); return; }
    if (tipFor === icon) hideTip(); else showTip(icon, true);
  });
  window.addEventListener('scroll', hideTip, { passive: true });

})();
