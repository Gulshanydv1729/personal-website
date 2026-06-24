/* ============================================
   Magnetic hover effect on .magnetic elements
   ============================================ */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none)').matches;

  if (isCoarse || prefersReduced) return;

  const magnets = document.querySelectorAll('.magnetic');
  const strength = 18;

  magnets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const mx = (e.clientX - cx) / (r.width / 2);
      const my = (e.clientY - cy) / (r.height / 2);
      el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();
