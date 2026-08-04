/* =============================================================
   ArteVia — shared behaviour for every page

   Each block guards its own markup, so one file is safe to load
   everywhere. A page without a hamburger simply skips that block.
   ============================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Sticky nav — hairline appears once you start scrolling
     --------------------------------------------------------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var panel  = document.getElementById('navPanel');

  if (toggle && panel) {
    var closePanel = function () {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 700) closePanel();
    });
  }

  /* ---------------------------------------------------------
     Scroll spy — highlights the section you're currently in
     --------------------------------------------------------- */
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[data-target]')
  );

  if (spyLinks.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      spyLinks.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('data-target') === id);
      });
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    spyLinks.forEach(function (l) {
      var el = document.getElementById(l.getAttribute('data-target'));
      if (el) observer.observe(el);
    });
  }
})();
