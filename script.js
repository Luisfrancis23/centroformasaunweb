/* ============================================================
   BrightPath Academy — Interactive Functionality
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (selector, context) => (context || document).querySelector(selector);
  const $$ = (selector, context) => Array.from((context || document).querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header state + back-to-top visibility ---------- */
  const header = $('#site-header');
  const backToTop = $('#back-to-top');

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 24);
    if (backToTop) backToTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mobile navigation menu ---------- */
  const navToggle = $('#nav-toggle');
  const navMenu = $('#nav-menu');

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    header.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      header.classList.toggle('menu-open', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    });

    // Close menu when a link is tapped
    $$('.nav-link', navMenu).forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Close menu when resizing to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  /* ---------- Active navigation link highlighting ---------- */
  const navLinks = $$('.nav-link');
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(function (link) {
        const isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  $$('main section[id]').forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ---------- Scroll reveal animations (with stagger) ---------- */
  const revealEls = $$('.reveal');
  revealEls.forEach(function (el) {
    const siblings = Array.from(el.parentElement.children).filter(function (child) {
      return child.classList && child.classList.contains('reveal');
    });
    el.style.transitionDelay = (siblings.indexOf(el) * 80) + 'ms';
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Animated statistics counters ---------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString('en-US') + suffix;
      return;
    }
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = $$('.stat-num');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ---------- Course category filter ---------- */
  const chips = $$('.chip');
  const courseCards = $$('.course-card');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      courseCards.forEach(function (card) {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !show);
      });
    });
  });

  /* ---------- Testimonial slider ---------- */
  const slider = $('#testimonial-slider');
  if (slider) {
    const track = $('.slider-track', slider);
    const slides = $$('.slide', slider);
    const dotsWrap = $('#slider-dots');
    const prevBtn = $('#slider-prev');
    const nextBtn = $('#slider-next');
    let index = 0;
    let timer = null;

    // Build dot buttons
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
    });
    const dots = $$('.slider-dot', dotsWrap);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, j) { d.classList.toggle('active', j === index); });
      slides.forEach(function (s, j) { s.setAttribute('aria-hidden', String(j !== index)); });
    }

    function startAuto() {
      if (prefersReducedMotion) return;
      timer = setInterval(function () { goTo(index + 1); }, 6500);
    }
    function restartAuto() {
      clearInterval(timer);
      startAuto();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); restartAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); restartAuto(); });

    // Pause auto-advance while hovering or focused
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', function () { clearInterval(timer); });
    slider.addEventListener('focusout', startAuto);

    // Touch swipe support
    let touchStartX = null;
    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) {
        goTo(index + (delta < 0 ? 1 : -1));
        restartAuto();
      }
      touchStartX = null;
    }, { passive: true });

    goTo(0);
    startAuto();
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = $('#lightbox');
  const galleryItems = $$('.gallery-item');

  if (lightbox && galleryItems.length) {
    const lbImg = $('#lightbox-img');
    const lbCaption = $('#lightbox-caption');
    const lbClose = $('#lb-close');
    const lbPrev = $('#lb-prev');
    const lbNext = $('#lb-next');
    let lbIndex = 0;
    let lastFocused = null;

    function updateLightbox() {
      const img = $('img', galleryItems[lbIndex]);
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = galleryItems[lbIndex].dataset.caption || '';
    }

    function openLightbox(i) {
      lbIndex = i;
      updateLightbox();
      lastFocused = document.activeElement;
      lightbox.classList.add('open');
      document.body.classList.add('no-scroll');
      lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.classList.remove('no-scroll');
      if (lastFocused) lastFocused.focus();
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () { openLightbox(i); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { lbIndex = (lbIndex - 1 + galleryItems.length) % galleryItems.length; updateLightbox(); });
    lbNext.addEventListener('click', function () { lbIndex = (lbIndex + 1) % galleryItems.length; updateLightbox(); });

    // Close when clicking the backdrop (outside the figure)
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + galleryItems.length) % galleryItems.length; updateLightbox(); }
      if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % galleryItems.length; updateLightbox(); }
    });
  }
  /* ---------- Contact form validation ---------- */
  const contactForm = $('#contact-form');
  if (contactForm) {
    const successMsg = $('#form-success');

    function setError(input, message) {
      const group = input.closest('.form-group');
      const errorEl = $('.error-text', group);
      if (message) {
        input.classList.add('invalid');
        if (errorEl) errorEl.textContent = message;
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.classList.remove('invalid');
        if (errorEl) errorEl.textContent = '';
        input.removeAttribute('aria-invalid');
      }
      return !message;
    }

    function validateField(input) {
      const value = input.value.trim();
      if (!value) return setError(input, 'This field is required.');
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return setError(input, 'Please enter a valid email address.');
      }
      if (input.id === 'form-message' && value.length < 10) {
        return setError(input, 'Please write at least 10 characters.');
      }
      if (input.id === 'form-name' && value.length < 2) {
        return setError(input, 'Please enter your full name.');
      }
      return setError(input, '');
    }

    $$('input, select, textarea', contactForm).forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('invalid')) validateField(input);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const fields = $$('input, select, textarea', contactForm);
      let isValid = true;
      let firstInvalid = null;

      fields.forEach(function (input) {
        if (!validateField(input)) {
          isValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!isValid) {
        firstInvalid.focus();
        return;
      }

      // Simulate successful submission
      contactForm.reset();
      fields.forEach(function (input) { setError(input, ''); });
      successMsg.classList.add('show');
      successMsg.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
      setTimeout(function () { successMsg.classList.remove('show'); }, 8000);
    });
  }

  /* ---------- Newsletter form ---------- */
  const newsletterForm = $('#newsletter-form');
  if (newsletterForm) {
    const emailInput = $('#newsletter-email');
    const msg = $('#newsletter-msg');
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const value = emailInput.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        msg.textContent = 'Please enter a valid email address.';
        msg.style.color = '#ff8a5c';
        emailInput.focus();
        return;
      }
      msg.textContent = 'Subscribed! Check your inbox for a welcome note.';
      msg.style.color = '';
      newsletterForm.reset();
    });
  }

  /* ---------- Image fallback placeholder ---------- */
  // If an Unsplash image fails to load (e.g. offline), swap in a branded SVG placeholder.
  function buildPlaceholder(width, height, label) {
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='" + width + "' height='" + height + "'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='#14335c'/><stop offset='1' stop-color='#0b1f3a'/>" +
      "</linearGradient></defs>" +
      "<rect width='100%' height='100%' fill='url(#g)'/>" +
      "<circle cx='" + (width - 70) + "' cy='70' r='90' fill='#f97316' opacity='0.25'/>" +
      "<path d='M" + (width / 2 - 40) + ' ' + (height / 2 - 55) + "l40 18-40 18-40-18z' fill='#f97316'/>" +
      "<path d='M" + (width / 2 - 32) + ' ' + (height / 2 - 28) + "l32 14 32-14v14l-32 14-32-14z' fill='#ffffff'/>" +
      "<text x='50%' y='" + (height / 2 + 60) + "' fill='#9db1c9' font-family='Arial, sans-serif' " +
      "font-size='22' font-weight='bold' text-anchor='middle'>" + label + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  $$('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.src = buildPlaceholder(800, 600, 'BrightPath Academy');
    }, { once: true });
  });

})();