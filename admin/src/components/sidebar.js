import { cmsStore } from '../store/cmsStore.js';
import { authManager } from '../auth/authManager.js';

export function renderSidebar(container, activeView, onNavigate) {
  if (!container) return;

  const data = cmsStore.data;
  const user = authManager.currentUser || { name: 'Admin', email: 'admin@greenpulse.energy' };

  container.innerHTML = `
    <!-- Header -->
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <svg class="sidebar-brand-icon" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="42" stroke="#10b981" stroke-width="3" stroke-dasharray="8 6"/>
          <path d="M50 16 L78 32 L78 68 L50 84 L22 68 L22 32 Z" fill="#061a11" stroke="#10b981" stroke-width="3"/>
          <circle cx="50" cy="50" r="10" fill="#f59e0b"/>
        </svg>
        <span>GREEN PULSE</span>
        <span class="sidebar-brand-badge">CMS</span>
      </div>
    </div>

    <!-- Primary Visual Theme Editor Action -->
    <div style="padding: 0 1.25rem 1rem 1.25rem;">
      <button class="btn-adm btn-adm-primary" id="btn-sidebar-edit-website" style="width: 100%; justify-content: center; padding: 0.75rem; font-weight: 700; box-shadow: var(--admin-shadow-sm);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        <span>Edit Website</span>
      </button>
    </div>

    <!-- Navigation Items -->
    <div class="sidebar-nav-wrap">
      
      <!-- Group 1: Main -->
      <div>
        <div class="sidebar-group-title">Overview</div>
        <ul class="sidebar-nav-list">
          <li class="sidebar-nav-item ${activeView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Dashboard</span>
            </div>
          </li>
          <li class="sidebar-nav-item ${activeView === 'visual-editor' ? 'active' : ''}" data-view="visual-editor">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
              <span>Visual Theme Editor</span>
            </div>
            <span class="sidebar-brand-badge" style="background: rgba(245,158,11,0.15); color: #f59e0b;">PRO</span>
          </li>
          <li class="sidebar-nav-item ${activeView === 'pages' ? 'active' : ''}" data-view="pages">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Pages</span>
            </div>
            <span class="sidebar-badge-count">${data.pages.length}</span>
          </li>
        </ul>
      </div>

      <!-- Group 2: Content CMS -->
      <div>
        <div class="sidebar-group-title">Content CMS</div>
        <ul class="sidebar-nav-list">
          <li class="sidebar-nav-item ${activeView === 'services' ? 'active' : ''}" data-view="services">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
              <span>Services</span>
            </div>
            <span class="sidebar-badge-count">${data.services.length}</span>
          </li>
          <li class="sidebar-nav-item ${activeView === 'projects' ? 'active' : ''}" data-view="projects">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <span>Our Projects</span>
            </div>
            <span class="sidebar-badge-count">${data.projects.length}</span>
          </li>
          <li class="sidebar-nav-item ${activeView === 'media' ? 'active' : ''}" data-view="media">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>Media Library</span>
            </div>
            <span class="sidebar-badge-count">${data.media.length}</span>
          </li>
        </ul>
      </div>

      <!-- Group 3: Visual & 3D Experience -->
      <div>
        <div class="sidebar-group-title">Experience & 3D</div>
        <ul class="sidebar-nav-list">
          <li class="sidebar-nav-item ${activeView === 'animation-studio' ? 'active' : ''}" data-view="animation-studio">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Animation Studio</span>
            </div>
          </li>
          <li class="sidebar-nav-item ${activeView === 'hero-editor' ? 'active' : ''}" data-view="hero-editor">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              <span>Hero Editor</span>
            </div>
          </li>
          <li class="sidebar-nav-item ${activeView === 'brand' ? 'active' : ''}" data-view="brand">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
              <span>Brand & Theme</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Group 4: Settings & Architecture -->
      <div>
        <div class="sidebar-group-title">Architecture & SEO</div>
        <ul class="sidebar-nav-list">
          <li class="sidebar-nav-item ${activeView === 'navigation' ? 'active' : ''}" data-view="navigation">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              <span>Nav & Footer</span>
            </div>
          </li>
          <li class="sidebar-nav-item ${activeView === 'company' ? 'active' : ''}" data-view="company">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Company Info</span>
            </div>
          </li>
          <li class="sidebar-nav-item ${activeView === 'seo' ? 'active' : ''}" data-view="seo">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>SEO Manager</span>
            </div>
          </li>
          <li class="sidebar-nav-item ${activeView === 'settings' ? 'active' : ''}" data-view="settings">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>Settings</span>
            </div>
          </li>
          <li class="sidebar-nav-item ${activeView === 'versions' ? 'active' : ''}" data-view="versions">
            <div class="sidebar-item-left">
              <svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
              <span>Version History</span>
            </div>
            <span class="sidebar-badge-count">${data.versionHistory.length}</span>
          </li>
        </ul>
      </div>

    </div>

    <!-- User Profile & Logout -->
    <div class="sidebar-footer">
      <div class="user-profile-widget" id="btn-user-profile">
        <img src="${user.avatar || '/images/team-ceo.jpg'}" alt="Avatar" class="user-avatar" />
        <div class="user-info">
          <span class="user-name">${user.name}</span>
          <span class="user-role">${user.role}</span>
        </div>
      </div>
      <button class="btn-adm-ghost btn-adm-sm" id="btn-admin-logout" title="Sign Out" style="padding: 6px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>
  `;

  document.getElementById('btn-sidebar-edit-website')?.addEventListener('click', () => {
    if (onNavigate) onNavigate('visual-editor');
  });

  // Attach navigation listeners
  container.querySelectorAll('.sidebar-nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (onNavigate) onNavigate(view);
    });
  });

  document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
    authManager.logout();
  });
}
