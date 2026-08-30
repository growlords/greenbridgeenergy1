import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function renderVisualThemeEditor(container, onBackToDashboard, initialPageId = null) {
  if (!container) return;

  const data = cmsStore.data;
  let activePageId = initialPageId || (data.pages[0] ? data.pages[0].id : 'page-home');
  let selectedElementKey = 'home.hero.title';
  let selectedElementTagName = 'h1';
  let activeViewport = 'desktop'; // 'desktop' | 'tablet' | 'mobile'
  let activeLeftTab = 'sections'; // 'pages' | 'sections' | 'currency' | 'theme'

  function getActivePage() {
    return cmsStore.getPage(activePageId) || data.pages[0];
  }

  function getPageHash(pageId) {
    const map = {
      'page-home': 'home',
      'page-about': 'about',
      'page-services': 'services',
      'page-projects': 'projects',
      'page-contact': 'contact'
    };
    return map[pageId] || 'home';
  }

  function render() {
    const page = getActivePage();
    if (!page) {
      container.innerHTML = `<div style="padding:2rem;">No page found.</div>`;
      return;
    }

    const isSaving = cmsStore.autosaveStatus === 'saving';

    container.innerHTML = `
      <div class="visual-editor-root">
        
        <!-- ================= TOP HEADER BAR ================= -->
        <header class="ve-topbar">
          
          <!-- Left: Back to Admin & Page Badge -->
          <div class="ve-topbar-left">
            <button class="ve-back-btn" id="btn-ve-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              <span>Dashboard</span>
            </button>

            <div class="ve-page-title-badge">
              <span style="color: var(--admin-accent-emerald);">●</span>
              <span id="ve-active-page-name">${page.name}</span>
              <span style="color: var(--admin-text-muted); font-size: 0.72rem; font-family: var(--admin-font-mono);">${page.slug}</span>
            </div>
          </div>

          <!-- Center: Viewport Switchers & Undo/Redo -->
          <div class="ve-topbar-center">
            
            <div class="ve-viewport-group">
              <button class="ve-vp-btn ${activeViewport === 'desktop' ? 'active' : ''}" data-vp="desktop" title="Desktop View (100%)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                <span>Desktop</span>
              </button>
              <button class="ve-vp-btn ${activeViewport === 'tablet' ? 'active' : ''}" data-vp="tablet" title="Tablet View (768px)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                <span>Tablet</span>
              </button>
              <button class="ve-vp-btn ${activeViewport === 'mobile' ? 'active' : ''}" data-vp="mobile" title="Mobile View (375px)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                <span>Mobile</span>
              </button>
            </div>

            <div style="display: flex; gap: 4px;">
              <button class="btn-adm-ghost btn-adm-sm" id="btn-ve-undo" title="Undo (Ctrl+Z)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              </button>
              <button class="btn-adm-ghost btn-adm-sm" id="btn-ve-redo" title="Redo (Ctrl+Shift+Z)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              </button>
            </div>

          </div>

          <!-- Right: Autosave Status, Preview & Publish -->
          <div class="ve-topbar-right">
            
            <div class="ve-autosave-badge ${isSaving ? 'saving' : ''}" id="ve-autosave-indicator">
              <span style="font-size: 0.65rem;">●</span>
              <span>${isSaving ? 'Saving...' : 'Saved'}</span>
            </div>

            <a href="http://localhost:5174/?preview=true#${getPageHash(activePageId)}" target="_blank" class="btn-adm btn-adm-secondary btn-adm-sm" title="Open Draft Preview">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Preview</span>
            </a>

            <button class="btn-adm btn-adm-secondary btn-adm-sm" id="btn-ve-save-draft">
              <span>Save Draft</span>
            </button>

            <button class="btn-adm btn-adm-primary btn-adm-sm" id="btn-ve-publish">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Publish</span>
            </button>

          </div>

        </header>


        <!-- ================= 3-PANEL WORKSPACE ================= -->
        <div class="ve-workspace">
          
          <!-- ================= LEFT SIDEBAR ================= -->
          <aside class="ve-left-sidebar">
            
            <div class="ve-sidebar-tabs">
              <button class="ve-tab-btn ${activeLeftTab === 'pages' ? 'active' : ''}" data-tab="pages">Pages</button>
              <button class="ve-tab-btn ${activeLeftTab === 'sections' ? 'active' : ''}" data-tab="sections">Sections</button>
              <button class="ve-tab-btn ${activeLeftTab === 'currency' ? 'active' : ''}" data-tab="currency">Currency</button>
              <button class="ve-tab-btn ${activeLeftTab === 'theme' ? 'active' : ''}" data-tab="theme">Theme</button>
            </div>

            <div class="ve-tab-content-pane">
              ${renderLeftSidebarTab(activeLeftTab, page)}
            </div>

          </aside>


          <!-- ================= CENTER CANVAS (REAL WEBSITE IFRAME) ================= -->
          <main class="ve-canvas-area">
            
            <div class="ve-canvas-device-wrapper vp-${activeViewport}" id="ve-canvas-frame" style="height: 100%; width: 100%; display: flex; flex-direction: column;">
              
              <!-- Real Website Iframe Running Live 3D Experience & Real DOM -->
              <iframe 
                id="ve-preview-iframe" 
                src="http://localhost:5174/?editor=true#${getPageHash(activePageId)}" 
                style="width: 100%; height: 100%; border: none; flex: 1; background: #061a11;"
                title="Real Website Preview Frame"
              ></iframe>

            </div>

          </main>


          <!-- ================= RIGHT PROPERTIES INSPECTOR ================= -->
          <aside class="ve-right-inspector">
            
            <div class="ve-inspector-header">
              <strong style="font-size: 0.85rem;">Element Inspector</strong>
              <span class="sidebar-brand-badge" style="background: rgba(16,185,129,0.15); color: #10b981;">ACTIVE</span>
            </div>

            <div class="ve-inspector-scroll" id="ve-inspector-fields">
              ${renderPropertiesInspector(selectedElementKey, selectedElementTagName)}
            </div>

          </aside>

        </div>

      </div>
    `;

    attachEditorListeners();
  }

  // Left Sidebar Content
  function renderLeftSidebarTab(tab, page) {
    if (tab === 'pages') {
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <strong style="font-size: 0.85rem;">Website Pages (${data.pages.length})</strong>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${data.pages.map((p) => `
            <div class="ve-tree-item ${p.id === activePageId ? 'selected' : ''} btn-switch-page" data-page-id="${p.id}">
              <div>
                <strong>${p.name}</strong>
                <div style="font-size: 0.72rem; color: var(--admin-text-muted);">${p.slug}</div>
              </div>
              <span class="badge-status ${p.status === 'published' ? 'badge-published' : 'badge-draft'}">${p.status}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'sections') {
      const sections = page.sections || [];
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <strong style="font-size: 0.85rem;">Page Sections (${sections.length})</strong>
        </div>
        <p style="font-size: 0.72rem; color: var(--admin-text-muted); margin-bottom: 0.5rem;">
          Grab the ⠿ handle to drag and reorder sections live. Drop anywhere in the list.
        </p>

        <!-- All Real Sections on this Page -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem;" id="ve-section-tree-list">
          ${sections.map((sec, idx) => `
            <div class="ve-tree-item" draggable="true" data-section-id="${sec.id}" data-idx="${idx}">
              <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1;">
                <span class="ve-tree-drag-handle" title="Drag to reorder">⠿</span>
                <span style="font-size: 1rem;">${sec.icon || '📄'}</span>
                <strong style="font-size: 0.82rem; font-weight: 600;">${sec.name}</strong>
              </div>
              <div class="ve-tree-actions">
                <button class="ve-tree-action-btn btn-tree-sec-up" data-idx="${idx}" title="Move Up" ${idx === 0 ? 'disabled style="opacity:0.2;"' : ''}>▲</button>
                <button class="ve-tree-action-btn btn-tree-sec-down" data-idx="${idx}" title="Move Down" ${idx === (sections.length - 1) ? 'disabled style="opacity:0.2;"' : ''}>▼</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'currency') {
      const cur = data.currency || {
        defaultCurrency: 'INR',
        symbol: '₹',
        code: 'INR',
        position: 'before',
        decimalPlaces: 0,
        minBill: 500,
        maxBill: 10000000,
        step: 500,
        defaultBill: 4500
      };

      return `
        <strong style="font-size: 0.85rem;">Solar Savings & Currency Settings</strong>
        <p style="font-size: 0.72rem; color: var(--admin-text-muted); margin-bottom: 0.75rem;">
          Configure global currency, slider limits (up to ₹1,00,00,000+), and ROI metrics on the public calculator.
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          
          <div class="adm-form-group">
            <label class="adm-label">Currency Preset</label>
            <select class="adm-select" id="cur-preset-select">
              <option value="INR" ${cur.code === 'INR' ? 'selected' : ''}>INR (₹) - Indian Rupee</option>
              <option value="USD" ${cur.code === 'USD' ? 'selected' : ''}>USD ($) - US Dollar</option>
              <option value="EUR" ${cur.code === 'EUR' ? 'selected' : ''}>EUR (€) - Euro</option>
              <option value="GBP" ${cur.code === 'GBP' ? 'selected' : ''}>GBP (£) - British Pound</option>
              <option value="AED" ${cur.code === 'AED' ? 'selected' : ''}>AED (د.إ) - UAE Dirham</option>
              <option value="CAD" ${cur.code === 'CAD' ? 'selected' : ''}>CAD ($) - Canadian Dollar</option>
              <option value="AUD" ${cur.code === 'AUD' ? 'selected' : ''}>AUD ($) - Australian Dollar</option>
              <option value="SGD" ${cur.code === 'SGD' ? 'selected' : ''}>SGD ($) - Singapore Dollar</option>
              <option value="JPY" ${cur.code === 'JPY' ? 'selected' : ''}>JPY (¥) - Japanese Yen</option>
              <option value="CUSTOM" ${!['INR','USD','EUR','GBP','AED','CAD','AUD','SGD','JPY'].includes(cur.code) ? 'selected' : ''}>Custom Currency</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="adm-form-group">
              <label class="adm-label">Currency Symbol</label>
              <input type="text" id="cur-symbol-in" class="adm-input" value="${cur.symbol}" />
            </div>
            <div class="adm-form-group">
              <label class="adm-label">Currency Code</label>
              <input type="text" id="cur-code-in" class="adm-input" value="${cur.code}" />
            </div>
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Symbol Position</label>
            <select class="adm-select" id="cur-position-select">
              <option value="before" ${cur.position === 'before' ? 'selected' : ''}>Before Amount (e.g. ₹4,500 / $350)</option>
              <option value="after" ${cur.position === 'after' ? 'selected' : ''}>After Amount (e.g. 4,500 ₹)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="adm-form-group">
              <label class="adm-label">Minimum Bill</label>
              <input type="number" id="cur-min-bill-in" class="adm-input" value="${cur.minBill !== undefined ? cur.minBill : 500}" />
            </div>
            <div class="adm-form-group">
              <label class="adm-label">Maximum Bill</label>
              <input type="number" id="cur-max-bill-in" class="adm-input" value="${cur.maxBill !== undefined ? cur.maxBill : 10000000}" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="adm-form-group">
              <label class="adm-label">Slider Step</label>
              <input type="number" id="cur-step-in" class="adm-input" value="${cur.step !== undefined ? cur.step : 500}" />
            </div>
            <div class="adm-form-group">
              <label class="adm-label">Default Bill</label>
              <input type="number" id="cur-default-bill-in" class="adm-input" value="${cur.defaultBill || 4500}" />
            </div>
          </div>

          <button class="btn-adm btn-adm-primary" id="btn-save-currency-settings" style="width: 100%; justify-content: center; margin-top: 0.5rem;">
            Apply Currency Settings
          </button>
        </div>
      `;
    }

    if (tab === 'theme') {
      return `
        <strong style="font-size: 0.85rem;">Global Theme & Design Tokens</strong>
        
        <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 0.75rem;">
          <div class="adm-form-group">
            <label class="adm-label">Primary Accent Emerald</label>
            <input type="color" id="theme-col-accent" value="${data.branding.colors.accentEmerald}" style="width: 100%; height: 36px; border: none; border-radius: 6px; cursor: pointer;" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Solar Gold Accent</label>
            <input type="color" id="theme-col-gold" value="${data.branding.colors.accentGold}" style="width: 100%; height: 36px; border: none; border-radius: 6px; cursor: pointer;" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Heading Typography</label>
            <select class="adm-select" id="theme-font-heading">
              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              <option value="Inter">Inter</option>
              <option value="Space Grotesk">Space Grotesk</option>
            </select>
          </div>

          <button class="btn-adm btn-adm-primary" id="btn-save-theme-tokens" style="width: 100%; justify-content: center; margin-top: 0.5rem;">
            Save Theme Tokens
          </button>
        </div>
      `;
    }
  }

  // Right Section Inspector Content
  function renderSectionInspector(sec, pageId) {
    const data = cmsStore.data;
    const elements = data.elements || {};

    if (sec.id === 'sec-calculator') {
      const cur = data.currency || {};
      return `
        <div style="background: var(--admin-bg-elevated); padding: 0.85rem; border-radius: var(--admin-radius-sm); margin-bottom: 1rem; border: 1px solid var(--admin-border-subtle);">
          <div style="font-size: 0.72rem; color: var(--admin-text-muted); text-transform: uppercase;">Selected Section</div>
          <strong style="font-size: 0.95rem; color: var(--admin-accent-emerald);">${sec.icon || '🧮'} ${sec.name}</strong>
          <div style="font-size: 0.7rem; color: var(--admin-text-muted); margin-top: 2px;">ID: #${sec.id} | Page: ${pageId}</div>
        </div>

        <div class="inspector-accordion-group">
          <div class="inspector-group-title">Section Copy & Headlines</div>
          <div class="adm-form-group">
            <label class="adm-label">Section Tag</label>
            <input type="text" class="adm-input" id="sec-inp-calc-tag" value="${elements['home.calc.tag'] || 'Precision Solar Modeling'}" />
          </div>
          <div class="adm-form-group">
            <label class="adm-label">Heading Title</label>
            <input type="text" class="adm-input" id="sec-inp-calc-title" value="${elements['home.calc.title'] || 'Estimate Your 25-Year Solar ROI'}" />
          </div>
          <div class="adm-form-group">
            <label class="adm-label">Subtitle Description</label>
            <textarea class="adm-textarea" id="sec-inp-calc-subtitle" style="min-height: 70px;">${elements['home.calc.subtitle'] || ''}</textarea>
          </div>
          <div class="adm-form-group">
            <label class="adm-label">CTA Button Text</label>
            <input type="text" class="adm-input" id="sec-inp-calc-btn" value="${elements['home.calc.btnText'] || 'Lock In This Estimate & Get Quote'}" />
          </div>
        </div>

        <div class="inspector-accordion-group" style="margin-top: 1rem;">
          <div class="inspector-group-title">Calculator Currency & Ranges</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <div class="adm-form-group">
              <label class="adm-label">Currency Symbol</label>
              <input type="text" class="adm-input" id="sec-cur-sym" value="${cur.symbol || '₹'}" />
            </div>
            <div class="adm-form-group">
              <label class="adm-label">Currency Code</label>
              <input type="text" class="adm-input" id="sec-cur-code" value="${cur.code || 'INR'}" />
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem;">
            <div class="adm-form-group">
              <label class="adm-label">Min Bill</label>
              <input type="number" class="adm-input" id="sec-cur-min" value="${cur.minBill !== undefined ? cur.minBill : 500}" />
            </div>
            <div class="adm-form-group">
              <label class="adm-label">Max Bill</label>
              <input type="number" class="adm-input" id="sec-cur-max" value="${cur.maxBill !== undefined ? cur.maxBill : 10000000}" />
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem;">
            <div class="adm-form-group">
              <label class="adm-label">Slider Step</label>
              <input type="number" class="adm-input" id="sec-cur-step" value="${cur.step !== undefined ? cur.step : 500}" />
            </div>
            <div class="adm-form-group">
              <label class="adm-label">Default Bill</label>
              <input type="number" class="adm-input" id="sec-cur-def" value="${cur.defaultBill || 4500}" />
            </div>
          </div>
          <button class="btn-adm btn-adm-primary" id="btn-save-calc-sec" style="width: 100%; justify-content: center; margin-top: 0.75rem;">
            Apply Calculator Settings
          </button>
        </div>
      `;
    }

    // Generic Section Inspector
    return `
      <div style="background: var(--admin-bg-elevated); padding: 0.85rem; border-radius: var(--admin-radius-sm); margin-bottom: 1rem; border: 1px solid var(--admin-border-subtle);">
        <div style="font-size: 0.72rem; color: var(--admin-text-muted); text-transform: uppercase;">Selected Section</div>
        <strong style="font-size: 0.95rem; color: var(--admin-accent-emerald);">${sec.icon || '📄'} ${sec.name}</strong>
        <div style="font-size: 0.7rem; color: var(--admin-text-muted); margin-top: 2px;">ID: #${sec.id} | Page: ${pageId}</div>
      </div>

      <div class="inspector-accordion-group">
        <div class="inspector-group-title">Section Settings</div>
        <div class="adm-form-group">
          <label class="adm-label">Section Display Name</label>
          <input type="text" class="adm-input" id="sec-prop-name" value="${sec.name}" />
        </div>
        <div class="adm-form-group">
          <label class="adm-label">Section DOM ID</label>
          <input type="text" class="adm-input" value="#${sec.id}" disabled style="opacity: 0.7;" />
        </div>
      </div>

      <div class="inspector-accordion-group" style="margin-top: 1rem;">
        <div class="inspector-group-title">Direct Canvas Editing</div>
        <p style="font-size: 0.75rem; color: var(--admin-text-muted); line-height: 1.4;">
          Click any text, badge, or button directly in the center preview to edit its copy in real-time.
        </p>
      </div>
    `;
  }

  // Right Inspector Content with Clean Progressive Disclosure
  function renderPropertiesInspector(elementKey, tagName) {
    const currentValue = cmsStore.getElementValue(elementKey, '');

    return `
      <!-- Active Element Header -->
      <div style="background: var(--admin-bg-elevated); padding: 0.85rem; border-radius: var(--admin-radius-sm); margin-bottom: 1rem; border: 1px solid var(--admin-border-subtle);">
        <div style="font-size: 0.72rem; color: var(--admin-text-muted); text-transform: uppercase;">Selected Element</div>
        <strong style="font-size: 0.88rem; color: var(--admin-accent-emerald); word-break: break-all;">${elementKey}</strong>
        <div style="font-size: 0.7rem; color: var(--admin-text-muted); margin-top: 2px;">Tag: &lt;${(tagName || 'text').toUpperCase()}&gt;</div>
      </div>

      <!-- Real-Time Text Input -->
      <div class="inspector-accordion-group">
        <div class="inspector-group-title">Element Content</div>

        <div class="adm-form-group">
          <label class="adm-label">Direct Content / Text</label>
          <textarea id="ve-prop-text-input" class="adm-textarea" style="min-height: 110px; font-size: 0.88rem; line-height: 1.5;">${currentValue}</textarea>
        </div>
      </div>

      <!-- Advanced Settings (Collapsible Progressive Disclosure) -->
      <details style="background: var(--admin-bg-elevated); border: 1px solid var(--admin-border-subtle); border-radius: var(--admin-radius-sm); padding: 0.75rem; margin-top: 1rem;">
        <summary style="font-size: 0.8rem; font-weight: 600; cursor: pointer; color: var(--admin-text-secondary);">
          ⚙️ Advanced Settings
        </summary>
        <div style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <div class="adm-form-group">
            <label class="adm-label">CSS Custom Class</label>
            <input type="text" class="adm-input" placeholder="e.g. highlight-emerald-glow" />
          </div>
          <div class="adm-form-group">
            <label class="adm-label">Element Opacity</label>
            <input type="range" min="0.1" max="1.0" step="0.05" value="1.0" class="adm-slider" />
          </div>
        </div>
      </details>
    `;
  }

  // Attach All Event Listeners & Bridge
  function attachEditorListeners() {
    const page = getActivePage();
    const iframe = document.getElementById('ve-preview-iframe');

    // Back to Dashboard
    document.getElementById('btn-ve-back')?.addEventListener('click', () => {
      if (onBackToDashboard) onBackToDashboard();
    });

    // Viewport Switcher Buttons
    container.querySelectorAll('.ve-vp-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeViewport = btn.dataset.vp;
        const frame = document.getElementById('ve-canvas-frame');
        if (frame) {
          frame.className = `ve-canvas-device-wrapper vp-${activeViewport}`;
        }
        container.querySelectorAll('.ve-vp-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Left Tab Switchers
    container.querySelectorAll('.ve-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeLeftTab = btn.dataset.tab;
        render();
      });
    });

    // Page Switchers
    container.querySelectorAll('.btn-switch-page').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePageId = btn.dataset.pageId;
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'GPE_NAVIGATE_PAGE',
            pageId: activePageId
          }, '*');
        }
        render();
      });
    });

    // Section Tree Items: Native Drag-and-Drop & Click Handlers
    const treeItems = container.querySelectorAll('#ve-section-tree-list .ve-tree-item');
    let draggedIndex = null;

    treeItems.forEach((item) => {
      // 1. Click to scroll to section & open section inspector
      item.addEventListener('click', (e) => {
        if (e.target.closest('.ve-tree-actions') || e.target.closest('.ve-tree-drag-handle')) return;
        const secId = item.dataset.sectionId;
        treeItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const sec = page.sections?.find(s => s.id === secId) || { id: secId, name: 'Section' };
        selectedElementKey = null;
        
        const inspectorBody = document.getElementById('ve-inspector-body');
        if (inspectorBody) {
          inspectorBody.innerHTML = renderSectionInspector(sec, activePageId);

          // Listeners for calculator quick edit
          if (sec.id === 'sec-calculator') {
            document.getElementById('sec-inp-calc-tag')?.addEventListener('input', (ev) => {
              cmsStore.setElementValue('home.calc.tag', ev.target.value);
            });
            document.getElementById('sec-inp-calc-title')?.addEventListener('input', (ev) => {
              cmsStore.setElementValue('home.calc.title', ev.target.value);
            });
            document.getElementById('sec-inp-calc-subtitle')?.addEventListener('input', (ev) => {
              cmsStore.setElementValue('home.calc.subtitle', ev.target.value);
            });
            document.getElementById('sec-inp-calc-btn')?.addEventListener('input', (ev) => {
              cmsStore.setElementValue('home.calc.btnText', ev.target.value);
            });
            document.getElementById('btn-save-calc-sec')?.addEventListener('click', () => {
              const symbol = document.getElementById('sec-cur-sym')?.value || '₹';
              const code = document.getElementById('sec-cur-code')?.value || 'INR';
              const minBill = parseFloat(document.getElementById('sec-cur-min')?.value) || 500;
              const maxBill = parseFloat(document.getElementById('sec-cur-max')?.value) || 10000000;
              const step = parseFloat(document.getElementById('sec-cur-step')?.value) || 500;
              const defaultBill = parseFloat(document.getElementById('sec-cur-def')?.value) || 4500;
              cmsStore.updateCurrency({ symbol, code, minBill, maxBill, step, defaultBill });
              toast.success('Calculator settings updated!');
            });
          }
        }

        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'GPE_SCROLL_TO_SECTION',
            sectionId: secId
          }, '*');
        }
      });

      // 2. Drag Start
      item.addEventListener('dragstart', (e) => {
        draggedIndex = parseInt(item.dataset.idx);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedIndex.toString());
        setTimeout(() => item.classList.add('dragging'), 0);
      });

      // 3. Drag End
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        treeItems.forEach(i => i.classList.remove('drop-target-above', 'drop-target-below'));
        draggedIndex = null;
      });

      // 4. Drag Over & Calculate Drop Position Indicator
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const rect = item.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const isAbove = e.clientY < midY;

        treeItems.forEach(i => i.classList.remove('drop-target-above', 'drop-target-below'));
        if (isAbove) {
          item.classList.add('drop-target-above');
        } else {
          item.classList.add('drop-target-below');
        }
      });

      // 5. Drag Leave
      item.addEventListener('dragleave', () => {
        item.classList.remove('drop-target-above', 'drop-target-below');
      });

      // 6. Drop & Reorder
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.classList.remove('drop-target-above', 'drop-target-below');

        const fromIdx = draggedIndex !== null ? draggedIndex : parseInt(e.dataTransfer.getData('text/plain'));
        const toIdx = parseInt(item.dataset.idx);

        if (isNaN(fromIdx) || isNaN(toIdx) || fromIdx === toIdx) return;

        const rect = item.getBoundingClientRect();
        const isAbove = e.clientY < (rect.top + rect.height / 2);

        const currentIds = page.sections ? page.sections.map(s => s.id) : [];
        const [movedId] = currentIds.splice(fromIdx, 1);

        let targetInsertIdx = toIdx;
        if (!isAbove && fromIdx < toIdx) {
          targetInsertIdx = toIdx; // target index shifted down
        } else if (!isAbove && fromIdx > toIdx) {
          targetInsertIdx = toIdx + 1;
        } else if (isAbove && fromIdx < toIdx) {
          targetInsertIdx = toIdx - 1;
        }

        targetInsertIdx = Math.max(0, Math.min(targetInsertIdx, currentIds.length));
        currentIds.splice(targetInsertIdx, 0, movedId);

        cmsStore.reorderSections(activePageId, currentIds);
        toast.success('Section reordered!');
        render();
      });
    });

    // Move Section Up (▲) / Down (▼)
    container.querySelectorAll('.btn-tree-sec-up').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        if (idx > 0 && page.sections) {
          const ids = page.sections.map((s) => s.id);
          const temp = ids[idx - 1];
          ids[idx - 1] = ids[idx];
          ids[idx] = temp;
          cmsStore.reorderSections(activePageId, ids);
          render();
        }
      });
    });

    container.querySelectorAll('.btn-tree-sec-down').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        if (page.sections && idx < page.sections.length - 1) {
          const ids = page.sections.map((s) => s.id);
          const temp = ids[idx + 1];
          ids[idx + 1] = ids[idx];
          ids[idx] = temp;
          cmsStore.reorderSections(activePageId, ids);
          render();
        }
      });
    });

    // Right Inspector Text Input Event
    const textInput = document.getElementById('ve-prop-text-input');
    textInput?.addEventListener('input', (e) => {
      if (selectedElementKey) {
        cmsStore.setElementValue(selectedElementKey, e.target.value);
      }
    });

    // Currency Presets
    const curPreset = document.getElementById('cur-preset-select');
    curPreset?.addEventListener('change', (e) => {
      const presets = {
        INR: { symbol: '₹', code: 'INR', position: 'before', minBill: 500, maxBill: 10000000, step: 500, defaultBill: 4500 },
        USD: { symbol: '$', code: 'USD', position: 'before', minBill: 50, maxBill: 50000, step: 25, defaultBill: 350 },
        EUR: { symbol: '€', code: 'EUR', position: 'before', minBill: 50, maxBill: 50000, step: 25, defaultBill: 300 },
        GBP: { symbol: '£', code: 'GBP', position: 'before', minBill: 50, maxBill: 50000, step: 25, defaultBill: 260 },
        AED: { symbol: 'د.إ', code: 'AED', position: 'after', minBill: 200, maxBill: 200000, step: 100, defaultBill: 1200 },
        CAD: { symbol: '$', code: 'CAD', position: 'before', minBill: 50, maxBill: 50000, step: 25, defaultBill: 400 },
        AUD: { symbol: '$', code: 'AUD', position: 'before', minBill: 50, maxBill: 50000, step: 25, defaultBill: 420 },
        SGD: { symbol: '$', code: 'SGD', position: 'before', minBill: 50, maxBill: 50000, step: 25, defaultBill: 450 },
        JPY: { symbol: '¥', code: 'JPY', position: 'before', minBill: 5000, maxBill: 5000000, step: 1000, defaultBill: 35000 }
      };
      const p = presets[e.target.value] || presets.INR;
      const sIn = document.getElementById('cur-symbol-in');
      const cIn = document.getElementById('cur-code-in');
      const posSel = document.getElementById('cur-position-select');
      const minIn = document.getElementById('cur-min-bill-in');
      const maxIn = document.getElementById('cur-max-bill-in');
      const stepIn = document.getElementById('cur-step-in');
      const billIn = document.getElementById('cur-default-bill-in');

      if (sIn) sIn.value = p.symbol;
      if (cIn) cIn.value = p.code;
      if (posSel) posSel.value = p.position;
      if (minIn) minIn.value = p.minBill;
      if (maxIn) maxIn.value = p.maxBill;
      if (stepIn) stepIn.value = p.step;
      if (billIn) billIn.value = p.defaultBill;
    });

    // Save Currency Settings Button
    document.getElementById('btn-save-currency-settings')?.addEventListener('click', () => {
      const symbol = document.getElementById('cur-symbol-in')?.value || '₹';
      const code = document.getElementById('cur-code-in')?.value || 'INR';
      const position = document.getElementById('cur-position-select')?.value || 'before';
      const minBill = parseFloat(document.getElementById('cur-min-bill-in')?.value) || 500;
      const maxBill = parseFloat(document.getElementById('cur-max-bill-in')?.value) || 10000000;
      const step = parseFloat(document.getElementById('cur-step-in')?.value) || 500;
      const defaultBill = parseFloat(document.getElementById('cur-default-bill-in')?.value) || 4500;

      cmsStore.updateCurrency({
        symbol,
        code,
        position,
        minBill,
        maxBill,
        step,
        defaultBill
      });

      toast.success(`Currency configured to ${code} (${symbol})!`);
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'GPE_CMS_LIVE_PREVIEW',
          data: cmsStore.data
        }, '*');
      }
    });

    // Undo / Redo
    document.getElementById('btn-ve-undo')?.addEventListener('click', () => {
      if (cmsStore.undo()) render();
    });

    document.getElementById('btn-ve-redo')?.addEventListener('click', () => {
      if (cmsStore.redo()) render();
    });

    // Save Draft
    document.getElementById('btn-ve-save-draft')?.addEventListener('click', () => {
      cmsStore.saveData(true);
      toast.success('Draft snapshot saved successfully!');
    });

    // Publish Action
    document.getElementById('btn-ve-publish')?.addEventListener('click', () => {
      const pubBtn = document.getElementById('btn-ve-publish');
      if (pubBtn) {
        pubBtn.disabled = true;
        pubBtn.innerHTML = `<span>Publishing...</span>`;
      }

      const changelog = `Updated ${page.name} visual layout & copy`;
      cmsStore.publish(changelog);

      setTimeout(() => {
        if (pubBtn) {
          pubBtn.disabled = false;
          pubBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Publish</span>
          `;
        }
        toast.success('🎉 Published to Live Website successfully!');
      }, 350);
    });
  }

  // Handle Incoming PostMessage Events from the Live Website Iframe
  window.addEventListener('message', (event) => {
    const { type, key, value, tagName, src, orderedIds, pageId } = event.data || {};

    // 1. Direct Canvas Typing (GPE_ELEMENT_VALUE_CHANGED)
    if (type === 'GPE_ELEMENT_VALUE_CHANGED' && key) {
      cmsStore.setElementValue(key, value, false);
      selectedElementKey = key;
      selectedElementTagName = tagName || 'text';

      // Update right textarea if currently open
      const activeTextarea = document.getElementById('ve-prop-text-input');
      if (activeTextarea && activeTextarea !== document.activeElement) {
        activeTextarea.value = value;
      }
    }

    // 2. Direct Canvas Click / Focus (GPE_ELEMENT_FOCUSED)
    if (type === 'GPE_ELEMENT_FOCUSED' && key) {
      selectedElementKey = key;
      selectedElementTagName = tagName || 'text';
      const rightFields = document.getElementById('ve-inspector-fields');
      if (rightFields) {
        rightFields.innerHTML = renderPropertiesInspector(selectedElementKey, selectedElementTagName);
        const textIn = document.getElementById('ve-prop-text-input');
        textIn?.addEventListener('input', (e) => {
          cmsStore.setElementValue(selectedElementKey, e.target.value);
        });
      }
    }

    // 3. Direct Section Reordered from Canvas Drag
    if (type === 'GPE_SECTION_REORDERED' && Array.isArray(orderedIds)) {
      const targetPageId = pageId || activePageId;
      cmsStore.reorderSections(targetPageId, orderedIds);
      toast.success('Canvas section reordered!');
      render();
    }

    // 4. Direct Image Click
    if (type === 'GPE_IMAGE_SELECTED') {
      modal.open(`
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <h3 style="font-size: 1.35rem;">Replace Image Asset</h3>
          <div style="display: flex; gap: 1rem; align-items: center; background: var(--admin-bg-elevated); padding: 1rem; border-radius: 8px;">
            <img src="${src}" alt="Current" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;" />
            <div>
              <strong style="font-size: 0.85rem;">Current Image</strong>
              <div style="font-size: 0.72rem; color: var(--admin-text-muted); word-break: break-all;">${src}</div>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-label">Choose from Media Library</label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; max-height: 180px; overflow-y: auto;">
              ${cmsStore.getMedia().map(m => `
                <div class="btn-choose-media-replace" data-url="${m.url}" style="cursor: pointer; border: 1px solid var(--admin-border-subtle); border-radius: 6px; overflow: hidden;">
                  <img src="${m.url}" alt="${m.title}" style="width: 100%; height: 60px; object-fit: cover;" />
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `, '560px');

      document.querySelectorAll('.btn-choose-media-replace').forEach((btn) => {
        btn.addEventListener('click', () => {
          const newUrl = btn.dataset.url;
          modal.close();
          toast.success('Image replaced in draft!');
          const iframe = document.getElementById('ve-preview-iframe');
          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'GPE_CMS_LIVE_PREVIEW',
              data: cmsStore.data
            }, '*');
          }
        });
      });
    }
  });

  // Subscribe to autosave changes
  cmsStore.subscribeAutosave((status) => {
    const badge = document.getElementById('ve-autosave-indicator');
    if (badge) {
      if (status === 'saving') {
        badge.classList.add('saving');
        badge.innerHTML = `<span style="font-size: 0.65rem;">●</span><span>Saving...</span>`;
      } else {
        badge.classList.remove('saving');
        badge.innerHTML = `<span style="font-size: 0.65rem;">●</span><span>Saved</span>`;
      }
    }
  });

  render();
}
