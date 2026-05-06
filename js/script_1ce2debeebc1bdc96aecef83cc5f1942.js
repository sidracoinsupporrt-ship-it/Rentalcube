document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');

  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    const isDark = t === 'dark';
    if (icon) icon.className = isDark ? 'bi bi-sun' : 'bi bi-moon-stars';
  };

  const saved = localStorage.getItem('racf_theme');
  if (saved === 'dark' || saved === 'light') applyTheme(saved);

  btn?.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    localStorage.setItem('racf_theme', next);
    applyTheme(next);
  });

  // Offcanvas z-index stability
  const menuEl = document.getElementById('mobileMenu');
  if (menuEl) {
    menuEl.addEventListener('show.bs.offcanvas', () => document.documentElement.classList.add('menu-open'));
    menuEl.addEventListener('hidden.bs.offcanvas', () => document.documentElement.classList.remove('menu-open'));
  }

  // Hard-open handler
  const hamBtn = document.querySelector('[data-bs-target="#mobileMenu"]');
  if (menuEl && hamBtn && window.bootstrap) {
    const instance = bootstrap.Offcanvas.getOrCreateInstance(menuEl);
    hamBtn.addEventListener('click', (e) => {
      e.preventDefault();
      instance.show();
    });
  }
});
