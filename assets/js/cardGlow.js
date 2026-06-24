/* ============================================
   Card cursor glow position (sets --mx/--my vars)
   ============================================ */

(() => {
  'use strict';

  document.querySelectorAll('.research-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
})();
