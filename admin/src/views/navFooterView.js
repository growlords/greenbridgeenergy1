import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';

export function renderNavFooterView(container) {
  if (!container) return;

  const nav = cmsStore.data.navigation;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Navigation & Footer Architecture</h1>
        <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
          Configure sticky header navbar links, CTA trigger button, footer columns, and copyright notice.
        </p>
      </div>
      <button class="btn-adm btn-adm-primary" id="btn-save-nav-footer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Save Navigation Settings</span>
      </button>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      
      <!-- Header Navbar Links -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">Header Navigation Menu</h3>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;" id="nav-items-list">
          ${nav.header.map((item, idx) => `
            <div style="display: flex; gap: 0.5rem; align-items: center; background: var(--admin-bg-elevated); padding: 0.5rem 0.75rem; border-radius: 6px;">
              <span style="font-size: 0.75rem; color: var(--admin-text-muted); font-family: var(--admin-font-mono);">${idx + 1}</span>
              <input type="text" class="adm-input nav-label-in" data-idx="${idx}" value="${item.label}" style="flex: 1; padding: 0.35rem 0.65rem; font-size: 0.85rem;" />
              <input type="text" class="adm-input nav-link-in" data-idx="${idx}" value="${item.link}" style="flex: 1; padding: 0.35rem 0.65rem; font-size: 0.85rem;" />
            </div>
          `).join('')}
        </div>

        <div class="adm-form-group">
          <label class="adm-label">Header CTA Button Text</label>
          <input type="text" id="nav-cta-label" class="adm-input" value="${nav.ctaButton?.label || 'Get a Quote'}" />
        </div>
      </div>

      <!-- Footer & Copyright -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">Footer Copyright & Legal</h3>
        </div>

        <div class="adm-form-group">
          <label class="adm-label">Footer Copyright Notice</label>
          <textarea id="nav-copyright" class="adm-textarea">${nav.copyright}</textarea>
        </div>

        <div class="adm-form-group">
          <label class="adm-label">Newsletter Heading</label>
          <input type="text" class="adm-input" value="Clean Tech Digest" readonly />
        </div>
      </div>

    </div>
  `;

  document.getElementById('btn-save-nav-footer')?.addEventListener('click', () => {
    const updatedHeader = [];
    const labels = container.querySelectorAll('.nav-label-in');
    const links = container.querySelectorAll('.nav-link-in');

    labels.forEach((lblIn, idx) => {
      updatedHeader.push({
        id: `nav-${idx + 1}`,
        label: lblIn.value,
        link: links[idx]?.value || '#home',
        visible: true,
        external: false
      });
    });

    cmsStore.updateNavigation({
      header: updatedHeader,
      ctaButton: {
        label: document.getElementById('nav-cta-label')?.value || 'Get a Quote',
        link: '#contact',
        style: 'primary',
        visible: true
      },
      copyright: document.getElementById('nav-copyright')?.value || ''
    });

    toast.success('Navigation settings saved!');
  });
}
