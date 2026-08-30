import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function renderPagesView(container, onNavigate) {
  if (!container) return;

  const data = cmsStore.data;

  function render() {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Pages Management</h1>
          <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
            Create, configure, reorder, and edit all public-facing pages and routing.
          </p>
        </div>
        <button class="btn-adm btn-adm-primary" id="btn-create-page">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Create New Page</span>
        </button>
      </div>

      <!-- Pages Table -->
      <div class="adm-table-wrap">
        <table class="adm-table">
          <thead>
            <tr>
              <th style="width: 50px;">#</th>
              <th>Page Name</th>
              <th>URL Slug</th>
              <th>Sections</th>
              <th>Status</th>
              <th>In Nav</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.pages.map((p, idx) => `
              <tr>
                <td style="color: var(--admin-text-muted); font-family: var(--admin-font-mono);">${idx + 1}</td>
                <td>
                  <strong>${p.name}</strong>
                  <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${p.seo?.title || ''}</div>
                </td>
                <td>
                  <span style="font-family: var(--admin-font-mono); font-size: 0.8rem; background: var(--admin-bg-elevated); padding: 3px 8px; border-radius: 4px;">
                    ${p.slug}
                  </span>
                </td>
                <td>
                  <span class="sidebar-badge-count">${p.sections ? p.sections.length : 0} sections</span>
                </td>
                <td>
                  <span class="badge-status ${p.status === 'published' ? 'badge-published' : 'badge-draft'}">
                    ${p.status}
                  </span>
                </td>
                <td>
                  <span style="color: ${p.inNavigation ? 'var(--admin-accent-emerald)' : 'var(--admin-text-muted)'}; font-weight: 600; font-size: 0.8rem;">
                    ${p.inNavigation ? '✓ Yes' : '✕ Hidden'}
                  </span>
                </td>
                <td style="text-align: right;">
                  <div style="display: inline-flex; gap: 0.4rem;">
                    <button class="btn-adm btn-adm-primary btn-adm-sm btn-open-builder" data-page-id="${p.id}" title="Edit in Visual Page Builder">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      <span>Visual Builder</span>
                    </button>
                    <button class="btn-adm btn-adm-secondary btn-adm-sm btn-dup-page" data-page-id="${p.id}" title="Duplicate Page">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                    <button class="btn-adm btn-adm-danger btn-adm-sm btn-del-page" data-page-id="${p.id}" title="Delete Page" ${data.pages.length <= 1 ? 'disabled' : ''}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Open in Visual Builder
    container.querySelectorAll('.btn-open-builder').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pageId = btn.dataset.pageId;
        if (onNavigate) onNavigate('page-builder', pageId);
      });
    });

    // Duplicate Page
    container.querySelectorAll('.btn-dup-page').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pageId = btn.dataset.pageId;
        const copy = cmsStore.duplicatePage(pageId);
        if (copy) {
          toast.success(`Duplicated page as "${copy.name}"`);
          render();
        }
      });
    });

    // Delete Page
    container.querySelectorAll('.btn-del-page').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pageId = btn.dataset.pageId;
        const page = cmsStore.getPage(pageId);
        if (!page) return;

        modal.confirm({
          title: `Delete Page "${page.name}"?`,
          message: 'Are you sure you want to remove this page? This action can be undone via Version History.',
          confirmText: 'Delete Page',
          isDanger: true,
          onConfirm: () => {
            cmsStore.deletePage(pageId);
            toast.warning(`Deleted page "${page.name}"`);
            render();
          }
        });
      });
    });

    // Create New Page Modal
    document.getElementById('btn-create-page')?.addEventListener('click', () => {
      modal.open(`
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <h3 style="font-size: 1.35rem;">Create New Website Page</h3>
          
          <div class="adm-form-group">
            <label class="adm-label">Page Title *</label>
            <input type="text" id="new-page-name" class="adm-input" placeholder="e.g. Energy Storage & Microgrids" required />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">URL Slug *</label>
            <input type="text" id="new-page-slug" class="adm-input" placeholder="/energy-storage" required />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">SEO Meta Description</label>
            <textarea id="new-page-desc" class="adm-textarea" placeholder="Summary of this clean energy solution..."></textarea>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0;">
            <div>
              <strong>Include in Main Navigation</strong>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Add link automatically to header navbar</div>
            </div>
            <label class="adm-switch">
              <input type="checkbox" id="new-page-nav-toggle" checked />
              <span class="adm-slider-switch"></span>
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
            <button class="btn-adm btn-adm-secondary" onclick="document.getElementById('admin-dynamic-modal').classList.remove('active')">Cancel</button>
            <button class="btn-adm btn-adm-primary" id="btn-submit-new-page">Create Page</button>
          </div>
        </div>
      `, '520px');

      const nameIn = document.getElementById('new-page-name');
      const slugIn = document.getElementById('new-page-slug');
      nameIn?.addEventListener('input', () => {
        if (slugIn) slugIn.value = '/' + nameIn.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      });

      document.getElementById('btn-submit-new-page')?.addEventListener('click', () => {
        const name = nameIn?.value;
        const slug = slugIn?.value;
        const desc = document.getElementById('new-page-desc')?.value;
        const inNav = document.getElementById('new-page-nav-toggle')?.checked;

        if (!name || !slug) {
          alert('Please provide a page name and slug.');
          return;
        }

        const created = cmsStore.createPage({
          name,
          slug,
          seoDesc: desc,
          inNavigation: inNav
        });

        modal.close();
        toast.success(`Created page "${created.name}"`);
        render();
      });
    });
  }

  render();
}
