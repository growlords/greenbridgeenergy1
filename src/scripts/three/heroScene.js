import * as THREE from 'three';

export function initHeroScene(container) {
  if (!container) return null;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Group to hold all floating anti-gravity objects
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0xdff5e9, 1.2);
  scene.add(ambientLight);

  // Primary Sun Light (Warm Solar Gold)
  const sunLight = new THREE.DirectionalLight(0xfff3d1, 3.2);
  sunLight.position.set(5, 6, 6);
  scene.add(sunLight);

  // Emerald Energy Point Light (from below)
  const emeraldLight = new THREE.PointLight(0x10b981, 4.0, 15);
  emeraldLight.position.set(-2, -3, 2);
  scene.add(emeraldLight);

  // Subtle Cyan/Teal Rim Light
  const rimLight = new THREE.DirectionalLight(0x34d399, 1.5);
  rimLight.position.set(-5, 2, -4);
  scene.add(rimLight);

  // --- 1. Procedural High-Detail Solar Panel Generator ---
  function createSolarPanel(width = 2.4, height = 1.4, depth = 0.06, cellGridX = 6, cellGridY = 4) {
    const panelGroup = new THREE.Group();

    // Aluminum Frame (Matte metallic silver/slate)
    const frameGeo = new THREE.BoxGeometry(width, height, depth);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1e2925,
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 1.0
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    panelGroup.add(frameMesh);

    // Dark Monocrystalline PV Glass Face
    const faceGeo = new THREE.PlaneGeometry(width * 0.96, height * 0.94);
    
    // Create high-tech solar cell texture canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep blue-black photovoltaic base
    ctx.fillStyle = '#061727';
    ctx.fillRect(0, 0, 512, 512);

    // Draw individual silicon cell wafers
    const cols = cellGridX;
    const rows = cellGridY;
    const cellW = 512 / cols;
    const cellH = 512 / rows;
    const gap = 3;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + gap;
        const y = r * cellH + gap;
        const w = cellW - gap * 2;
        const h = cellH - gap * 2;

        // Monocrystalline wafer cut corners
        ctx.fillStyle = '#0a2238';
        ctx.beginPath();
        const cornerCut = 6;
        ctx.moveTo(x + cornerCut, y);
        ctx.lineTo(x + w - cornerCut, y);
        ctx.lineTo(x + w, y + cornerCut);
        ctx.lineTo(x + w, y + h - cornerCut);
        ctx.lineTo(x + w - cornerCut, y + h);
        ctx.lineTo(x + cornerCut, y + h);
        ctx.lineTo(x, y + h - cornerCut);
        ctx.lineTo(x, y + cornerCut);
        ctx.closePath();
        ctx.fill();

        // Silver Busbars
        ctx.strokeStyle = 'rgba(210, 235, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.25, y);
        ctx.lineTo(x + w * 0.25, y + h);
        ctx.moveTo(x + w * 0.5, y);
        ctx.lineTo(x + w * 0.5, y + h);
        ctx.moveTo(x + w * 0.75, y);
        ctx.lineTo(x + w * 0.75, y + h);
        ctx.stroke();

        // Micro fingers (ultra fine grid lines)
        ctx.strokeStyle = 'rgba(120, 180, 220, 0.15)';
        ctx.lineWidth = 0.5;
        for (let f = 1; f < 8; f++) {
          const fy = y + (h / 8) * f;
          ctx.beginPath();
          ctx.moveTo(x, fy);
          ctx.lineTo(x + w, fy);
          ctx.stroke();
        }
      }
    }

    const solarTexture = new THREE.CanvasTexture(canvas);
    solarTexture.wrapS = THREE.RepeatWrapping;
    solarTexture.wrapT = THREE.RepeatWrapping;

    const faceMat = new THREE.MeshPhysicalMaterial({
      map: solarTexture,
      color: 0xffffff,
      metalness: 0.6,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
      transmission: 0.0
    });

    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.z = depth / 2 + 0.002;
    panelGroup.add(faceMesh);

    // Glowing border edge accent (Emerald energy trace)
    const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(width * 0.98, height * 0.96, depth * 0.5));
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.65
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    edgeLines.position.z = depth / 2 + 0.003;
    panelGroup.add(edgeLines);

    return panelGroup;
  }

  // Main floating solar installation (Primary Hero Array)
  const mainPanel = createSolarPanel(2.8, 1.7, 0.08, 6, 4);
  mainPanel.rotation.set(-0.25, 0.35, -0.05);
  mainPanel.position.set(0.4, 0.1, 0.2);
  rootGroup.add(mainPanel);

  // Floating auxiliary solar cells / sub-panels at staggered anti-gravity elevations
  const subPanels = [];
  const subConfig = [
    { scale: 0.45, pos: [-1.9, 1.2, -0.8], rot: [0.3, -0.5, 0.1], speed: 1.1, phase: 0 },
    { scale: 0.38, pos: [2.1, -1.1, -0.5], rot: [-0.2, 0.6, -0.2], speed: 0.9, phase: 1.8 },
    { scale: 0.3, pos: [-1.6, -1.3, 0.6], rot: [0.4, 0.2, 0.3], speed: 1.3, phase: 3.2 },
    { scale: 0.25, pos: [1.8, 1.4, -1.2], rot: [-0.3, -0.3, -0.1], speed: 0.75, phase: 4.5 }
  ];

  subConfig.forEach((cfg) => {
    const sub = createSolarPanel(2.2 * cfg.scale, 1.4 * cfg.scale, 0.05 * cfg.scale, 4, 3);
    sub.position.set(...cfg.pos);
    sub.rotation.set(...cfg.rot);
    sub.userData = {
      baseY: cfg.pos[1],
      baseRotX: cfg.rot[0],
      baseRotY: cfg.rot[1],
      speed: cfg.speed,
      phase: cfg.phase
    };
    rootGroup.add(sub);
    subPanels.push(sub);
  });

  // --- 2. Floating Energy Flux Orbit Rings (Glowing Ribbons) ---
  const ringGroup = new THREE.Group();
  rootGroup.add(ringGroup);

  const ringGeo = new THREE.TorusGeometry(2.3, 0.012, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.7
  });
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.55
  });

  const ring1 = new THREE.Mesh(ringGeo, ringMat1);
  ring1.rotation.x = Math.PI / 2.4;
  ring1.rotation.y = 0.3;
  ringGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(2.8, 0.008, 16, 120);
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.z = 0.5;
  ringGroup.add(ring2);

  // --- 3. 3D Sun Emitter Halo (Upper Right Backdrop) ---
  const sunCoreGeo = new THREE.SphereGeometry(0.55, 32, 32);
  const sunCoreMat = new THREE.MeshBasicMaterial({
    color: 0xfff6dd
  });
  const sunCore = new THREE.Mesh(sunCoreGeo, sunCoreMat);
  sunCore.position.set(3.2, 2.4, -3.0);
  scene.add(sunCore);

  // Sun Corona Glow
  const sunGlowGeo = new THREE.SphereGeometry(0.85, 32, 32);
  const sunGlowMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
  });
  const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
  sunCore.add(sunGlow);

  // --- 4. Floating Anti-Gravity Energy Particle System (2,000+ points) ---
  const particleCount = 1800;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  const speeds = new Float32Array(particleCount);
  const angles = new Float32Array(particleCount);
  const radii = new Float32Array(particleCount);

  const emeraldColor = new THREE.Color(0x10b981);
  const goldColor = new THREE.Color(0xf59e0b);
  const whiteColor = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Distribute in a spherical/elliptical anti-gravity envelope
    const radius = 0.8 + Math.random() * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
    positions[i3 + 2] = radius * Math.cos(phi);

    radii[i] = radius;
    angles[i] = theta;
    speeds[i] = 0.2 + Math.random() * 0.6;
    scales[i] = 0.5 + Math.random() * 1.5;

    // Color gradient mixing (65% emerald, 25% solar gold, 10% white photon)
    const rand = Math.random();
    let col = emeraldColor;
    if (rand > 0.65 && rand < 0.9) col = goldColor;
    else if (rand >= 0.9) col = whiteColor;

    colors[i3] = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle Canvas Texture for soft round glowing orbs
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 64;
  pCanvas.height = 64;
  const pCtx = pCanvas.getContext('2d');
  const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.8)');
  grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 64, 64);
  const pTexture = new THREE.CanvasTexture(pCanvas);

  const particleMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    map: pTexture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  rootGroup.add(particleSystem);

  // --- 5. Floating Eco Leaf Elements (Subtle Anti-Gravity) ---
  const leafGroup = new THREE.Group();
  rootGroup.add(leafGroup);

  const leafGeo = new THREE.ConeGeometry(0.08, 0.22, 5);
  leafGeo.scale(1, 1, 0.3); // Flatten into leaf
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75
  });

  const leaves = [];
  for (let l = 0; l < 12; l++) {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    const lx = (Math.random() - 0.5) * 5.5;
    const ly = (Math.random() - 0.5) * 4.0;
    const lz = (Math.random() - 0.5) * 3.0;
    leaf.position.set(lx, ly, lz);
    leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    leaf.userData = {
      baseY: ly,
      speed: 0.6 + Math.random() * 0.8,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.03
    };
    leafGroup.add(leaf);
    leaves.push(leaf);
  }

  // --- 6. Mouse Tracking & Cursor Inertia ---
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let targetPosX = 0;
  let targetPosY = 0;

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    mouseX = x;
    mouseY = y;

    targetRotY = mouseX * 0.35;
    targetRotX = -mouseY * 0.25;
    targetPosX = mouseX * 0.4;
    targetPosY = mouseY * 0.25;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Handle Resize
  function onResize() {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;

    // Adjust camera distance for mobile screens
    if (width < 768) {
      camera.position.set(0, 0, 9.5);
      mainPanel.scale.set(0.8, 0.8, 0.8);
    } else {
      camera.position.set(0, 0, 7.5);
      mainPanel.scale.set(1.0, 1.0, 1.0);
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onResize);
  onResize(); // Initial setup

  // --- 7. Animation Loop with Realistic Anti-Gravity & Inertia ---
  let clock = new THREE.Clock();
  let animationFrameId = null;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth inertial lerp for root group
    rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.045;
    rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.045;
    rootGroup.position.x += (targetPosX - rootGroup.position.x) * 0.04;
    rootGroup.position.y += (targetPosY - rootGroup.position.y) * 0.04;

    // Primary Solar Panel Harmonic Anti-Gravity Floating
    mainPanel.position.y = 0.1 + Math.sin(elapsedTime * 0.9) * 0.12;
    mainPanel.rotation.z = -0.05 + Math.cos(elapsedTime * 0.7) * 0.03;
    mainPanel.rotation.x = -0.25 + Math.sin(elapsedTime * 0.8) * 0.02;

    // Sub-panels floating with harmonic offsets
    subPanels.forEach((sub) => {
      const u = sub.userData;
      sub.position.y = u.baseY + Math.sin(elapsedTime * u.speed + u.phase) * 0.18;
      sub.rotation.y = u.baseRotY + Math.cos(elapsedTime * 0.6 + u.phase) * 0.08;
      sub.rotation.x = u.baseRotX + Math.sin(elapsedTime * 0.5 + u.phase) * 0.06;
    });

    // Orbiting Energy Flux Rings
    ring1.rotation.z += 0.008;
    ring2.rotation.z -= 0.006;
    ringGroup.rotation.y = elapsedTime * 0.05;

    // Sun corona pulse
    const sunScale = 1.0 + Math.sin(elapsedTime * 2.0) * 0.08;
    sunGlow.scale.set(sunScale, sunScale, sunScale);

    // Floating Particles Dynamics (slow upward drift + swirling)
    const posAttr = particleGeo.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Gentle orbital drift
      angles[i] += 0.003 * speeds[i];
      positions[i3] = radii[i] * Math.cos(angles[i]);
      positions[i3 + 2] = radii[i] * Math.sin(angles[i]);

      // Anti-gravity vertical upward drift
      positions[i3 + 1] += 0.002 * speeds[i];
      if (positions[i3 + 1] > 3.0) {
        positions[i3 + 1] = -3.0; // Wrap around bottom
      }
    }
    posAttr.needsUpdate = true;

    // Floating Eco Leaves
    leaves.forEach((leaf) => {
      const u = leaf.userData;
      leaf.position.y = u.baseY + Math.sin(elapsedTime * u.speed) * 0.25;
      leaf.rotation.x += u.rotSpeedX;
      leaf.rotation.y += u.rotSpeedY;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Cleanup helper
  return {
    destroy: () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    }
  };
}
