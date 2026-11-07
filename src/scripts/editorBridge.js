// Green Bridge Energy - Visual Editor Iframe Bridge
// Activates when loaded inside the Admin Visual Theme Editor or with ?editor=true

export function initEditorBridge() {
  const urlParams = new URLSearchParams(window.location.search);
  const isEditor = urlParams.get('editor') === 'true' || window.self !== window.top;
  if (!isEditor) return;

  // Add visual editor CSS overlay styles into the iframe
  const styleEl = document.createElement('style');
  styleEl.id = 'gpe-editor-bridge-styles';
  styleEl.textContent = `
    [data-gpe-key] {
      cursor: text !important;
      position: relative;
      transition: outline 0.15s ease, background 0.15s ease;
    }
    [data-gpe-key]:hover {
      outline: 2px dashed rgba(16, 185, 129, 0.75) !important;
      outline-offset: 3px;
      background: rgba(16, 185, 129, 0.08) !important;
    }
    [data-gpe-key]:focus {
      outline: 2px solid #10b981 !important;
      outline-offset: 3px;
      background: rgba(16, 185, 129, 0.12) !important;
    }
    .gpe-element-selected {
      outline: 2px solid #10b981 !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.4) !important;
    }
    .gpe-section-active {
      outline: 2px solid #10b981 !important;
      outline-offset: -2px !important;
      position: relative;
    }
    .gpe-canvas-drop-line-above {
      border-top: 4px solid #10b981 !important;
      box-shadow: 0 -4px 12px rgba(16, 185, 129, 0.6) !important;
    }
    .gpe-canvas-drop-line-below {
      border-bottom: 4px solid #10b981 !important;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6) !important;
    }
    .gpe-sec-drag-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: #10b981;
      color: #061a11;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      cursor: grab;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      user-select: none;
      display: none;
    }
    section:hover > .gpe-sec-drag-badge, .hero-section:hover > .gpe-sec-drag-badge {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `;
  document.head.appendChild(styleEl);

  // Map of DOM element selectors to unique canonical CMS keys
  const elementKeyMappings = [
    // Global & Branding
    { sel: '.brand-title', key: 'global.branding.companyName' },
    { sel: '.brand-tagline', key: 'global.branding.tagline' },
    { sel: '.footer-bottom-bar div:first-child', key: 'global.nav.copyright' },

    // Page: Home
    { sel: '#hero-section .hero-badge-text', key: 'home.hero.badge' },
    { sel: '#hero-section .hero-title', key: 'home.hero.title' },
    { sel: '#hero-section .hero-subtitle', key: 'home.hero.subtitle' },
    { sel: '#hero-cta-explore span', key: 'home.hero.cta1Text' },
    { sel: '#hero-cta-consult span', key: 'home.hero.cta2Text' },

    // Home Partners & Metrics
    { sel: '#sec-trusted-partners .stat-item:nth-child(1) .stat-desc', key: 'home.partners.metric0Lbl' },
    { sel: '#sec-trusted-partners .stat-item:nth-child(2) .stat-desc', key: 'home.partners.metric1Lbl' },
    { sel: '#sec-trusted-partners .stat-item:nth-child(3) .stat-desc', key: 'home.partners.metric2Lbl' },
    { sel: '#sec-trusted-partners .stat-item:nth-child(4) .stat-desc', key: 'home.partners.metric3Lbl' },

    // Home Why Solar
    { sel: '#sec-why-solar .section-tag span:last-child', key: 'home.whySolar.tag' },
    { sel: '#sec-why-solar .section-title', key: 'home.whySolar.title' },
    { sel: '#sec-why-solar .section-subtitle', key: 'home.whySolar.subtitle' },
    { sel: '#sec-why-solar .why-card:nth-child(1) .why-card-title', key: 'home.whySolar.card0Title' },
    { sel: '#sec-why-solar .why-card:nth-child(1) .why-card-text', key: 'home.whySolar.card0Text' },
    { sel: '#sec-why-solar .why-card:nth-child(2) .why-card-title', key: 'home.whySolar.card1Title' },
    { sel: '#sec-why-solar .why-card:nth-child(2) .why-card-text', key: 'home.whySolar.card1Text' },
    { sel: '#sec-why-solar .why-card:nth-child(3) .why-card-title', key: 'home.whySolar.card2Title' },
    { sel: '#sec-why-solar .why-card:nth-child(3) .why-card-text', key: 'home.whySolar.card2Text' },
    { sel: '#sec-why-solar .why-card:nth-child(4) .why-card-title', key: 'home.whySolar.card3Title' },
    { sel: '#sec-why-solar .why-card:nth-child(4) .why-card-text', key: 'home.whySolar.card3Text' },

    // Home Calculator
    { sel: '#sec-calculator .section-tag span', key: 'home.calc.tag' },
    { sel: '#sec-calculator h3', key: 'home.calc.title' },
    { sel: '#sec-calculator p', key: 'home.calc.subtitle' },
    { sel: '#calc-apply-quote-btn span', key: 'home.calc.btnText' },

    // Home Services Preview
    { sel: '#sec-home-services .section-tag span:last-child', key: 'home.services.tag' },
    { sel: '#sec-home-services .section-title', key: 'home.services.title' },
    { sel: '#sec-home-services .section-subtitle', key: 'home.services.subtitle' },

    // Home Projects Preview
    { sel: '#sec-home-projects .section-tag span:last-child', key: 'home.projects.tag' },
    { sel: '#sec-home-projects .section-title', key: 'home.projects.title' },
    { sel: '#sec-home-projects .section-subtitle', key: 'home.projects.subtitle' },

    // Home CTA
    { sel: '#sec-home-cta .cta-title', key: 'home.cta.title' },
    { sel: '#sec-home-cta .cta-subtitle', key: 'home.cta.subtitle' },
    { sel: '#sec-home-cta .btn-gold span', key: 'home.cta.btnText' },

    // Page: About Us
    { sel: '#page-about .page-hero-title', key: 'about.hero.title' },
    { sel: '#page-about .page-hero-subtitle', key: 'about.hero.subtitle' },

    // Page: Services
    { sel: '#page-services .page-hero-title', key: 'services.hero.title' },
    { sel: '#page-services .page-hero-subtitle', key: 'services.hero.subtitle' },

    // Page: Projects
    { sel: '#page-projects .page-hero-title', key: 'projects.hero.title' },
    { sel: '#page-projects .page-hero-subtitle', key: 'projects.hero.subtitle' },

    // Page: Contact
    { sel: '#page-contact .page-hero-title', key: 'contact.hero.title' },
    { sel: '#page-contact .page-hero-subtitle', key: 'contact.hero.subtitle' }
  ];

  function registerEditableElements() {
    // 1. Assign explicit data-gpe-key based on mappings
    elementKeyMappings.forEach(({ sel, key }) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.setAttribute('data-gpe-key', key);
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
      });
    });

    // 2. Fallback for any other headings/paragraphs without keys
    document.querySelectorAll('h1, h2, h3, h4, .section-subtitle, .tagline').forEach((el, index) => {
      if (!el.getAttribute('data-gpe-key')) {
        const sec = el.closest('section') || el.closest('.page-view') || document.body;
        const autoKey = `${sec.id || 'sec'}.${el.tagName.toLowerCase()}_${index}`;
        el.setAttribute('data-gpe-key', autoKey);
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
      }
    });

    // 3. Attach input & click listeners to all data-gpe-key elements
    document.querySelectorAll('[data-gpe-key]').forEach((el) => {
      const key = el.getAttribute('data-gpe-key');

      // On direct typing
      el.addEventListener('input', () => {
        window.parent.postMessage({
          type: 'GPE_ELEMENT_VALUE_CHANGED',
          key: key,
          value: el.textContent,
          tagName: el.tagName.toLowerCase(),
          id: el.id
        }, '*');
      });

      // On click / focus
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.gpe-element-selected').forEach(a => a.classList.remove('gpe-element-selected'));
        el.classList.add('gpe-element-selected');

        window.parent.postMessage({
          type: 'GPE_ELEMENT_FOCUSED',
          key: key,
          value: el.textContent,
          tagName: el.tagName.toLowerCase(),
          id: el.id
        }, '*');
      });
    });

    // 4. Mark Images for replacement
    document.querySelectorAll('img').forEach((img) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        window.parent.postMessage({
          type: 'GPE_IMAGE_SELECTED',
          src: img.src,
          alt: img.alt,
          id: img.id
        }, '*');
      });
    });

    // 5. Canvas Direct Section Drag & Reorder Setup
    const homeSections = document.querySelectorAll('#page-home > section, #page-home > .hero-section');
    let draggedCanvasSec = null;

    homeSections.forEach((sec) => {
      // Add floating drag badge if missing
      if (!sec.querySelector('.gpe-sec-drag-badge')) {
        const badge = document.createElement('div');
        badge.className = 'gpe-sec-drag-badge';
        badge.innerHTML = '⠿ Reorder Section';
        badge.setAttribute('draggable', 'true');
        
        badge.addEventListener('dragstart', (e) => {
          draggedCanvasSec = sec;
          e.dataTransfer.setData('text/plain', sec.id);
          e.dataTransfer.effectAllowed = 'move';
        });

        sec.style.position = 'relative';
        sec.prepend(badge);
      }

      // Drag Over Canvas Section
      sec.addEventListener('dragover', (e) => {
        if (!draggedCanvasSec || draggedCanvasSec === sec) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const rect = sec.getBoundingClientRect();
        const isAbove = e.clientY < (rect.top + rect.height / 2);

        homeSections.forEach(s => s.classList.remove('gpe-canvas-drop-line-above', 'gpe-canvas-drop-line-below'));
        if (isAbove) sec.classList.add('gpe-canvas-drop-line-above');
        else sec.classList.add('gpe-canvas-drop-line-below');
      });

      sec.addEventListener('dragleave', () => {
        sec.classList.remove('gpe-canvas-drop-line-above', 'gpe-canvas-drop-line-below');
      });

      sec.addEventListener('drop', (e) => {
        if (!draggedCanvasSec || draggedCanvasSec === sec) return;
        e.preventDefault();
        sec.classList.remove('gpe-canvas-drop-line-above', 'gpe-canvas-drop-line-below');

        const rect = sec.getBoundingClientRect();
        const isAbove = e.clientY < (rect.top + rect.height / 2);

        const parent = sec.parentNode;
        if (isAbove) {
          parent.insertBefore(draggedCanvasSec, sec);
        } else {
          parent.insertBefore(draggedCanvasSec, sec.nextSibling);
        }

        // Calculate new ordered IDs
        const newOrderedIds = Array.from(parent.querySelectorAll(':scope > section, :scope > .hero-section'))
          .map(s => s.id)
          .filter(Boolean);

        window.parent.postMessage({
          type: 'GPE_SECTION_REORDERED',
          pageId: 'page-home',
          orderedIds: newOrderedIds
        }, '*');

        draggedCanvasSec = null;
      });

      // Section Selection on Click
      sec.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-gpe-key')) return;
        document.querySelectorAll('.gpe-section-active').forEach(a => a.classList.remove('gpe-section-active'));
        sec.classList.add('gpe-section-active');

        window.parent.postMessage({
          type: 'GPE_SECTION_SELECTED',
          sectionId: sec.id
        }, '*');
      });
    });
  }

  // Initial registration
  setTimeout(registerEditableElements, 400);

  // Handle messages from Admin Editor parent
  window.addEventListener('message', (event) => {
    const { type, key, value, data, pageId, sectionId, orderedIds } = event.data || {};

    // Live element value update from right sidebar
    if (type === 'GPE_SET_ELEMENT_VALUE' && key && value !== undefined) {
      const targetEl = document.querySelector(`[data-gpe-key="${key}"]`);
      if (targetEl && targetEl !== document.activeElement) {
        targetEl.textContent = value;
      }
    }

    // Navigation
    if (type === 'GPE_NAVIGATE_PAGE' && pageId) {
      const pageMap = {
        'page-home': '#home',
        'page-about': '#about',
        'page-services': '#services',
        'page-projects': '#projects',
        'page-contact': '#contact'
      };
      window.location.hash = pageMap[pageId] || '#home';
      setTimeout(registerEditableElements, 300);
    }

    // Reorder sections live in DOM
    if (type === 'GPE_REORDER_SECTIONS' && Array.isArray(orderedIds)) {
      const targetPageId = pageId || 'page-home';
      const pageContainer = document.getElementById(targetPageId) || (targetPageId === 'page-home' ? document.querySelector('main') : null);
      if (pageContainer) {
        orderedIds.forEach((secId) => {
          const secEl = document.getElementById(secId);
          if (secEl) pageContainer.appendChild(secEl);
        });
      }
    }

    // Scroll to section
    if (type === 'GPE_SCROLL_TO_SECTION' && sectionId) {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.querySelectorAll('.gpe-section-active').forEach(a => a.classList.remove('gpe-section-active'));
        target.classList.add('gpe-section-active');
      }
    }
  });

  // Notify parent editor that iframe is ready
  window.parent.postMessage({ type: 'GPE_IFRAME_READY' }, '*');
}
