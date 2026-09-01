import * as THREE from 'three';

export function initContactScene(container) {
  if (!container) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5.0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // Lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambLight);

  const sunLight = new THREE.DirectionalLight(0xffedd5, 3.5);
  sunLight.position.set(4, 5, 4);
  scene.add(sunLight);

  const emeraldLight = new THREE.PointLight(0x10b981, 4.0, 10);
  emeraldLight.position.set(-2, -2, 2);
  scene.add(emeraldLight);

  // 1. Crystalline 3D Solar Prism (Octahedron / Icosahedron Core)
  const prismGeo = new THREE.OctahedronGeometry(1.2, 0);
  const prismMat = new THREE.MeshPhysicalMaterial({
    color: 0x06281a,
    metalness: 0.8,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
    wireframe: false
  });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  rootGroup.add(prism);

  // Glowing wireframe overlay on the prism
  const wireGeo = new THREE.WireframeGeometry(prismGeo);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.8
  });
  const wireLines = new THREE.LineSegments(wireGeo, wireMat);
  prism.add(wireLines);

  // 2. Inner Glowing Energy Core
  const coreGeo = new THREE.SphereGeometry(0.4, 24, 24);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  prism.add(core);

  // 3. Dual Floating Gyroscopic Solar Orbit Rings
  const ring1Geo = new THREE.TorusGeometry(1.7, 0.015, 16, 60);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.7
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3;
  rootGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(1.9, 0.012, 16, 60);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.6
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.z = Math.PI / 6;
  rootGroup.add(ring2);

  // 4. Orbiting Energy Sparkles
  const sparkCount = 200;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i++) {
    const r = 1.3 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    sparkPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    sparkPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    sparkPos[i * 3 + 2] = r * Math.cos(phi);
  }
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x34d399,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  rootGroup.add(sparks);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseX = nx;
    mouseY = ny;
    targetRotY = mouseX * 0.8;
    targetRotX = -mouseY * 0.6;
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function onResize() {
    if (!container) return;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    camera.aspect = width / height;
    if (width < 640) {
      camera.position.set(0, 0, 6.8);
    } else {
      camera.position.set(0, 0, 5.5);
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

    // Damped mouse rotation
    rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.06;
    rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.06;

    // Prism spinning & anti-gravity floating
    prism.rotation.y = elapsed * 0.4;
    prism.rotation.z = Math.sin(elapsed * 0.5) * 0.2;
    prism.position.y = Math.sin(elapsed * 1.5) * 0.12;

    // Ring orbits
    ring1.rotation.z += 0.01;
    ring2.rotation.x += 0.008;

    // Core glow pulse
    const cScale = 1.0 + Math.sin(elapsed * 3.0) * 0.15;
    core.scale.set(cScale, cScale, cScale);

    sparks.rotation.y = elapsed * 0.1;

    renderer.render(scene, camera);
  }
  animate();

  return {
    triggerPulse: () => {
      // Trigger a bright pulse when user interacts with form
      core.scale.set(1.6, 1.6, 1.6);
      emeraldLight.intensity = 8.0;
      setTimeout(() => {
        emeraldLight.intensity = 4.0;
      }, 400);
    },
    destroy: () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    }
  };
}
