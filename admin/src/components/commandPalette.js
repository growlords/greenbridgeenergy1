import { cmsStore } from '../store/cmsStore.js';

export function initCommandPalette(onNavigate) {
  let backdrop = document.getElementById('cmd-palette-modal');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'cmd-palette-modal';
    backdrop.className = 'cmd-palette-backdrop';
    backdrop.innerHTML = `
      <div class="cmd-palette-window">
        <div class="cmd-search-input-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--admin-text-muted);">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" class="cmd-search-input" id="cmd-input-field" placeholder="Type a command or search pages, services, projects..." autocomplete="off" />
          <span class="search-shortcut-kbd">ESC</span>
        </div>
        <ul class="cmd-results-list" id="cmd-results-list"></ul>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  const input = document.getElementById('cmd-input-field');
  const resultsList = document.getElementById('cmd-results-list');

  function open() {
    backdrop.classList.add('active');
    input.value = '';
    renderResults('');
    input.focus();
  }

  function close() {
    backdrop.classList.remove('active');
  }

  function getItems() {
    const data = cmsStore.data;
    const items = [
      // Views & Actions
      { title: 'Dashboard Overview', type: 'View', view: 'dashboard' },
      { title: 'Pages Management', type: 'View', view: 'pages' },
      { title: 'Visual Page Builder', type: 'View', view: 'page-builder' },
      { title: 'Services CMS', type: 'View', view: 'services' },
      { title: 'Projects CMS', type: 'View', view: 'projects' },
      { title: 'Media Library', type: 'View', view: 'media' },
      { title: 'Animation Studio & 3D Controls', type: 'View', view: 'animation-studio' },
      { title: 'Hero Section Editor', type: 'View', view: 'hero-editor' },
      { title: 'Brand & Color Settings', type: 'View', view: 'brand' },
      { title: 'Navigation & Footer Trees', type: 'View', view: 'navigation' },
      { title: 'Company Information', type: 'View', view: 'company' },
      { title: 'SEO & Social Meta Suite', type: 'View', view: 'seo' },
      { title: 'Global Website Settings', type: 'View', view: 'settings' },
      { title: 'Version History & Rollback', type: 'View', view: 'versions' }
    ];

    // Add Pages
    data.pages.forEach((p) => {
      items.push({ title: `Edit Page: ${p.name}`, type: 'Page', view: 'page-builder', pageId: p.id });
    });

    // Add Services
    data.services.forEach((s) => {
      items.push({ title: `Service: ${s.title}`, type: 'Service', view: 'services' });
    });

    // Add Projects
    data.projects.forEach((pr) => {
      items.push({ title: `Project: ${pr.title}`, type: 'Project', view: 'projects' });
    });

    return items;
  }

  function renderResults(query) {
    const items = getItems();
    const filtered = query.trim() === ''
      ? items
      : items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase()));

    resultsList.innerHTML = filtered.map((item, idx) => `
      <li class="cmd-result-item ${idx === 0 ? 'selected' : ''}" data-view="${item.view}" data-page-id="${item.pageId || ''}">
        <span>${item.title}</span>
        <span class="cmd-item-tag">${item.type}</span>
      </li>
    `).join('');

    resultsList.querySelectorAll('.cmd-result-item').forEach((el) => {
      el.addEventListener('click', () => {
        const targetView = el.dataset.view;
        const pageId = el.dataset.pageId;
        close();
        if (onNavigate) onNavigate(targetView, pageId);
      });
    });
  }

  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  // Keyboard Shortcuts: ⌘K or Ctrl+K
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('active')) {
        close();
      } else {
        open();
      }
    } else if (e.key === 'Escape') {
      close();
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  return { open, close };
}
