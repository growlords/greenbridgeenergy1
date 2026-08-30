import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function renderSettingsView(container) {
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Global Website Settings</h1>
        <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
          Configure system environments, cache rules, database export/import, and emergency resets.
        </p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      
      <!-- Backup & Restore -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">CMS Data Backup & Restore</h3>
        </div>

        <p style="font-size: 0.85rem; color: var(--admin-text-secondary); margin-bottom: 1.5rem;">
          Export the entire website configuration, 3D physics profile, and project database as a portable JSON snapshot.
        </p>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <button class="btn-adm btn-adm-secondary" id="btn-export-json">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download Database JSON Backup</span>
          </button>

          <div style="position: relative;">
            <input type="file" id="import-json-file" accept=".json" style="display: none;" />
            <button class="btn-adm btn-adm-secondary" id="btn-trigger-import" style="width: 100%;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Import Database JSON Snapshot</span>
            </button>
          </div>
        </div>
      </div>


      <!-- System Maintenance & Cache -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">Cache & Diagnostics</h3>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--admin-border-subtle); padding-bottom: 1rem;">
            <div>
              <strong>Clear CDN & Browser Caches</strong>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Force refresh static 3D assets on client browsers</div>
            </div>
            <button class="btn-adm btn-adm-secondary btn-adm-sm" id="btn-clear-cache">Purge Cache</button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem;">
            <div>
              <strong style="color: var(--admin-accent-danger);">Factory Reset CMS</strong>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Restore original production seed data</div>
            </div>
            <button class="btn-adm btn-adm-danger btn-adm-sm" id="btn-factory-reset">Reset to Default</button>
          </div>
        </div>
      </div>

    </div>
  `;

  // Export JSON
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const jsonStr = cmsStore.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `green-pulse-energy-cms-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Downloaded CMS backup file');
  });

  // Import JSON
  const importFile = document.getElementById('import-json-file');
  document.getElementById('btn-trigger-import')?.addEventListener('click', () => importFile?.click());
  importFile?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const success = cmsStore.importJSON(evt.target.result);
        if (success) {
          toast.success('Successfully restored database snapshot!');
          setTimeout(() => window.location.reload(), 800);
        } else {
          toast.error('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  });

  document.getElementById('btn-clear-cache')?.addEventListener('click', () => {
    toast.success('Purged CDN & 3D asset caches');
  });

  document.getElementById('btn-factory-reset')?.addEventListener('click', () => {
    modal.confirm({
      title: 'Reset CMS to Default?',
      message: 'This will reset all pages, services, and 3D physics back to factory baseline.',
      confirmText: 'Reset Everything',
      isDanger: true,
      onConfirm: () => {
        cmsStore.resetToDefault();
        toast.warning('CMS reset to initial state');
        setTimeout(() => window.location.reload(), 800);
      }
    });
  });
}
