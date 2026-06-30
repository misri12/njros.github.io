/**
 * NJROS — National Jirga Registration and Oversight System
 * Government White Paper Website — Vanilla JavaScript
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     DOM Ready
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initLoader();
    initNavbar();
    initThemeToggle();
    initScrollReveal();
    initCounters();
    initWorkflowAnimation();
    initGovernanceReveal();
    initTimeline();
    initFAQ();
    initCaseStudies();
    initScrollTop();
    initSmoothScroll();
    initContactForm();
    initActiveNavLink();
  }

  /* --------------------------------------------------------------------------
     Loading Screen
     -------------------------------------------------------------------------- */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
        loader.setAttribute('aria-hidden', 'true');
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
     Navbar — Mobile Toggle & Scroll State
     -------------------------------------------------------------------------- */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');

    if (!navbar || !toggle || !menu) return;

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    menu.querySelectorAll('.navbar__link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     Dark Mode Toggle
     -------------------------------------------------------------------------- */
  function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const saved = localStorage.getItem('njros-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    updateThemeIcon();

    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('njros-theme', next);
      updateThemeIcon();
    });

    function updateThemeIcon() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      toggle.innerHTML = isDark
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  /* --------------------------------------------------------------------------
     Scroll Reveal (Intersection Observer)
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* --------------------------------------------------------------------------
     Animated Counters
     -------------------------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) { observer.observe(counter); });
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;

      el.textContent = prefix + (decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString()) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* --------------------------------------------------------------------------
     Workflow Step Animation
     -------------------------------------------------------------------------- */
  function initWorkflowAnimation() {
    const workflow = document.querySelector('.workflow');
    const steps = document.querySelectorAll('.workflow__step');
    if (!workflow || !steps.length) return;

    let cycleTimer = null;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          steps.forEach(function (step, i) {
            setTimeout(function () {
              step.classList.add('visible');
            }, i * 150);
          });

          var current = 0;
          steps[0].classList.add('active');

          cycleTimer = setInterval(function () {
            steps.forEach(function (s) { s.classList.remove('active'); });
            current = (current + 1) % steps.length;
            steps[current].classList.add('active');
          }, 1800);

          observer.disconnect();
        } else if (cycleTimer) {
          clearInterval(cycleTimer);
          cycleTimer = null;
        }
      });
    }, { threshold: 0.3 });

    observer.observe(workflow);
  }

  /* --------------------------------------------------------------------------
     Governance Levels Reveal
     -------------------------------------------------------------------------- */
  function initGovernanceReveal() {
    const levels = document.querySelectorAll('.governance__level');
    if (!levels.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          levels.forEach(function (level, i) {
            setTimeout(function () {
              level.classList.add('visible');
            }, i * 120);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(document.querySelector('.governance'));
  }

  /* --------------------------------------------------------------------------
     Interactive Timeline
     -------------------------------------------------------------------------- */
  function initTimeline() {
    const items = document.querySelectorAll('.timeline__item');
    const contents = document.querySelectorAll('.timeline__content');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    items.forEach(function (item) { observer.observe(item); });

    contents.forEach(function (content) {
      content.addEventListener('click', function () {
        contents.forEach(function (c) { c.classList.remove('active'); });
        content.classList.add('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     FAQ Accordion
     -------------------------------------------------------------------------- */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(function (item) {
      const question = item.querySelector('.faq-item__question');
      if (!question) return;

      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        items.forEach(function (other) {
          other.classList.remove('open');
          other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Case Study Cards
     -------------------------------------------------------------------------- */
  function initCaseStudies() {
    const cards = document.querySelectorAll('.case-card');

    cards.forEach(function (card) {
      const toggle = card.querySelector('.case-card__toggle');
      if (!toggle) return;

      toggle.addEventListener('click', function () {
        const isOpen = card.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
      });
    });
  }

  /* --------------------------------------------------------------------------
     Scroll to Top Button
     -------------------------------------------------------------------------- */
  function initScrollTop() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     Smooth Scroll for Anchor Links
     -------------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#') return;

        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Active Navigation Link on Scroll
     -------------------------------------------------------------------------- */
  function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* --------------------------------------------------------------------------
     Contact Form Handler
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent';
      btn.disabled = true;
      btn.style.background = 'var(--accent)';

      setTimeout(function () {
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    });
  }

})();
