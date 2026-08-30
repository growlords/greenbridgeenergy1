import { cmsStore } from '../store/cmsStore.js';
import { toast } from './toast.js';
import { modal } from './modal.js';
import { themeManager } from './themeSwitcher.js';

export function renderTopbar(container, activeView, onOpenSearch) {
  if (!container) return;

  const isDraft = cmsStore.hasUnsavedChanges;
  const viewTitles = {
    'dashboard': 'Dashboard',
    'pages': 'Pages Management',
    'page-builder': 'Visual Page Builder',
    'visual-editor': 'Visual Theme Editor',
    'services': 'Services CMS',
    'projects': 'Projects CMS',
    'media': 'Media Library',
    'animation-studio': 'Animation Studio & 3D',
    'hero-editor': 'Hero Section Editor',
    'brand': 'Brand & Theme Settings',
    'navigation': 'Navigation & Footer',
    'company': 'Company Information',
    'seo': 'SEO & Social Suite',
    'settings': 'Global Settings',
    'versions': 'Version History'
  };

  const title = viewTitles[activeView] || 'Overview';

  container.innerHTML = `
    <div class="topbar-left">
      <div class="breadcrumbs">
        <span class="breadcrumb-root">Admin</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">${title}</span>
      </div>

      <!-- Spotlight Search Trigger -->
      <button class="search-trigger-btn" id="btn-topbar-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Search anything...</span>
        <span class="search-shortcut-kbd">⌘K</span>
      </button>
    </div>

    <div class="topbar-right">
      
      <!-- Theme Switcher -->
      <div id="topbar-theme-switcher-slot"></div>
      
      <!-- Status Pill -->
      <div class="status-indicator-pill ${isDraft ? 'draft' : ''}">
        <span class="status-dot"></span>
        <span>${isDraft ? 'Unsaved Draft Changes' : 'Production Live'}</span>
      </div>

      <!-- Public Site Preview Link -->
      <a href="http://localhost:5174/" target="_blank" class="btn-adm btn-adm-secondary btn-adm-sm" title="View Public Website">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        <span>Preview Website</span>
      </a>

      <!-- Save Draft -->
      <button class="btn-adm btn-adm-secondary btn-adm-sm" id="btn-save-draft" ${!isDraft ? 'disabled style="opacity:0.5;"' : ''}>
        <span>Save Draft</span>
      </button>

      <!-- Publish Action -->
      <button class="btn-adm btn-adm-primary btn-adm-sm" id="btn-publish-all">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Publish Changes</span>
      </button>
    </div>
  `;

  // Render Theme Switcher
  const themeSlot = document.getElementById('topbar-theme-switcher-slot');
  if (themeSlot) {
    themeManager.renderSwitcher(themeSlot);
  }

  // Listeners
  document.getElementById('btn-topbar-search')?.addEventListener('click', () => {
    if (onOpenSearch) onOpenSearch();
  });

  document.getElementById('btn-save-draft')?.addEventListener('click', () => {
    cmsStore.saveData(true);
    toast.success('Draft snapshot saved successfully!');
  });

  document.getElementById('btn-publish-all')?.addEventListener('click', () => {
    const pubBtn = document.getElementById('btn-publish-all');
    if (pubBtn) {
      pubBtn.disabled = true;
      pubBtn.innerHTML = `<span>Publishing...</span>`;
    }

    const notes = 'Production release deployment';
    cmsStore.publish(notes);

    setTimeout(() => {
      if (pubBtn) {
        pubBtn.disabled = false;
        pubBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Publish Changes</span>
        `;
      }
      toast.success('🎉 Successfully published to Production website!');
    }, 350);
  });
}
