// Dynamic CMS Hydration Engine for Public Website
// Consumes published CMS data safely without altering existing 3D WebGL scenes or CSS layouts.

const PUBLISHED_KEY = 'gpe_cms_data_published';
const DRAFT_KEY = 'gpe_cms_data_v2';

export const GPE_ELEMENT_MAPPINGS = [
  // Global & Branding
  { sel: '.brand-title', key: 'global.branding.companyName' },
  { sel: '.brand-tagline', key: 'global.branding.tagline' },
  { sel: '.footer-bottom-bar div:first-child', key: 'global.nav.copyright' },

  // Home Page Hero
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
  { sel: '#page-about .section-title', key: 'about.hero.title' },
  { sel: '#page-about .section-subtitle', key: 'about.hero.subtitle' },

  // Page: Services
  { sel: '#page-services .section-title', key: 'services.hero.title' },
  { sel: '#page-services .section-subtitle', key: 'services.hero.subtitle' },

  // Page: Projects
  { sel: '#page-projects .section-title', key: 'projects.hero.title' },
  { sel: '#page-projects .section-subtitle', key: 'projects.hero.subtitle' },

  // Page: Contact
  { sel: '#page-contact .section-title', key: 'contact.hero.title' },
  { sel: '#page-contact .section-subtitle', key: 'contact.hero.subtitle' }
];

export function initCMSHydration() {
  const urlParams = new URLSearchParams(window.location.search);
  const isPreviewMode = urlParams.get('preview') === 'true' || urlParams.get('editor') === 'true' || window.self !== window.top;

  // Ensure DOM elements are tagged with data-gpe-key
  GPE_ELEMENT_MAPPINGS.forEach(({ sel, key }) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.getAttribute('data-gpe-key')) {
        el.setAttribute('data-gpe-key', key);
      }
    });
  });

  function loadActiveData() {
    try {
      const key = isPreviewMode ? DRAFT_KEY : PUBLISHED_KEY;
      const stored = localStorage.getItem(key) || localStorage.getItem(DRAFT_KEY) || localStorage.getItem(PUBLISHED_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('CMS Hydration data parse warning:', e);
    }
    return null;
  }

  function applyData(data) {
    if (!data) return;

    // Persist in local storage on this port (5174) for offline/reloads
    try {
      if (data.meta?.status === 'published') {
        localStorage.setItem(PUBLISHED_KEY, JSON.stringify(data));
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) {
      // Ignored
    }

    // 1. Currency Configuration
    if (data.currency) {
      window.GPE_CURRENCY = data.currency;
      if (typeof window.GPE_RECALCULATE_CALC === 'function') {
        window.GPE_RECALCULATE_CALC();
      }
    }

    // 2. Granular Element Dictionary Hydration
    if (data.elements && typeof data.elements === 'object') {
      // Direct data-gpe-key matching
      Object.entries(data.elements).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        const targetEl = document.querySelector(`[data-gpe-key="${key}"]`);
        if (targetEl) {
          if (key === 'home.hero.title' && value.includes('.')) {
            const parts = value.split('.');
            targetEl.innerHTML = `${parts[0]} <span class="hero-title-highlight">${parts.slice(1).join('.')}</span>`;
          } else {
            targetEl.textContent = value;
          }
        }
      });

      // Also hydrate via selector mapping in case elements were freshly loaded
      GPE_ELEMENT_MAPPINGS.forEach(({ sel, key }) => {
        const val = data.elements[key];
        if (val !== undefined && val !== null) {
          document.querySelectorAll(sel).forEach((el) => {
            if (key === 'home.hero.title' && val.includes('.')) {
              const parts = val.split('.');
              el.innerHTML = `${parts[0]} <span class="hero-title-highlight">${parts.slice(1).join('.')}</span>`;
            } else {
              el.textContent = val;
            }
          });
        }
      });
    }

    // 3. Section Order Hydration
    if (data.sectionOrder && typeof data.sectionOrder === 'object') {
      Object.entries(data.sectionOrder).forEach(([pId, orderedIds]) => {
        if (Array.isArray(orderedIds)) {
          const pageContainer = document.getElementById(pId) || (pId === 'page-home' ? document.querySelector('main') : null);
          if (pageContainer) {
            orderedIds.forEach((secId) => {
              const secEl = document.getElementById(secId);
              if (secEl) pageContainer.appendChild(secEl);
            });
          }
        }
      });
    }

    // 4. Global Branding Fallbacks
    if (data.branding) {
      const brandTitles = document.querySelectorAll('.brand-title');
      const brandTags = document.querySelectorAll('.brand-tagline');
      brandTitles.forEach((el) => {
        if (data.branding.companyName) {
          el.textContent = data.branding.companyName.toUpperCase();
        }
      });
      brandTags.forEach((el) => {
        if (data.branding.tagline) {
          el.textContent = data.branding.tagline.toUpperCase();
        }
      });
    }

    // 5. Global Footer Copyright Fallback
    if (data.navigation?.copyright) {
      const footerBottom = document.querySelector('.footer-bottom-bar div:first-child');
      if (footerBottom) {
        footerBottom.textContent = data.navigation.copyright;
      }
    }
  }

  // Initial load & apply
  const initialData = loadActiveData();
  if (initialData) {
    applyData(initialData);
  }

  // Listen for real-time live iframe postMessages from visual editor
  window.addEventListener('message', (event) => {
    if (event.data) {
      const { type, data } = event.data;
      if (type === 'GPE_CMS_LIVE_PREVIEW' || type === 'GPE_PUBLISH_TO_PUBLIC') {
        applyData(data);
      }
    }
  });

  // Listen to storage events across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === PUBLISHED_KEY || e.key === DRAFT_KEY) {
      applyData(loadActiveData());
    }
  });
}
