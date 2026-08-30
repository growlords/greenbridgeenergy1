// Toast notification manager
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.getElementById('admin-toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'admin-toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('admin-toast-container');
    }
  }

  show(message, type = 'success', duration = 3500) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;

    if (type === 'error') {
      iconSvg = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `;
    } else if (type === 'warning') {
      iconSvg = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span style="font-weight: 500;">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(msg) { this.show(msg, 'success'); }
  error(msg) { this.show(msg, 'error'); }
  warning(msg) { this.show(msg, 'warning'); }
}

export const toast = new ToastManager();
