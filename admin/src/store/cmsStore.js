import { initialCMSData } from './initialData.js';

const STORAGE_KEY = 'gpe_cms_data_v2';
const PUBLISHED_KEY = 'gpe_cms_data_published';
const DRAFT_FLAG_KEY = 'gpe_cms_draft_changes';

class CMSStore {
  constructor() {
    this.subscribers = new Set();
    this.autosaveSubscribers = new Set();
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 40;
    this.autosaveTimer = null;
    this.autosaveStatus = 'saved'; // 'saved' | 'saving'
    this.data = this.loadData();
    this.hasUnsavedChanges = localStorage.getItem(DRAFT_FLAG_KEY) === 'true';

    // Ensure published seed exists
    if (!localStorage.getItem(PUBLISHED_KEY)) {
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify(this.data));
    }

    // Initialize hidden cross-origin sync frame if in browser
    if (typeof window !== 'undefined') {
      this.initSyncFrame();
    }
  }

  initSyncFrame() {
    if (!document.getElementById('gpe-origin-sync-frame')) {
      const syncFrame = document.createElement('iframe');
      syncFrame.id = 'gpe-origin-sync-frame';
      syncFrame.src = 'http://localhost:5174/?sync=true';
      syncFrame.style.display = 'none';
      syncFrame.style.width = '0';
      syncFrame.style.height = '0';
      syncFrame.style.border = 'none';
      document.body.appendChild(syncFrame);
    }
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.elements) parsed.elements = { ...initialCMSData.elements };
        if (!parsed.sectionOrder) parsed.sectionOrder = { ...initialCMSData.sectionOrder };
        return parsed;
      }
    } catch (e) {
      console.error('Error loading stored CMS data', e);
    }
    return JSON.parse(JSON.stringify(initialCMSData));
  }

  saveData(pushToUndo = true, triggerAutosaveIndicator = true) {
    if (pushToUndo) {
      this.pushHistory();
    }
    this.data.meta.lastSaved = new Date().toISOString();
    this.hasUnsavedChanges = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    localStorage.setItem(DRAFT_FLAG_KEY, 'true');

    // Broadcast live preview update to iframes & public origin
    this.syncToPublicOrigin(this.data, false);

    // Trigger Autosave status transition
    if (triggerAutosaveIndicator) {
      this.triggerAutosaveCycle();
    }

    this.notify();
  }

  triggerAutosaveCycle() {
    this.setAutosaveStatus('saving');
    if (this.autosaveTimer) clearTimeout(this.autosaveTimer);
    this.autosaveTimer = setTimeout(() => {
      this.setAutosaveStatus('saved');
    }, 400);
  }

  setAutosaveStatus(status) {
    this.autosaveStatus = status;
    this.autosaveSubscribers.forEach((cb) => {
      try { cb(status); } catch (e) { console.error(e); }
    });
  }

  subscribeAutosave(callback) {
    this.autosaveSubscribers.add(callback);
    return () => this.autosaveSubscribers.delete(callback);
  }

  syncToPublicOrigin(data, isPublished = false) {
    try {
      const type = isPublished ? 'GPE_PUBLISH_TO_PUBLIC' : 'GPE_CMS_LIVE_PREVIEW';

      // 1. Send to all visible iframes
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((ifr) => {
        ifr.contentWindow?.postMessage({ type, data }, '*');
      });

      // 2. Ensure sync frame is notified
      const syncFrame = document.getElementById('gpe-origin-sync-frame');
      if (syncFrame && syncFrame.contentWindow) {
        syncFrame.contentWindow.postMessage({ type, data }, '*');
      }
    } catch (e) {
      console.warn('Sync to public origin warning:', e);
    }
  }

  pushHistory() {
    const snapshot = JSON.stringify(this.data);
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length === 0) return false;
    const current = JSON.stringify(this.data);
    this.redoStack.push(current);
    const prev = this.undoStack.pop();
    this.data = JSON.parse(prev);
    localStorage.setItem(STORAGE_KEY, prev);
    this.syncToPublicOrigin(this.data, false);
    this.notify();
    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;
    const current = JSON.stringify(this.data);
    this.undoStack.push(current);
    const next = this.redoStack.pop();
    this.data = JSON.parse(next);
    localStorage.setItem(STORAGE_KEY, next);
    this.syncToPublicOrigin(this.data, false);
    this.notify();
    return true;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach((cb) => {
      try {
        cb(this.data);
      } catch (err) {
        console.error('Error in subscriber callback', err);
      }
    });
  }

  // --- Element-Level Editing ---
  setElementValue(key, value, pushUndo = false) {
    if (!this.data.elements) this.data.elements = {};
    this.data.elements[key] = value;
    this.saveData(pushUndo, true);

    try {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((ifr) => {
        ifr.contentWindow?.postMessage({
          type: 'GPE_SET_ELEMENT_VALUE',
          key: key,
          value: value
        }, '*');
      });
    } catch (e) {
      // Ignored
    }
  }

  getElementValue(key, fallback = '') {
    if (this.data.elements && this.data.elements[key] !== undefined) {
      return this.data.elements[key];
    }
    return initialCMSData.elements[key] || fallback;
  }

  // --- Safe Publish System ---
  publish(versionNotes = 'Production release deployment') {
    this.data.meta.lastPublished = new Date().toISOString();
    this.data.meta.status = 'published';
    this.hasUnsavedChanges = false;
    localStorage.setItem(DRAFT_FLAG_KEY, 'false');

    // Create a version snapshot
    const nextVer = 'v2.' + (this.data.versionHistory.length + 6) + '.0';
    const snapshot = {
      id: 'ver-' + Date.now(),
      versionNumber: nextVer,
      title: 'Production Deployment',
      author: 'Dr. Elena Vance (Administrator)',
      timestamp: new Date().toISOString(),
      notes: versionNotes,
      snapshotData: JSON.parse(JSON.stringify(this.data))
    };
    this.data.versionHistory.unshift(snapshot);

    // Save to published store in admin origin (port 5180)
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(this.data));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));

    // Broadcast publish event to public origin (port 5174)
    this.syncToPublicOrigin(this.data, true);

    this.setAutosaveStatus('saved');
    this.notify();
    return true;
  }

  // Non-destructive rollback
  restoreVersion(versionId) {
    const ver = this.data.versionHistory.find((v) => v.id === versionId);
    if (!ver || !ver.snapshotData) return false;

    this.pushHistory();

    const restoredData = JSON.parse(JSON.stringify(ver.snapshotData));
    const nextVer = 'v2.' + (this.data.versionHistory.length + 6) + '.0';

    restoredData.versionHistory = [
      {
        id: 'ver-' + Date.now(),
        versionNumber: nextVer,
        title: `Restored from ${ver.versionNumber}`,
        author: 'Administrator',
        timestamp: new Date().toISOString(),
        notes: `Safely rolled back website state to snapshot ${ver.versionNumber} (${ver.title}).`,
        snapshotData: JSON.parse(JSON.stringify(restoredData))
      },
      ...this.data.versionHistory
    ];

    this.data = restoredData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(this.data));
    this.hasUnsavedChanges = false;
    localStorage.setItem(DRAFT_FLAG_KEY, 'false');

    this.syncToPublicOrigin(this.data, true);
    this.notify();
    return true;
  }

  // --- Currency Configuration ---
  updateCurrency(currencyUpdates) {
    this.data.currency = {
      ...(this.data.currency || initialCMSData.currency),
      ...currencyUpdates
    };
    this.saveData();
  }

  // --- Pages Management ---
  getPages() {
    return this.data.pages;
  }

  getPage(pageId) {
    return this.data.pages.find((p) => p.id === pageId);
  }

  // --- Section Reordering ---
  reorderSections(pageId, orderedSectionIds) {
    if (!this.data.sectionOrder) this.data.sectionOrder = {};
    this.data.sectionOrder[pageId] = orderedSectionIds;
    
    const page = this.getPage(pageId);
    if (page && page.sections) {
      const sMap = new Map(page.sections.map((s) => [s.id, s]));
      page.sections = orderedSectionIds.map((id) => sMap.get(id)).filter(Boolean);
    }

    this.saveData();

    try {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((ifr) => {
        ifr.contentWindow?.postMessage({
          type: 'GPE_REORDER_SECTIONS',
          pageId,
          orderedIds: orderedSectionIds
        }, '*');
      });
    } catch (e) {
      // Ignored
    }
  }

  // --- Services CMS ---
  getServices() {
    if (!this.data.services) this.data.services = [...initialCMSData.services];
    return this.data.services;
  }

  addService(service) {
    if (!this.data.services) this.data.services = [...initialCMSData.services];
    const newService = {
      id: 'srv-' + Date.now(),
      title: service.title || 'New Solar Offering',
      tagline: service.tagline || 'Engineered Performance',
      badge: service.badge || 'Service',
      description: service.description || '',
      features: service.features || ['Tier-1 Monocrystalline', 'Full Engineering Warranty'],
      warranty: service.warranty || '25-Yr Full Warranty',
      efficiency: service.efficiency || 'High Yield'
    };
    this.data.services.push(newService);
    this.saveData();
    return newService;
  }

  updateService(serviceId, updates) {
    const srv = this.getServices().find((s) => s.id === serviceId);
    if (srv) {
      Object.assign(srv, updates);
      this.saveData();
      return true;
    }
    return false;
  }

  deleteService(serviceId) {
    if (!this.data.services) this.data.services = [...initialCMSData.services];
    this.data.services = this.data.services.filter((s) => s.id !== serviceId);
    this.saveData();
    return true;
  }

  // --- Projects CMS ---
  getProjects() {
    if (!this.data.projects) this.data.projects = [...initialCMSData.projects];
    return this.data.projects;
  }

  addProject(project) {
    if (!this.data.projects) this.data.projects = [...initialCMSData.projects];
    const newProject = {
      id: 'proj-' + Date.now(),
      title: project.title || 'New Solar Installation',
      category: project.category || 'residential',
      categoryLabel: project.categoryLabel || 'Solar Case Study',
      location: project.location || 'United States',
      capacity: project.capacity || '10 kW DC',
      annualGeneration: project.annualGeneration || '15,000 kWh/yr',
      co2Offset: project.co2Offset || '10.5 Tons/yr',
      image: project.image || '/images/project-residential.jpg',
      description: project.description || 'Turnkey clean energy installation.',
      technicalSpecs: project.technicalSpecs || {
        panels: 'Tier-1 Mono Cells',
        inverters: 'Smart Inverter System',
        battery: 'Storage Integrated',
        roiPayback: '4.0 Years'
      }
    };
    this.data.projects.push(newProject);
    this.saveData();
    return newProject;
  }

  updateProject(projectId, updates) {
    const proj = this.getProjects().find((p) => p.id === projectId);
    if (proj) {
      Object.assign(proj, updates);
      this.saveData();
      return true;
    }
    return false;
  }

  deleteProject(projectId) {
    if (!this.data.projects) this.data.projects = [...initialCMSData.projects];
    this.data.projects = this.data.projects.filter((p) => p.id !== projectId);
    this.saveData();
    return true;
  }

  // --- Media Library ---
  getMedia() {
    if (!this.data.media) this.data.media = [...initialCMSData.media];
    return this.data.media;
  }

  addMedia(mediaItem) {
    if (!this.data.media) this.data.media = [...initialCMSData.media];
    const newMedia = {
      id: 'med-' + Date.now(),
      name: mediaItem.name || 'uploaded-asset.jpg',
      title: mediaItem.title || 'Uploaded Asset',
      url: mediaItem.url,
      category: mediaItem.category || 'general',
      size: mediaItem.size || '1.0 MB',
      dimensions: mediaItem.dimensions || '1920x1080',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    this.data.media.unshift(newMedia);
    this.saveData();
    return newMedia;
  }

  deleteMedia(mediaId) {
    if (!this.data.media) this.data.media = [...initialCMSData.media];
    this.data.media = this.data.media.filter((m) => m.id !== mediaId);
    this.saveData();
    return true;
  }
}

export const cmsStore = new CMSStore();
