import * as THREE from 'three';

export function initGlobeScene(container) {
  if (!container) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0x10b981, 3.0);
  sunLight.position.set(3, 3, 3);
  scene.add(sunLight);

  // 1. Inner Core Glowing Energy Sphere
  const innerCoreGeo = new THREE.SphereGeometry(0.7, 32, 32);
  const innerCoreMat = new THREE.MeshBasicMaterial({
    color: 0x059669,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });
  const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
  globeGroup.add(innerCore);

  // 2. Holographic Latitude & Longitude Wireframe Grid
  const sphereGeo = new THREE.SphereGeometry(1.6, 24, 24);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const wireMesh = new THREE.Mesh(sphereGeo, wireMat);
  globeGroup.add(wireMesh);

  // 3. Floating Clean Energy Node Pins (Global Solar Hubs)
  const nodeCount = 18;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.045, 16, 16);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;
    
    const x = 1.62 * Math.cos(theta) * Math.sin(phi);
    const y = 1.62 * Math.sin(theta) * Math.sin(phi);
    const z = 1.62 * Math.cos(phi);

    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
    nodeMesh.position.set(x, y, z);
    globeGroup.add(nodeMesh);
    nodes.push(nodeMesh);

    // Connecting energy lines from center to nodes
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, z)
    ]);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.25
    });
    const line = new THREE.Line(lineGeo, lineMat);
    globeGroup.add(line);
  }

  // 4. Orbiting Solar Rings (Tilted Rings around Globe)
  const ringGeo1 = new THREE.TorusGeometry(2.1, 0.01, 16, 80);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.6
  });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 2.5;
  globeGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(2.35, 0.008, 16, 80);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.5
  });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.y = 0.4;
  globeGroup.add(ring2);

  // 5. Swirling Energy Particles
  const pCount = 600;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r = 1.6 + (Math.random() - 0.5) * 0.8;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.035,
    color: 0x34d399,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(pGeo, pMat);
  globeGroup.add(particles);

  // Mouse Interaction
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let targetRotY = 0;
  let targetRotX = 0;

  function onMouseDown(e) {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  }

  function onMouseMove(e) {
    if (!isDragging) {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY += nx * 0.005;
      targetRotX += ny * 0.003;
      return;
    }
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    targetRotY += deltaX * 0.008;
    targetRotX += deltaY * 0.008;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  }

  function onMouseUp() {
    isDragging = false;
  }

  container.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseup', onMouseUp);

  function onResize() {
    if (!container) return;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    camera.aspect = width / height;
    if (width < 640) {
      camera.position.set(0, 0, 7.2);
    } else {
      camera.position.set(0, 0, 5.8);
    }
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);
  onResize();

  let clock = new THREE.Clock();
  let animId = null;

  function animate() {
    animId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Constant auto-rotation + damped user drag
    targetRotY += 0.004;
    globeGroup.rotation.y += (targetRotY - globeGroup.rotation.y) * 0.08;
    globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.08;

    // Anti-gravity floating
    globeGroup.position.y = Math.sin(elapsed * 1.2) * 0.1;

    // Ring rotations
    ring1.rotation.z += 0.005;
    ring2.rotation.z -= 0.004;

    // Node pulsing
    nodes.forEach((node, idx) => {
      const s = 1.0 + Math.sin(elapsed * 3.0 + idx) * 0.35;
      node.scale.set(s, s, s);
    });

    // Core pulsing
    const cScale = 1.0 + Math.sin(elapsed * 2.0) * 0.08;
    innerCore.scale.set(cScale, cScale, cScale);

    renderer.render(scene, camera);
  }
  animate();

  return {
    destroy: () => {
      if (animId) cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    }
  };
}
