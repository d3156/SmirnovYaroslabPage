(function () {
  function initRotatingTitle(options = {}) {
    const {
      elementId = "rotating",
      texts = [
        "Короткий код — лучший код",
        "Больше строк — больше багов",
        "Shorter code, better code",
        "Fewer lines, fewer bugs",
      ],
      showMs = 10000,
      wipeMs = 600,
      autostart = true,
    } = options;

    const el = document.getElementById(elementId);
    if (!el) return () => {};

    let i = 0;
    let timer = null;

    // стартовое состояние
    el.textContent = texts[i] ?? "";
    el.classList.add("is-shown");
    el.classList.remove("is-hidden");

    function next() {
      el.classList.remove("is-shown");
      el.classList.add("is-hidden");

      setTimeout(() => {
        i = (i + 1) % texts.length;
        el.textContent = texts[i] ?? "";

        el.classList.remove("is-hidden");
        el.classList.add("is-shown");
      }, wipeMs);
    }

    function start() {
      if (timer) return;
      next(); // первый переход
      timer = setInterval(next, showMs + wipeMs * 2);
    }

    function stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    }

    if (autostart) start();
    return stop;
  }

  // Автозапуск на страницах, где есть #rotating
  document.addEventListener("DOMContentLoaded", () => {
    initRotatingTitle();
  });

  // (опционально) доступ снаружи
  window.initRotatingTitle = initRotatingTitle;
})();
