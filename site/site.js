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

  /* ---------------------------------------------------------
     Enquiry form — post in the background, then hand over to the
     booking page named in the form's data-next attribute.

     Formspree's "Thank You" redirect is a paid feature, so the
     redirect happens here instead. Deliberately a plain fetch and
     NOT @formspree/ajax: that library loads from unpkg on every
     page view, which would put a third-party request on the page
     before anyone has pressed anything and break the claim in
     privacy.html. Nothing here runs until submit.

     Enhancement only. With JS off, or fetch missing, or no
     data-next, the form posts normally and the message still
     arrives — the person just lands on Formspree's own page
     instead of the diary.
     --------------------------------------------------------- */
  var enquiry = document.querySelector('form.enquiry');

  if (enquiry && window.fetch && window.FormData) {
    var next    = enquiry.getAttribute('data-next');
    var status  = enquiry.querySelector('.form-status');
    var button  = enquiry.querySelector('button[type="submit"]');
    var idle    = button ? button.textContent : '';

    var say = function (text, isError) {
      if (!status) return;
      status.textContent = text;
      status.classList.toggle('error', !!isError);
      status.hidden = false;
    };

    enquiry.addEventListener('submit', function (e) {
      if (!next) return;                 // nowhere to go — let it post normally
      e.preventDefault();

      if (status) status.hidden = true;
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }

      fetch(enquiry.action, {
        method:  'POST',
        body:    new FormData(enquiry),
        headers: { Accept: 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          /* A beat on "Sent" before the handover. Without it the page
             swaps to a stranger's booking form with no evidence the
             message went anywhere, and people assume it failed. */
          say('Sent. Now pick a time…');
          window.setTimeout(function () { window.location.href = next; }, 1200);
          return;
        }
        /* Formspree answers a rejected submission with JSON saying why.
           The visitor gets the plain sentence either way; the reason goes
           to the console, because "it didn't send" with no detail is not
           something you can debug a year from now. */
        return res.json()
          .catch(function () { return null; })
          .then(function (body) {
            throw new Error(
              body && body.errors
                ? body.errors.map(function (er) { return er.message; }).join('; ')
                : 'HTTP ' + res.status
            );
          });
      })
      .catch(function (err) {
        if (button) { button.disabled = false; button.textContent = idle; }
        say('That didn’t send. Email hello@arte-via.uk and it will reach me.', true);

        if (!window.console) return;
        console.error('[enquiry] submission failed: ' + err.message);
        /* By far the most common cause while working locally, and it looks
           identical to a real outage from inside the catch. */
        if (window.location.protocol === 'file:') {
          console.error(
            '[enquiry] This page is open over file://, so its origin is "null" ' +
            'and the browser blocks the request to Formspree before it leaves. ' +
            'Nothing is wrong with the form. Serve the folder over http instead — ' +
            'cd site && python3 -m http.server — or test on the deployed site.'
          );
        }
      });
    });
  }
})();
