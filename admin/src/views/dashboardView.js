import { cmsStore } from '../store/cmsStore.js';

export function renderDashboardView(container, onNavigate) {
  if (!container) return;

  const data = cmsStore.data;
  const publishedPages = data.pages.filter((p) => p.status === 'published').length;
  const draftPages = data.pages.filter((p) => p.status === 'draft').length;

  container.innerHTML = `
    <!-- Top Greeting & Overview -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Command Center Overview</h1>
        <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
          Manage website content, 3D anti-gravity physics, projects portfolio, and SEO parameters.
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn-adm btn-adm-secondary btn-adm-sm" id="btn-quick-new-page">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>New Page</span>
        </button>
        <button class="btn-adm btn-adm-primary btn-adm-sm" id="btn-quick-edit-home">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span>Edit Website (Theme Editor)</span>
        </button>
      </div>
    </div>

    <!-- Stats Metric Cards -->
    <div class="stats-quad-grid">
      <div class="stat-metric-card">
        <span class="stat-label-text">Total Pages</span>
        <div class="stat-value-text">${data.pages.length}</div>
        <span style="font-size: 0.75rem; color: var(--admin-accent-emerald);">● ${publishedPages} Published, ${draftPages} Draft</span>
      </div>

      <div class="stat-metric-card">
        <span class="stat-label-text">Active Services</span>
        <div class="stat-value-text">${data.services.length}</div>
        <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">Turnkey EPC & Maintenance</span>
      </div>

      <div class="stat-metric-card">
        <span class="stat-label-text">Featured Projects</span>
        <div class="stat-value-text">${data.projects.length}</div>
        <span style="font-size: 0.75rem; color: var(--admin-accent-gold);">Total 5.4+ MWp Capacity</span>
      </div>

      <div class="stat-metric-card">
        <span class="stat-label-text">Media Assets</span>
        <div class="stat-value-text">${data.media.length}</div>
        <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">High-Res 8K Renders & Photos</span>
      </div>
    </div>

    <!-- Quick Action Launchpads -->
    <div class="adm-card" style="margin-bottom: 2rem;">
      <div class="adm-card-header">
        <h3 class="adm-card-title">Quick Action Hub</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        
        <button class="btn-adm btn-adm-secondary quick-hub-btn" data-view="page-builder" style="padding: 1.25rem; flex-direction: column; gap: 0.6rem; align-items: flex-start; text-align: left;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(16,185,129,0.15); color: #10b981; display:flex; align-items:center; justify-content:center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          </div>
          <strong style="font-size: 0.95rem;">Visual Page Builder</strong>
          <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">Drag & drop section visualizer</span>
        </button>

        <button class="btn-adm btn-adm-secondary quick-hub-btn" data-view="animation-studio" style="padding: 1.25rem; flex-direction: column; gap: 0.6rem; align-items: flex-start; text-align: left;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(245,158,11,0.15); color: #f59e0b; display:flex; align-items:center; justify-content:center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <strong style="font-size: 0.95rem;">3D Animation Studio</strong>
          <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">Tune particles & anti-gravity</span>
        </button>

        <button class="btn-adm btn-adm-secondary quick-hub-btn" data-view="projects" style="padding: 1.25rem; flex-direction: column; gap: 0.6rem; align-items: flex-start; text-align: left;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(6,182,212,0.15); color: #06b6d4; display:flex; align-items:center; justify-content:center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <strong style="font-size: 0.95rem;">Add / Edit Projects</strong>
          <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">Manage portfolio installations</span>
        </button>

        <button class="btn-adm btn-adm-secondary quick-hub-btn" data-view="media" style="padding: 1.25rem; flex-direction: column; gap: 0.6rem; align-items: flex-start; text-align: left;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(168,85,247,0.15); color: #a855f7; display:flex; align-items:center; justify-content:center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <strong style="font-size: 0.95rem;">Media Library</strong>
          <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">Upload photos & SVGs</span>
        </button>

      </div>
    </div>

    <!-- Dual Split: Recent Activity & System Health -->
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem;">
      
      <!-- Activity Feed -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">Recent CMS Activity</h3>
          <span style="font-size: 0.75rem; color: var(--admin-text-muted);">Real-time Telemetry</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.85rem;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--admin-accent-emerald); margin-top: 6px;"></div>
            <div>
              <strong>Production Release Deployed</strong>
              <div style="color: var(--admin-text-muted); font-size: 0.75rem;">${new Date(data.meta.lastPublished).toLocaleString()} by Dr. Elena Vance</div>
            </div>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.85rem;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--admin-accent-gold); margin-top: 6px;"></div>
            <div>
              <strong>Calibrated 3D Floating Particle Dynamics</strong>
              <div style="color: var(--admin-text-muted); font-size: 0.75rem;">Inertial damping optimized to 1800 particles</div>
            </div>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.85rem;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--admin-accent-cyan); margin-top: 6px;"></div>
            <div>
              <strong>Added Apex Logistics 2.1 MWp Case Study</strong>
              <div style="color: var(--admin-text-muted); font-size: 0.75rem;">Hardware specs & annual kWh metrics updated</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Website Status & Environment -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">Deployment Status</h3>
          <span class="badge-status badge-published">Online 99.98%</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--admin-border-subtle); padding-bottom: 0.5rem;">
            <span style="color: var(--admin-text-muted);">Public Web Server</span>
            <span style="font-family: var(--admin-font-mono); color: var(--admin-accent-emerald);">http://localhost:5174/</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--admin-border-subtle); padding-bottom: 0.5rem;">
            <span style="color: var(--admin-text-muted);">Admin CMS Server</span>
            <span style="font-family: var(--admin-font-mono); color: var(--admin-accent-emerald);">http://localhost:5180/</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--admin-border-subtle); padding-bottom: 0.5rem;">
            <span style="color: var(--admin-text-muted);">Core CMS Engine</span>
            <span style="font-family: var(--admin-font-mono);">${data.meta.version}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--admin-text-muted);">Last Saved</span>
            <span style="font-size: 0.78rem;">${new Date(data.meta.lastSaved).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach quick action listeners
  container.querySelectorAll('.quick-hub-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (onNavigate) onNavigate(view);
    });
  });

  document.getElementById('btn-quick-edit-home')?.addEventListener('click', () => {
    if (onNavigate) onNavigate('visual-editor', 'page-home');
  });

  document.getElementById('btn-quick-new-page')?.addEventListener('click', () => {
    if (onNavigate) onNavigate('pages');
  });
}
