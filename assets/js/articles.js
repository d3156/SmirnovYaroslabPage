(function () {
  function escapeHtml(s = "") {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  async function loadMoreArticles(options = {}) {
    const {
      hostId = "more-articles",
      indexUrl = "./index.json",
      emptyHtml = '<div class="callout">Пока нет других статей.</div>',
      errorHtml = '<div class="callout">Не удалось загрузить список статей. Проверь, что <span class="mono">articles/index.json</span> существует и сайт открыт по HTTP(S).</div>',
      limit = 999,
    } = options;

    const host = document.getElementById(hostId);
    if (!host) return;

    const current = new URL(location.href).pathname.split("/").pop();

    try {
      const res = await fetch(indexUrl, { cache: "no-store" });
      if (!res.ok) throw new Error("index.json not found");
      const items = await res.json();

      const filtered = (items || [])
        .filter(p => p && p.url && !p.url.endsWith(current))
        .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
        .slice(0, limit);

      if (!filtered.length) {
        host.innerHTML = emptyHtml;
        return;
      }

      host.innerHTML = filtered.map(p => `
        <a class="card box" href="${p.url}" style="display:block; padding:16px;">
          <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
            <b style="font-size:15px;">${escapeHtml(p.title || "Без названия")}</b>
            ${p.date ? `<span class="mono" style="color:var(--muted); font-size:12.5px;">${escapeHtml(p.date)}</span>` : ""}
          </div>
          ${Array.isArray(p.tags) && p.tags.length ? `
            <div class="pillset" style="margin-top:10px;">
              ${p.tags.slice(0, 4).map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("")}
            </div>` : ""
          }
        </a>
      `).join("");

    } catch (e) {
      host.innerHTML = errorHtml;
    }
  }

  // Автозапуск (для страниц статей в папке /articles)
  document.addEventListener("DOMContentLoaded", () => {
    loadMoreArticles();
  });

  // На всякий случай оставим доступ из консоли/страницы:
  window.loadMoreArticles = loadMoreArticles;
})();
