// Side-by-side Version Diff Comparator
import { modal } from './modal.js';

export function openVersionDiffModal(versionA, versionB) {
  if (!versionA || !versionB) return;

  const dataA = versionA.snapshotData || {};
  const dataB = versionB.snapshotData || {};

  modal.open(`
    <div style="display: flex; flex-direction: column; gap: 1.25rem; max-height: 80vh;">
      <div>
        <div class="sidebar-brand-badge" style="display: inline-block; margin-bottom: 0.5rem;">Audit & Diff Tool</div>
        <h3 style="font-size: 1.35rem;">Compare Version Deployments</h3>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-bottom: 1px solid var(--admin-border-subtle); padding-bottom: 0.75rem;">
        <div>
          <strong style="color: var(--admin-accent-emerald);">${versionA.versionNumber} (Selected Baseline)</strong>
          <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${new Date(versionA.timestamp).toLocaleString()}</div>
        </div>
        <div>
          <strong style="color: var(--admin-accent-gold);">${versionB.versionNumber} (Comparison Target)</strong>
          <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${new Date(versionB.timestamp).toLocaleString()}</div>
        </div>
      </div>

      <!-- Diff Content -->
      <div style="display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; padding-right: 0.5rem; max-height: 380px;">
        
        <!-- Hero Section Diff -->
        <div style="background: var(--admin-bg-elevated); padding: 1rem; border-radius: 8px;">
          <strong style="font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Homepage Hero Headline</strong>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.82rem;">
            <div style="padding: 0.5rem; background: rgba(16,185,129,0.08); border-left: 3px solid #10b981;">
              ${dataA.pages?.[0]?.sections?.[0]?.title || 'Powering a Greener Tomorrow.'}
            </div>
            <div style="padding: 0.5rem; background: rgba(245,158,11,0.08); border-left: 3px solid #f59e0b;">
              ${dataB.pages?.[0]?.sections?.[0]?.title || 'Powering a Greener Tomorrow.'}
            </div>
          </div>
        </div>

        <!-- 3D Physics Diff -->
        <div style="background: var(--admin-bg-elevated); padding: 1rem; border-radius: 8px;">
          <strong style="font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">3D Anti-Gravity Physics Profile</strong>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.82rem;">
            <div>
              Preset: <strong>${dataA.animations?.preset || 'balanced'}</strong><br/>
              Particles: <strong>${dataA.animations?.particleDensity || 1800} pts</strong>
            </div>
            <div>
              Preset: <strong>${dataB.animations?.preset || 'balanced'}</strong><br/>
              Particles: <strong>${dataB.animations?.particleDensity || 1800} pts</strong>
            </div>
          </div>
        </div>

        <!-- Services Count Diff -->
        <div style="background: var(--admin-bg-elevated); padding: 1rem; border-radius: 8px;">
          <strong style="font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Services & Offerings</strong>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.82rem;">
            <div>Total Services: <strong>${dataA.services?.length || 6}</strong></div>
            <div>Total Services: <strong>${dataB.services?.length || 6}</strong></div>
          </div>
        </div>

      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
        <button class="btn-adm btn-adm-secondary" onclick="document.getElementById('admin-dynamic-modal').classList.remove('active')">Close Comparison</button>
      </div>
    </div>
  `, '720px');
}
