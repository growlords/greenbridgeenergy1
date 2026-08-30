import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function renderServicesView(container) {
  if (!container) return;

  function render() {
    const services = cmsStore.getServices();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Solar Services CMS</h1>
          <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
            Manage turnkey solar offerings, rooftop systems, commercial EPC solutions, and warranties.
          </p>
        </div>
        <button class="btn-adm btn-adm-primary" id="btn-add-service">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Add New Service</span>
        </button>
      </div>

      <!-- Services Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem;">
        ${services.map((srv) => `
          <div class="adm-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <span class="badge-status badge-published">${srv.badge || 'Service'}</span>
                <div style="display: flex; gap: 0.35rem;">
                  <button class="btn-adm btn-adm-secondary btn-adm-sm btn-edit-srv" data-srv-id="${srv.id}">Edit</button>
                  <button class="btn-adm btn-adm-danger btn-adm-sm btn-del-srv" data-srv-id="${srv.id}">✕</button>
                </div>
              </div>

              <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">${srv.title}</h3>
              <div style="font-size: 0.8rem; color: var(--admin-accent-emerald); font-weight: 600; margin-bottom: 0.75rem;">${srv.tagline || ''}</div>
              <p style="font-size: 0.85rem; color: var(--admin-text-secondary); line-height: 1.5; margin-bottom: 1rem;">
                ${srv.description}
              </p>

              <ul style="list-style: none; font-size: 0.8rem; color: var(--admin-text-secondary); display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.25rem;">
                ${(srv.features || []).map(f => `<li><span style="color: var(--admin-accent-emerald);">✓</span> ${f}</li>`).join('')}
              </ul>
            </div>

            <div style="border-top: 1px solid var(--admin-border-subtle); padding-top: 0.85rem; display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--admin-text-muted);">
              <span>${srv.warranty || '25-Yr Warranty'}</span>
              <span style="color: var(--admin-accent-emerald); font-weight: 600;">${srv.efficiency || 'High Yield'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Edit Service Modal
    container.querySelectorAll('.btn-edit-srv').forEach((btn) => {
      btn.addEventListener('click', () => {
        const srvId = btn.dataset.srvId;
        const srv = cmsStore.getServices().find((s) => s.id === srvId);
        if (!srv) return;

        modal.open(`
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <h3 style="font-size: 1.35rem;">Edit Service: ${srv.title}</h3>

            <div class="adm-form-group">
              <label class="adm-label">Service Title</label>
              <input type="text" id="edit-srv-title" class="adm-input" value="${srv.title}" />
            </div>

            <div class="adm-form-group">
              <label class="adm-label">Tagline</label>
              <input type="text" id="edit-srv-tagline" class="adm-input" value="${srv.tagline || ''}" />
            </div>

            <div class="adm-form-group">
              <label class="adm-label">Badge Pill Text</label>
              <input type="text" id="edit-srv-badge" class="adm-input" value="${srv.badge || ''}" />
            </div>

            <div class="adm-form-group">
              <label class="adm-label">Description</label>
              <textarea id="edit-srv-desc" class="adm-textarea">${srv.description || ''}</textarea>
            </div>

            <div class="adm-form-group">
              <label class="adm-label">Warranty Assurance</label>
              <input type="text" id="edit-srv-warranty" class="adm-input" value="${srv.warranty || ''}" />
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
              <button class="btn-adm btn-adm-secondary" onclick="document.getElementById('admin-dynamic-modal').classList.remove('active')">Cancel</button>
              <button class="btn-adm btn-adm-primary" id="btn-save-srv-changes">Save Service</button>
            </div>
          </div>
        `, '560px');

        document.getElementById('btn-save-srv-changes')?.addEventListener('click', () => {
          const title = document.getElementById('edit-srv-title')?.value;
          const tagline = document.getElementById('edit-srv-tagline')?.value;
          const badge = document.getElementById('edit-srv-badge')?.value;
          const desc = document.getElementById('edit-srv-desc')?.value;
          const warranty = document.getElementById('edit-srv-warranty')?.value;

          cmsStore.updateService(srvId, {
            title,
            tagline,
            badge,
            description: desc,
            warranty
          });

          modal.close();
          toast.success(`Updated service "${title}"`);
          render();
        });
      });
    });

    // Delete Service
    container.querySelectorAll('.btn-del-srv').forEach((btn) => {
      btn.addEventListener('click', () => {
        const srvId = btn.dataset.srvId;
        const srv = cmsStore.getServices().find((s) => s.id === srvId);
        if (!srv) return;

        modal.confirm({
          title: `Delete Service "${srv.title}"?`,
          message: 'Are you sure you want to remove this solar service offering?',
          confirmText: 'Delete',
          isDanger: true,
          onConfirm: () => {
            cmsStore.deleteService(srvId);
            toast.warning(`Deleted service "${srv.title}"`);
            render();
          }
        });
      });
    });

    // Add New Service Modal
    document.getElementById('btn-add-service')?.addEventListener('click', () => {
      modal.open(`
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <h3 style="font-size: 1.35rem;">Add New Solar Service</h3>

          <div class="adm-form-group">
            <label class="adm-label">Service Title *</label>
            <input type="text" id="new-srv-title" class="adm-input" placeholder="e.g. Floating Solar & Reservoir Arrays" required />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Tagline</label>
            <input type="text" id="new-srv-tagline" class="adm-input" placeholder="Water Surface Clean Energy Generation" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Description</label>
            <textarea id="new-srv-desc" class="adm-textarea" placeholder="Comprehensive engineering details..."></textarea>
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Warranty</label>
            <input type="text" id="new-srv-warranty" class="adm-input" value="25-Year Linear Warranty" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
            <button class="btn-adm btn-adm-secondary" onclick="document.getElementById('admin-dynamic-modal').classList.remove('active')">Cancel</button>
            <button class="btn-adm btn-adm-primary" id="btn-submit-new-srv">Create Service</button>
          </div>
        </div>
      `, '540px');

      document.getElementById('btn-submit-new-srv')?.addEventListener('click', () => {
        const title = document.getElementById('new-srv-title')?.value;
        const tagline = document.getElementById('new-srv-tagline')?.value;
        const desc = document.getElementById('new-srv-desc')?.value;
        const warranty = document.getElementById('new-srv-warranty')?.value;

        if (!title) {
          alert('Please specify a service title.');
          return;
        }

        cmsStore.createService({
          title,
          tagline,
          description: desc,
          warranty
        });

        modal.close();
        toast.success(`Created service "${title}"`);
        render();
      });
    });
  }

  render();
}
