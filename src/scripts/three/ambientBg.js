// Ambient 2D/Canvas floating particle & energy glow system
export function initAmbientParticles(canvas) {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  let animationId = null;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);

  const particles = [];
  const count = Math.min(Math.floor(width / 25), 45);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4, // Upward anti-gravity drift
      alpha: Math.random() * 0.4 + 0.15,
      color: Math.random() > 0.3 ? '16, 185, 129' : '245, 158, 11',
      pulse: Math.random() * Math.PI * 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.pulse += 0.02;
      p.x += p.vx + Math.sin(p.pulse) * 0.2;
      p.y += p.vy;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const currentAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.color}, 0.5)`;
      ctx.fill();
    });

    animationId = requestAnimationFrame(draw);
  }

  draw();

  return {
    destroy: () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    }
  };
}
