import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';

export function renderCompanyView(container) {
  if (!container) return;

  const info = cmsStore.data.companyInfo;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Company Information</h1>
        <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
          Centralized headquarters coordinates, contact phones, emails, and operating hours.
        </p>
      </div>
      <button class="btn-adm btn-adm-primary" id="btn-save-company-info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Save Company Profile</span>
      </button>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      
      <!-- Contact Channels -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">Corporate Contact Channels</h3>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="adm-form-group">
            <label class="adm-label">Toll-Free Phone</label>
            <input type="text" id="comp-phone" class="adm-input" value="${info.phone}" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Direct Engineering Desk Phone</label>
            <input type="text" id="comp-direct-phone" class="adm-input" value="${info.directPhone}" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Consultation Inquiries Email</label>
            <input type="email" id="comp-email" class="adm-input" value="${info.email}" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Customer Support Email</label>
            <input type="email" id="comp-support-email" class="adm-input" value="${info.supportEmail}" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">WhatsApp Quick Connect</label>
            <input type="text" id="comp-whatsapp" class="adm-input" value="${info.whatsapp}" />
          </div>
        </div>
      </div>

      <!-- Physical Coordinates & Hours -->
      <div class="adm-card">
        <div class="adm-card-header">
          <h3 class="adm-card-title">Headquarters & Operating Hours</h3>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="adm-form-group">
            <label class="adm-label">Physical Street Address</label>
            <input type="text" id="comp-address" class="adm-input" value="${info.address}" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">City, State, Zip & Country</label>
            <input type="text" id="comp-city" class="adm-input" value="${info.city}, ${info.country}" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Standard Operating Hours</label>
            <input type="text" id="comp-hours" class="adm-input" value="${info.businessHours}" />
          </div>

          <div class="adm-form-group">
            <label class="adm-label">Emergency Telemetry Protocol</label>
            <input type="text" id="comp-emergency" class="adm-input" value="${info.emergencyHours}" />
          </div>
        </div>
      </div>

    </div>
  `;

  document.getElementById('btn-save-company-info')?.addEventListener('click', () => {
    cmsStore.updateCompanyInfo({
      phone: document.getElementById('comp-phone')?.value,
      directPhone: document.getElementById('comp-direct-phone')?.value,
      email: document.getElementById('comp-email')?.value,
      supportEmail: document.getElementById('comp-support-email')?.value,
      whatsapp: document.getElementById('comp-whatsapp')?.value,
      address: document.getElementById('comp-address')?.value,
      city: document.getElementById('comp-city')?.value,
      businessHours: document.getElementById('comp-hours')?.value,
      emergencyHours: document.getElementById('comp-emergency')?.value
    });
    toast.success('Company info updated across website!');
  });
}
