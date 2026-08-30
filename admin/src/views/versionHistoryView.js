import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { openVersionDiffModal } from '../components/diffViewer.js';

export function renderVersionHistoryView(container) {
  if (!container) return;

  const versions = cmsStore.data.versionHistory;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Version History & Rollback</h1>
        <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
          Audit past production deployments, compare visual diffs, and perform non-destructive rollbacks.
        </p>
      </div>
    </div>

    <div class="adm-card">
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${versions.map((ver, idx) => `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 1.5rem; ${idx !== versions.length - 1 ? 'border-bottom: 1px solid var(--admin-border-subtle);' : ''}">
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: ${idx === 0 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}; color: ${idx === 0 ? '#10b981' : 'var(--admin-text-muted)'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: var(--admin-font-mono); font-size: 0.82rem;">
                ${ver.versionNumber || `v2.${versions.length - idx}.0`}
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <strong style="font-size: 1rem;">${ver.title || 'Production Deployment'}</strong>
                  ${idx === 0 ? '<span class="badge-status badge-published">Active Production</span>' : ''}
                </div>
                <div style="font-size: 0.78rem; color: var(--admin-text-muted); margin-top: 2px;">
                  Published on ${new Date(ver.timestamp).toLocaleString()} by ${ver.author || 'Administrator'}
                </div>
                <p style="font-size: 0.85rem; color: var(--admin-text-secondary); margin-top: 0.5rem; line-height: 1.4;">
                  ${ver.notes || 'Routine production update and telemetry configuration.'}
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              ${idx > 0 ? `
                <button class="btn-adm btn-adm-secondary btn-adm-sm btn-diff-ver" data-ver-id="${ver.id}">
                  <span>Compare Diff</span>
                </button>
              ` : ''}
              <button class="btn-adm btn-adm-secondary btn-adm-sm btn-rollback-ver" data-ver-id="${ver.id}" ${idx === 0 ? 'disabled style="opacity:0.4;"' : ''}>
                <span>Restore Snapshot</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Compare Diff
  container.querySelectorAll('.btn-diff-ver').forEach((btn) => {
    btn.addEventListener('click', () => {
      const vId = btn.dataset.verId;
      const targetVer = versions.find((v) => v.id === vId);
      const latestVer = versions[0];
      openVersionDiffModal(latestVer, targetVer);
    });
  });

  // Non-destructive Rollback
  container.querySelectorAll('.btn-rollback-ver').forEach((btn) => {
    btn.addEventListener('click', () => {
      const vId = btn.dataset.verId;
      const targetVer = versions.find((v) => v.id === vId);

      modal.confirm({
        title: `Restore Snapshot ${targetVer?.versionNumber}?`,
        message: 'This will create a new production version based on this snapshot, preserving all version history.',
        confirmText: 'Confirm & Restore',
        onConfirm: () => {
          cmsStore.restoreVersion(vId);
          toast.success(`Successfully rolled back to snapshot ${targetVer?.versionNumber}!`);
          renderVersionHistoryView(container);
        }
      });
    });
  });
}
