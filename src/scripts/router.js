import { initHeroScene } from './three/heroScene.js';
import { initGlobeScene } from './three/globeScene.js';
import { initContactScene } from './three/contactScene.js';
import { initCounters } from './components/counter.js';
import { initTilt } from './components/tilt.js';
import { initCalculator } from './components/calculator.js';
import { initEnergyFlow } from './components/energyFlow.js';
import { initProjects } from './components/projects.js';
import { initContactForm } from './components/contactForm.js';

export function initRouter() {
  const pages = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-nav-link');

  let activeScene = null; // Can hold hero, globe, or contact scene with .destroy()
  let currentRoute = null;

  function cleanupCurrentScene() {
    if (activeScene && typeof activeScene.destroy === 'function') {
      try {
        activeScene.destroy();
      } catch (e) {
        console.warn('Scene cleanup warning:', e);
      }
      activeScene = null;
    }
  }

  function handleRoute() {
    const hash = window.location.hash.toLowerCase() || '#home';
    const cleanRoute = hash.replace('#', '') || 'home';

    if (currentRoute === cleanRoute && activeScene) {
      return;
    }

    currentRoute = cleanRoute;

    // 1. Destroy and dispose any previous 3D WebGL scene to free GPU & memory
    cleanupCurrentScene();

    let targetPage = document.getElementById(`page-${cleanRoute}`);
    if (!targetPage) {
      targetPage = document.getElementById('page-home');
    }

    // 2. Hide all pages, activate target page
    pages.forEach((p) => {
      p.classList.remove('active');
    });

    if (targetPage) {
      targetPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // 3. Update active nav links
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${cleanRoute}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 4. Clean and reinitialize 3D scene after DOM paint (ensures non-zero container dimensions)
    requestAnimationFrame(() => {
      if (cleanRoute === 'home') {
        const heroContainer = document.getElementById('hero-3d-canvas');
        if (heroContainer) {
          heroContainer.innerHTML = '';
          activeScene = initHeroScene(heroContainer);
        }
      } else if (cleanRoute === 'about') {
        const globeContainer = document.getElementById('about-globe-canvas');
        if (globeContainer) {
          globeContainer.innerHTML = '';
          activeScene = initGlobeScene(globeContainer);
        }
      } else if (cleanRoute === 'contact') {
        const contactContainer = document.getElementById('contact-3d-canvas');
        if (contactContainer) {
          contactContainer.innerHTML = '';
          activeScene = initContactScene(contactContainer);
          initContactForm(activeScene);
        }
      }

      // 5. Re-trigger page enhancements
      initCounters();
      initTilt();
      if (cleanRoute === 'home') initCalculator();
      if (cleanRoute === 'services') initEnergyFlow();
      if (cleanRoute === 'projects') initProjects();
    });
  }

  window.addEventListener('hashchange', handleRoute);
  
  // Initial route trigger
  handleRoute();
}
