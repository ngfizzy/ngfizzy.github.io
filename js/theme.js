(function () {
  var STORAGE_KEY = 'ngfizzy-theme';
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var systemPrefersLight = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: light)')
    : { matches: false };

  if (!toggle) {
    return;
  }

  function activeTheme() {
    if (root.dataset.theme === 'light' || root.dataset.theme === 'dark') {
      return root.dataset.theme;
    }

    return systemPrefersLight.matches ? 'light' : 'dark';
  }

  function describeToggle() {
    var isLight = activeTheme() === 'light';

    toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    toggle.querySelector('.theme-toggle-icon').textContent = isLight ? '☾' : '☀';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Storage can be unavailable; the choice still applies for this page view.
    }

    describeToggle();
  }

  // Sync the label before wiring listeners so a legacy matchMedia cannot
  // abort this script with a stale label still on the button.
  describeToggle();

  toggle.addEventListener('click', function () {
    applyTheme(activeTheme() === 'light' ? 'dark' : 'light');
  });

  // Without an explicit choice the page follows the system preference live.
  if (typeof systemPrefersLight.addEventListener === 'function') {
    systemPrefersLight.addEventListener('change', function () {
      if (!root.dataset.theme) {
        describeToggle();
      }
    });
  }
})();
