import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import * as THREE from 'three';

export function renderAnimationStudioView(container) {
  if (!container) return;

  const anim = cmsStore.data.animations;
  let simScene = null;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Animation Studio & 3D Controls</h1>
        <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
          Calibrate real-time anti-gravity physics, photon particle density, rotational inertia, and mouse parallax.
        </p>
      </div>
      <button class="btn-adm btn-adm-primary" id="btn-save-anim-settings">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Save Animation Profile</span>
      </button>
    </div>

    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; align-items: start;">
      
      <!-- Left Column: Controls & Presets -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Master Toggle & Presets Card -->
        <div class="adm-card">
          <div class="adm-card-header">
            <h3 class="adm-card-title">Anti-Gravity Engine State</h3>
            <span class="badge-status badge-published">Active Engine</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.25rem; border-bottom: 1px solid var(--admin-border-subtle); margin-bottom: 1.25rem;">
            <div>
              <strong>Enable 3D WebGL Objects & Physics</strong>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Render 3D solar arrays, levitation, and photon clouds</div>
            </div>
            <label class="adm-switch">
              <input type="checkbox" id="anim-master-3d-toggle" ${anim.enable3d ? 'checked' : ''} />
              <span class="adm-slider-switch"></span>
            </label>
          </div>

          <!-- Presets -->
          <div>
            <label class="adm-label" style="margin-bottom: 0.5rem;">Anti-Gravity Dynamics Preset</label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
              <button class="btn-adm btn-adm-sm ${anim.preset === 'subtle' ? 'btn-adm-primary' : 'btn-adm-secondary'} anim-preset-btn" data-preset="subtle">Subtle</button>
              <button class="btn-adm btn-adm-sm ${anim.preset === 'balanced' ? 'btn-adm-primary' : 'btn-adm-secondary'} anim-preset-btn" data-preset="balanced">Balanced</button>
              <button class="btn-adm btn-adm-sm ${anim.preset === 'dynamic' ? 'btn-adm-primary' : 'btn-adm-secondary'} anim-preset-btn" data-preset="dynamic">Dynamic</button>
              <button class="btn-adm btn-adm-sm ${anim.preset === 'extreme' ? 'btn-adm-primary' : 'btn-adm-secondary'} anim-preset-btn" data-preset="extreme">Extreme</button>
            </div>
          </div>
        </div>

        <!-- Fine-Tuning Physics Sliders -->
        <div class="adm-card">
          <div class="adm-card-header">
            <h3 class="adm-card-title">Particle & Anti-Gravity Parameters</h3>
            <span style="font-size: 0.75rem; color: var(--admin-accent-emerald);">Live Tuned</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <!-- Particle Density -->
            <div>
              <div class="adm-label">
                <span>Photon Particle Density</span>
                <span class="adm-range-val" id="val-particle-density">${anim.particleDensity} pts</span>
              </div>
              <div class="adm-range-wrapper">
                <input type="range" min="300" max="4000" step="100" value="${anim.particleDensity}" class="adm-range-input" id="slider-particle-density" />
              </div>
            </div>

            <!-- Floating Intensity -->
            <div>
              <div class="adm-label">
                <span>Floating Levitation Amplitude</span>
                <span class="adm-range-val" id="val-floating-intensity">${anim.floatingIntensity}x</span>
              </div>
              <div class="adm-range-wrapper">
                <input type="range" min="0.2" max="3.0" step="0.1" value="${anim.floatingIntensity}" class="adm-range-input" id="slider-floating-intensity" />
              </div>
            </div>

            <!-- Particle Drift Speed -->
            <div>
              <div class="adm-label">
                <span>Particle Velocity & Flow Speed</span>
                <span class="adm-range-val" id="val-particle-speed">${anim.particleSpeed}x</span>
              </div>
              <div class="adm-range-wrapper">
                <input type="range" min="0.2" max="3.0" step="0.1" value="${anim.particleSpeed}" class="adm-range-input" id="slider-particle-speed" />
              </div>
            </div>

            <!-- Mouse Parallax Sensitivity -->
            <div>
              <div class="adm-label">
                <span>Mouse Parallax & Gyroscopic Inertia</span>
                <span class="adm-range-val" id="val-mouse-sens">${anim.mouseSensitivity}x</span>
              </div>
              <div class="adm-range-wrapper">
                <input type="range" min="0.1" max="2.5" step="0.1" value="${anim.mouseSensitivity}" class="adm-range-input" id="slider-mouse-sens" />
              </div>
            </div>

            <!-- 3D Depth & Field of View -->
            <div>
              <div class="adm-label">
                <span>3D Depth & Spatial Layering</span>
                <span class="adm-range-val" id="val-3d-depth">${anim.threeDepth}x</span>
              </div>
              <div class="adm-range-wrapper">
                <input type="range" min="0.5" max="2.5" step="0.1" value="${anim.threeDepth}" class="adm-range-input" id="slider-3d-depth" />
              </div>
            </div>

            <!-- Glow & Energy Waves -->
            <div>
              <div class="adm-label">
                <span>Energy Wave & Glow Radiation</span>
                <span class="adm-range-val" id="val-glow-intensity">${anim.glowIntensity}x</span>
              </div>
              <div class="adm-range-wrapper">
                <input type="range" min="0.2" max="2.5" step="0.1" value="${anim.glowIntensity}" class="adm-range-input" id="slider-glow-intensity" />
              </div>
            </div>

          </div>
        </div>

      </div>


      <!-- Right Column: Live WebGL 3D Simulator -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div class="adm-card" style="padding: 0; overflow: hidden;">
          <div style="padding: 1rem 1.25rem; background: var(--admin-bg-elevated); border-bottom: 1px solid var(--admin-border-subtle); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="font-size: 0.85rem;">Live Physics Simulator</strong>
              <div style="font-size: 0.72rem; color: var(--admin-text-muted);">Interactive Three.js Anti-Gravity Sandbox</div>
            </div>
            <span class="sidebar-brand-badge" style="background: rgba(16,185,129,0.15); color: #10b981;">60 FPS</span>
          </div>

          <div id="admin-3d-sim-container" style="width: 100%; height: 380px; background: #061a11; position: relative; cursor: grab;">
            <div style="position: absolute; bottom: 12px; left: 12px; font-size: 0.75rem; color: #9ab4a7; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px; pointer-events: none;">
              Move cursor over canvas to test inertia
            </div>
          </div>
        </div>

        <!-- Accessibility / Global Toggles -->
        <div class="adm-card">
          <div class="adm-card-header">
            <h3 class="adm-card-title">Accessibility & UI Micro-Effects</h3>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>3D Card Tilt on Hover</strong>
                <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Specular cursor sheen on cards</div>
              </div>
              <label class="adm-switch">
                <input type="checkbox" id="toggle-card-tilt" ${anim.cardTilt ? 'checked' : ''} />
                <span class="adm-slider-switch"></span>
              </label>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>Reduced Motion Fallback</strong>
                <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Respect OS prefers-reduced-motion</div>
              </div>
              <label class="adm-switch">
                <input type="checkbox" id="toggle-reduced-motion" ${anim.reducedMotion ? 'checked' : ''} />
                <span class="adm-slider-switch"></span>
              </label>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  // Initialize Live WebGL Simulator
  initSimulator();

  // Attach Listeners
  attachListeners();

  function initSimulator() {
    const simBox = document.getElementById('admin-3d-sim-container');
    if (!simBox) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, simBox.clientWidth / simBox.clientHeight, 0.1, 50);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(simBox.clientWidth, simBox.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    simBox.innerHTML = '';
    simBox.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);
    const sun = new THREE.DirectionalLight(0xf59e0b, 3.0);
    sun.position.set(3, 4, 3);
    scene.add(sun);

    // Center 3D Floating Solar Panel
    const pGeo = new THREE.BoxGeometry(2.0, 1.2, 0.05);
    const pMat = new THREE.MeshStandardMaterial({
      color: 0x092218,
      metalness: 0.8,
      roughness: 0.2
    });
    const panel = new THREE.Mesh(pGeo, pMat);
    group.add(panel);

    // Edge wire
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(pGeo),
      new THREE.LineBasicMaterial({ color: 0x10b981 })
    );
    panel.add(edge);

    // Particle Cloud
    let pCount = Math.min(anim.particleDensity, 1200);
    const particleGeo = new THREE.BufferGeometry();
    let pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 1.2 + Math.random() * 2.5;
      const t = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      pPos[i * 3] = r * Math.sin(ph) * Math.cos(t);
      pPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(t) * 0.8;
      pPos[i * 3 + 2] = r * Math.cos(ph);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMatPoints = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x10b981,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, pMatPoints);
    group.add(particles);

    // Interactive mouse tracking in sim
    let mouseX = 0, mouseY = 0;
    simBox.addEventListener('mousemove', (e) => {
      const rect = simBox.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    });

    let clock = new THREE.Clock();
    let animId = null;

    function loop() {
      animId = requestAnimationFrame(loop);
      const elapsed = clock.getElapsedTime();

      const speed = cmsStore.data.animations.particleSpeed || 1.0;
      const levitation = cmsStore.data.animations.floatingIntensity || 1.2;
      const sens = cmsStore.data.animations.mouseSensitivity || 1.0;

      // Group mouse parallax
      group.rotation.y += (mouseX * 0.5 * sens - group.rotation.y) * 0.05;
      group.rotation.x += (-mouseY * 0.4 * sens - group.rotation.x) * 0.05;

      // Floating panel
      panel.position.y = Math.sin(elapsed * 1.5 * speed) * (0.15 * levitation);
      panel.rotation.z = Math.cos(elapsed * 1.0 * speed) * 0.05;

      // Orbit particles
      particles.rotation.y = elapsed * 0.2 * speed;

      renderer.render(scene, camera);
    }
    loop();

    simScene = {
      destroy: () => {
        if (animId) cancelAnimationFrame(animId);
        renderer.dispose();
      }
    };
  }

  function attachListeners() {
    // Preset Buttons
    container.querySelectorAll('.anim-preset-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        const presets = {
          subtle: { particleDensity: 800, particleSpeed: 0.6, floatingIntensity: 0.6, mouseSensitivity: 0.6, glowIntensity: 0.6 },
          balanced: { particleDensity: 1800, particleSpeed: 1.0, floatingIntensity: 1.2, mouseSensitivity: 1.0, glowIntensity: 1.0 },
          dynamic: { particleDensity: 2600, particleSpeed: 1.6, floatingIntensity: 1.8, mouseSensitivity: 1.5, glowIntensity: 1.5 },
          extreme: { particleDensity: 3600, particleSpeed: 2.2, floatingIntensity: 2.5, mouseSensitivity: 2.0, glowIntensity: 2.0 }
        };
        const pValues = presets[preset];
        cmsStore.updateAnimations({ preset, ...pValues });
        toast.info(`Applied "${preset.toUpperCase()}" 3D Preset`);
        renderAnimationStudioView(container);
      });
    });

    // Sliders
    const sDensity = document.getElementById('slider-particle-density');
    sDensity?.addEventListener('input', (e) => {
      document.getElementById('val-particle-density').textContent = `${e.target.value} pts`;
      cmsStore.updateAnimations({ particleDensity: parseInt(e.target.value) });
    });

    const sFloat = document.getElementById('slider-floating-intensity');
    sFloat?.addEventListener('input', (e) => {
      document.getElementById('val-floating-intensity').textContent = `${e.target.value}x`;
      cmsStore.updateAnimations({ floatingIntensity: parseFloat(e.target.value) });
    });

    const sSpeed = document.getElementById('slider-particle-speed');
    sSpeed?.addEventListener('input', (e) => {
      document.getElementById('val-particle-speed').textContent = `${e.target.value}x`;
      cmsStore.updateAnimations({ particleSpeed: parseFloat(e.target.value) });
    });

    const sSens = document.getElementById('slider-mouse-sens');
    sSens?.addEventListener('input', (e) => {
      document.getElementById('val-mouse-sens').textContent = `${e.target.value}x`;
      cmsStore.updateAnimations({ mouseSensitivity: parseFloat(e.target.value) });
    });

    const sDepth = document.getElementById('slider-3d-depth');
    sDepth?.addEventListener('input', (e) => {
      document.getElementById('val-3d-depth').textContent = `${e.target.value}x`;
      cmsStore.updateAnimations({ threeDepth: parseFloat(e.target.value) });
    });

    const sGlow = document.getElementById('slider-glow-intensity');
    sGlow?.addEventListener('input', (e) => {
      document.getElementById('val-glow-intensity').textContent = `${e.target.value}x`;
      cmsStore.updateAnimations({ glowIntensity: parseFloat(e.target.value) });
    });

    // Save Button
    document.getElementById('btn-save-anim-settings')?.addEventListener('click', () => {
      cmsStore.saveData(true);
      toast.success('Saved 3D Animation Profile!');
    });
  }
}
