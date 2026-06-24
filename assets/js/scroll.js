/* ============================================
   Reveal on scroll, active nav, hero parallax
   ============================================ */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none)').matches;

  /* --------------------------------------------
     Active nav link tracking
     -------------------------------------------- */

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [...document.querySelectorAll('section[id]')];

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.id;
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(s => navObs.observe(s));
  }

  /* --------------------------------------------
     Reveal on scroll
     -------------------------------------------- */

  const revealTargets = document.querySelectorAll(
    '.section-head, .research-card, .archive-row, .writing-card, .contact-card, .contact-section .signature, .foot-inner, .coming-soon'
  );

  revealTargets.forEach((t, i) => {
    t.classList.add('reveal');
    const col = (i % 3) + 1;
    t.setAttribute('data-delay', String(col));
  });

  if ('IntersectionObserver' in window && !prefersReduced) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          revealObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(t => revealObs.observe(t));
  } else {
    revealTargets.forEach(t => t.classList.add('in'));
  }

  /* --------------------------------------------
     Subtle hero parallax on pointer
     -------------------------------------------- */

  if (!isCoarse && !prefersReduced) {
    const hero = document.querySelector('.hero-inner');
    if (hero) {
      let hx = 0, hy = 0, cx = 0, cy = 0;

      window.addEventListener('mousemove', (e) => {
        hx = (e.clientX / window.innerWidth - 0.5) * 12;
        hy = (e.clientY / window.innerHeight - 0.5) * 8;
      }, { passive: true });

      const loop = () => {
        cx += (hx - cx) * 0.05;
        cy += (hy - cy) * 0.05;
        hero.style.transform = `translate(${cx}px, ${cy}px)`;
        requestAnimationFrame(loop);
      };
      loop();
    }
  }

  /* --------------------------------------------
     Hero fade on scroll
     -------------------------------------------- */

  const heroInner = document.querySelector('.hero-inner');
  if (heroInner) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const opacity = Math.max(0, 1 - y / 600);
      const lift = Math.min(60, y * 0.08);
      heroInner.style.opacity = opacity;
      heroInner.style.transform = `translateY(${lift}px)`;
    }, { passive: true });
  }
})();
