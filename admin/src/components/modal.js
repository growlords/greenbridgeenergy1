// Reusable Admin Modal Window System
class ModalManager {
  constructor() {
    this.modalEl = null;
    this.init();
  }

  init() {
    if (!document.getElementById('admin-dynamic-modal')) {
      this.modalEl = document.createElement('div');
      this.modalEl.id = 'admin-dynamic-modal';
      this.modalEl.className = 'cmd-palette-backdrop';
      this.modalEl.innerHTML = `
        <div class="cmd-palette-window" id="admin-modal-window" style="max-width: 620px; padding: 2rem;">
          <div id="admin-modal-content"></div>
        </div>
      `;
      document.body.appendChild(this.modalEl);

      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    } else {
      this.modalEl = document.getElementById('admin-dynamic-modal');
    }
  }

  open(htmlContent, customWidth = '620px') {
    if (!this.modalEl) this.init();
    const content = document.getElementById('admin-modal-content');
    const win = document.getElementById('admin-modal-window');
    if (win) win.style.maxWidth = customWidth;
    if (content) content.innerHTML = htmlContent;
    this.modalEl.classList.add('active');
  }

  close() {
    if (this.modalEl) this.modalEl.classList.remove('active');
  }

  confirm({ title, message, confirmText = 'Confirm', onConfirm, isDanger = false }) {
    this.open(`
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <h3 style="font-size: 1.25rem;">${title}</h3>
        <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">${message}</p>
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
          <button class="btn-adm btn-adm-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn-adm ${isDanger ? 'btn-adm-danger' : 'btn-adm-primary'}" id="modal-confirm-btn">${confirmText}</button>
        </div>
      </div>
    `, '440px');

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.close());
    document.getElementById('modal-confirm-btn')?.addEventListener('click', () => {
      this.close();
      if (onConfirm) onConfirm();
    });
  }
}

export const modal = new ModalManager();
