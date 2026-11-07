import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';

export function renderBrandView(container) {
  if (!container) return;

  const branding = cmsStore.data.branding;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Brand & Color Tokens</h1>
        <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
          Configure company logos, SVG vector marks, favicons, and global theme color palettes.
        </p>
      </div>
      <button class="btn-adm btn-adm-primary" id="btn-save-brand-settings">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Save Brand Tokens</span>
      </button>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      
      <!-- Brand Logos Card -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">Logos & Favicons</h3>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          
          <div class="adm-form-group">
            <label class="adm-label">Company Brand Name</label>
            <input type="text" id="brand-company-name" class="adm-input" value="${branding.companyName}" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Brand Tagline</label>
            <input type="text" id="brand-tagline" class="adm-input" value="${branding.tagline}" />
          </div>

          <div style="display: flex; align-items: center; gap: 1.25rem; background: var(--admin-bg-elevated); padding: 1rem; border-radius: 8px;">
            <div style="width: 50px; height: 50px; background: #061a11; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <img src="${branding.logoMain}" alt="Logo" style="width: 34px; height: 34px;" />
            </div>
            <div style="flex: 1;">
              <strong style="font-size: 0.85rem; display: block;">Primary SVG Logo Mark</strong>
              <span style="font-size: 0.75rem; color: var(--admin-text-muted); font-family: var(--admin-font-mono);">${branding.logoMain}</span>
            </div>
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Favicon Path</label>
            <input type="text" id="brand-favicon" class="adm-input" value="${branding.favicon}" />
          </div>

        </div>
      </div>


      <!-- Color Tokens Card -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">Color Palette Tokens</h3>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>Deep Emerald Slate (Dark Theme)</strong>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Primary dark container color</div>
            </div>
            <input type="color" id="col-primary-dark" value="${branding.colors.primaryDark}" style="width: 42px; height: 32px; border: none; cursor: pointer; border-radius: 4px;" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>Vibrant Emerald Accent</strong>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Primary button & glow accent</div>
            </div>
            <input type="color" id="col-accent-emerald" value="${branding.colors.accentEmerald}" style="width: 42px; height: 32px; border: none; cursor: pointer; border-radius: 4px;" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>Solar Ray Gold (Accent)</strong>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Sun corona & secondary button</div>
            </div>
            <input type="color" id="col-accent-gold" value="${branding.colors.accentGold}" style="width: 42px; height: 32px; border: none; cursor: pointer; border-radius: 4px;" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>Ultra-Clean Light Neutral</strong>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Public site backdrop</div>
            </div>
            <input type="color" id="col-bg-light" value="${branding.colors.bgLight}" style="width: 42px; height: 32px; border: none; cursor: pointer; border-radius: 4px;" />
          </div>

        </div>
      </div>

    </div>
  `;

  document.getElementById('btn-save-brand-settings')?.addEventListener('click', () => {
    cmsStore.updateBranding({
      companyName: document.getElementById('brand-company-name')?.value,
      tagline: document.getElementById('brand-tagline')?.value,
      favicon: document.getElementById('brand-favicon')?.value,
      colors: {
        primaryDark: document.getElementById('col-primary-dark')?.value,
        accentEmerald: document.getElementById('col-accent-emerald')?.value,
        accentGold: document.getElementById('col-accent-gold')?.value,
        bgLight: document.getElementById('col-bg-light')?.value,
        bgSurface: '#ffffff'
      }
    });
    toast.success('Brand tokens updated!');
  });
}
