/* ============================================
   Particle / neural-line canvas
   ============================================ */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none)').matches;

  const canvas = document.getElementById('particles');
  if (!canvas || prefersReduced) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let nodes = [];
  const mouse = { x: -9999, y: -9999, radius: 140 };
  const NODE_COUNT_BASE = 55;

  const spawn = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    r: Math.random() * 1.3 + 0.3,
    a: Math.random() * 0.5 + 0.2
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.25 : 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const scale = isCoarse ? 0.45 : Math.min(1.4, window.innerWidth / 1280);
    const count = Math.floor(NODE_COUNT_BASE * scale);
    nodes = new Array(count).fill(0).map(() => spawn());
  };

  window.addEventListener('resize', () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    resize();
  });

  if (!isCoarse) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  const tick = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > window.innerWidth) n.vx *= -1;
      if (n.y < 0 || n.y > window.innerHeight) n.vy *= -1;

      if (!isCoarse) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const f = (1 - dist / mouse.radius) * 0.4;
          n.x += (dx / dist) * f;
          n.y += (dy / dist) * f;
        }
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 200, 255, ${n.a})`;
      ctx.fill();
    }

    const maxDist = 130;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.12;
          ctx.strokeStyle = `rgba(140, 165, 230, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(tick);
  };

  resize();
  tick();
})();
