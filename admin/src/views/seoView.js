import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import { renderSeoScoreWidget } from '../components/seoValidator.js';

export function renderSeoView(container) {
  if (!container) return;

  const data = cmsStore.data;
  let selectedPageId = data.pages[0]?.id || 'page-home';

  function render() {
    const page = cmsStore.getPage(selectedPageId) || data.pages[0];
    const seo = page.seo || {};

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">SEO & Social Meta Suite</h1>
          <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
            Manage meta tags, OpenGraph sharing cards, Google search snippets, and keyword indexing.
          </p>
        </div>
        <button class="btn-adm btn-adm-primary" id="btn-save-seo-settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Save SEO Profile</span>
        </button>
      </div>

      <!-- Live SEO Quality Checklist & Score -->
      ${renderSeoScoreWidget(page)}

      <!-- Page Selector Bar -->
      <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 0.85rem; font-weight: 600;">Select Page:</span>
        <select id="seo-page-select" class="adm-select" style="max-width: 260px;">
          ${data.pages.map(p => `
            <option value="${p.id}" ${p.id === selectedPageId ? 'selected' : ''}>${p.name} (${p.slug})</option>
          `).join('')}
        </select>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem;">
        
        <!-- SEO Inputs -->
        <div class="adm-card">
          <div class="adm-card-header">
            <h3 class="adm-card-title">Metadata Settings</h3>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <div class="adm-form-group">
              <label class="adm-label">
                <span>SEO Page Title (60 chars recommended)</span>
                <span style="font-family: var(--admin-font-mono); font-size: 0.75rem;" id="char-title-count">${(seo.title || '').length} / 60</span>
              </label>
              <input type="text" id="seo-input-title" class="adm-input" value="${seo.title || ''}" />
            </div>

            <div class="adm-form-group">
              <label class="adm-label">
                <span>Meta Description (160 chars recommended)</span>
                <span style="font-family: var(--admin-font-mono); font-size: 0.75rem;" id="char-desc-count">${(seo.description || '').length} / 160</span>
              </label>
              <textarea id="seo-input-desc" class="adm-textarea" style="min-height: 90px;">${seo.description || ''}</textarea>
            </div>

            <div class="adm-form-group">
              <label class="adm-label">Target Search Keywords</label>
              <input type="text" id="seo-input-keywords" class="adm-input" value="${seo.keywords || ''}" />
            </div>

            <div class="adm-form-group">
              <label class="adm-label">Canonical URL</label>
              <input type="text" id="seo-input-canonical" class="adm-input" value="${seo.canonicalUrl || ''}" />
            </div>

          </div>
        </div>


        <!-- Live Search Snippet & Social Card Preview -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Google Search Snippet Preview -->
          <div class="adm-card">
            <div class="adm-card-header">
              <h3 class="adm-card-title">Google Search Snippet Preview</h3>
              <span class="badge-status badge-published">Rich Snippet</span>
            </div>

            <div style="background: #ffffff; padding: 1.25rem; border-radius: 8px; font-family: arial, sans-serif;">
              <div style="font-size: 0.8rem; color: #202124; margin-bottom: 2px;">https://greenbridgeenergy.com${page.slug}</div>
              <h4 style="font-size: 1.15rem; color: #1a0dab; margin-bottom: 4px; font-weight: normal;" id="google-snippet-title">
                ${seo.title || 'Green Bridge Energy'}
              </h4>
              <p style="font-size: 0.82rem; color: #4d5156; line-height: 1.4;" id="google-snippet-desc">
                ${seo.description || 'Solar energy systems and clean power.'}
              </p>
            </div>
          </div>

          <!-- Social Share Preview -->
          <div class="adm-card">
            <div class="adm-card-header">
              <h3 class="adm-card-title">OpenGraph Social Card Preview</h3>
            </div>

            <div style="border: 1px solid var(--admin-border-subtle); border-radius: 8px; overflow: hidden; background: #000;">
              <div style="height: 160px; overflow: hidden;">
                <img src="${seo.ogImage || '/images/project-residential.jpg'}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="padding: 1rem; background: var(--admin-bg-elevated);">
                <div style="font-size: 0.72rem; color: var(--admin-text-muted); text-transform: uppercase;">greenbridgeenergy.com</div>
                <strong style="font-size: 0.95rem; color: #ffffff; display: block; margin: 3px 0;" id="social-card-title">${seo.title || 'Green Bridge Energy'}</strong>
                <p style="font-size: 0.78rem; color: var(--admin-text-secondary);" id="social-card-desc">${seo.description || ''}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;

    attachListeners(page);
  }

  function attachListeners(page) {
    document.getElementById('seo-page-select')?.addEventListener('change', (e) => {
      selectedPageId = e.target.value;
      render();
    });

    const tIn = document.getElementById('seo-input-title');
    const dIn = document.getElementById('seo-input-desc');

    tIn?.addEventListener('input', (e) => {
      document.getElementById('char-title-count').textContent = `${e.target.value.length} / 60`;
      document.getElementById('google-snippet-title').textContent = e.target.value;
      document.getElementById('social-card-title').textContent = e.target.value;
    });

    dIn?.addEventListener('input', (e) => {
      document.getElementById('char-desc-count').textContent = `${e.target.value.length} / 160`;
      document.getElementById('google-snippet-desc').textContent = e.target.value;
      document.getElementById('social-card-desc').textContent = e.target.value;
    });

    document.getElementById('btn-save-seo-settings')?.addEventListener('click', () => {
      cmsStore.updatePage(selectedPageId, {
        seo: {
          title: tIn.value,
          description: dIn.value,
          keywords: document.getElementById('seo-input-keywords')?.value,
          canonicalUrl: document.getElementById('seo-input-canonical')?.value,
          ogImage: page.seo?.ogImage || '/images/project-residential.jpg'
        }
      });
      toast.success('Saved SEO profile for page!');
    });
  }

  render();
}
