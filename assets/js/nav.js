(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  /* ---------- Mobile navigation ---------- */
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('open'));
    });

    // Close after following a link on mobile.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    // Close on Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Header state on scroll ---------- */
  if (header) {
    var syncHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  /* ---------- Hash routing ----------
     Expands the matching <details> (and any ancestors) and scrolls to it, so a
     deep link such as /#terms opens the section rather than landing on a closed
     accordion. */
  function openFromHash() {
    var hash = location.hash;
    if (!hash || hash.length < 2) return;

    var target;
    try {
      target = document.querySelector(hash);
    } catch (err) {
      return; // invalid selector in the hash
    }
    if (!target) return;

    // Open the target itself (if collapsible) and every enclosing <details>.
    var d = target.tagName === 'DETAILS' ? target : target.closest('details');
    while (d) {
      d.open = true;
      d = d.parentElement ? d.parentElement.closest('details') : null;
    }

    // Scroll after the newly expanded content has laid out.
    requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Run on initial load (script is deferred, so the DOM is ready) and on later
  // hash changes.
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* ---------- Section highlighting ----------
     Marks the nav link for whichever section currently owns the upper part of
     the viewport. Purely decorative, so it is skipped where unsupported. */
  if (nav && 'IntersectionObserver' in window) {
    var links = {};
    Array.prototype.forEach.call(nav.querySelectorAll('a[href^="#"]'), function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });

    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });

      var current = null;
      Object.keys(links).forEach(function (id) {
        if (visible[id] && !current) current = id;
      });

      Object.keys(links).forEach(function (id) {
        links[id].classList.toggle('is-active', id === current);
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    Object.keys(links).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }
})();
