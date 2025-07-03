// src/composables/useTypewriter.js
export function typeTextWithCursor(textEl, cursorEl, text, speed = 50) {
  let i = 0;
  textEl.textContent = '';
  cursorEl.style.left = '0px';

  function updateCursor() {
    cursorEl.style.left = `${textEl.offsetWidth + 4}px`;
  }

  function type() {
    if (i < text.length) {
      textEl.textContent += text[i++];
      updateCursor();
      setTimeout(type, speed);
    } else {
      blink();
    }
  }

  function blink() {
    let b = 0;
    const iv = setInterval(() => {
      cursorEl.style.opacity = cursorEl.style.opacity === '0' ? '1' : '0';
      if (++b >= 6) {
        clearInterval(iv);
        cursorEl.style.opacity = '1';
      }
    }, 400);
  }

  new ResizeObserver(updateCursor).observe(textEl);
  type();
}
