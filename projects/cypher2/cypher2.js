/* ============================================
   Cypher 2 — interaction
   Two-way Caesar with live alphabet visualization
   ============================================ */

(() => {
  'use strict';

  const plainInput = document.getElementById('plainText');
  const cipherInput = document.getElementById('cipherText');
  const shiftInput = document.getElementById('shiftAmount');
  const shiftSlider = document.getElementById('shiftSlider');
  const stepButtons = document.querySelectorAll('.cypher-step');
  const alphabetEl = document.getElementById('alphabet');
  const shiftReadout = document.getElementById('shiftReadout');
  const plainPanel = plainInput.closest('.cypher-panel');
  const cipherPanel = cipherInput.closest('.cypher-panel');
  const plainLenEl = document.querySelector('[data-stat="plain-len"]');
  const cipherLenEl = document.querySelector('[data-stat="cipher-len"]');

  if (!plainInput || !cipherInput) return;

  /* --------------------------------------------
     Build alphabet visualization
     -------------------------------------------- */
  const buildAlphabet = () => {
    alphabetEl.innerHTML = '';
    for (let i = 0; i < 26; i++) {
      const cell = document.createElement('span');
      cell.className = 'glyph from';
      cell.dataset.from = i;
      cell.innerHTML = '<span class="arrow">↓</span>' + String.fromCharCode(65 + i);
      alphabetEl.appendChild(cell);
    }
  };

  const updateAlphabet = (k) => {
    const cells = alphabetEl.querySelectorAll('.glyph');
    cells.forEach(cell => {
      const from = parseInt(cell.dataset.from, 10);
      const to = (from + k) % 26;
      cell.classList.toggle('to', to === from);
      cell.classList.add('from');
      cell.lastChild.textContent = String.fromCharCode(65 + to);
    });
  };

  /* --------------------------------------------
     Core shift
     -------------------------------------------- */
  const shiftString = (str, shift) => {
    shift = ((shift % 26) + 26) % 26;
    return str.replace(/[a-zA-Z]/g, ch => {
      const base = ch <= 'Z' ? 65 : 97;
      const code = ch.charCodeAt(0) - base;
      return String.fromCharCode(((code + shift) % 26) + base);
    });
  };

  /* --------------------------------------------
     State
     -------------------------------------------- */
  let lastActive = 'plain';

  const flash = (panel) => {
    panel.classList.remove('updated');
    void panel.offsetWidth;
    panel.classList.add('updated');
    setTimeout(() => panel.classList.remove('updated'), 600);
  };

  const updateLengths = () => {
    const p = plainInput.value.length;
    const c = cipherInput.value.length;
    plainLenEl.textContent = `${p} character${p === 1 ? '' : 's'}`;
    cipherLenEl.textContent = `${c} character${c === 1 ? '' : 's'}`;
  };

  /* --------------------------------------------
     Bindings
     -------------------------------------------- */
  const getShift = () => {
    const n = parseInt(shiftInput.value, 10);
    if (isNaN(n)) return 0;
    return ((n % 26) + 26) % 26;
  };

  // keep focused textarea visible above Android keyboard
  const focusHandler = (e) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };
  plainInput.addEventListener('focus', focusHandler);
  cipherInput.addEventListener('focus', focusHandler);

  const setShift = (k) => {
    const v = ((k % 26) + 26) % 26;
    shiftInput.value = v;
    shiftSlider.value = v;
    updateAlphabet(v);
    shiftReadout.textContent = `k = ${v}`;
  };

  const encrypt = () => {
    lastActive = 'plain';
    cipherInput.value = shiftString(plainInput.value, getShift());
    flash(cipherPanel);
    updateLengths();
  };

  const decrypt = () => {
    lastActive = 'cipher';
    plainInput.value = shiftString(cipherInput.value, -getShift());
    flash(plainPanel);
    updateLengths();
  };

  plainInput.addEventListener('input', encrypt);
  cipherInput.addEventListener('input', decrypt);

  shiftInput.addEventListener('input', () => {
    setShift(parseInt(shiftInput.value, 10) || 0);
    if (lastActive === 'plain') encrypt();
    else decrypt();
  });

  shiftSlider.addEventListener('input', () => {
    setShift(parseInt(shiftSlider.value, 10));
    if (lastActive === 'plain') encrypt();
    else decrypt();
  });

  stepButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      setShift(getShift() + step);
      if (lastActive === 'plain') encrypt();
      else decrypt();
    });
  });

  /* --------------------------------------------
     Init
     -------------------------------------------- */
  buildAlphabet();
  setShift(3);
  updateLengths();

})();
