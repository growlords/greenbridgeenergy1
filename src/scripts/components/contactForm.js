import confetti from 'canvas-confetti';

export function initContactForm(contact3dController) {
  const form = document.getElementById('solar-contact-form');
  const successBox = document.getElementById('contact-success-state');
  const refCodeSpan = document.getElementById('consultation-ref-code');
  const resetBtn = document.getElementById('contact-reset-btn');

  if (!form) return;

  // React 3D scene when inputs are focused
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      if (contact3dController && contact3dController.triggerPulse) {
        contact3dController.triggerPulse();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner"></span>
      <span>Transmitting Solar Assessment...</span>
    `;

    setTimeout(() => {
      // Generate clean reference ID
      const randomRef = 'GBE-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      if (refCodeSpan) refCodeSpan.textContent = randomRef;

      // Confetti blast celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#f59e0b', '#34d399', '#ffffff']
        });
      } catch (err) {
        console.log('Confetti triggered', err);
      }

      // Hide form, show success state
      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1200);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (successBox) successBox.style.display = 'none';
    });
  }
}
