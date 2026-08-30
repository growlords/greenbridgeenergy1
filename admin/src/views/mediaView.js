import { cmsStore } from '../store/cmsStore.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function renderMediaView(container) {
  if (!container) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function render() {
    const allMedia = cmsStore.getMedia();
    const filtered = allMedia.filter((m) => {
      const matchCat = activeCategory === 'all' || m.category === activeCategory;
      const matchSearch = searchQuery === '' || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Media Library</h1>
          <p style="color: var(--admin-text-secondary); font-size: 0.9rem;">
            Upload and manage high-resolution photos, team portraits, SVG brand assets, and videos.
          </p>
        </div>
      </div>

      <!-- Drag & Drop Upload Zone -->
      <div class="adm-card" id="media-dropzone" style="border: 2px dashed var(--admin-border-strong); background: var(--admin-bg-elevated); text-align: center; padding: 2.5rem; margin-bottom: 2rem; cursor: pointer; transition: all 0.2s ease;">
        <input type="file" id="media-file-input" style="display: none;" accept="image/*,.svg,video/*" multiple />
        <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(16,185,129,0.15); color: #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">Drag & drop images or click to browse</h3>
        <p style="font-size: 0.8rem; color: var(--admin-text-muted);">Supports PNG, JPG, WebP, SVG vectors up to 25 MB</p>
      </div>

      <!-- Filter and Search Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-adm btn-adm-sm ${activeCategory === 'all' ? 'btn-adm-primary' : 'btn-adm-secondary'} filter-cat-btn" data-cat="all">All Media (${allMedia.length})</button>
          <button class="btn-adm btn-adm-sm ${activeCategory === 'projects' ? 'btn-adm-primary' : 'btn-adm-secondary'} filter-cat-btn" data-cat="projects">Projects</button>
          <button class="btn-adm btn-adm-sm ${activeCategory === 'team' ? 'btn-adm-primary' : 'btn-adm-secondary'} filter-cat-btn" data-cat="team">Team</button>
          <button class="btn-adm btn-adm-sm ${activeCategory === 'branding' ? 'btn-adm-primary' : 'btn-adm-secondary'} filter-cat-btn" data-cat="branding">Logos & SVGs</button>
        </div>

        <div style="width: 260px;">
          <input type="text" id="media-search-input" class="adm-input" placeholder="Search filenames..." value="${searchQuery}" style="padding: 0.45rem 0.75rem; font-size: 0.82rem;" />
        </div>
      </div>

      <!-- Media Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem;">
        ${filtered.map((item) => `
          <div class="adm-card media-thumb-card" data-media-id="${item.id}" style="padding: 0.75rem; cursor: pointer; transition: transform 0.2s ease;">
            <div style="width: 100%; height: 140px; background: #000; border-radius: 6px; overflow: hidden; position: relative; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: center;">
              <img src="${item.url}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" />
              <span style="position: absolute; bottom: 6px; right: 6px; background: rgba(0,0,0,0.7); color: #fff; font-size: 0.65rem; font-family: var(--admin-font-mono); padding: 2px 6px; border-radius: 4px;">
                ${item.dimensions || 'Image'}
              </span>
            </div>
            <div style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">
              ${item.name}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--admin-text-muted);">
              <span>${item.size}</span>
              <span>${item.uploadedAt}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Dropzone & File Input
    const dropzone = document.getElementById('media-dropzone');
    const fileInput = document.getElementById('media-file-input');

    dropzone?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const fakeUrl = URL.createObjectURL(file);
        cmsStore.addMedia({
          name: file.name,
          title: file.name,
          url: fakeUrl,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          dimensions: '1920x1080',
          category: file.name.includes('team') ? 'team' : (file.name.endsWith('.svg') ? 'branding' : 'projects')
        });
      });
      toast.success(`Uploaded ${files.length} file(s) to Media Library`);
      render();
    });

    // Category Filter Buttons
    container.querySelectorAll('.filter-cat-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        render();
      });
    });

    // Search Input
    const sInput = document.getElementById('media-search-input');
    sInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
    });

    // Media Item Click (Inspector Modal)
    container.querySelectorAll('.media-thumb-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset.mediaId;
        const item = cmsStore.getMedia().find((m) => m.id === id);
        if (!item) return;

        modal.open(`
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <h3 style="font-size: 1.35rem;">Asset Details: ${item.name}</h3>

            <div style="width: 100%; height: 260px; background: #000; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
              <img src="${item.url}" alt="${item.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; background: var(--admin-bg-elevated); padding: 1rem; border-radius: 8px; font-size: 0.8rem;">
              <div>
                <span style="color: var(--admin-text-muted); display: block;">Dimensions</span>
                <strong>${item.dimensions}</strong>
              </div>
              <div>
                <span style="color: var(--admin-text-muted); display: block;">File Size</span>
                <strong>${item.size}</strong>
              </div>
              <div>
                <span style="color: var(--admin-text-muted); display: block;">Type</span>
                <strong>${item.type}</strong>
              </div>
            </div>

            <div class="adm-form-group">
              <label class="adm-label">Direct Asset URL</label>
              <input type="text" class="adm-input" value="${item.url}" readonly />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
              <button class="btn-adm btn-adm-danger btn-adm-sm" id="btn-delete-media-item">Delete Asset</button>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn-adm btn-adm-secondary" onclick="document.getElementById('admin-dynamic-modal').classList.remove('active')">Close</button>
                <button class="btn-adm btn-adm-primary" id="btn-copy-media-url">Copy URL</button>
              </div>
            </div>
          </div>
        `, '560px');

        document.getElementById('btn-copy-media-url')?.addEventListener('click', () => {
          navigator.clipboard?.writeText(item.url);
          toast.success('Asset URL copied to clipboard!');
        });

        document.getElementById('btn-delete-media-item')?.addEventListener('click', () => {
          cmsStore.deleteMedia(item.id);
          modal.close();
          toast.warning(`Deleted "${item.name}"`);
          render();
        });
      });
    });
  }

  render();
}
