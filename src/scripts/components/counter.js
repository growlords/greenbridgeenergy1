// Animated Number Counter on Viewport Intersection
export function initCounters() {
  const counterElements = document.querySelectorAll('.stat-counter');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const isDecimal = el.dataset.target.includes('.');
          
          let startTime = null;

          function updateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing: easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = easeProgress * target;

            if (isDecimal) {
              el.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
            } else {
              el.textContent = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              if (isDecimal) {
                el.textContent = `${prefix}${target.toFixed(1)}${suffix}`;
              } else {
                el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
              }
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.25 }
  );

  counterElements.forEach((el) => observer.observe(el));
}
