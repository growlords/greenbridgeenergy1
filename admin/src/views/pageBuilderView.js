import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function renderPageBuilderView(container, initialPageId = null) {
  if (!container) return;

  const data = cmsStore.data;
  let activePageId = initialPageId || (data.pages[0] ? data.pages[0].id : 'page-home');
  let selectedSectionId = null;
  let activeViewport = 'desktop'; // 'desktop' | 'laptop' | 'tablet' | 'mobile'

  function getActivePage() {
    return cmsStore.getPage(activePageId) || data.pages[0];
  }

  function render() {
    const page = getActivePage();
    if (!page) {
      container.innerHTML = `<div style="padding:2rem;">No pages found.</div>`;
      return;
    }

    if (!selectedSectionId && page.sections && page.sections.length > 0) {
      selectedSectionId = page.sections[0].id;
    }

    container.innerHTML = `
      <div class="page-builder-layout">
        
        <!-- ================= LEFT PANEL: COMPONENT LIBRARY ================= -->
        <div class="builder-left-panel">
          <div class="builder-panel-head">
            <span class="builder-panel-title">Component Library</span>
            <span class="sidebar-brand-badge">DRAG & DROP</span>
          </div>

          <div class="builder-elements-scroll">
            
            <div class="element-card-draggable" data-type="hero" title="Add 3D Hero Section">
              <div class="element-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4"/></svg>
              </div>
              <div class="element-info">
                <span class="element-name">3D Hero Section</span>
                <span class="element-desc">Anti-gravity solar scene</span>
              </div>
            </div>

            <div class="element-card-draggable" data-type="statistics" title="Add Statistics Bar">
              <div class="element-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div class="element-info">
                <span class="element-name">Statistics Banner</span>
                <span class="element-desc">Animated counters grid</span>
              </div>
            </div>

            <div class="element-card-draggable" data-type="features" title="Add Features Cards">
              <div class="element-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div class="element-info">
                <span class="element-name">3D Tilt Cards</span>
                <span class="element-desc">Interactive benefits grid</span>
              </div>
            </div>

            <div class="element-card-draggable" data-type="calculator" title="Add ROI Calculator">
              <div class="element-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/></svg>
              </div>
              <div class="element-info">
                <span class="element-name">Solar Calculator</span>
                <span class="element-desc">Interactive 25-yr ROI tool</span>
              </div>
            </div>

            <div class="element-card-draggable" data-type="services-preview" title="Add Services Grid">
              <div class="element-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4"/></svg>
              </div>
              <div class="element-info">
                <span class="element-name">Services Grid</span>
                <span class="element-desc">Turnkey solar cards</span>
              </div>
            </div>

            <div class="element-card-draggable" data-type="projects-preview" title="Add Projects Showcase">
              <div class="element-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <div class="element-info">
                <span class="element-name">Projects Showcase</span>
                <span class="element-desc">Portfolio case studies</span>
              </div>
            </div>

            <div class="element-card-draggable" data-type="cta" title="Add Call to Action Banner">
              <div class="element-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
              </div>
              <div class="element-info">
                <span class="element-name">Call to Action (CTA)</span>
                <span class="element-desc">High-impact conversion box</span>
              </div>
            </div>

            <div class="element-card-draggable" data-type="how-solar-works" title="Add How Solar Works Pipeline">
              <div class="element-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div class="element-info">
                <span class="element-name">Energy Flow Pipeline</span>
                <span class="element-desc">5-step interactive diagram</span>
              </div>
            </div>

          </div>
        </div>


        <!-- ================= CENTER PANEL: LIVE VISUAL CANVAS ================= -->
        <div class="builder-center-panel">
          
          <!-- Canvas Top Toolbar -->
          <div class="canvas-toolbar-bar">
            
            <!-- Page Selector -->
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 0.8rem; color: var(--admin-text-muted); font-weight: 600;">Page:</span>
              <select id="builder-page-select" class="adm-select" style="padding: 0.35rem 0.75rem; width: 170px; font-size: 0.82rem;">
                ${data.pages.map((p) => `
                  <option value="${p.id}" ${p.id === activePageId ? 'selected' : ''}>${p.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Viewport Switchers -->
            <div class="viewport-switchers">
              <button class="viewport-btn ${activeViewport === 'desktop' ? 'active' : ''}" data-vp="desktop" title="Desktop View (100%)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </button>
              <button class="viewport-btn ${activeViewport === 'laptop' ? 'active' : ''}" data-vp="laptop" title="Laptop View (1024px)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
              </button>
              <button class="viewport-btn ${activeViewport === 'tablet' ? 'active' : ''}" data-vp="tablet" title="Tablet View (768px)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </button>
              <button class="viewport-btn ${activeViewport === 'mobile' ? 'active' : ''}" data-vp="mobile" title="Mobile View (375px)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </button>
            </div>

            <!-- Undo / Redo & Add Section -->
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button class="btn-adm btn-adm-ghost btn-adm-sm" id="btn-builder-undo" title="Undo (Ctrl+Z)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              </button>
              <button class="btn-adm btn-adm-ghost btn-adm-sm" id="btn-builder-redo" title="Redo (Ctrl+Shift+Z)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              </button>
              <button class="btn-adm btn-adm-primary btn-adm-sm" id="btn-builder-add-sec">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Add Section</span>
              </button>
            </div>

          </div>

          <!-- Canvas Viewport Frame -->
          <div class="canvas-viewport-wrapper">
            <div class="canvas-frame viewport-${activeViewport}" id="builder-canvas-frame">
              ${renderCanvasSections(page)}
            </div>
          </div>

        </div>


        <!-- ================= RIGHT PANEL: PROPERTIES INSPECTOR ================= -->
        <div class="builder-right-panel">
          <div class="builder-panel-head">
            <span class="builder-panel-title">Properties Inspector</span>
            <span style="font-size: 0.75rem; color: var(--admin-text-muted);">LIVE SYNC</span>
          </div>

          <div class="inspector-scroll-area" id="builder-inspector-content">
            ${renderInspectorProperties(page, selectedSectionId)}
          </div>
        </div>

      </div>
    `;

    attachBuilderListeners();
  }

  function renderCanvasSections(page) {
    if (!page.sections || page.sections.length === 0) {
      return `
        <div class="canvas-drop-target">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 0.5rem; opacity: 0.5;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          <div>This page has no sections yet.</div>
          <div style="font-size: 0.75rem; margin-top: 4px;">Click an element on the left to add a section.</div>
        </div>
      `;
    }

    return page.sections.map((sec, idx) => `
      <div class="canvas-section-box ${sec.id === selectedSectionId ? 'selected' : ''}" data-section-id="${sec.id}" style="${sec.visible === false ? 'opacity: 0.45; filter: grayscale(0.5);' : ''}">
        
        <!-- Section Hover Toolbar -->
        <div class="canvas-section-toolbar">
          <span style="font-size: 0.7rem; color: #ffffff; padding: 0 6px; font-weight: 600;">${sec.name || sec.type}</span>
          <button class="canvas-tool-btn btn-sec-move-up" data-section-id="${sec.id}" title="Move Up" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}>▲</button>
          <button class="canvas-tool-btn btn-sec-move-down" data-section-id="${sec.id}" title="Move Down" ${idx === page.sections.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>▼</button>
          <button class="canvas-tool-btn btn-sec-dup" data-section-id="${sec.id}" title="Duplicate">❐</button>
          <button class="canvas-tool-btn btn-sec-hide" data-section-id="${sec.id}" title="${sec.visible === false ? 'Show' : 'Hide'}">${sec.visible === false ? '👁' : '🚫'}</button>
          <button class="canvas-tool-btn danger btn-sec-del" data-section-id="${sec.id}" title="Delete">✕</button>
        </div>

        <!-- Render Section Preview Visual -->
        ${renderSectionPreviewSnippet(sec)}
      </div>
    `).join('');
  }

  function renderSectionPreviewSnippet(sec) {
    if (sec.type === 'hero') {
      return `
        <div style="padding: 4rem 2.5rem; background: linear-gradient(135deg, #f8faf9 0%, #edf6f1 100%); border-bottom: 1px solid rgba(16,111,60,0.1);">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(16,185,129,0.1); border-radius: 99px; font-size: 0.75rem; font-weight: 700; color: #106f3c; margin-bottom: 1rem;">
            ${sec.badge || 'Next-Gen Solar'}
          </div>
          <h1 style="font-size: 2.3rem; color: #061a11; line-height: 1.15; margin-bottom: 1rem;">
            ${sec.title || 'Powering a Greener Tomorrow.'}
          </h1>
          <p style="font-size: 0.95rem; color: #4a6358; max-width: 540px; margin-bottom: 1.5rem;">
            ${sec.subtitle || 'Smart solar solutions designed to help homes and businesses generate cleaner energy.'}
          </p>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-primary" style="padding: 0.65rem 1.4rem; font-size: 0.85rem;">${sec.primaryCtaText || 'Explore Services'}</button>
            <button class="btn btn-secondary" style="padding: 0.65rem 1.4rem; font-size: 0.85rem;">${sec.secondaryCtaText || 'Get Consultation'}</button>
          </div>
        </div>
      `;
    }

    if (sec.type === 'statistics') {
      return `
        <div style="padding: 2.5rem; background: #061a11; color: #ffffff; text-align: center;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;">
            ${(sec.items || [
              { label: 'Experience', value: '10+' },
              { label: 'Installations', value: '500+' },
              { label: 'Clean Energy', value: '1.8 MW+' },
              { label: 'Sustainable', value: '100%' }
            ]).map(it => `
              <div>
                <div style="font-size: 1.8rem; font-weight: 800; color: #34d399;">${it.value}${it.suffix || ''}</div>
                <div style="font-size: 0.75rem; color: #9ab4a7;">${it.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (sec.type === 'features') {
      return `
        <div style="padding: 3.5rem 2.5rem; background: #ffffff;">
          <div style="text-align: center; max-width: 600px; margin: 0 auto 2rem auto;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #106f3c; text-transform: uppercase;">${sec.tag || 'Features'}</span>
            <h2 style="font-size: 1.8rem; color: #061a11; margin-top: 4px;">${sec.title || 'Why Solar?'}</h2>
            <p style="font-size: 0.85rem; color: #5e776a;">${sec.subtitle || ''}</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            ${(sec.cards || [
              { title: 'Lower Electricity Costs', description: 'Lock in predictable rates.' },
              { title: 'Clean Energy', description: 'Zero carbon footprint.' }
            ]).map(c => `
              <div style="padding: 1.25rem; border: 1px solid rgba(16,111,60,0.1); border-radius: 12px; background: #fdfefe;">
                <strong style="font-size: 0.95rem; color: #061a11;">${c.title}</strong>
                <p style="font-size: 0.8rem; color: #5e776a; margin-top: 4px;">${c.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (sec.type === 'cta') {
      return `
        <div style="padding: 3rem 2rem; background: linear-gradient(135deg, #061a11 0%, #0d3a22 100%); color: #ffffff; text-align: center;">
          <h2 style="font-size: 1.8rem; color: #ffffff; margin-bottom: 0.5rem;">${sec.title || 'Ready to Switch?'}</h2>
          <p style="font-size: 0.85rem; color: #9ab4a7; max-width: 500px; margin: 0 auto 1.5rem auto;">${sec.subtitle || ''}</p>
          <button class="btn btn-gold" style="padding: 0.65rem 1.5rem; font-size: 0.85rem;">${sec.buttonText || 'Talk to Experts'}</button>
        </div>
      `;
    }

    // Default Generic Section View
    return `
      <div style="padding: 3rem 2.5rem; background: #f8faf9; border-bottom: 1px solid rgba(0,0,0,0.06);">
        <span style="font-size: 0.75rem; font-weight: 700; color: #106f3c; text-transform: uppercase;">${sec.tag || sec.name}</span>
        <h3 style="font-size: 1.5rem; color: #061a11; margin-top: 4px;">${sec.title || sec.name}</h3>
        <p style="font-size: 0.88rem; color: #4a6358; margin-top: 6px;">${sec.subtitle || 'Configured through visual inspector properties.'}</p>
      </div>
    `;
  }

  function renderInspectorProperties(page, sectionId) {
    const sec = page.sections?.find((s) => s.id === sectionId);
    if (!sec) {
      return `
        <div style="color: var(--admin-text-muted); font-size: 0.85rem; text-align: center; padding: 2rem 0;">
          Select a section on the canvas to inspect and edit its properties.
        </div>
      `;
    }

    return `
      <!-- Section Identity -->
      <div class="inspector-accordion-group">
        <div class="inspector-group-title">Section Overview</div>
        
        <div class="adm-form-group">
          <label class="adm-label">Section Name</label>
          <input type="text" id="prop-sec-name" class="adm-input" value="${sec.name || ''}" />
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem;">
          <span style="font-size: 0.82rem; color: var(--admin-text-secondary); font-weight: 500;">Visible on Website</span>
          <label class="adm-switch">
            <input type="checkbox" id="prop-sec-visible" ${sec.visible !== false ? 'checked' : ''} />
            <span class="adm-slider-switch"></span>
          </label>
        </div>
      </div>

      <!-- Typography & Content -->
      <div class="inspector-accordion-group">
        <div class="inspector-group-title">Content & Copy</div>
        
        ${sec.tag !== undefined ? `
          <div class="adm-form-group">
            <label class="adm-label">Tagline Badge</label>
            <input type="text" id="prop-sec-tag" class="adm-input" value="${sec.tag || ''}" />
          </div>
        ` : ''}

        ${sec.badge !== undefined ? `
          <div class="adm-form-group">
            <label class="adm-label">Pill Badge</label>
            <input type="text" id="prop-sec-badge" class="adm-input" value="${sec.badge || ''}" />
          </div>
        ` : ''}

        ${sec.title !== undefined ? `
          <div class="adm-form-group">
            <label class="adm-label">Main Heading (Title)</label>
            <input type="text" id="prop-sec-title" class="adm-input" value="${sec.title || ''}" />
          </div>
        ` : ''}

        ${sec.subtitle !== undefined ? `
          <div class="adm-form-group">
            <label class="adm-label">Subtitle / Description</label>
            <textarea id="prop-sec-subtitle" class="adm-textarea">${sec.subtitle || ''}</textarea>
          </div>
        ` : ''}
      </div>

      <!-- Buttons & CTAs -->
      ${sec.primaryCtaText !== undefined ? `
        <div class="inspector-accordion-group">
          <div class="inspector-group-title">Call to Action Buttons</div>
          
          <div class="adm-form-group">
            <label class="adm-label">Primary Button Text</label>
            <input type="text" id="prop-sec-cta1-text" class="adm-input" value="${sec.primaryCtaText || ''}" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Primary Button Link</label>
            <input type="text" id="prop-sec-cta1-link" class="adm-input" value="${sec.primaryCtaLink || ''}" />
          </div>

          ${sec.secondaryCtaText !== undefined ? `
            <div class="adm-form-group">
              <label class="adm-label">Secondary Button Text</label>
              <input type="text" id="prop-sec-cta2-text" class="adm-input" value="${sec.secondaryCtaText || ''}" />
            </div>
            <div class="adm-form-group">
              <label class="adm-label">Secondary Button Link</label>
              <input type="text" id="prop-sec-cta2-link" class="adm-input" value="${sec.secondaryCtaLink || ''}" />
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- 3D & Animation Overrides -->
      <div class="inspector-accordion-group">
        <div class="inspector-group-title">3D & Micro-Animations</div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <span style="font-size: 0.82rem; color: var(--admin-text-secondary); font-weight: 500;">Enable 3D Scene</span>
          <label class="adm-switch">
            <input type="checkbox" id="prop-sec-3d" ${sec.show3dScene !== false ? 'checked' : ''} />
            <span class="adm-slider-switch"></span>
          </label>
        </div>

        <div class="adm-form-group">
          <label class="adm-label">Scroll Reveal Trigger</label>
          <select id="prop-sec-anim-trigger" class="adm-select">
            <option value="fade-up">Fade Up & In</option>
            <option value="float-anti-gravity">Anti-Gravity Levitation</option>
            <option value="3d-tilt">3D Interactive Tilt</option>
            <option value="scale-zoom">Scale Zoom</option>
          </select>
        </div>
      </div>
    `;
  }

  function attachBuilderListeners() {
    const page = getActivePage();

    // Page Selector Change
    document.getElementById('builder-page-select')?.addEventListener('change', (e) => {
      activePageId = e.target.value;
      selectedSectionId = null;
      render();
    });

    // Viewport Switcher Buttons
    container.querySelectorAll('.viewport-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeViewport = btn.dataset.vp;
        render();
      });
    });

    // Undo / Redo
    document.getElementById('btn-builder-undo')?.addEventListener('click', () => {
      if (cmsStore.undo()) {
        toast.info('Undone last action');
        render();
      }
    });

    document.getElementById('btn-builder-redo')?.addEventListener('click', () => {
      if (cmsStore.redo()) {
        toast.info('Redone action');
        render();
      }
    });

    // Add Section Button
    document.getElementById('btn-builder-add-sec')?.addEventListener('click', () => {
      modal.open(`
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <h3 style="font-size: 1.35rem;">Add New Section</h3>
          <div class="adm-form-group">
            <label class="adm-label">Choose Section Type</label>
            <select id="modal-sec-type-select" class="adm-select">
              <option value="hero">3D Hero Section</option>
              <option value="statistics">Statistics Banner</option>
              <option value="features">3D Tilt Features Cards</option>
              <option value="calculator">Solar Savings Calculator</option>
              <option value="services-preview">Services Grid Preview</option>
              <option value="projects-preview">Projects Portfolio Preview</option>
              <option value="cta">Call to Action Banner</option>
            </select>
          </div>
          <div class="adm-form-group">
            <label class="adm-label">Section Title</label>
            <input type="text" id="modal-sec-title-in" class="adm-input" placeholder="e.g. Next-Generation Solar Architecture" />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button class="btn-adm btn-adm-secondary" onclick="document.getElementById('admin-dynamic-modal').classList.remove('active')">Cancel</button>
            <button class="btn-adm btn-adm-primary" id="btn-modal-add-sec-confirm">Add to Page</button>
          </div>
        </div>
      `, '480px');

      document.getElementById('btn-modal-add-sec-confirm')?.addEventListener('click', () => {
        const type = document.getElementById('modal-sec-type-select')?.value;
        const title = document.getElementById('modal-sec-title-in')?.value || 'New Section';
        cmsStore.addSectionToPage(activePageId, {
          type,
          name: title,
          title,
          subtitle: 'Configured through visual builder.'
        });
        modal.close();
        toast.success('Section added to page');
        render();
      });
    });

    // Draggable element cards in Left Panel
    container.querySelectorAll('.element-card-draggable').forEach((card) => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        const names = {
          'hero': '3D Hero Section',
          'statistics': 'Statistics Banner',
          'features': '3D Tilt Features',
          'calculator': 'Solar Calculator',
          'services-preview': 'Services Grid',
          'projects-preview': 'Projects Showcase',
          'cta': 'CTA Banner',
          'how-solar-works': 'How Solar Works Pipeline'
        };
        cmsStore.addSectionToPage(activePageId, {
          type,
          name: names[type] || 'New Section',
          title: names[type] || 'New Section',
          subtitle: 'Configurable section for Green Bridge Energy.'
        });
        toast.success(`Added ${names[type]} to page`);
        render();
      });
    });

    // Section Selection on Canvas
    container.querySelectorAll('.canvas-section-box').forEach((box) => {
      box.addEventListener('click', (e) => {
        if (e.target.closest('.canvas-section-toolbar')) return; // Don't trigger if clicked tool button
        selectedSectionId = box.dataset.sectionId;
        render();
      });
    });

    // Section Toolbars: Move Up, Move Down, Duplicate, Hide, Delete
    container.querySelectorAll('.btn-sec-move-up').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.dataset.sectionId;
        const sIdx = page.sections.findIndex((s) => s.id === secId);
        if (sIdx > 0) {
          const ids = page.sections.map((s) => s.id);
          const temp = ids[sIdx - 1];
          ids[sIdx - 1] = ids[sIdx];
          ids[sIdx] = temp;
          cmsStore.reorderSections(activePageId, ids);
          render();
        }
      });
    });

    container.querySelectorAll('.btn-sec-move-down').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.dataset.sectionId;
        const sIdx = page.sections.findIndex((s) => s.id === secId);
        if (sIdx < page.sections.length - 1) {
          const ids = page.sections.map((s) => s.id);
          const temp = ids[sIdx + 1];
          ids[sIdx + 1] = ids[sIdx];
          ids[sIdx] = temp;
          cmsStore.reorderSections(activePageId, ids);
          render();
        }
      });
    });

    container.querySelectorAll('.btn-sec-dup').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.dataset.sectionId;
        cmsStore.duplicateSection(activePageId, secId);
        toast.success('Section duplicated');
        render();
      });
    });

    container.querySelectorAll('.btn-sec-hide').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.dataset.sectionId;
        const sec = page.sections.find((s) => s.id === secId);
        if (sec) {
          cmsStore.updateSection(activePageId, secId, { visible: !sec.visible });
          render();
        }
      });
    });

    container.querySelectorAll('.btn-sec-del').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.dataset.sectionId;
        modal.confirm({
          title: 'Delete Section?',
          message: 'Are you sure you want to remove this section from the page?',
          confirmText: 'Delete',
          isDanger: true,
          onConfirm: () => {
            cmsStore.deleteSection(activePageId, secId);
            selectedSectionId = null;
            toast.warning('Section removed');
            render();
          }
        });
      });
    });

    // Properties Inspector Live Input Sync
    const nameIn = document.getElementById('prop-sec-name');
    nameIn?.addEventListener('input', (e) => {
      cmsStore.updateSection(activePageId, selectedSectionId, { name: e.target.value }, false);
    });

    const visibleIn = document.getElementById('prop-sec-visible');
    visibleIn?.addEventListener('change', (e) => {
      cmsStore.updateSection(activePageId, selectedSectionId, { visible: e.target.checked });
      render();
    });

    const tagIn = document.getElementById('prop-sec-tag');
    tagIn?.addEventListener('input', (e) => {
      cmsStore.updateSection(activePageId, selectedSectionId, { tag: e.target.value }, false);
    });

    const badgeIn = document.getElementById('prop-sec-badge');
    badgeIn?.addEventListener('input', (e) => {
      cmsStore.updateSection(activePageId, selectedSectionId, { badge: e.target.value }, false);
    });

    const titleIn = document.getElementById('prop-sec-title');
    titleIn?.addEventListener('input', (e) => {
      cmsStore.updateSection(activePageId, selectedSectionId, { title: e.target.value }, false);
    });

    const subIn = document.getElementById('prop-sec-subtitle');
    subIn?.addEventListener('input', (e) => {
      cmsStore.updateSection(activePageId, selectedSectionId, { subtitle: e.target.value }, false);
    });

    const cta1TextIn = document.getElementById('prop-sec-cta1-text');
    cta1TextIn?.addEventListener('input', (e) => {
      cmsStore.updateSection(activePageId, selectedSectionId, { primaryCtaText: e.target.value }, false);
    });

    const cta1LinkIn = document.getElementById('prop-sec-cta1-link');
    cta1LinkIn?.addEventListener('input', (e) => {
      cmsStore.updateSection(activePageId, selectedSectionId, { primaryCtaLink: e.target.value }, false);
    });
  }

  // Keyboard shortcut listener for Undo / Redo in Page Builder
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      if (e.shiftKey) {
        if (cmsStore.redo()) render();
      } else {
        if (cmsStore.undo()) render();
      }
    }
  });

  render();
}
