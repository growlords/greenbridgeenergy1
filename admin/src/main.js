import { cmsStore } from './store/cmsStore.js';
import { authManager } from './auth/authManager.js';
import { renderSidebar } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { initCommandPalette } from './components/commandPalette.js';
import { toast } from './components/toast.js';

// Views
import { renderDashboardView } from './views/dashboardView.js';
import { renderPagesView } from './views/pagesView.js';
import { renderPageBuilderView } from './views/pageBuilderView.js';
import { renderVisualThemeEditor } from './views/visualThemeEditor.js';
import { renderServicesView } from './views/servicesView.js';
import { renderProjectsView } from './views/projectsView.js';
import { renderMediaView } from './views/mediaView.js';
import { renderAnimationStudioView } from './views/animationStudioView.js';
import { renderHeroEditorView } from './views/heroEditorView.js';
import { renderBrandView } from './views/brandView.js';
import { renderNavFooterView } from './views/navFooterView.js';
import { renderCompanyView } from './views/companyView.js';
import { renderSeoView } from './views/seoView.js';
import { renderSettingsView } from './views/settingsView.js';
import { renderVersionHistoryView } from './views/versionHistoryView.js';

class AdminApp {
  constructor() {
    this.activeView = 'dashboard';
    this.selectedPageId = null;
    this.cmdPalette = null;
    this.init();
  }

  init() {
    // Check Auth
    authManager.subscribe((isAuth) => {
      if (!isAuth) {
        this.renderLogin();
      } else {
        this.renderApp();
      }
    });

    if (!authManager.isAuthenticated) {
      this.renderLogin();
    } else {
      this.renderApp();
    }

    // Subscribe to store updates to keep Topbar status updated
    cmsStore.subscribe(() => {
      if (authManager.isAuthenticated) {
        const topbarContainer = document.getElementById('admin-topbar-container');
        if (topbarContainer) {
          renderTopbar(topbarContainer, this.activeView, () => this.cmdPalette?.open());
        }
      }
    });
  }

  navigate(viewName, param = null) {
    this.activeView = viewName;
    if (param) this.selectedPageId = param;
    this.renderApp();
  }

  renderLogin() {
    const appEl = document.getElementById('admin-app');
    if (!appEl) return;

    appEl.innerHTML = `
      <div class="auth-overlay-view">
        <div class="auth-card">
          <div class="auth-header">
            <svg class="auth-logo" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="42" stroke="#10b981" stroke-width="3" stroke-dasharray="8 6"/>
              <path d="M50 16 L78 32 L78 68 L50 84 L22 68 L22 32 Z" fill="#061a11" stroke="#10b981" stroke-width="3"/>
              <circle cx="50" cy="50" r="10" fill="#f59e0b"/>
            </svg>
            <h2 class="auth-title">Green Bridge Admin</h2>
            <p class="auth-subtitle">Clean Energy Content Management System</p>
          </div>

          <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="adm-form-group" style="margin-bottom: 0;">
              <label class="adm-label">Email Address</label>
              <input type="email" id="login-email" class="adm-input" value="admin@greenbridge.energy" required />
            </div>

            <div class="adm-form-group" style="margin-bottom: 0;">
              <label class="adm-label">Password</label>
              <input type="password" id="login-password" class="adm-input" value="GreenBridge2026!" required />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--admin-text-secondary);">
              <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                <input type="checkbox" id="login-remember" checked />
                <span>Remember me</span>
              </label>
              <span style="color: var(--admin-accent-emerald); cursor: pointer;">Forgot Password?</span>
            </div>

            <button type="submit" class="btn-adm btn-adm-primary" style="padding: 0.75rem; font-size: 0.95rem; margin-top: 0.5rem;">
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          <div class="auth-demo-badge">
            <strong>Demo Credentials:</strong><br/>
            Email: <code>admin@greenbridge.energy</code><br/>
            Password: <code>GreenBridge2026!</code>
          </div>
        </div>
      </div>
    `;

    document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const remember = document.getElementById('login-remember').checked;

      const res = authManager.login(email, pass, remember);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        this.renderApp();
      } else {
        toast.error(res.message);
      }
    });
  }

  renderApp() {
    const appEl = document.getElementById('admin-app');
    if (!appEl) return;

    appEl.innerHTML = `
      <!-- Sidebar -->
      <aside class="admin-sidebar" id="admin-sidebar-container"></aside>

      <!-- Main Layout -->
      <main class="admin-main">
        <header class="admin-topbar" id="admin-topbar-container"></header>
        <div class="admin-view-container" id="admin-view-container"></div>
      </main>
    `;

    // If visual-editor, render directly into appEl (full screen)
    if (this.activeView === 'visual-editor') {
      renderVisualThemeEditor(appEl, () => this.navigate('dashboard'), this.selectedPageId);
      return;
    }

    // Render Sidebar & Topbar
    const sidebarEl = document.getElementById('admin-sidebar-container');
    const topbarEl = document.getElementById('admin-topbar-container');
    const viewContainer = document.getElementById('admin-view-container');

    renderSidebar(sidebarEl, this.activeView, (view) => this.navigate(view));
    renderTopbar(topbarEl, this.activeView, () => this.cmdPalette?.open());

    // Initialize ⌘K Command Palette
    this.cmdPalette = initCommandPalette((view, param) => this.navigate(view, param));

    // Render Active View
    switch (this.activeView) {
      case 'dashboard':
        renderDashboardView(viewContainer, (view, param) => this.navigate(view, param));
        break;
      case 'pages':
        renderPagesView(viewContainer, (view, param) => this.navigate(view, param));
        break;
      case 'page-builder':
        renderPageBuilderView(viewContainer, this.selectedPageId);
        break;
      case 'visual-editor':
        renderVisualThemeEditor(viewContainer, () => this.navigate('dashboard'), this.selectedPageId);
        break;
      case 'services':
        renderServicesView(viewContainer);
        break;
      case 'projects':
        renderProjectsView(viewContainer);
        break;
      case 'media':
        renderMediaView(viewContainer);
        break;
      case 'animation-studio':
        renderAnimationStudioView(viewContainer);
        break;
      case 'hero-editor':
        renderHeroEditorView(viewContainer);
        break;
      case 'brand':
        renderBrandView(viewContainer);
        break;
      case 'navigation':
        renderNavFooterView(viewContainer);
        break;
      case 'company':
        renderCompanyView(viewContainer);
        break;
      case 'seo':
        renderSeoView(viewContainer);
        break;
      case 'settings':
        renderSettingsView(viewContainer);
        break;
      case 'versions':
        renderVersionHistoryView(viewContainer);
        break;
      default:
        renderDashboardView(viewContainer, (view, param) => this.navigate(view, param));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminApp();
});
