/**
 * VowsProfile - Client-Side Matrimonial Biodata Generator
 * Real-time reactive data binding, local image processing, client-side A4 PDF export
 * Features: LocalStorage auto-save, dynamic entries, A4 overflow detection, customizable headers
 */

const MAP_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff7ec" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>';
const EXT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" class="ext-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#8c5324" d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm5 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/></svg>';
const PLACEHOLDER_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="100%" height="100%" fill="%23ecdac0"/><circle cx="150" cy="140" r="50" fill="%23c4a98b"/><path d="M70 330 C70 230, 230 230, 230 330 Z" fill="%23c4a98b"/><text x="150" y="365" font-family="sans-serif" font-size="14" fill="%237d5d3e" text-anchor="middle">Photo Slot</text></svg>';

const ICON_PATHS = {
  person: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z",
  edu: "M12 5 2 10l10 5 8-4v5h2v-6Zm-6 8v3.5C6 18.4 8.7 20 12 20s6-1.6 6-3.5V13l-6 3Z",
  work: "M9 6V4h6v2h4a2 2 0 0 1 2 2v3H3V8a2 2 0 0 1 2-2Zm6 0V5H9v1Zm6 7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5h6v2h6v-2Z",
  link: "M10.6 13.4a2 2 0 0 0 2.8 0l3.6-3.6a2 2 0 0 0-2.8-2.8L12.6 8.6l1.4 1.4 1.6-1.6a.5.5 0 0 1 .7.7l-3.6 3.6a.5.5 0 0 1-.7 0ZM6.3 17a2 2 0 0 0 2.8 0l1.6-1.6-1.4-1.4-1.6 1.6a.5.5 0 0 1-.7-.7l3.6-3.6a.5.5 0 1 1 .7.7l-.3.3 1.4 1.4.3-.3a2 2 0 1 0-2.8-2.8L6.3 14.2A2 2 0 0 0 6.3 17Z",
  family: "M9 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm6 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2 0-3.8.8-5 2.1C8.8 13.8 7 13 5 13c-2.8 0-5 1.8-5 4v1h10v-1a4.8 4.8 0 0 0-.1-1H20v1h4v-1c0-2.2-2.2-4-5-4Z",
  paternal: "M12 2A7 7 0 0 0 5 9c0 2.5 1.3 4.7 3.3 5.9V19H7v2h10v-2h-1.3v-4.1c2-1.2 3.3-3.4 3.3-5.9a7 7 0 0 0-7-7Zm-1.5 17v-3.5h3V19h-3Z",
  maternal: "M12 2a5 5 0 0 1 5 5c0 2.1-1.3 3.9-3.2 4.6.4.7.7 1.4.9 2.2 2.6.4 4.8 2.3 5.2 4.9.1.7-.4 1.3-1.1 1.3H5.2c-.7 0-1.2-.6-1.1-1.3.4-2.6 2.6-4.5 5.2-4.9.2-.8.5-1.5.9-2.2C8.3 10.9 7 9.1 7 7a5 5 0 0 1 5-5Z",
  phone: "M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.24 1Z"
};

function getSvgIcon(name) {
  return `<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fff7ec" d="${ICON_PATHS[name]}"/></svg></span>`;
}

// Limits
const MAX_EDUCATION = 3;
const MAX_SOCIAL_LINKS = 4;
const MAX_SIBLINGS = 4;
const MAX_PHONES = 3;
const STORAGE_KEY = 'vowsprofile_data';

// Default reference data matching Rahul Sharma's biodata
const SAMPLE_DATA = {
  header: {
    mantra: "|| \u0936\u094d\u0930\u0940 \u0917\u0923\u0947\u0936\u093e\u092f \u0928\u092e\u0903 ||",
    ganeshImage: "metadata/Ganesh.png",
    name: "Rahul Sharma",
    subtitle: "Software Engineer | Tech Solutions"
  },
  customLabels: {
    sectionDivider: "Biodata Profile",
    card1Title: "Personal & Professional Details",
    card2Title: "Family"
  },
  photos: [
    "metadata/1.png",
    "metadata/2.png",
    "metadata/3.jpg"
  ],
  personal: {
    name: "Rahul Sharma",
    gotra: "Bharadwaj",
    height: "5' 10\"",
    dateOfBirth: "15 August 1996",
    timeOfBirth: "10:30 AM",
    placeOfBirth: "Delhi, India",
    manglik: ""
  },
  education: [
    {
      degree: "B.Tech",
      field: "Computer Science",
      institution: "Delhi Technological University"
    }
  ],
  professional: {
    designation: "Software Engineer",
    company: "Tech Solutions",
    workLocation: "Hybrid",
    officeAddress: "Gurgaon, Haryana",
    mapLink: "https://maps.google.com/?q=Gurgaon"
  },
  profileLinks: [
    { enabled: true, platform: "Jeevansathi ID", id: "SAMPLE1234", url: "https://www.jeevansathi.com/", isExternal: false },
    { enabled: true, platform: "LinkedIn", id: "rahulsharma_sample", url: "https://www.linkedin.com/", isExternal: true }
  ],
  nativePlace: "Mathura, Uttar Pradesh",
  permanentAddress: {
    line1: "123, Sample Society, Example Road",
    line2: "New Delhi - 110001",
    mapLink: "https://maps.google.com/?q=New+Delhi"
  },
  contact: {
    phones: ["+91 9876543210", "+91 9123456789"]
  },
  family: {
    motherTitle: "Smt.",
    mother: "Sunita Sharma",
    fatherTitle: "Shri",
    father: "Ramesh Sharma",
    hasSiblings: true,
    siblings: [
      {
        relation: "Younger Sister",
        name: "Priya Sharma",
        details: ["Software Developer, MNC", "B.Tech (IT)"]
      }
    ],
    paternalFamily: {
      grandmotherTitle: "Late Smt.",
      grandmother: "Savitri Devi",
      grandfatherTitle: "Late Shri",
      grandfather: "Om Prakash Sharma",
      hasBuas: true,
      buaCount: "2",
      buaLocation: "1 in Delhi, 1 in Agra",
      hasChachas: true,
      chachaCount: "1",
      chachaLocation: "1 in Mathura"
    },
    maternalFamily: {
      grandmotherTitle: "Smt.",
      grandmother: "Kamla Devi",
      grandfatherTitle: "Shri",
      grandfather: "Ram Kumar",
      hasMamas: true,
      mamaCount: "2",
      mamaLocation: "Both in Noida",
      hasMausis: true,
      mausiCount: "1",
      mausiLocation: "1 in Ghaziabad"
    }
  }
};

// Application State
let appData = JSON.parse(JSON.stringify(SAMPLE_DATA));
let currentScale = 1;
let scaleMode = 'fit';
let renderTimeout = null;
let saveTimeout = null;

// Helper: Escape HTML to avoid injection
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   LOCAL STORAGE - Save / Load Progress
   ========================================================================== */

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    showSaveIndicator();
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('\u26a0 Storage full \u2014 try removing uploaded photos first');
    }
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore corrupt data */ }
  return null;
}

function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

function showSaveIndicator() {
  const el = document.getElementById('save-indicator');
  if (el) {
    el.textContent = '\u2714 Saved';
    el.classList.add('is-visible');
    setTimeout(() => el.classList.remove('is-visible'), 1800);
  }
}

function exportDataAsJSON() {
  const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(appData.personal.name || 'biodata').replace(/[^a-zA-Z0-9]/g, '_')}_data.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported as JSON!');
}

function importDataFromJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      appData = mergeWithDefault(json);
      populateForm(appData);
      renderBiodataPreview(appData);
      saveToLocalStorage();
      showToast('Data imported successfully!');
    } catch (err) {
      showToast('Invalid JSON file');
    }
  };
  reader.readAsText(file);
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

async function initApp() {
  // Priority: 1. localStorage saved data, 2. details.json, 3. SAMPLE_DATA
  const saved = loadFromLocalStorage();
  if (saved) {
    appData = mergeWithDefault(saved);
    // Delay toast so DOM is ready
    setTimeout(() => showToast('\u2714 Restored your saved progress'), 200);
  } else {
    try {
      const res = await fetch('metadata/details.json');
      if (res.ok) {
        const json = await res.json();
        appData = mergeWithDefault(json);
      } else {
        appData = JSON.parse(JSON.stringify(SAMPLE_DATA));
      }
    } catch (e) {
      appData = JSON.parse(JSON.stringify(SAMPLE_DATA));
    }
  }

  // Build dynamic form sections
  renderEducationForm();
  renderSocialLinksForm();
  renderPhoneForm();
  renderSiblingsForm();

  // Populate static form controls
  populateForm(appData);

  // Initial render
  renderBiodataPreview(appData);

  // Setup UI event listeners
  setupFormListeners();
  setupPhotoUploaders();
  setupZoomControls();
  setupActions();
  setupDynamicButtons();
  setupMobileTabs();

  // Initial scale calculation
  setTimeout(() => {
    updateScale();
    checkA4Overflow();
  }, 120);
  window.addEventListener('resize', () => {
    if (scaleMode === 'fit') updateScale();
  });
}

/* ==========================================================================
   DEEP MERGE loaded JSON with default structure
   ========================================================================== */

function mergeWithDefault(json) {
  const merged = JSON.parse(JSON.stringify(SAMPLE_DATA));
  if (!json) return merged;

  if (json.header) Object.assign(merged.header, json.header);
  if (json.personal) Object.assign(merged.personal, json.personal);
  if (json.professional) Object.assign(merged.professional, json.professional);
  if (json.nativePlace) merged.nativePlace = json.nativePlace;
  if (json.permanentAddress) Object.assign(merged.permanentAddress, json.permanentAddress);
  if (json.contact && json.contact.phones) merged.contact.phones = json.contact.phones;

  // Custom labels
  if (json.customLabels) Object.assign(merged.customLabels, json.customLabels);

  // Education array
  if (Array.isArray(json.education) && json.education.length > 0) {
    merged.education = json.education;
  }

  // Profile links - handle both old object format and new array format
  if (json.profileLinks) {
    if (Array.isArray(json.profileLinks)) {
      merged.profileLinks = json.profileLinks;
    } else {
      // Convert old object format to array
      const arr = [];
      const oldKeys = ['jeevansathi', 'shaadi', 'linkedin'];
      const platformNames = { jeevansathi: 'Jeevansathi ID', shaadi: 'Shaadi ID', linkedin: 'LinkedIn' };
      oldKeys.forEach(k => {
        const v = json.profileLinks[k];
        if (v) {
          arr.push({
            enabled: v.enabled !== false,
            platform: v.label || platformNames[k] || k,
            id: v.id || '',
            url: v.url || '',
            isExternal: k === 'linkedin'
          });
        }
      });
      if (arr.length > 0) merged.profileLinks = arr;
    }
  }

  // Family details
  if (json.family) {
    if (json.family.mother) {
      const m = json.family.mother;
      if (m.startsWith('Late Smt.')) {
        merged.family.motherTitle = 'Late Smt.';
        merged.family.mother = m.replace('Late Smt.', '').trim();
      } else if (m.startsWith('Smt.')) {
        merged.family.motherTitle = 'Smt.';
        merged.family.mother = m.replace('Smt.', '').trim();
      } else {
        merged.family.mother = m;
      }
    }
    if (json.family.motherTitle) merged.family.motherTitle = json.family.motherTitle;

    if (json.family.father) {
      const f = json.family.father;
      if (f.startsWith('Late Shri')) {
        merged.family.fatherTitle = 'Late Shri';
        merged.family.father = f.replace('Late Shri', '').trim();
      } else if (f.startsWith('Shri')) {
        merged.family.fatherTitle = 'Shri';
        merged.family.father = f.replace('Shri', '').trim();
      } else {
        merged.family.father = f;
      }
    }
    if (json.family.fatherTitle) merged.family.fatherTitle = json.family.fatherTitle;

    if (json.family.hasSiblings !== undefined) merged.family.hasSiblings = json.family.hasSiblings;
    if (Array.isArray(json.family.siblings) && json.family.siblings.length > 0) {
      merged.family.hasSiblings = true;
      merged.family.siblings = json.family.siblings;
    }

    if (json.family.paternalFamily && typeof json.family.paternalFamily === 'object') {
      const pat = json.family.paternalFamily;
      Object.assign(merged.family.paternalFamily, pat);
      // Parse title from name if needed
      if (pat.grandmother && !pat.grandmotherTitle) {
        if (pat.grandmother.startsWith('Late Smt.')) {
          merged.family.paternalFamily.grandmotherTitle = 'Late Smt.';
          merged.family.paternalFamily.grandmother = pat.grandmother.replace('Late Smt.', '').trim();
        } else if (pat.grandmother.startsWith('Smt.')) {
          merged.family.paternalFamily.grandmotherTitle = 'Smt.';
          merged.family.paternalFamily.grandmother = pat.grandmother.replace('Smt.', '').trim();
        }
      }
      if (pat.grandfather && !pat.grandfatherTitle) {
        if (pat.grandfather.startsWith('Late Shri')) {
          merged.family.paternalFamily.grandfatherTitle = 'Late Shri';
          merged.family.paternalFamily.grandfather = pat.grandfather.replace('Late Shri', '').trim();
        } else if (pat.grandfather.startsWith('Shri')) {
          merged.family.paternalFamily.grandfatherTitle = 'Shri';
          merged.family.paternalFamily.grandfather = pat.grandfather.replace('Shri', '').trim();
        }
      }
      if (pat.buas) {
        merged.family.paternalFamily.hasBuas = true;
        parseCountAndLocation(pat.buas, merged.family.paternalFamily, 'bua');
      }
      if (pat.chachas) {
        merged.family.paternalFamily.hasChachas = true;
        parseCountAndLocation(pat.chachas, merged.family.paternalFamily, 'chacha');
      }
    }

    if (json.family.maternalFamily && typeof json.family.maternalFamily === 'object') {
      const mat = json.family.maternalFamily;
      Object.assign(merged.family.maternalFamily, mat);
      if (mat.grandmother && !mat.grandmotherTitle) {
        if (mat.grandmother.startsWith('Late Smt.')) {
          merged.family.maternalFamily.grandmotherTitle = 'Late Smt.';
          merged.family.maternalFamily.grandmother = mat.grandmother.replace('Late Smt.', '').trim();
        } else if (mat.grandmother.startsWith('Smt.')) {
          merged.family.maternalFamily.grandmotherTitle = 'Smt.';
          merged.family.maternalFamily.grandmother = mat.grandmother.replace('Smt.', '').trim();
        }
      }
      if (mat.grandfather && !mat.grandfatherTitle) {
        if (mat.grandfather.startsWith('Late Shri')) {
          merged.family.maternalFamily.grandfatherTitle = 'Late Shri';
          merged.family.maternalFamily.grandfather = mat.grandfather.replace('Late Shri', '').trim();
        } else if (mat.grandfather.startsWith('Shri')) {
          merged.family.maternalFamily.grandfatherTitle = 'Shri';
          merged.family.maternalFamily.grandfather = mat.grandfather.replace('Shri', '').trim();
        }
      }
      if (mat.mamas) {
        merged.family.maternalFamily.hasMamas = true;
        parseCountAndLocation(mat.mamas, merged.family.maternalFamily, 'mama');
      }
      if (mat.mausis) {
        merged.family.maternalFamily.hasMausis = true;
        parseCountAndLocation(mat.mausis, merged.family.maternalFamily, 'mausi');
      }
    }
  }

  // Photos
  if (Array.isArray(json.photos) && json.photos.length > 0) {
    merged.photos = json.photos;
  }

  return merged;
}

function parseCountAndLocation(str, obj, prefix) {
  if (!str) return;
  const colonIdx = str.indexOf(':');
  if (colonIdx !== -1) {
    const lead = str.substring(0, colonIdx).trim();
    const loc = str.substring(colonIdx + 1).trim();
    const countMatch = lead.match(/\d+/);
    obj[`${prefix}Count`] = countMatch ? countMatch[0] : '1';
    obj[`${prefix}Location`] = loc;
  } else {
    obj[`${prefix}Location`] = str;
  }
}

/* ==========================================================================
   DYNAMIC FORM BUILDERS (Education, Social Links, Phones)
   ========================================================================== */

function renderEducationForm() {
  const container = document.getElementById('edu-container');
  if (!container) return;
  container.innerHTML = '';
  appData.education.forEach((edu, i) => {
    container.appendChild(createEducationCard(i, edu));
  });
  updateAddBtnVisibility('btn-add-edu', appData.education.length, MAX_EDUCATION);
}

function createEducationCard(index, edu) {
  const card = document.createElement('div');
  card.className = 'repeatable-entry';
  card.dataset.eduIndex = index;
  const label = index === 0 ? 'PRIMARY DEGREE' : `DEGREE ${index + 1}`;
  card.innerHTML = `
    <div class="entry-header">
      <span class="entry-label">${label}</span>
      ${index > 0 ? `<button type="button" class="btn-remove" data-action="remove-edu" data-index="${index}" title="Remove this degree">\u2715</button>` : ''}
    </div>
    <div class="form-row-2">
      <div class="form-group">
        <label class="form-label">Degree</label>
        <input class="form-input" data-field="edu-degree-${index}" type="text" placeholder="e.g. B.E / B.Tech / MBA" value="${escapeHtml(edu.degree || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Field / Stream</label>
        <input class="form-input" data-field="edu-field-${index}" type="text" placeholder="e.g. Electrical & Electronics" value="${escapeHtml(edu.field || '')}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">University / College & City</label>
      <input class="form-input" data-field="edu-inst-${index}" type="text" placeholder="e.g. PES University, Bangalore" value="${escapeHtml(edu.institution || '')}">
    </div>
  `;
  return card;
}

function addEducationEntry() {
  if (appData.education.length >= MAX_EDUCATION) {
    showToast(`Maximum ${MAX_EDUCATION} degrees allowed`);
    return;
  }
  appData.education.push({ degree: '', field: '', institution: '' });
  renderEducationForm();
  triggerUpdate();
}

function removeEducationEntry(index) {
  if (appData.education.length <= 1) return;
  appData.education.splice(index, 1);
  renderEducationForm();
  triggerUpdate();
}

function renderSocialLinksForm() {
  const container = document.getElementById('social-container');
  if (!container) return;
  container.innerHTML = '';
  appData.profileLinks.forEach((link, i) => {
    container.appendChild(createSocialLinkCard(i, link));
  });
  updateAddBtnVisibility('btn-add-social', appData.profileLinks.length, MAX_SOCIAL_LINKS);
}

function createSocialLinkCard(index, link) {
  const card = document.createElement('div');
  card.className = 'repeatable-card';
  card.dataset.socialIndex = index;
  card.innerHTML = `
    <div class="entry-header">
      <label class="toggle-row">
        <input type="checkbox" data-field="social-enabled-${index}" ${link.enabled !== false ? 'checked' : ''}>
        <span class="toggle-label">Profile Link ${index + 1}</span>
      </label>
      ${appData.profileLinks.length > 1 ? `<button type="button" class="btn-remove" data-action="remove-social" data-index="${index}" title="Remove this link">\u2715</button>` : ''}
    </div>
    <div class="conditional-fields ${link.enabled === false ? 'is-hidden' : ''}" data-social-group="${index}">
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Platform Name</label>
          <input class="form-input" data-field="social-platform-${index}" type="text" placeholder="e.g. Jeevansathi ID" value="${escapeHtml(link.platform || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Profile ID</label>
          <input class="form-input" data-field="social-id-${index}" type="text" placeholder="e.g. TUWA2925" value="${escapeHtml(link.id || '')}">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Profile URL</label>
          <input class="form-input" data-field="social-url-${index}" type="url" placeholder="https://..." value="${escapeHtml(link.url || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Show external icon?</label>
          <label class="toggle-row" style="margin-top:4px">
            <input type="checkbox" data-field="social-external-${index}" ${link.isExternal ? 'checked' : ''}>
            <span class="toggle-label">External link icon</span>
          </label>
        </div>
      </div>
    </div>
  `;
  return card;
}

function addSocialLink() {
  if (appData.profileLinks.length >= MAX_SOCIAL_LINKS) {
    showToast(`Maximum ${MAX_SOCIAL_LINKS} profile links allowed`);
    return;
  }
  appData.profileLinks.push({ enabled: true, platform: '', id: '', url: '', isExternal: false });
  renderSocialLinksForm();
  triggerUpdate();
}

function removeSocialLink(index) {
  if (appData.profileLinks.length <= 1) return;
  appData.profileLinks.splice(index, 1);
  renderSocialLinksForm();
  triggerUpdate();
}

function renderPhoneForm() {
  const container = document.getElementById('phone-container');
  if (!container) return;
  container.innerHTML = '';
  const phones = appData.contact.phones || [];
  if (phones.length === 0) phones.push('');
  phones.forEach((ph, i) => {
    const group = document.createElement('div');
    group.className = 'phone-entry';
    group.dataset.phoneIndex = i;
    const labelText = i === 0 ? 'Primary Phone' : `Phone ${i + 1}`;
    const optional = i > 0 ? ' <span class="optional">(optional)</span>' : '';
    group.innerHTML = `
      <div class="form-group" style="flex:1">
        <label class="form-label">${labelText}${optional}</label>
        <input class="form-input" data-field="phone-${i}" type="tel" placeholder="+91 ..." value="${escapeHtml(ph || '')}">
      </div>
      ${i > 0 ? `<button type="button" class="btn-remove btn-remove-phone" data-action="remove-phone" data-index="${i}" title="Remove">\u2715</button>` : ''}
    `;
    container.appendChild(group);
  });
  updateAddBtnVisibility('btn-add-phone', phones.length, MAX_PHONES);
}

function addPhoneEntry() {
  if (appData.contact.phones.length >= MAX_PHONES) {
    showToast(`Maximum ${MAX_PHONES} phone numbers allowed`);
    return;
  }
  appData.contact.phones.push('');
  renderPhoneForm();
  triggerUpdate();
}

function removePhoneEntry(index) {
  if (appData.contact.phones.length <= 1) return;
  appData.contact.phones.splice(index, 1);
  renderPhoneForm();
  triggerUpdate();
}

function updateAddBtnVisibility(btnId, count, max) {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.style.display = count >= max ? 'none' : '';
    btn.textContent = `+ Add (${count}/${max})`;
  }
}

/* ==========================================================================
   DYNAMIC SIBLINGS FORM
   ========================================================================== */

function renderSiblingsForm() {
  const container = document.getElementById('siblings-container');
  if (!container) return;
  container.innerHTML = '';
  const siblings = appData.family.siblings || [];
  siblings.forEach((sib, i) => {
    container.appendChild(createSiblingCard(i, sib));
  });
  updateAddBtnVisibility('btn-add-sibling', siblings.length, MAX_SIBLINGS);
}

function createSiblingCard(index, sib) {
  const card = document.createElement('div');
  card.className = 'repeatable-entry';
  card.dataset.sibIndex = index;
  const label = `SIBLING ${index + 1}`;
  card.innerHTML = `
    <div class="entry-header">
      <span class="entry-label">${label}</span>
      ${index > 0 ? `<button type="button" class="btn-remove" data-action="remove-sibling" data-index="${index}" title="Remove this sibling">\u2715</button>` : ''}
    </div>
    <div class="form-row-2">
      <div class="form-group">
        <label class="form-label">Relation</label>
        <select class="form-input" data-field="sib-rel-${index}">
          <option value="Elder Brother" ${(sib.relation === 'Elder Brother') ? 'selected' : ''}>Elder Brother</option>
          <option value="Younger Brother" ${(sib.relation === 'Younger Brother') ? 'selected' : ''}>Younger Brother</option>
          <option value="Elder Sister" ${(sib.relation === 'Elder Sister') ? 'selected' : ''}>Elder Sister</option>
          <option value="Younger Sister" ${(sib.relation === 'Younger Sister') ? 'selected' : ''}>Younger Sister</option>
          <option value="Brother" ${(sib.relation === 'Brother') ? 'selected' : ''}>Brother</option>
          <option value="Sister" ${(sib.relation === 'Sister') ? 'selected' : ''}>Sister</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Sibling Name</label>
        <input class="form-input" data-field="sib-name-${index}" type="text" placeholder="e.g. Harshit Agarwal" value="${escapeHtml(sib.name || '')}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Career Detail (Line 1)</label>
      <input class="form-input" data-field="sib-d1-${index}" type="text" placeholder="e.g. Senior Manager, Yes Bank" value="${escapeHtml((sib.details && sib.details[0]) || '')}">
    </div>
    <div class="form-group">
      <label class="form-label">Education / Other Detail (Line 2)</label>
      <input class="form-input" data-field="sib-d2-${index}" type="text" placeholder="e.g. MBA (BM) @ XIMB" value="${escapeHtml((sib.details && sib.details[1]) || '')}">
    </div>
  `;
  return card;
}

function addSiblingEntry() {
  if (!appData.family.siblings) appData.family.siblings = [];
  if (appData.family.siblings.length >= MAX_SIBLINGS) {
    showToast(`Maximum ${MAX_SIBLINGS} siblings allowed`);
    return;
  }
  appData.family.siblings.push({ relation: 'Elder Brother', name: '', details: [] });
  appData.family.hasSiblings = true;
  renderSiblingsForm();
  triggerUpdate();
}

function removeSiblingEntry(index) {
  if (!appData.family.siblings || appData.family.siblings.length <= 1) return;
  appData.family.siblings.splice(index, 1);
  renderSiblingsForm();
  triggerUpdate();
}

/* ==========================================================================
   POPULATE FORM from state
   ========================================================================== */

function populateForm(d) {
  // Header
  setVal('f-mantra', d.header.mantra);
  setVal('f-name', d.header.name || d.personal.name);
  setVal('f-subtitle', d.header.subtitle);

  // Custom labels
  const labels = d.customLabels || {};
  setVal('f-section-divider', labels.sectionDivider || 'Biodata Profile');
  setVal('f-card1-title', labels.card1Title || 'Personal & Professional Details');
  setVal('f-card2-title', labels.card2Title || 'Family');

  // Personal
  setVal('f-gotra', d.personal.gotra);
  setVal('f-height', d.personal.height);
  setVal('f-dob', d.personal.dateOfBirth);
  setVal('f-tob', d.personal.timeOfBirth);
  setVal('f-pob', d.personal.placeOfBirth);
  setVal('f-manglik', d.personal.manglik || '');

  // Education (dynamic form already rendered)
  d.education.forEach((edu, i) => {
    setDynVal(`edu-degree-${i}`, edu.degree);
    setDynVal(`edu-field-${i}`, edu.field);
    setDynVal(`edu-inst-${i}`, edu.institution);
  });

  // Professional
  setVal('f-prof-desig', d.professional.designation);
  setVal('f-prof-comp', d.professional.company);
  setVal('f-prof-loc', d.professional.workLocation);
  setVal('f-prof-addr', d.professional.officeAddress);
  setVal('f-prof-map', d.professional.mapLink);

  // Social links (dynamic form already rendered)
  d.profileLinks.forEach((link, i) => {
    setDynChecked(`social-enabled-${i}`, link.enabled !== false);
    setDynVal(`social-platform-${i}`, link.platform);
    setDynVal(`social-id-${i}`, link.id);
    setDynVal(`social-url-${i}`, link.url);
    setDynChecked(`social-external-${i}`, link.isExternal);
  });

  // Native & Residence
  setVal('f-native', d.nativePlace);
  setVal('f-res-line1', d.permanentAddress.line1);
  setVal('f-res-line2', d.permanentAddress.line2);
  setVal('f-res-map', d.permanentAddress.mapLink);

  // Phones (dynamic form already rendered)
  (d.contact.phones || []).forEach((ph, i) => {
    setDynVal(`phone-${i}`, ph);
  });

  // Parents
  setVal('f-mother-title', d.family.motherTitle || 'Smt.');
  setVal('f-mother', d.family.mother || '');
  setVal('f-father-title', d.family.fatherTitle || 'Shri');
  setVal('f-father', d.family.father || '');

  // Siblings (dynamic form already rendered)
  setChecked('f-has-siblings', d.family.hasSiblings !== false);
  toggleGroupVisibility('group-siblings', d.family.hasSiblings !== false);
  (d.family.siblings || []).forEach((sib, i) => {
    setDynVal(`sib-rel-${i}`, sib.relation || 'Elder Brother');
    setDynVal(`sib-name-${i}`, sib.name || '');
    setDynVal(`sib-d1-${i}`, (sib.details && sib.details[0]) || '');
    setDynVal(`sib-d2-${i}`, (sib.details && sib.details[1]) || '');
  });

  // Paternal Family
  const pat = d.family.paternalFamily || {};
  setVal('f-pat-gmother-title', pat.grandmotherTitle || 'Late Smt.');
  setVal('f-pat-gmother', pat.grandmother || '');
  setVal('f-pat-gfather-title', pat.grandfatherTitle || 'Shri');
  setVal('f-pat-gfather', pat.grandfather || '');

  setChecked('f-has-buas', pat.hasBuas !== false);
  setVal('f-bua-count', pat.buaCount || '3');
  setVal('f-bua-loc', pat.buaLocation || '');
  toggleGroupVisibility('group-buas', pat.hasBuas !== false);

  setChecked('f-has-chachas', pat.hasChachas !== false);
  setVal('f-chacha-count', pat.chachaCount || '3');
  setVal('f-chacha-loc', pat.chachaLocation || '');
  toggleGroupVisibility('group-chachas', pat.hasChachas !== false);

  // Maternal Family
  const mat = d.family.maternalFamily || {};
  setVal('f-mat-gmother-title', mat.grandmotherTitle || 'Late Smt.');
  setVal('f-mat-gmother', mat.grandmother || '');
  setVal('f-mat-gfather-title', mat.grandfatherTitle || 'Late Shri');
  setVal('f-mat-gfather', mat.grandfather || '');

  setChecked('f-has-mamas', mat.hasMamas !== false);
  setVal('f-mama-count', mat.mamaCount || '3');
  setVal('f-mama-loc', mat.mamaLocation || '');
  toggleGroupVisibility('group-mamas', mat.hasMamas !== false);

  setChecked('f-has-mausis', mat.hasMausis !== false);
  setVal('f-mausi-count', mat.mausiCount || '3');
  setVal('f-mausi-loc', mat.mausiLocation || '');
  toggleGroupVisibility('group-mausis', mat.hasMausis !== false);

  // Photos
  updatePhotoThumbnails();
}

/* Form helpers */
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined && val !== null ? val : '';
}
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function setChecked(id, bool) {
  const el = document.getElementById(id);
  if (el) el.checked = Boolean(bool);
}
function getChecked(id) {
  const el = document.getElementById(id);
  return el ? el.checked : false;
}
function toggleGroupVisibility(groupId, isVisible) {
  const el = document.getElementById(groupId);
  if (el) {
    if (isVisible) el.classList.remove('is-hidden');
    else el.classList.add('is-hidden');
  }
}

// Dynamic field helpers (data-field attribute based)
function setDynVal(fieldName, val) {
  const el = document.querySelector(`[data-field="${fieldName}"]`);
  if (el) el.value = val !== undefined && val !== null ? val : '';
}
function getDynVal(fieldName) {
  const el = document.querySelector(`[data-field="${fieldName}"]`);
  return el ? el.value.trim() : '';
}
function setDynChecked(fieldName, bool) {
  const el = document.querySelector(`[data-field="${fieldName}"]`);
  if (el) el.checked = Boolean(bool);
}
function getDynChecked(fieldName) {
  const el = document.querySelector(`[data-field="${fieldName}"]`);
  return el ? el.checked : false;
}

/* ==========================================================================
   SYNCHRONIZE STATE FROM FORM
   ========================================================================== */

function syncStateFromForm() {
  appData.header.mantra = getVal('f-mantra');
  appData.header.name = getVal('f-name');
  appData.header.subtitle = getVal('f-subtitle');

  appData.personal.name = appData.header.name;
  appData.personal.gotra = getVal('f-gotra');
  appData.personal.height = getVal('f-height');
  appData.personal.dateOfBirth = getVal('f-dob');
  appData.personal.timeOfBirth = getVal('f-tob');
  appData.personal.placeOfBirth = getVal('f-pob');
  appData.personal.manglik = getVal('f-manglik');

  // Custom labels
  appData.customLabels = {
    sectionDivider: getVal('f-section-divider') || 'Biodata Profile',
    card1Title: getVal('f-card1-title') || 'Personal & Professional Details',
    card2Title: getVal('f-card2-title') || 'Family'
  };

  // Education (dynamic)
  appData.education = [];
  const eduCards = document.querySelectorAll('[data-edu-index]');
  eduCards.forEach((card, i) => {
    appData.education.push({
      degree: getDynVal(`edu-degree-${i}`),
      field: getDynVal(`edu-field-${i}`),
      institution: getDynVal(`edu-inst-${i}`)
    });
  });
  if (appData.education.length === 0) {
    appData.education.push({ degree: '', field: '', institution: '' });
  }

  appData.professional = {
    designation: getVal('f-prof-desig'),
    company: getVal('f-prof-comp'),
    workLocation: getVal('f-prof-loc'),
    officeAddress: getVal('f-prof-addr'),
    mapLink: getVal('f-prof-map')
  };

  // Social links (dynamic)
  appData.profileLinks = [];
  const socialCards = document.querySelectorAll('[data-social-index]');
  socialCards.forEach((card, i) => {
    const enabled = getDynChecked(`social-enabled-${i}`);
    const group = document.querySelector(`[data-social-group="${i}"]`);
    if (group) {
      if (enabled) group.classList.remove('is-hidden');
      else group.classList.add('is-hidden');
    }
    appData.profileLinks.push({
      enabled,
      platform: getDynVal(`social-platform-${i}`),
      id: getDynVal(`social-id-${i}`),
      url: getDynVal(`social-url-${i}`),
      isExternal: getDynChecked(`social-external-${i}`)
    });
  });

  appData.nativePlace = getVal('f-native');
  appData.permanentAddress = {
    line1: getVal('f-res-line1'),
    line2: getVal('f-res-line2'),
    mapLink: getVal('f-res-map')
  };

  // Phones (dynamic)
  appData.contact.phones = [];
  const phoneEntries = document.querySelectorAll('[data-phone-index]');
  phoneEntries.forEach((entry, i) => {
    const val = getDynVal(`phone-${i}`);
    if (val) appData.contact.phones.push(val);
  });

  // Family (same as before)
  appData.family.motherTitle = getVal('f-mother-title') || 'Smt.';
  appData.family.mother = getVal('f-mother');
  appData.family.fatherTitle = getVal('f-father-title') || 'Shri';
  appData.family.father = getVal('f-father');

  const hasSiblings = getChecked('f-has-siblings');
  toggleGroupVisibility('group-siblings', hasSiblings);
  appData.family.hasSiblings = hasSiblings;
  if (hasSiblings) {
    appData.family.siblings = [];
    const sibCards = document.querySelectorAll('[data-sib-index]');
    sibCards.forEach((card, i) => {
      appData.family.siblings.push({
        relation: getDynVal(`sib-rel-${i}`) || 'Elder Brother',
        name: getDynVal(`sib-name-${i}`),
        details: [getDynVal(`sib-d1-${i}`), getDynVal(`sib-d2-${i}`)].filter(Boolean)
      });
    });
  } else {
    appData.family.siblings = [];
  }

  // Paternal
  const hasBuas = getChecked('f-has-buas');
  toggleGroupVisibility('group-buas', hasBuas);
  const hasChachas = getChecked('f-has-chachas');
  toggleGroupVisibility('group-chachas', hasChachas);

  appData.family.paternalFamily = {
    grandmotherTitle: getVal('f-pat-gmother-title') || 'Late Smt.',
    grandmother: getVal('f-pat-gmother'),
    grandfatherTitle: getVal('f-pat-gfather-title') || 'Shri',
    grandfather: getVal('f-pat-gfather'),
    hasBuas,
    buaCount: getVal('f-bua-count') || '3',
    buaLocation: getVal('f-bua-loc'),
    hasChachas,
    chachaCount: getVal('f-chacha-count') || '3',
    chachaLocation: getVal('f-chacha-loc')
  };

  // Maternal
  const hasMamas = getChecked('f-has-mamas');
  toggleGroupVisibility('group-mamas', hasMamas);
  const hasMausis = getChecked('f-has-mausis');
  toggleGroupVisibility('group-mausis', hasMausis);

  appData.family.maternalFamily = {
    grandmotherTitle: getVal('f-mat-gmother-title') || 'Late Smt.',
    grandmother: getVal('f-mat-gmother'),
    grandfatherTitle: getVal('f-mat-gfather-title') || 'Late Shri',
    grandfather: getVal('f-mat-gfather'),
    hasMamas,
    mamaCount: getVal('f-mama-count') || '3',
    mamaLocation: getVal('f-mama-loc'),
    hasMausis,
    mausiCount: getVal('f-mausi-count') || '3',
    mausiLocation: getVal('f-mausi-loc')
  };
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */

function triggerUpdate() {
  syncStateFromForm();
  if (renderTimeout) cancelAnimationFrame(renderTimeout);
  renderTimeout = requestAnimationFrame(() => {
    renderBiodataPreview(appData);
    checkA4Overflow();
  });

  // Auto-save (debounced 2s)
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveToLocalStorage(), 2000);
}

function setupFormListeners() {
  const form = document.getElementById('biodata-form');
  if (!form) return;

  form.addEventListener('input', triggerUpdate);
  form.addEventListener('change', triggerUpdate);
}

function setupDynamicButtons() {
  // Education add
  const btnAddEdu = document.getElementById('btn-add-edu');
  if (btnAddEdu) btnAddEdu.addEventListener('click', addEducationEntry);

  // Social links add
  const btnAddSocial = document.getElementById('btn-add-social');
  if (btnAddSocial) btnAddSocial.addEventListener('click', addSocialLink);

  // Phone add
  const btnAddPhone = document.getElementById('btn-add-phone');
  if (btnAddPhone) btnAddPhone.addEventListener('click', addPhoneEntry);

  // Sibling add
  const btnAddSibling = document.getElementById('btn-add-sibling');
  if (btnAddSibling) btnAddSibling.addEventListener('click', addSiblingEntry);

  // Delegate remove buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const index = parseInt(btn.dataset.index, 10);
    if (action === 'remove-edu') removeEducationEntry(index);
    else if (action === 'remove-social') removeSocialLink(index);
    else if (action === 'remove-phone') removePhoneEntry(index);
    else if (action === 'remove-sibling') removeSiblingEntry(index);
  });

  // Export/Import
  const btnExport = document.getElementById('btn-export-json');
  if (btnExport) btnExport.addEventListener('click', exportDataAsJSON);

  const btnImport = document.getElementById('btn-import-json');
  if (btnImport) {
    btnImport.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        if (e.target.files[0]) importDataFromJSON(e.target.files[0]);
      };
      input.click();
    });
  }

  const btnLoadExample = document.getElementById('btn-load-example');
  if (btnLoadExample) {
    btnLoadExample.addEventListener('click', async () => {
      if (confirm("This will overwrite your current data with the example template. Continue?")) {
        try {
          const res = await fetch('metadata/details.example.json');
          if (!res.ok) throw new Error('Failed to load example JSON');
          const exampleData = await res.json();
          populateForm(exampleData);
          saveData();
          renderPreview();
        } catch (e) {
          alert("Error loading example data: " + e.message);
        }
      }
    });
  }
}

/* ==========================================================================
   PHOTO UPLOADERS
   ========================================================================== */

function setupPhotoUploaders() {
  [0, 1, 2].forEach(index => {
    const dropzone = document.getElementById(`photo-dropzone-${index}`);
    const fileInput = document.getElementById(`photo-input-${index}`);
    const removeBtn = document.getElementById(`photo-remove-${index}`);

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--app-gold-bright)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = '';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processImageFile(e.dataTransfer.files[0], index);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processImageFile(e.target.files[0], index);
      }
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        appData.photos[index] = '';
        updatePhotoThumbnails();
        renderBiodataPreview(appData);
      });
    }
  });
}

function processImageFile(file, index) {
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file');
    return;
  }

  // Instant blob URL preview
  const blobUrl = URL.createObjectURL(file);
  appData.photos[index] = blobUrl;
  updatePhotoThumbnails();
  renderBiodataPreview(appData);

  // Background conversion to Base64 data URL for bulletproof PDF generation & localStorage
  const reader = new FileReader();
  reader.onload = (e) => {
    appData.photos[index] = e.target.result;
    // Auto-save after photo is converted to base64
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveToLocalStorage(), 1000);
  };
  reader.readAsDataURL(file);
}

function updatePhotoThumbnails() {
  [0, 1, 2].forEach(index => {
    const dropzone = document.getElementById(`photo-dropzone-${index}`);
    const thumbImg = document.getElementById(`photo-thumb-${index}`);
    const emptyState = document.getElementById(`dropzone-empty-${index}`);
    const removeBtn = document.getElementById(`photo-remove-${index}`);

    const src = appData.photos[index];
    if (src && src.trim() !== '') {
      if (thumbImg) {
        thumbImg.src = src;
        thumbImg.style.display = 'block';
      }
      if (emptyState) emptyState.style.display = 'none';
      if (dropzone) dropzone.classList.add('has-image');
      if (removeBtn) removeBtn.style.display = 'inline-flex';
    } else {
      if (thumbImg) {
        thumbImg.src = '';
        thumbImg.style.display = 'none';
      }
      if (emptyState) emptyState.style.display = 'flex';
      if (dropzone) dropzone.classList.remove('has-image');
      if (removeBtn) removeBtn.style.display = 'none';
    }
  });
}

/* ==========================================================================
   ZOOM & SCALE
   ========================================================================== */

function setupZoomControls() {
  const btnIn = document.getElementById('zoom-in');
  const btnOut = document.getElementById('zoom-out');
  const btnFit = document.getElementById('zoom-fit');

  const setManualScale = (newScale) => {
    scaleMode = 'manual';
    currentScale = Math.min(Math.max(newScale, 0.4), 1.5);
    applyScale(currentScale);
  };

  if (btnIn) btnIn.addEventListener('click', () => setManualScale(currentScale + 0.1));
  if (btnOut) btnOut.addEventListener('click', () => setManualScale(currentScale - 0.1));
  if (btnFit) btnFit.addEventListener('click', () => {
    scaleMode = 'fit';
    updateScale();
  });
}

function updateScale() {
  if (scaleMode !== 'fit') return;
  const viewport = document.getElementById('preview-viewport');
  const preview = document.getElementById('biodata-preview');
  if (!viewport || !preview) return;

  const vpW = viewport.clientWidth - 40;
  const vpH = viewport.clientHeight - 48;

  const a4W = 793.7;
  const a4H = 1122.5;

  const scaleX = vpW / a4W;
  const scaleY = vpH / a4H;
  currentScale = Math.min(scaleX, scaleY, 1.0);
  applyScale(currentScale);
}

function applyScale(scale) {
  const stage = document.getElementById('preview-stage');
  const preview = document.getElementById('biodata-preview');
  const zoomText = document.getElementById('zoom-value');

  if (stage && preview) {
    const a4W = 793.7;
    const a4H = 1122.5;
    preview.style.transform = `scale(${scale})`;
    preview.style.transformOrigin = 'top left';
    stage.style.width = `${Math.round(a4W * scale)}px`;
    stage.style.height = `${Math.round(a4H * scale)}px`;
  }

  if (zoomText) {
    zoomText.textContent = scaleMode === 'fit' ? 'Fit' : `${Math.round(scale * 100)}%`;
  }
}

/* ==========================================================================
   ACTION BUTTONS
   ========================================================================== */

function setupActions() {
  // Load Sample Data
  const btnSample = document.getElementById('btn-load-sample');
  if (btnSample) {
    btnSample.addEventListener('click', () => {
      appData = JSON.parse(JSON.stringify(SAMPLE_DATA));
      renderEducationForm();
      renderSocialLinksForm();
      renderPhoneForm();
      renderSiblingsForm();
      populateForm(appData);
      renderBiodataPreview(appData);
      checkA4Overflow();
      saveToLocalStorage();
      showToast('Gaurav\'s sample biodata loaded!');
    });
  }

  // Clear Form
  const btnClear = document.getElementById('btn-clear-form');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (!confirm('Clear all form entries? This will also clear saved progress.')) return;
      appData = {
        header: { mantra: "|| \u0936\u094d\u0930\u0940 \u0917\u0923\u0947\u0936\u093e\u092f \u0928\u092e\u0903 ||", ganeshImage: "metadata/Ganesh.png", name: "", subtitle: "" },
        customLabels: { sectionDivider: "Biodata Profile", card1Title: "Personal & Professional Details", card2Title: "Family" },
        photos: ["", "", ""],
        personal: { name: "", gotra: "", height: "", dateOfBirth: "", timeOfBirth: "", placeOfBirth: "", manglik: "" },
        education: [{ degree: "", field: "", institution: "" }],
        professional: { designation: "", company: "", workLocation: "", officeAddress: "", mapLink: "" },
        profileLinks: [{ enabled: false, platform: "", id: "", url: "", isExternal: false }],
        nativePlace: "",
        permanentAddress: { line1: "", line2: "", mapLink: "" },
        contact: { phones: [""] },
        family: {
          motherTitle: "Smt.", mother: "", fatherTitle: "Shri", father: "",
          hasSiblings: false, siblings: [],
          paternalFamily: {
            grandmotherTitle: "Late Smt.", grandmother: "",
            grandfatherTitle: "Shri", grandfather: "",
            hasBuas: false, buaCount: "", buaLocation: "",
            hasChachas: false, chachaCount: "", chachaLocation: ""
          },
          maternalFamily: {
            grandmotherTitle: "Late Smt.", grandmother: "",
            grandfatherTitle: "Late Shri", grandfather: "",
            hasMamas: false, mamaCount: "", mamaLocation: "",
            hasMausis: false, mausiCount: "", mausiLocation: ""
          }
        }
      };
      renderEducationForm();
      renderSocialLinksForm();
      renderPhoneForm();
      renderSiblingsForm();
      populateForm(appData);
      renderBiodataPreview(appData);
      checkA4Overflow();
      clearLocalStorage();
      showToast('Form cleared & saved data removed');
    });
  }

  // Manual Save
  const btnSave = document.getElementById('btn-save-progress');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      syncStateFromForm();
      saveToLocalStorage();
      showToast('\u2714 Progress saved!');
    });
  }
  // Download dropdown
  setupDownloadDropdown();
}

function setupMobileTabs() {
  const tabEdit = document.getElementById('tab-edit');
  const tabPrev = document.getElementById('tab-prev');
  const body = document.getElementById('app-body');

  if (tabEdit) {
    tabEdit.addEventListener('click', () => {
      tabEdit.classList.add('active');
      if (tabPrev) tabPrev.classList.remove('active');
      if (body) body.classList.remove('show-preview');
    });
  }
  if (tabPrev) {
    tabPrev.addEventListener('click', () => {
      tabPrev.classList.add('active');
      if (tabEdit) tabEdit.classList.remove('active');
      if (body) body.classList.add('show-preview');
      setTimeout(updateScale, 50);
    });
  }
}

/* ==========================================================================
   A4 OVERFLOW DETECTION
   ========================================================================== */

function checkA4Overflow() {
  const preview = document.getElementById('biodata-preview');
  const banner = document.getElementById('overflow-warning');
  if (!preview || !banner) return;

  // Try auto-fit first
  autoFitContent(preview);

  const a4HeightPx = 1122.5; // 297mm at 96 DPI
  const contentHeight = preview.scrollHeight;

  if (contentHeight > a4HeightPx + 2) { // 2px tolerance
    const overflowMm = ((contentHeight - a4HeightPx) / 3.7795).toFixed(1);
    banner.innerHTML = `\u26a0\ufe0f <strong>Content overflows by ~${overflowMm}mm</strong> \u2014 reduce data or it will be clipped in PDF`;
    banner.classList.add('is-visible');
    preview.classList.add('overflow-danger');
  } else {
    banner.classList.remove('is-visible');
    preview.classList.remove('overflow-danger');
  }
}

/**
 * Auto-fit content to A4 page by dynamically reducing font-size
 * on card bodies when content overflows. Minimum 9pt floor.
 */
function autoFitContent(preview) {
  if (!preview) return;

  const a4HeightPx = 1122.5;
  const baseFontSizePt = 11.4;
  const minFontSizePt = 9.0;
  const stepPt = 0.2;

  // Reset to base size first
  const cardBodies = preview.querySelectorAll('.entries-timeline, .family-timeline');
  cardBodies.forEach(el => { el.style.fontSize = ''; });

  // Measure at base size
  let currentHeight = preview.scrollHeight;
  if (currentHeight <= a4HeightPx + 2) return; // Already fits

  // Progressively shrink
  let currentFontPt = baseFontSizePt;
  while (currentHeight > a4HeightPx + 2 && currentFontPt > minFontSizePt) {
    currentFontPt -= stepPt;
    const fontSizeStr = `${currentFontPt}pt`;
    cardBodies.forEach(el => { el.style.fontSize = fontSizeStr; });
    currentHeight = preview.scrollHeight;
  }
}

/* ==========================================================================
   RENDER BIODATA PREVIEW - Redesigned Header Layout
   ========================================================================== */

function renderBiodataPreview(d) {
  const preview = document.getElementById('biodata-preview');
  if (!preview) return;

  // Prepare values
  const mantra = escapeHtml(d.header.mantra || '');
  const candidateName = escapeHtml(d.header.name || d.personal.name || 'Your Name');
  const subtitle = escapeHtml(d.header.subtitle || '');
  const subtitleFormatted = subtitle.split('|').map(s => s.trim()).filter(Boolean).join(' &nbsp;|&nbsp; ');

  // Section labels
  const labels = d.customLabels || {};
  const sectionDividerText = escapeHtml(labels.sectionDivider || 'Biodata Profile');
  const card1Title = escapeHtml(labels.card1Title || 'Personal &amp; Professional Details');
  const card2Title = escapeHtml(labels.card2Title || 'Family');

  // Photos
  const photos = [0, 1, 2].map(i => {
    const src = (d.photos && d.photos[i]) || '';
    return src && src.trim() !== '' ? src : PLACEHOLDER_SVG;
  });

  // === CARD 1: PERSONAL & PROFESSIONAL ENTRIES ===
  // 1. Personal details
  let personalRowsHtml = '';
  const name = escapeHtml(d.personal.name || '');
  const gotra = escapeHtml(d.personal.gotra || '');
  const height = escapeHtml(d.personal.height || '');
  const manglik = escapeHtml(d.personal.manglik || '');

  if (name || gotra || height || manglik) {
    let parts = [];
    if (name) parts.push(`<strong>Name:</strong> ${name}`);
    if (gotra) parts.push(`<strong>Gotra:</strong> ${gotra}`);
    if (height) parts.push(`<strong>Height:</strong> ${height}`);
    if (manglik) parts.push(`<strong>Manglik:</strong> ${manglik}`);
    personalRowsHtml += `<p>${parts.join(' &nbsp;\u00b7&nbsp; ')}</p>`;
  }

  const dob = escapeHtml(d.personal.dateOfBirth || '');
  const tob = escapeHtml(d.personal.timeOfBirth || '');
  if (dob || tob) {
    let parts = [];
    if (dob) parts.push(`<strong>Date of Birth:</strong> ${dob}`);
    if (tob) parts.push(`<strong>Time:</strong> ${tob}`);
    personalRowsHtml += `<p>${parts.join(' &nbsp;\u00b7&nbsp; ')}</p>`;
  }

  const pob = escapeHtml(d.personal.placeOfBirth || '');
  if (pob) {
    personalRowsHtml += `<p><strong>Place of Birth:</strong> ${pob}</p>`;
  }

  // 2. Education entries (multiple)
  let educationHtml = '';
  if (d.education && d.education.length > 0) {
    const eduItems = d.education.filter(e => e.degree || e.field || e.institution);
    if (eduItems.length > 0) {
      educationHtml = `
        <div class="entry">
          <div class="rail">${getSvgIcon('edu')}</div>
          <div class="entry-body">
            <div class="details">
              ${eduItems.map(e => `
                <p><strong>Education:</strong> ${escapeHtml(e.degree || '')} ${e.field ? `(${escapeHtml(e.field)})` : ''}</p>
                ${e.institution ? `<p class="cont nobullet">${escapeHtml(e.institution)}</p>` : ''}
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  // 3. Professional Details entry
  let professionalHtml = '';
  const pDesig = escapeHtml(d.professional.designation || '');
  const pComp = escapeHtml(d.professional.company || '');
  const pLoc = escapeHtml(d.professional.workLocation || '');
  const pAddr = escapeHtml(d.professional.officeAddress || '');
  const pMap = d.professional.mapLink;

  if (pDesig || pComp || pLoc || pAddr) {
    let line1 = [];
    if (pDesig && pComp) line1.push(`<strong>Profession:</strong> ${pDesig}, ${pComp}`);
    else if (pDesig || pComp) line1.push(`<strong>Profession:</strong> ${pDesig || pComp}`);

    let line2 = [];
    if (pLoc) line2.push(`Work Location: ${pLoc}`);
    if (pAddr) {
      const mapBtn = pMap ? `<a class="map-link" href="${escapeHtml(pMap)}" target="_blank" rel="noreferrer" title="Open office location in Google Maps">${MAP_SVG}</a>` : '';
      line2.push(`Office: ${pAddr} ${mapBtn}`);
    }

    professionalHtml = `
      <div class="entry">
        <div class="rail">${getSvgIcon('work')}</div>
        <div class="entry-body">
          <div class="details">
            ${line1.length ? `<p>${line1.join('')}</p>` : ''}
            ${line2.length ? `<p class="cont nobullet">${line2.join(' &nbsp;\u00b7&nbsp; ')}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // 4. Profiles & Search IDs entry (array format)
  let profileChipsHtml = '';
  const links = d.profileLinks || [];
  let chips = [];
  links.forEach(link => {
    if (link.enabled !== false && link.id && link.platform) {
      const isExt = link.isExternal;
      chips.push(`
        <a class="profile-chip ${isExt ? 'profile-chip-linkedin' : ''}" href="${escapeHtml(link.url || '#')}" target="_blank" rel="noreferrer" title="View profile">
          <span class="chip-platform">${escapeHtml(link.platform)}:</span>
          <span class="chip-id">${escapeHtml(link.id)}</span>
          ${isExt ? EXT_SVG : ''}
        </a>
      `);
    }
  });

  if (chips.length > 0) {
    profileChipsHtml = `
      <div class="entry entry-profiles">
        <div class="rail">${getSvgIcon('link')}</div>
        <div class="entry-body">
          <div class="details">
            <p class="profiles-heading"><strong>Profiles &amp; Search IDs:</strong></p>
            <div class="profile-chips">
              ${chips.join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 5. Residence & Native entry
  let residenceHtml = '';
  const native = escapeHtml(d.nativePlace || '');
  const rLine1 = escapeHtml((d.permanentAddress && d.permanentAddress.line1) || '');
  const rLine2 = escapeHtml((d.permanentAddress && d.permanentAddress.line2) || '');
  const rMap = d.permanentAddress && d.permanentAddress.mapLink;

  if (native || rLine1 || rLine2) {
    const resMapBtn = rMap ? `<a class="map-link" href="${escapeHtml(rMap)}" target="_blank" rel="noreferrer" title="Open residence location in Google Maps">${MAP_SVG}</a>` : '';
    residenceHtml = `
      <div class="entry">
        <div class="rail">${getSvgIcon('location')}</div>
        <div class="entry-body">
          <div class="details">
            ${native ? `<p><strong>Native Place:</strong> ${native}</p>` : ''}
            ${(rLine1 || rLine2) ? `<p><strong>Residence:</strong> ${rLine1} ${rLine2} ${resMapBtn}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // 6. Contact Information entry
  let contactHtml = '';
  const phonesList = (d.contact && d.contact.phones) || [];
  if (phonesList.length > 0 && phonesList.some(Boolean)) {
    const phoneLinks = phonesList.filter(Boolean).map(ph => `
      <a class="phone-link" href="tel:${escapeHtml(ph.replace(/\s/g, ''))}">${escapeHtml(ph)}</a>
    `).join(' &nbsp;&nbsp;|&nbsp;&nbsp; ');

    contactHtml = `
      <div class="entry entry-contact">
        <div class="rail">${getSvgIcon('phone')}</div>
        <div class="entry-body">
          <div class="details phones-inline">
            <p><strong>Contact:</strong> ${phoneLinks}</p>
          </div>
        </div>
      </div>
    `;
  }

  // === CARD 2: FAMILY ENTRIES ===
  // 1. Parents
  let parentsHtml = '';
  const mTitle = escapeHtml(d.family.motherTitle || 'Smt.');
  const mName = escapeHtml(d.family.mother || '');
  const fTitle = escapeHtml(d.family.fatherTitle || 'Shri');
  const fName = escapeHtml(d.family.father || '');

  if (mName || fName) {
    parentsHtml = `
      <div class="entry">
        <div class="rail">${getSvgIcon('family')}</div>
        <div class="entry-body">
          <div class="details">
            ${mName ? `<p><strong>Mother:</strong> ${mTitle} ${mName}</p>` : ''}
            ${fName ? `<p><strong>Father:</strong> ${fTitle} ${fName}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // 2. Siblings
  let siblingsHtml = '';
  if (d.family.hasSiblings !== false) {
    const sibs = d.family.siblings || [];
    if (sibs.length > 0) {
      siblingsHtml = sibs.map(s => {
        const rel = escapeHtml(s.relation || 'Sibling');
        const sName = escapeHtml(s.name || '');
        const sDetails = (s.details || []).filter(Boolean).map(escapeHtml).join('<br>');
        if (!sName && !sDetails) return '';
        return `
          <div class="entry">
            <div class="rail">${getSvgIcon('person')}</div>
            <div class="entry-body">
              <div class="details">
                <p><strong>${rel}:</strong> ${sName}</p>
                ${sDetails ? `<p class="cont nobullet">${sDetails}</p>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 3. Paternal Family
  let paternalHtml = '';
  const pat = d.family.paternalFamily || {};
  const patGmotherTitle = escapeHtml(pat.grandmotherTitle || 'Late Smt.');
  const patGmother = escapeHtml(pat.grandmother || '');
  const patGfatherTitle = escapeHtml(pat.grandfatherTitle || 'Shri');
  const patGfather = escapeHtml(pat.grandfather || '');

  let buaLine = '';
  if (pat.hasBuas !== false && pat.buaLocation) {
    const bCount = pat.buaCount || '3';
    const bLabel = bCount ? `${bCount} Bua Families:` : 'Bua Families:';
    buaLine = `<p><strong>${escapeHtml(bLabel)}</strong> ${escapeHtml(pat.buaLocation)}</p>`;
  }

  let chachaLine = '';
  if (pat.hasChachas !== false && pat.chachaLocation) {
    const cCount = pat.chachaCount || '3';
    const cLabel = cCount ? `${cCount} Chacha Families:` : 'Chacha Families:';
    chachaLine = `<p><strong>${escapeHtml(cLabel)}</strong> ${escapeHtml(pat.chachaLocation)}</p>`;
  }

  if (patGmother || patGfather || buaLine || chachaLine) {
    paternalHtml = `
      <div class="entry">
        <div class="rail">${getSvgIcon('paternal')}</div>
        <div class="entry-body">
          <div class="details">
            <p class="section-lead"><strong>Paternal Family:</strong></p>
            ${patGmother ? `<p><strong>Grandmother:</strong> ${patGmotherTitle} ${patGmother}</p>` : ''}
            ${patGfather ? `<p><strong>Grandfather:</strong> ${patGfatherTitle} ${patGfather}</p>` : ''}
            ${buaLine}
            ${chachaLine}
          </div>
        </div>
      </div>
    `;
  }

  // 4. Maternal Family
  let maternalHtml = '';
  const mat = d.family.maternalFamily || {};
  const matGmotherTitle = escapeHtml(mat.grandmotherTitle || 'Late Smt.');
  const matGmother = escapeHtml(mat.grandmother || '');
  const matGfatherTitle = escapeHtml(mat.grandfatherTitle || 'Late Shri');
  const matGfather = escapeHtml(mat.grandfather || '');

  let mamaLine = '';
  if (mat.hasMamas !== false && mat.mamaLocation) {
    const mCount = mat.mamaCount || '3';
    const mLabel = mCount ? `${mCount} Mama Families:` : 'Mama Families:';
    mamaLine = `<p><strong>${escapeHtml(mLabel)}</strong> ${escapeHtml(mat.mamaLocation)}</p>`;
  }

  let mausiLine = '';
  if (mat.hasMausis !== false && mat.mausiLocation) {
    const mCount = mat.mausiCount || '3';
    const mLabel = mCount ? `${mCount} Mausi Families:` : 'Mausi Families:';
    mausiLine = `<p><strong>${escapeHtml(mLabel)}</strong> ${escapeHtml(mat.mausiLocation)}</p>`;
  }

  if (matGmother || matGfather || mamaLine || mausiLine) {
    maternalHtml = `
      <div class="entry">
        <div class="rail">${getSvgIcon('maternal')}</div>
        <div class="entry-body">
          <div class="details">
            <p class="section-lead"><strong>Maternal Family:</strong></p>
            ${matGmother ? `<p><strong>Grandmother:</strong> ${matGmotherTitle} ${matGmother}</p>` : ''}
            ${matGfather ? `<p><strong>Grandfather:</strong> ${matGfatherTitle} ${matGfather}</p>` : ''}
            ${mamaLine}
            ${mausiLine}
          </div>
        </div>
      </div>
    `;
  }

  // ========== BUILD FULL BIODATA HTML ==========
  // REDESIGNED HEADER: Name/Subtitle LEFT, Ganesha/Mantra RIGHT
  preview.innerHTML = `
    <div class="border-frame"></div>
    <div class="content">
      <!-- HEADER: REDESIGNED - Name Left, Ganesha Right -->
      <header class="hero">
        <div class="hero-left">
          <div class="name-tile">
            <h1 class="name">${candidateName}</h1>
            ${subtitleFormatted ? `<p class="subtitle">${subtitleFormatted}</p>` : ''}
          </div>
        </div>
        <div class="hero-right">
          ${d.header.ganeshImage ? `<div class="ganesh-wrapper"><img class="ganesh" src="${escapeHtml(d.header.ganeshImage)}" alt="Lord Ganesha Emblem"></div>` : ''}
          ${mantra ? `<p class="ganesh-line">${mantra}</p>` : ''}
        </div>
      </header>

      <!-- SECTION DIVIDER (Customizable) -->
      <div class="section-divider">
        <span>${sectionDividerText}</span>
      </div>

      <!-- TWO COLUMNS LAYOUT -->
      <section class="columns">
        <!-- LEFT COLUMN: 3 FRAMED PHOTOS -->
        <div class="photos-column">
          <div class="photo-card photo-card-1">
            <img src="${photos[0]}" alt="Primary Portrait">
          </div>
          <div class="photo-card photo-card-2">
            <img src="${photos[1]}" alt="Full-length Photo">
          </div>
          <div class="photo-card photo-card-3">
            <img src="${photos[2]}" alt="Traditional Attire Photo">
          </div>
        </div>

        <!-- RIGHT COLUMN: 2 BALANCED CARDS -->
        <div class="details-column">
          <!-- CARD 1: PERSONAL & PROFESSIONAL DETAILS (Customizable Title) -->
          <article class="card card-personal">
            <h2 class="card-title"><span class="flourish">\u2756</span>${card1Title}</h2>
            <div class="entries-timeline">
              ${personalRowsHtml ? `
                <div class="entry">
                  <div class="rail">${getSvgIcon('person')}</div>
                  <div class="entry-body">
                    <div class="details">${personalRowsHtml}</div>
                  </div>
                </div>
              ` : ''}
              ${educationHtml}
              ${professionalHtml}
              ${profileChipsHtml}
              ${residenceHtml}
              ${contactHtml}
            </div>
          </article>

          <!-- CARD 2: FAMILY DETAILS (Customizable Title) -->
          <article class="card card-family">
            <h3 class="card-title"><span class="flourish">\u2756</span>${card2Title}</h3>
            <div class="family-timeline">
              ${parentsHtml}
              ${siblingsHtml}
              ${paternalHtml}
              ${maternalHtml}
            </div>
          </article>
        </div>
      </section>

      <!-- FOOTER: Simple decorative line (no mantra) -->
      <footer class="footer-line"></footer>
    </div>
  `;
}

/* ==========================================================================
   GENERATE PDF (Fixed Client-Side Export)
   ========================================================================== */

async function generatePDF() {
  const btn = document.getElementById('btn-download-pdf');
  const originalText = btn ? btn.innerHTML : 'Download PDF';

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Generating PDF (300 DPI)...`;
    }

    // Ensure html2pdf is available
    if (typeof html2pdf === 'undefined') {
      showToast('Loading PDF engine...');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
    }

    const preview = document.getElementById('biodata-preview');
    if (!preview) throw new Error('Preview element not found');

    // Wait for all fonts and images to be decoded
    if (document.fonts) {
      await document.fonts.ready;
    }
    const images = Array.from(preview.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    // Small delay to ensure rendering is fully settled
    await new Promise(r => setTimeout(r, 300));

    // Clone element to an unscaled sandbox positioned behind other elements
    // html2canvas ignores elements far offscreen like -99999px
    const sandbox = document.createElement('div');
    sandbox.style.cssText = 'position:absolute;top:0;left:0;width:210mm;height:297mm;overflow:hidden;z-index:-1000;opacity:0.01;pointer-events:none;';

    const clone = preview.cloneNode(true);
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.width = '210mm';
    clone.style.height = '296.8mm'; // Slightly less than 297mm to prevent fractional spillover causing a 2nd blank page
    clone.classList.remove('overflow-danger');
    sandbox.appendChild(clone);
    document.body.appendChild(sandbox);

    // Normalize clone for html2canvas: resolve computed styles
    normalizeCloneForCapture(clone);

    const safeName = (appData.personal.name || appData.header.name || 'Biodata').replace(/[^a-zA-Z0-9_-]/g, '_');
    const opt = {
      margin: 0,
      filename: `${safeName}_Biodata.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        backgroundColor: null,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        windowWidth: 793,
        windowHeight: 1122
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    // Give clone 100ms to settle its layout
    await new Promise(r => setTimeout(r, 100));

    // 1. Manually capture canvas to guarantee all absolute positioned elements and text are drawn
    const canvas = await html2canvas(clone, opt.html2canvas);

    // 2. Generate JPEG data directly to guarantee compression (avoids massive 60MB PNG PDFs)
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // 3. Manually create the jsPDF instance and add the image
    const jsPdfConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (jsPdfConstructor) {
      const pdf = new jsPdfConstructor(opt.jsPDF);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(opt.filename);
    } else {
      // Fallback: Pass the rendered canvas to html2pdf (this is safer than passing the clone)
      await html2pdf().set(opt).from(canvas).save();
    }

    document.body.removeChild(sandbox);
    showToast('PDF downloaded successfully!');

    // Open support page after successful download
    setTimeout(() => {
      window.open('support.html', '_blank');
    }, 800);
  } catch (err) {
    console.error('PDF generation error:', err);
    showToast('Failed to generate PDF: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

/**
 * Normalize a cloned preview element for html2canvas capture.
 * Resolves mm-based border-radius to computed px values and
 * ensures SVG fills use explicit colors instead of currentColor.
 */
function normalizeCloneForCapture(clone) {
  // Convert all mm-based border-radius to computed px
  const allElements = clone.querySelectorAll('*');
  allElements.forEach(el => {
    const computed = window.getComputedStyle(el);
    const br = computed.borderRadius;
    if (br && br !== '0px') {
      el.style.borderRadius = br; // Force computed px value
    }
  });

  // Resolve currentColor in SVGs to explicit fill colors
  const svgs = clone.querySelectorAll('svg');
  svgs.forEach(svg => {
    const paths = svg.querySelectorAll('path, circle, rect');
    paths.forEach(path => {
      const fill = path.getAttribute('fill');
      if (fill === 'currentColor' || !fill) {
        const parentColor = window.getComputedStyle(svg.parentElement || svg).color;
        path.setAttribute('fill', parentColor || '#3a2515');
      }
    });
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ==========================================================================
   DOWNLOAD DROPDOWN & MULTI-FORMAT EXPORT
   ========================================================================== */

function setupDownloadDropdown() {
  const dropdown = document.getElementById('download-dropdown');
  const mainBtn = document.getElementById('btn-download-main');
  const menu = document.getElementById('download-menu');
  if (!dropdown || !mainBtn || !menu) return;

  // Toggle dropdown
  mainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Handle format selection
  menu.querySelectorAll('.download-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const format = btn.dataset.format;
      dropdown.classList.remove('open');
      exportAs(format);
    });
  });
}

async function exportAs(format) {
  switch (format) {
    case 'pdf':
      return generatePDF();
    case 'jpg':
      return exportAsImage('jpeg');
    case 'png':
      return exportAsImage('png');
    case 'docx':
      return exportAsDocx();
    default:
      showToast('Unknown format: ' + format);
  }
}

async function exportAsImage(type) {
  const mainBtn = document.getElementById('btn-download-main');
  const originalHTML = mainBtn ? mainBtn.innerHTML : '';

  try {
    if (mainBtn) {
      mainBtn.disabled = true;
      mainBtn.innerHTML = `<span class="spinner"></span> Generating ${type.toUpperCase()}...`;
    }

    if (typeof html2canvas === 'undefined') {
      showToast('Loading image engine...');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    }

    const preview = document.getElementById('biodata-preview');
    if (!preview) throw new Error('Preview element not found');

    // Wait for fonts and images
    if (document.fonts) await document.fonts.ready;
    const images = Array.from(preview.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
    }));
    await new Promise(r => setTimeout(r, 200));

    // Clone to unscaled sandbox
    const sandbox = document.createElement('div');
    sandbox.style.cssText = 'position:absolute;top:0;left:0;width:210mm;height:297mm;overflow:hidden;z-index:-1000;opacity:0.01;pointer-events:none;';
    const clone = preview.cloneNode(true);
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.width = '210mm';
    clone.style.height = '297mm';
    clone.classList.remove('overflow-danger');
    sandbox.appendChild(clone);
    document.body.appendChild(sandbox);

    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      backgroundColor: '#d4c4b0',
      logging: false,
      windowWidth: 793,
      windowHeight: 1122
    });

    document.body.removeChild(sandbox);

    const mimeType = type === 'jpeg' ? 'image/jpeg' : 'image/png';
    const ext = type === 'jpeg' ? 'jpg' : 'png';
    const quality = type === 'jpeg' ? 0.95 : undefined;

    canvas.toBlob((blob) => {
      const safeName = (appData.personal.name || appData.header.name || 'Biodata').replace(/[^a-zA-Z0-9_-]/g, '_');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeName}_Biodata.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`${ext.toUpperCase()} downloaded successfully!`);
    }, mimeType, quality);

  } catch (err) {
    console.error('Image export error:', err);
    showToast('Failed to generate image: ' + err.message);
  } finally {
    if (mainBtn) {
      mainBtn.disabled = false;
      mainBtn.innerHTML = originalHTML;
    }
  }
}

async function exportAsDocx() {
  const mainBtn = document.getElementById('btn-download-main');
  const originalHTML = mainBtn ? mainBtn.innerHTML : '';

  try {
    if (mainBtn) {
      mainBtn.disabled = true;
      mainBtn.innerHTML = `<span class="spinner"></span> Generating DOCX...`;
    }

    if (typeof htmlDocx === 'undefined') {
      showToast('Loading DOCX engine...');
      await loadScript('https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js');
    }

    const preview = document.getElementById('biodata-preview');
    if (!preview) throw new Error('Preview element not found');

    // Build self-contained HTML with inline styles for Word
    const previewHTML = preview.innerHTML;
    const docContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #2e1c0d; line-height: 1.45; }
          h1 { font-size: 22pt; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4pt; }
          h2, h3 { font-size: 13pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #c89455; padding-bottom: 3pt; margin: 8pt 0 4pt; }
          strong { font-weight: bold; }
          p { margin: 2pt 0; }
          img { max-width: 150px; max-height: 200px; }
          a { color: #5d3615; }
        </style>
      </head>
      <body>
        ${previewHTML}
      </body>
      </html>
    `;

    const blob = htmlDocx.asBlob(docContent, {
      orientation: 'portrait',
      margins: { top: 720, right: 720, bottom: 720, left: 720 }
    });

    const safeName = (appData.personal.name || appData.header.name || 'Biodata').replace(/[^a-zA-Z0-9_-]/g, '_');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_Biodata.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('DOCX downloaded successfully!');

  } catch (err) {
    console.error('DOCX export error:', err);
    showToast('Failed to generate DOCX: ' + err.message);
  } finally {
    if (mainBtn) {
      mainBtn.disabled = false;
      mainBtn.innerHTML = originalHTML;
    }
  }
}

// Ensure the page scales dynamically to fit the A4 preview in the UI viewport
function updatePreviewScale() {
  const previewWrap = document.querySelector('.preview-wrapper');
  const preview = document.getElementById('biodata-preview');
  if (!previewWrap || !preview) return;

  const currentZoom = window.previewZoomLevel || 1;
  const padding = 32;
  const availableWidth = previewWrap.clientWidth - padding;
  const availableHeight = previewWrap.clientHeight - padding;
  
  // A4 dimensions at 96 DPI
  const a4Width = 793.7;
  const a4Height = 1122.5;

  const scaleX = availableWidth / a4Width;
  const scaleY = availableHeight / a4Height;
  const scaleToFit = Math.min(scaleX, scaleY, 1);
  
  const finalScale = scaleToFit * currentZoom;
  preview.style.transform = `scale(${finalScale})`;
}

// ... Initial setup ...
function handleZoom(action) {
  if (typeof window.previewZoomLevel === 'undefined') {
    window.previewZoomLevel = 1;
  }
  
  if (action === 'in') window.previewZoomLevel += 0.1;
  else if (action === 'out') window.previewZoomLevel = Math.max(0.5, window.previewZoomLevel - 0.1);
  else if (action === 'fit') window.previewZoomLevel = 1;
  
  updatePreviewScale();
}

window.addEventListener('resize', updatePreviewScale);
window.addEventListener('DOMContentLoaded', initApp);
