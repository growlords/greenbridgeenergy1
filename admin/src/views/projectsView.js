import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function renderProjectsView(container) {
  if (!container) return;

  function render() {
    const projects = cmsStore.getProjects();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Projects Portfolio CMS</h1>
          <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
            Manage verified solar case studies, high-resolution installations, capacity statistics, and ROI metrics.
          </p>
        </div>
        <button class="btn-adm btn-adm-primary" id="btn-add-project">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Add New Project</span>
        </button>
      </div>

      <!-- Projects Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.75rem;">
        ${projects.map((proj) => `
          <div class="adm-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="position: relative; width: 100%; height: 180px; background: #000;">
              <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;" />
              <span class="badge-status badge-published" style="position: absolute; top: 10px; left: 10px;">
                ${proj.categoryLabel || proj.category}
              </span>
              <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.75); color: #fff; padding: 3px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">
                ⚡ ${proj.capacity}
              </span>
            </div>

            <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 0.75rem; color: var(--admin-text-muted); margin-bottom: 0.25rem;">📍 ${proj.location}</div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${proj.title}</h3>
                <p style="font-size: 0.85rem; color: var(--admin-text-secondary); line-height: 1.5; margin-bottom: 1rem;">
                  ${proj.description}
                </p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background: var(--admin-bg-elevated); padding: 0.75rem; border-radius: 8px; font-size: 0.75rem; margin-bottom: 1.25rem;">
                  <div>
                    <span style="color: var(--admin-text-muted); display: block;">Annual Generation</span>
                    <strong style="color: var(--admin-text-primary); font-size: 0.85rem;">${proj.annualGeneration}</strong>
                  </div>
                  <div>
                    <span style="color: var(--admin-text-muted); display: block;">Payback Timeline</span>
                    <strong style="color: var(--admin-accent-emerald); font-size: 0.85rem;">${proj.technicalSpecs?.roiPayback || '3.8 Yrs'}</strong>
                  </div>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.4rem; border-top: 1px solid var(--admin-border-subtle); padding-top: 1rem;">
                <button class="btn-adm btn-adm-secondary btn-adm-sm btn-edit-proj" data-proj-id="${proj.id}">Edit Specs</button>
                <button class="btn-adm btn-adm-danger btn-adm-sm btn-del-proj" data-proj-id="${proj.id}">Delete</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Edit Project Modal
    container.querySelectorAll('.btn-edit-proj').forEach((btn) => {
      btn.addEventListener('click', () => {
        const projId = btn.dataset.projId;
        const proj = cmsStore.getProjects().find((p) => p.id === projId);
        if (!proj) return;

        modal.open(`
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <h3 style="font-size: 1.35rem;">Edit Project: ${proj.title}</h3>

            <div class="adm-form-group">
              <label class="adm-label">Project Title</label>
              <input type="text" id="edit-proj-title" class="adm-input" value="${proj.title}" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="adm-form-group">
                <label class="adm-label">Capacity (e.g. 650 kWp)</label>
                <input type="text" id="edit-proj-cap" class="adm-input" value="${proj.capacity}" />
              </div>
              <div class="adm-form-group">
                <label class="adm-label">Location</label>
                <input type="text" id="edit-proj-loc" class="adm-input" value="${proj.location}" />
              </div>
            </div>

            <div class="adm-form-group">
              <label class="adm-label">Project Description</label>
              <textarea id="edit-proj-desc" class="adm-textarea">${proj.description || ''}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="adm-form-group">
                <label class="adm-label">Annual Generation (kWh/yr)</label>
                <input type="text" id="edit-proj-gen" class="adm-input" value="${proj.annualGeneration}" />
              </div>
              <div class="adm-form-group">
                <label class="adm-label">Estimated Payback Period</label>
                <input type="text" id="edit-proj-payback" class="adm-input" value="${proj.technicalSpecs?.roiPayback || '3.5 Years'}" />
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
              <button class="btn-adm btn-adm-secondary" onclick="document.getElementById('admin-dynamic-modal').classList.remove('active')">Cancel</button>
              <button class="btn-adm btn-adm-primary" id="btn-save-proj-changes">Save Changes</button>
            </div>
          </div>
        `, '600px');

        document.getElementById('btn-save-proj-changes')?.addEventListener('click', () => {
          const title = document.getElementById('edit-proj-title')?.value;
          const capacity = document.getElementById('edit-proj-cap')?.value;
          const location = document.getElementById('edit-proj-loc')?.value;
          const description = document.getElementById('edit-proj-desc')?.value;
          const gen = document.getElementById('edit-proj-gen')?.value;
          const payback = document.getElementById('edit-proj-payback')?.value;

          cmsStore.updateProject(projId, {
            title,
            capacity,
            location,
            description,
            annualGeneration: gen,
            technicalSpecs: {
              ...proj.technicalSpecs,
              roiPayback: payback
            }
          });

          modal.close();
          toast.success(`Updated project "${title}"`);
          render();
        });
      });
    });

    // Delete Project
    container.querySelectorAll('.btn-del-proj').forEach((btn) => {
      btn.addEventListener('click', () => {
        const projId = btn.dataset.projId;
        const proj = cmsStore.getProjects().find((p) => p.id === projId);
        if (!proj) return;

        modal.confirm({
          title: `Delete Project "${proj.title}"?`,
          message: 'Are you sure you want to remove this project case study?',
          confirmText: 'Delete',
          isDanger: true,
          onConfirm: () => {
            cmsStore.deleteProject(projId);
            toast.warning(`Deleted project "${proj.title}"`);
            render();
          }
        });
      });
    });

    // Add New Project Modal
    document.getElementById('btn-add-project')?.addEventListener('click', () => {
      modal.open(`
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <h3 style="font-size: 1.35rem;">Add New Solar Project</h3>

          <div class="adm-form-group">
            <label class="adm-label">Project Title *</label>
            <input type="text" id="new-proj-title" class="adm-input" placeholder="e.g. Pacific Coast Renewable Center" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="adm-form-group">
              <label class="adm-label">Category</label>
              <select id="new-proj-cat" class="adm-select">
                <option value="residential">Residential Solar</option>
                <option value="commercial">Commercial Solar</option>
                <option value="industrial">Industrial Solar</option>
                <option value="rooftop">Rooftop & Agri</option>
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-label">Capacity (kWp / MWp) *</label>
              <input type="text" id="new-proj-cap" class="adm-input" placeholder="e.g. 350 kWp" required />
            </div>
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Location</label>
            <input type="text" id="new-proj-loc" class="adm-input" placeholder="e.g. San Jose, California" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Description</label>
            <textarea id="new-proj-desc" class="adm-textarea" placeholder="Key architecture, module density, and battery specs..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
            <button class="btn-adm btn-adm-secondary" onclick="document.getElementById('admin-dynamic-modal').classList.remove('active')">Cancel</button>
            <button class="btn-adm btn-adm-primary" id="btn-submit-new-proj">Create Project</button>
          </div>
        </div>
      `, '580px');

      document.getElementById('btn-submit-new-proj')?.addEventListener('click', () => {
        const title = document.getElementById('new-proj-title')?.value;
        const cat = document.getElementById('new-proj-cat')?.value;
        const cap = document.getElementById('new-proj-cap')?.value;
        const loc = document.getElementById('new-proj-loc')?.value;
        const desc = document.getElementById('new-proj-desc')?.value;

        if (!title || !cap) {
          alert('Please specify a project title and capacity.');
          return;
        }

        cmsStore.createProject({
          title,
          category: cat,
          categoryLabel: cat.toUpperCase() + ' SOLAR',
          capacity: cap,
          location: loc || 'California, USA',
          description: desc,
          image: '/images/project-commercial.jpg'
        });

        modal.close();
        toast.success(`Created project "${title}"`);
        render();
      });
    });
  }

  render();
}
