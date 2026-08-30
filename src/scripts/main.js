import { initAmbientParticles } from './three/ambientBg.js';
import { initNavbar } from './components/navbar.js';
import { initRouter } from './router.js';
import { initCalculator } from './components/calculator.js';
import { initEnergyFlow } from './components/energyFlow.js';
import { initProjects } from './components/projects.js';
import { initCMSHydration } from './cmsHydration.js';
import { initEditorBridge } from './editorBridge.js';

document.addEventListener('DOMContentLoaded', () => {
  // 0. Dynamic CMS Hydration & Editor Bridge
  initCMSHydration();
  initEditorBridge();
  // 1. Ambient floating energy canvas
  const ambientCanvas = document.getElementById('ambient-canvas');
  if (ambientCanvas) {
    initAmbientParticles(ambientCanvas);
  }

  // 2. Sticky Glass Navbar & Modals
  initNavbar();

  // 3. Client SPA Router (handles all 5 pages & 3D WebGL scenes)
  initRouter();

  // 4. Custom cursor follower / subtle glow
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorGlow = document.querySelector('.cursor-glow');

  if (cursorDot && cursorGlow && window.innerWidth > 1024) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    function renderCursor() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();
  }
});
