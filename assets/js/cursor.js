/* ============================================
   Cursor dot + soft glow
   ============================================ */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none)').matches;

  if (isCoarse || prefersReduced) return;

  const glow = document.querySelector('.cursor-glow');
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
  let dx = gx, dy = gy;
  let tx = gx, ty = gy;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  const tick = () => {
    dx += (tx - dx) * 0.18;
    dy += (ty - dy) * 0.18;
    gx += (tx - gx) * 0.10;
    gy += (ty - gy) * 0.10;

    if (glow) glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;

    requestAnimationFrame(tick);
  };
  tick();

  document.querySelectorAll('a, button, .magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
  });

  window.addEventListener('mouseleave', () => {
    if (glow) glow.style.opacity = '0';
    dot.style.opacity = '0';
  });
  window.addEventListener('mouseenter', () => {
    if (glow) glow.style.opacity = '1';
    dot.style.opacity = '1';
  });
})();
