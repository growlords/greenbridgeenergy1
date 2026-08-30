// Theme Switcher Manager for Admin Panel (Light / Dark / System)
const THEME_KEY = 'gpe_admin_theme_mode';

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
    this.applyTheme(this.currentTheme);
    this.listenSystemTheme();
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);

    let effectiveTheme = theme;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }

  listenSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme === 'system') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }

  renderSwitcher(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="theme-switcher-control" style="display: inline-flex; align-items: center; background: var(--admin-bg-elevated); border: 1px solid var(--admin-border-subtle); border-radius: var(--admin-radius-md); padding: 2px;">
        <button class="theme-btn ${this.currentTheme === 'light' ? 'active' : ''}" data-theme="light" title="Light Mode" style="background: transparent; border: none; color: var(--admin-text-secondary); padding: 4px 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.75rem;">
          <span>☀️</span>
        </button>
        <button class="theme-btn ${this.currentTheme === 'dark' ? 'active' : ''}" data-theme="dark" title="Dark Mode" style="background: transparent; border: none; color: var(--admin-text-secondary); padding: 4px 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.75rem;">
          <span>🌙</span>
        </button>
        <button class="theme-btn ${this.currentTheme === 'system' ? 'active' : ''}" data-theme="system" title="System Preference" style="background: transparent; border: none; color: var(--admin-text-secondary); padding: 4px 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.75rem;">
          <span>🖥</span>
        </button>
      </div>
    `;

    container.querySelectorAll('.theme-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        this.applyTheme(theme);
        this.renderSwitcher(container);
      });
    });
  }
}

export const themeManager = new ThemeManager();
