import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';

export function renderHeroEditorView(container) {
  if (!container) return;

  const homePage = cmsStore.getPage('page-home') || cmsStore.data.pages[0];
  const heroSec = homePage.sections?.find((s) => s.type === 'hero') || homePage.sections[0];

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Dedicated Hero Section Editor</h1>
        <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
          Customize the high-impact public homepage hero, 3D photovoltaic array, headline copy, and CTAs.
        </p>
      </div>
      <button class="btn-adm btn-adm-primary" id="btn-save-hero-editor">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Save Hero Settings</span>
      </button>
    </div>

    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem;">
      
      <!-- Form Controls -->
      <div class="adm-card" style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <div class="adm-form-group">
          <label class="adm-label">Badge Pill Text</label>
          <input type="text" id="hero-edit-badge" class="adm-input" value="${heroSec.badge || 'Next-Generation Photovoltaics'}" />
        </div>

        <div class="adm-form-group">
          <label class="adm-label">Main Hero Headline (H1) *</label>
          <input type="text" id="hero-edit-title" class="adm-input" value="${heroSec.title || 'Powering a Greener Tomorrow.'}" />
        </div>

        <div class="adm-form-group">
          <label class="adm-label">Hero Supporting Subtitle</label>
          <textarea id="hero-edit-subtitle" class="adm-textarea">${heroSec.subtitle || ''}</textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="adm-form-group">
            <label class="adm-label">Primary CTA Button</label>
            <input type="text" id="hero-edit-cta1-text" class="adm-input" value="${heroSec.primaryCtaText || 'Explore Our Services'}" />
          </div>
          <div class="adm-form-group">
            <label class="adm-label">Primary CTA Link</label>
            <input type="text" id="hero-edit-cta1-link" class="adm-input" value="${heroSec.primaryCtaLink || '#services'}" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="adm-form-group">
            <label class="adm-label">Secondary CTA Button</label>
            <input type="text" id="hero-edit-cta2-text" class="adm-input" value="${heroSec.secondaryCtaText || 'Get a Free Consultation'}" />
          </div>
          <div class="adm-form-group">
            <label class="adm-label">Secondary CTA Link</label>
            <input type="text" id="hero-edit-cta2-link" class="adm-input" value="${heroSec.secondaryCtaLink || '#contact'}" />
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--admin-border-subtle);">
          <div>
            <strong>Interactive 3D Solar Array Enabled</strong>
            <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Render WebGL photovoltaic panels on right half</div>
          </div>
          <label class="adm-switch">
            <input type="checkbox" id="hero-edit-3d-toggle" ${heroSec.show3dScene !== false ? 'checked' : ''} />
            <span class="adm-slider-switch"></span>
          </label>
        </div>

      </div>

      <!-- Live Preview Card -->
      <div class="adm-card" style="background: #ffffff; color: #0c1e15; border-color: rgba(16,111,60,0.2);">
        <div style="font-size: 0.75rem; font-weight: 700; color: #106f3c; text-transform: uppercase; margin-bottom: 1rem;">
          Live Section Preview
        </div>

        <div style="padding: 1.5rem 0;">
          <div style="display: inline-block; padding: 3px 10px; background: rgba(16,185,129,0.12); border-radius: 99px; font-size: 0.72rem; font-weight: 700; color: #106f3c; margin-bottom: 0.85rem;" id="hero-preview-badge">
            ${heroSec.badge || 'Next-Gen'}
          </div>

          <h2 style="font-size: 1.8rem; line-height: 1.15; color: #061a11; margin-bottom: 0.75rem;" id="hero-preview-title">
            ${heroSec.title}
          </h2>

          <p style="font-size: 0.85rem; color: #4a6358; margin-bottom: 1.5rem; line-height: 1.5;" id="hero-preview-sub">
            ${heroSec.subtitle}
          </p>

          <div style="display: flex; gap: 0.6rem;">
            <button class="btn btn-primary" style="padding: 0.55rem 1.2rem; font-size: 0.8rem;" id="hero-preview-cta1">
              ${heroSec.primaryCtaText}
            </button>
            <button class="btn btn-secondary" style="padding: 0.55rem 1.2rem; font-size: 0.8rem;" id="hero-preview-cta2">
              ${heroSec.secondaryCtaText}
            </button>
          </div>
        </div>
      </div>

    </div>
  `;

  // Real-time Input Sync
  const bIn = document.getElementById('hero-edit-badge');
  const tIn = document.getElementById('hero-edit-title');
  const sIn = document.getElementById('hero-edit-subtitle');
  const c1In = document.getElementById('hero-edit-cta1-text');
  const c2In = document.getElementById('hero-edit-cta2-text');

  bIn?.addEventListener('input', (e) => {
    document.getElementById('hero-preview-badge').textContent = e.target.value;
  });
  tIn?.addEventListener('input', (e) => {
    document.getElementById('hero-preview-title').textContent = e.target.value;
  });
  sIn?.addEventListener('input', (e) => {
    document.getElementById('hero-preview-sub').textContent = e.target.value;
  });
  c1In?.addEventListener('input', (e) => {
    document.getElementById('hero-preview-cta1').textContent = e.target.value;
  });
  c2In?.addEventListener('input', (e) => {
    document.getElementById('hero-preview-cta2').textContent = e.target.value;
  });

  document.getElementById('btn-save-hero-editor')?.addEventListener('click', () => {
    cmsStore.updateSection(homePage.id, heroSec.id, {
      badge: bIn.value,
      title: tIn.value,
      subtitle: sIn.value,
      primaryCtaText: c1In.value,
      primaryCtaLink: document.getElementById('hero-edit-cta1-link')?.value,
      secondaryCtaText: c2In.value,
      secondaryCtaLink: document.getElementById('hero-edit-cta2-link')?.value,
      show3dScene: document.getElementById('hero-edit-3d-toggle')?.checked
    });
    toast.success('Hero Section saved successfully!');
  });
}
