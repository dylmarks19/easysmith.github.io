window.C = SITE_CONFIG;

// ── DOM HELPERS ─────────────────────────────────────────────────────────────

/**
 * el — Get a page element by its ID.
 *
 * @param  {string} id  - The ID attribute of the HTML element you want.
 * @returns {HTMLElement|null}
 */
function el(id) {
  return document.getElementById(id);
}

// ── COMPANY / BRANDING HELPERS ───────────────────────────────────────────────

/**
 * copyrightYear — Build the correct copyright date range for the footer,
 * e.g. "2026" or "2018-2026", from C.company.yearFounded.
 */
function copyrightYear() {
  const y = new Date().getFullYear();
  return y > C.company.yearFounded ? `${C.company.yearFounded}-${y}` : `${C.company.yearFounded}`;
}

// ── UI COMPONENT GENERATORS ──────────────────────────────────────────────────

/**
 * guidePromptHTML — Reusable "Open Selection Guide" call-to-action block,
 * used on both the Home and Products pages.
 */
function guidePromptHTML() {
  return `
    <div class="guide-prompt">
      <div>
        <h3>Uncertain about what would suit you best?</h3>
        <p>Check out the selection guide and we'll match you to the right model.</p>
      </div>
      <a class="btn btn-orange" href="guide.html"><i class="ti ti-compass"></i> Open Selection Guide</a>
    </div>`;
}

// ── PRODUCT LINE HELPERS ─────────────────────────────────────────────────────

/**
 * getAllCategories — Flatten every category across every product line into
 * one array, each tagged with its parent line's id/name.
 */
function getAllCategories() {
  return PRODUCT_LINES.flatMap(line =>
    line.categories.map(cat => ({ ...cat, lineId: line.id, lineName: line.name }))
  );
}

/**
 * findCategoryById — Look up a single category by id across all lines.
 */
function findCategoryById(id) {
  for (const line of PRODUCT_LINES) {
    const cat = line.categories.find(c => c.id === id);
    if (cat) return cat;
  }
  return null;
}

/**
 * findLineForCategory — Given a category id, return its parent product line.
 */
function findLineForCategory(id) {
  return PRODUCT_LINES.find(line => line.categories.some(c => c.id === id)) || null;
}

/**
 * getMaxSpecValue — Scan ONE category's spec table for the highest numeric
 * value in any header matching one of the given needles (e.g. "capacity"),
 * formatted with its unit. Used by the generic comparison table renderer.
 */
function getMaxSpecValue(category, headerNeedles) {
  const idx = category.tableHeaders.findIndex(h => headerNeedles.some(n => h.toLowerCase().includes(n)));
  if (idx < 0) return '—';
  let max = 0;
  let unit = '';
  category.tableRows.forEach(row => {
    const valStr = row[idx];
    if (!valStr) return;
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > max) {
      max = num;
      const match = valStr.match(/[a-zA-Z]+/);
      if (match) unit = match[0];
    }
  });
  return max ? `${max}${unit}` : '—';
}

/**
 * getMaxAcrossCategories — Like getMaxSpecValue, but scans every category in
 * a list (e.g. a whole product line) for the highest matching value. Lets a
 * line compute its own "headline" facts (tallest platform height, etc.)
 * live from its actual data instead of a hardcoded string that can go stale.
 */
function getMaxAcrossCategories(categories, headerNeedles) {
  let max = 0;
  let unit = '';
  categories.forEach(cat => {
    const idx = cat.tableHeaders ? cat.tableHeaders.findIndex(h => headerNeedles.some(n => h.toLowerCase().includes(n))) : -1;
    if (idx < 0) return;
    cat.tableRows.forEach(row => {
      const valStr = row[idx];
      if (!valStr) return;
      const num = parseFloat(valStr);
      if (!isNaN(num) && num > max) {
        max = num;
        const match = valStr.match(/[a-zA-Z]+/);
        if (match) unit = match[0];
      }
    });
  });
  return max ? `${max}${unit}` : '—';
}

/**
 * computeStatsBar — Builds the homepage stats bar automatically:
 *   - Total product categories across every line (always computed)
 *   - Total models available across every line (always computed)
 *   - Each line's own optional headlineStats() — a function a line can
 *     define to surface its own facts (e.g. max platform height). Nothing
 *     here assumes what counts as "headline-worthy" for a given product
 *     type, so a chemicals line can report something totally different
 *     from a MEWP line without any shared code changing.
 *   - Any fixed, non-product company facts from C.companyStats (compliance
 *     badges, business-model statements — things with no underlying data
 *     to compute from).
 * Nothing here needs to change when a product line is added or removed.
 */
function computeStatsBar() {
  const stats = [];

  const totalCategories = PRODUCT_LINES.reduce((sum, line) => sum + line.categories.length, 0);
  const totalModels = PRODUCT_LINES.reduce((sum, line) =>
    sum + line.categories.reduce((s, cat) => s + (cat.tableRows ? cat.tableRows.length : 0), 0), 0);

  stats.push({ num: String(totalCategories), lbl: 'Product Categories' });
  stats.push({ num: `${totalModels}+`, lbl: 'Models Available' });

  PRODUCT_LINES.forEach(line => {
    if (typeof line.headlineStats === 'function') {
      stats.push(...line.headlineStats());
    }
  });

  if (Array.isArray(C.companyStats)) stats.push(...C.companyStats);

  return stats;
}

// ── DEFAULT CATEGORY RENDERERS ───────────────────────────────────────────────
// Every product line renders its categories as a homepage card + a Products
// page accordion body. Most lines (any spec-table style range) are happy
// with these defaults. A line with very different needs — photo-led
// kitchenware, a simple chemical datasheet card, etc. — can override either
// one by providing `renderCard(cat)` and/or `renderBody(cat)` functions on
// its own line object; render-home.js / render-products.js fall back to
// these automatically whenever a line doesn't supply its own.

/**
 * getCategoryImages / getCategoryThumbnail — Single source of truth for
 * resolving a category's image(s), whether it uses the newer `images: [...]`
 * array or the older single `image: "..."` field. Used by the homepage
 * card, the category modal, and the Products page gallery, so none of them
 * can silently disagree about which image(s) a category actually has.
 */
function getCategoryImages(cat) {
  return (cat.images && cat.images.length) ? cat.images : (cat.image ? [cat.image] : []);
}
function getCategoryThumbnail(cat) {
  return getCategoryImages(cat)[0] || null;
}

function defaultCategoryCardHTML(cat) {
  const thumb = getCategoryThumbnail(cat);

  return `
    <div class="cat-card" onclick="openCatModal('${cat.id}')">
      <div class="cat-thumb">
        ${thumb
          ? `<img src="${thumb}" alt="${cat.title}" class="cat-thumb-img" loading="lazy" decoding="async">`
          : `<i class="ti ${cat.icon}"></i>`
        }
        <span class="cat-lbl">${cat.code}</span>
      </div>
      <div class="cat-body">
        <div class="cat-title">${cat.title}</div>
        <p class="cat-text">${cat.shortDesc.substring(0, 85)}...</p>
        <a class="btn btn-outline-navy" style="font-size:11px;padding:7px 12px;" onclick="event.stopPropagation(); goToCategory('${cat.id}')">View Models <i class="ti ti-arrow-right"></i></a>
      </div>
    </div>`;
}

function defaultAccordionBodyHTML(cat) {
  const theadHtml = cat.tableHeaders.map(h => `<th>${h}</th>`).join('');
  const tbodyHtml = cat.tableRows.map(row =>
    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
  ).join('');

  // Supports either `images: [...]` (multiple, swipeable) or the older
  // single `image: "..."` field — a category only needs one or the other.
  const images = getCategoryImages(cat);

  return `
    <div class="acc-body-inner">
      <div class="acc-table-side">
        <h4>Full Model Range - ${cat.title}</h4>
        <div style="overflow-x:auto;">
          <table class="prod-table">
            <thead><tr>${theadHtml}</tr></thead>
            <tbody>${tbodyHtml}</tbody>
          </table>
        </div>
        <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
          <a class="btn btn-navy btn-sm" href="contact.html"><i class="ti ti-file-invoice"></i> Enquire About This Range</a>
          <a class="btn btn-ghost btn-sm" href="${C.cataloguePdf}" download><i class="ti ti-file-download"></i> Download Catalogue PDF</a>
        </div>
        <p style="font-size:11px;color:var(--text-faint);margin-top:10px;">Specifications shown. All units are made to order. Custom specifications available on request.</p>
      </div>
      <div class="acc-img-side">
        ${images.length
          ? productImageGalleryHTML(cat.id, cat.title, images)
          : `<div class="acc-img-placeholder">
              <i class="ti ti-photo-off"></i>
              <span>Product image coming soon</span>
            </div>`
        }
        <div class="acc-img-actions">
          <a class="btn btn-outline-orange btn-sm" href="${C.cataloguePdf}" download><i class="ti ti-file-text"></i> View in Catalogue</a>
        </div>
      </div>
    </div>`;
}

// ── PRODUCT IMAGE GALLERY ─────────────────────────────────────────────────────
// A category can supply `images: ["a.png", "b.png", ...]` for a swipeable/
// toggleable gallery instead of a single `image`. With only one image, the
// gallery renders identically to a plain image (no arrows/dots), so nothing
// changes visually for categories that haven't been given extra images yet.

const galleryIndexByCategory = {};
const galleryDragState = {}; // catId -> { startX, deltaX, count }
const galleryJustSwiped = {};

function productImageGalleryHTML(catId, title, images) {
  const multi = images.length > 1;
  return `
    <div class="img-gallery" id="gallery-${catId}"
         onclick="galleryClickGuard(event, '${catId}')"
         ${multi ? `onpointerdown="galleryPointerDown(event, '${catId}', ${images.length})" onpointermove="galleryPointerMove(event, '${catId}')" onpointerup="galleryPointerUp(event, '${catId}')" onpointercancel="galleryPointerCancel('${catId}')"` : ''}>
      <div class="img-gallery-track" id="gallery-track-${catId}">
        ${images.map((img, i) => `<img src="${img}" class="img-gallery-slide" alt="${title}" loading="lazy" decoding="async" draggable="false">`).join('')}
      </div>
      ${multi ? `
        <button class="img-gallery-arrow img-gallery-prev" type="button" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation(); galleryPrev('${catId}', ${images.length})" aria-label="Previous image"><i class="ti ti-chevron-left"></i></button>
        <button class="img-gallery-arrow img-gallery-next" type="button" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation(); galleryNext('${catId}', ${images.length})" aria-label="Next image"><i class="ti ti-chevron-right"></i></button>
        <div class="img-gallery-dots">
          ${images.map((_, i) => `<button class="img-gallery-dot${i === 0 ? ' active' : ''}" type="button" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation(); galleryGoTo('${catId}', ${i})" aria-label="Image ${i + 1} of ${images.length}"></button>`).join('')}
        </div>
      ` : ''}
    </div>`;
}

function updateGalleryDOM(catId) {
  const idx = galleryIndexByCategory[catId] || 0;
  const track = el('gallery-track-' + catId);
  if (track) { track.style.transition = ''; track.style.transform = `translateX(-${idx * 100}%)`; }
  document.querySelectorAll(`#gallery-${catId} .img-gallery-dot`).forEach((d, i) => d.classList.toggle('active', i === idx));
}

function galleryNext(catId, count) {
  galleryIndexByCategory[catId] = ((galleryIndexByCategory[catId] || 0) + 1) % count;
  updateGalleryDOM(catId);
}

function galleryPrev(catId, count) {
  galleryIndexByCategory[catId] = ((galleryIndexByCategory[catId] || 0) - 1 + count) % count;
  updateGalleryDOM(catId);
}

function galleryGoTo(catId, index) {
  galleryIndexByCategory[catId] = index;
  updateGalleryDOM(catId);
}

/**
 * galleryPointerDown / galleryPointerMove / galleryPointerUp — Drag the
 * gallery live: the track follows the pointer in real time (via
 * pointermove) rather than only snapping to the next image after release.
 * Without live tracking, nothing visibly happens until the gesture ends,
 * which reads as "swipe doesn't work" even though the underlying logic is
 * technically firing correctly.
 */
function galleryPointerDown(event, catId, count) {
  galleryDragState[catId] = { startX: event.clientX, deltaX: 0, count };
  const track = el('gallery-track-' + catId);
  if (track) track.style.transition = 'none'; // 1:1 tracking while dragging, no easing lag
}

function galleryPointerMove(event, catId) {
  const state = galleryDragState[catId];
  if (!state) return;

  state.deltaX = event.clientX - state.startX;
  const gallery = el('gallery-' + catId);
  const track = el('gallery-track-' + catId);
  if (!gallery || !track) return;

  const idx = galleryIndexByCategory[catId] || 0;
  const percent = (state.deltaX / gallery.clientWidth) * 100;
  track.style.transform = `translateX(calc(-${idx * 100}% + ${percent}%))`;
}

function galleryPointerUp(event, catId) {
  const state = galleryDragState[catId];
  delete galleryDragState[catId];
  if (!state) return;

  if (Math.abs(state.deltaX) < 40) { updateGalleryDOM(catId); return; } // small movement — treat as a tap, not a swipe

  galleryJustSwiped[catId] = true;
  if (state.deltaX < 0) galleryNext(catId, state.count);
  else galleryPrev(catId, state.count);
}

/**
 * galleryPointerCancel — Real touchscreens sometimes abort an in-progress
 * pointer sequence (pointercancel) rather than completing it with
 * pointerup, e.g. if the browser decides the gesture is actually a page
 * scroll. Without handling this, the track could visually get stuck
 * mid-drag. Just snap back to wherever the gallery currently is.
 */
function galleryPointerCancel(catId) {
  delete galleryDragState[catId];
  updateGalleryDOM(catId);
}

/**
 * galleryClickGuard — Sits on the gallery container itself. Consumes the
 * "just swiped" flag and stops that click from bubbling any further (e.g.
 * to a parent card's own onclick), then lets normal clicks (a genuine tap
 * on the image, with no preceding swipe) pass through as usual.
 */
function galleryClickGuard(event, catId) {
  if (galleryJustSwiped[catId]) {
    galleryJustSwiped[catId] = false;
    event.stopPropagation();
  }
}

function renderCategoryCard(line, cat) {
  return (line.renderCard || defaultCategoryCardHTML)(cat);
}
function renderCategoryBody(line, cat) {
  return (line.renderBody || defaultAccordionBodyHTML)(cat);
}

/**
 * defaultCertGridHTML — Standard cert card grid for a line's certifications
 * array. Lines can override with their own `renderCertifications(certs)` if
 * they need a different layout.
 */
function defaultCertGridHTML(certifications) {
  return certifications.map(c => `
    <div class="cert-card">
      <div class="cert-icon"><i class="ti ${c.icon}"></i></div>
      <div class="cert-name">${c.name}</div>
      <p class="cert-body">${c.body}</p>
      <span class="tag tag-${c.tagType}">${c.tagLabel}</span>
    </div>`).join('');
}

// ── FILE://-SAFE BROWSER API HELPERS ─────────────────────────────────────────

/**
 * copyToClipboard — Wraps the Clipboard API with a fallback for insecure
 * contexts, where navigator.clipboard doesn't exist at all — most notably a
 * page opened directly as a file:// URL (Chrome only exposes the Clipboard
 * API in "secure contexts": https, or http on localhost). Falls back to the
 * older execCommand('copy') approach via a temporary offscreen textarea,
 * which works regardless of context. Once the site is hosted on GitHub
 * Pages (https://), the modern Clipboard API path is used automatically.
 */
function copyToClipboard(text, onSuccess) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
  } else {
    fallbackCopy(text, onSuccess);
  }
}

function fallbackCopy(text, onSuccess) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    if (onSuccess) onSuccess();
  } catch (err) {
    // Nothing further to do — the address is still visible and selectable
    // by hand as a last resort.
  }
  document.body.removeChild(textarea);
}

/**
 * goToCategory — Universal "take me to this category" navigator, safe to
 * call from ANY page. Now that Products lives on its own real page
 * (products.html), a click from Home or the Selection Guide needs an
 * actual page navigation rather than the same-page show()+scroll the old
 * single-page version used. products.html reads the URL hash on load and
 * opens/scrolls to the matching category itself (see render-products.js).
 */
function goToCategory(id) {
  window.location.href = 'products.html#' + id;
}

/**
 * getQueryParam — Small helper for reading a URL query string param, used
 * for the Selection Guide → Contact page handoff (there's no shared
 * in-memory JS state across a real page navigation, so prefill data travels
 * as a URL query param instead).
 */
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ── GLOBAL EXPORTS ───────────────────────────────────────────────────────────

window.guidePromptHTML = guidePromptHTML;
window.el = el;
window.copyrightYear = copyrightYear;
window.getAllCategories = getAllCategories;
window.findCategoryById = findCategoryById;
window.findLineForCategory = findLineForCategory;
window.getMaxSpecValue = getMaxSpecValue;
window.getMaxAcrossCategories = getMaxAcrossCategories;
window.computeStatsBar = computeStatsBar;
window.getCategoryImages = getCategoryImages;
window.getCategoryThumbnail = getCategoryThumbnail;
window.goToCategory = goToCategory;
window.getQueryParam = getQueryParam;
window.defaultCategoryCardHTML = defaultCategoryCardHTML;
window.defaultAccordionBodyHTML = defaultAccordionBodyHTML;
window.renderCategoryCard = renderCategoryCard;
window.renderCategoryBody = renderCategoryBody;
window.defaultCertGridHTML = defaultCertGridHTML;
window.copyToClipboard = copyToClipboard;
window.productImageGalleryHTML = productImageGalleryHTML;
window.galleryNext = galleryNext;
window.galleryPrev = galleryPrev;
window.galleryGoTo = galleryGoTo;
window.galleryPointerDown = galleryPointerDown;
window.galleryPointerMove = galleryPointerMove;
window.galleryPointerUp = galleryPointerUp;
window.galleryPointerCancel = galleryPointerCancel;
window.galleryClickGuard = galleryClickGuard;