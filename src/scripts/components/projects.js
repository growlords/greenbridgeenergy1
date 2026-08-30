import { projectsData } from '../data/projectsData.js';

export function initProjects() {
  const gridContainer = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('project-modal-body');
  const modalClose = document.getElementById('project-modal-close');

  if (!gridContainer) return;

  function renderProjects(filter = 'all') {
    const filtered = filter === 'all' 
      ? projectsData 
      : projectsData.filter((p) => p.category === filter);

    gridContainer.innerHTML = filtered.map((proj) => `
      <article class="project-card tilt-card" data-project-id="${proj.id}">
        <div class="project-image-wrap">
          <img src="${proj.image}" alt="${proj.title}" class="project-img" loading="lazy" />
          <div class="project-overlay">
            <span class="project-pill">${proj.categoryLabel}</span>
            <div class="project-cap-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <span>${proj.capacity}</span>
            </div>
          </div>
        </div>
        <div class="project-content">
          <div class="project-loc">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${proj.location}</span>
          </div>
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-desc">${proj.description}</p>
          <div class="project-footer">
            <div class="project-stat-pill">
              <span class="stat-lbl">Offset</span>
              <span class="stat-num">${proj.co2Offset}</span>
            </div>
            <button class="btn-view-project" data-project-id="${proj.id}">
              <span>Explore Project</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Reattach listeners to newly rendered cards
    attachCardListeners();
  }

  function attachCardListeners() {
    const cards = gridContainer.querySelectorAll('.project-card, .btn-view-project');
    cards.forEach((el) => {
      el.addEventListener('click', (e) => {
        const id = el.dataset.projectId || el.closest('[data-project-id]')?.dataset.projectId;
        if (id) openProjectModal(id);
      });
    });
  }

  function openProjectModal(projectId) {
    const proj = projectsData.find((p) => p.id === projectId);
    if (!proj || !modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-hero-img-wrap">
        <img src="${proj.image}" alt="${proj.title}" class="modal-hero-img" />
        <div class="modal-img-gradient"></div>
        <div class="modal-hero-badge">
          <span class="modal-pill">${proj.categoryLabel}</span>
          <span class="modal-cap">${proj.capacity} Installed</span>
        </div>
      </div>

      <div class="modal-inner-content">
        <div class="modal-header-row">
          <div>
            <div class="modal-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${proj.location}</span>
            </div>
            <h2 class="modal-title">${proj.title}</h2>
          </div>
          <div class="modal-roi-box">
            <span class="roi-label">Payback Timeline</span>
            <span class="roi-val">${proj.technicalSpecs.roiPayback}</span>
          </div>
        </div>

        <p class="modal-lead-desc">${proj.description}</p>

        <!-- High-Impact Stats Bar -->
        <div class="modal-stats-bar">
          <div class="m-stat-col">
            <span class="m-stat-name">Annual Yield</span>
            <span class="m-stat-data">${proj.annualGeneration}</span>
          </div>
          <div class="m-stat-col">
            <span class="m-stat-name">Energy Storage</span>
            <span class="m-stat-data">${proj.storage}</span>
          </div>
          <div class="m-stat-col">
            <span class="m-stat-name">CO₂ Abatement</span>
            <span class="m-stat-data">${proj.co2Offset}</span>
          </div>
          <div class="m-stat-col">
            <span class="m-stat-name">Est. 25-Yr Value</span>
            <span class="m-stat-data highlight">${proj.technicalSpecs.lifetimeSavings}</span>
          </div>
        </div>

        <!-- Project Highlights & Engineering Specs Grid -->
        <div class="modal-specs-grid">
          <div class="modal-col">
            <h4 class="modal-subhead">Key Engineering Highlights</h4>
            <ul class="modal-highlights-list">
              ${proj.highlights.map(h => `<li><span class="check-icon">✓</span> ${h}</li>`).join('')}
            </ul>
          </div>
          <div class="modal-col">
            <h4 class="modal-subhead">System Hardware & Telemetry</h4>
            <div class="modal-tech-table">
              <div class="tech-row">
                <span class="tech-k">PV Modules</span>
                <span class="tech-v">${proj.technicalSpecs.modules}</span>
              </div>
              <div class="tech-row">
                <span class="tech-k">Inverters</span>
                <span class="tech-v">${proj.technicalSpecs.inverters}</span>
              </div>
              <div class="tech-row">
                <span class="tech-k">Telemetry</span>
                <span class="tech-v">${proj.technicalSpecs.monitoring}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-cta-banner">
          <div>
            <h4 class="cta-banner-title">Require a Similar Solar Architecture?</h4>
            <p class="cta-banner-sub">Our clean energy engineering team will draft a complimentary 3D site simulation.</p>
          </div>
          <button class="btn btn-primary modal-quote-btn" id="modal-req-quote-btn">
            <span>Request Project Consultation</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hook up modal quote button
    const reqBtn = document.getElementById('modal-req-quote-btn');
    if (reqBtn) {
      reqBtn.addEventListener('click', () => {
        closeModal();
        window.location.hash = '#contact';
        setTimeout(() => {
          const reqInput = document.getElementById('contact-requirement');
          if (reqInput) reqInput.value = `Inquiring regarding design similar to ${proj.title} (${proj.capacity})`;
          const formElem = document.getElementById('contact-form');
          if (formElem) formElem.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderProjects(filter);
    });
  });

  // Render initial
  renderProjects('all');
}
