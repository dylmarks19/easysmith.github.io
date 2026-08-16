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

function getAnalyticsMeasurementId() {
  return (C && C.analyticsMeasurementId && String(C.analyticsMeasurementId).trim()) || '';
}

function initAnalytics() {
  const measurementId = getAnalyticsMeasurementId();
  if (!measurementId || window.__analyticsInitialized) return;

  window.__analyticsInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
    page_location: location.href,
    page_path: location.pathname,
  });
}

function trackEvent(action, params = {}) {
  const measurementId = getAnalyticsMeasurementId();
  if (!measurementId || typeof window.gtag !== 'function') return;

  window.gtag('event', action, {
    page_location: location.href,
    page_path: location.pathname,
    ...params,
  });
}

function bindAnalyticsInteractions() {
  if (window.__analyticsBound) return;
  window.__analyticsBound = true;

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href.includes('contact.html')) trackEvent('click_cta', { target: 'contact' });
    if (href.includes('products.html')) trackEvent('click_cta', { target: 'products' });
    if (href.includes('guide.html')) trackEvent('click_cta', { target: 'guide' });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAnalytics();
    bindAnalyticsInteractions();
  }, { once: true });
} else {
  initAnalytics();
  bindAnalyticsInteractions();
}

window.trackEvent = trackEvent;

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
 * computeStatsBar — Builds the homepage's TOP, company-level stats bar.
 * Deliberately company-only now — no per-line technical specs (max
 * platform height, max power, etc.) mixed in here anymore. Those move to
 * each line's own lineStatsStripHTML() below, right above that line's
 * section, where there's an actual product in view to give them context.
 * Mixing "6kW" in with "15 Product Categories" up here read as a random
 * grab-bag rather than a coherent company story, and it didn't scale — a
 * hard 2-line cap meant a 3rd/4th product line would silently lose its
 * slot as more lines get added.
 *
 * Order:
 *   1. Product Lines (computed — PRODUCT_LINES.length)
 *   2. Industries Served (computed — C.industriesServed.length)
 *   3-4. First two entries from C.companyStats (curated, non-product facts —
 *        compliance, delivery reach, business model). Reorder that array
 *        in site-config.js to change which two lead here.
 * Nothing here needs to change when a product line is added or removed.
 */
function computeStatsBar() {
  const stats = [];

  stats.push({
    num: String(PRODUCT_LINES.length),
    lbl: PRODUCT_LINES.length === 1 ? 'Product Line' : 'Product Lines',
  });

  if (Array.isArray(C.industriesServed) && C.industriesServed.length) {
    stats.push({ num: String(C.industriesServed.length), lbl: 'Industries Served' });
  }

  if (Array.isArray(C.companyStats)) {
    stats.push(...C.companyStats.slice(0, 2));
  }

  return stats.slice(0, 4);
}

/**
 * lineStatsStripHTML — A small, compact stats strip specific to ONE product
 * line, meant to sit directly above that line's own section heading (on
 * both the Home and Products pages, which both render one `.line-section`
 * per line). This is where per-line technical facts belong — right next to
 * the products they actually describe, instead of floating in the
 * company-wide bar at the top of the page.
 *
 * Shows, in order:
 *   1. Category count for this line (computed)
 *   2. Model count for this line (computed)
 *   3-4. This line's own headlineStats(), if it defines one — e.g. "Max
 *        Platform Height" for MEWPs, "Max Power" for Laser Cleaners. A line
 *        without a headlineStats() function just shows the two computed
 *        items above.
 */
function lineStatsStripHTML(line) {
  const modelCount = line.categories.reduce((s, cat) => s + (cat.tableRows ? cat.tableRows.length : 0), 0);

  const stats = [
    { num: String(line.categories.length), lbl: line.categories.length === 1 ? 'Category' : 'Categories' },
    { num: `${modelCount}+`, lbl: 'Models' },
  ];

  if (typeof line.headlineStats === 'function') {
    stats.push(...line.headlineStats());
  }

  return `
    <div class="line-stats-strip">
      ${stats.slice(0, 4).map(s => `
        <div class="line-stat-item">
          <span class="line-stat-num">${s.num}</span>
          <span class="line-stat-lbl">${s.lbl}</span>
        </div>`).join('')}
    </div>`;
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
 * isVideoSrc — Detects whether a media filename is a video based on its
 * extension, so the `images: [...]` array can contain a mix of photos and
 * product demo videos without needing a separate field or special syntax.
 */
function isVideoSrc(src) {
  return /\.(mp4|webm|mov|m4v|ogv)$/i.test(src);
}

/**
 * getCategoryImages / getCategoryThumbnail — Single source of truth for
 * resolving a category's media, whether it uses the newer `images: [...]`
 * array (which may now mix photos and videos — see isVideoSrc) or the older
 * single `image: "..."` field. Used by the homepage card, the category
 * modal, and the Products page gallery, so none of them can silently
 * disagree about what a category actually has.
 *
 * Array order is presentation order — to control which photo/video shows
 * first, second, etc., just order them in the `images` array. No separate
 * "position" field needed.
 */
function getCategoryImages(cat) {
  const media = (cat.images && cat.images.length)
    ? cat.images
    : (Array.isArray(cat.image) ? cat.image : (cat.image ? [cat.image] : []));

  if (!Array.isArray(media)) return [media].filter(Boolean);

  const normalized = [];
  for (const item of media) {
    if (Array.isArray(item)) {
      normalized.push(...item);
    } else if (item) {
      normalized.push(item);
    }
  }
  return normalized;
}

/**
 * getCategoryThumbnail — Always returns a still IMAGE, never a video, for
 * contexts that need one single static preview (the homepage card, and the
 * category modal's fallback). Skips past any video entries to find the
 * first actual image in the array — so a category can lead with a video in
 * its full gallery while the small static preview spots still show a photo.
 */
function getCategoryThumbnail(cat) {
  const media = getCategoryImages(cat);
  return media.find(src => !isVideoSrc(src)) || null;
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

function defaultAccordionBodyHTML(cat, line = null) {
  const theadHtml = cat.tableHeaders.map(h => `<th>${h}</th>`).join('');
  const tbodyHtml = cat.tableRows.map(row =>
    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
  ).join('');

  // Supports either `images: [...]` (multiple photos/videos, swipeable) or
  // the older single `image: "..."` field — a category only needs one or
  // the other. Video files are auto-detected by extension.
  const images = getCategoryImages(cat);
  const cataloguePdf = cat.cataloguePdf || line?.cataloguePdf || C.cataloguePdf;
  const cataloguePdfLabel = cat.cataloguePdfLabel || line?.cataloguePdfLabel || C.cataloguePdfLabel;

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
          <a class="btn btn-navy btn-sm" href="contact.html?category=${encodeURIComponent(cat.id)}&message=${encodeURIComponent('I am interested in the ' + cat.title + ' range. Please advise on suitability, pricing and lead time.')}"><i class="ti ti-file-invoice"></i> Enquire About This Range</a>
          <a class="btn btn-ghost btn-sm" href="${cataloguePdf}" download="${cataloguePdfLabel}.pdf"><i class="ti ti-file-download"></i> Download Catalogue PDF</a>
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
          <a class="btn btn-outline-orange btn-sm" href="${cataloguePdf}" download="${cataloguePdfLabel}.pdf"><i class="ti ti-file-text"></i> View in Catalogue</a>
        </div>
      </div>
    </div>`;
}

// ── PRODUCT IMAGE / VIDEO GALLERY ─────────────────────────────────────────────
// A category can supply `images: ["a.png", "demo.mp4", "b.png", ...]` for a
// swipeable/toggleable gallery instead of a single `image` — video files are
// auto-detected by extension (see isVideoSrc) and can be freely mixed in
// with photos. Array order is presentation order. With only one item total,
// the gallery renders identically to a plain image (no arrows/dots), so
// nothing changes visually for categories that haven't been given extra
// media yet.

const galleryIndexByCategory = {};
const galleryDragState = {}; // catId -> { startX, deltaX, count }
const galleryJustSwiped = {};
// Registries so the lightbox (and anything else) can look up what a given
// gallery instance is actually showing without re-threading media/title
// through every onclick attribute as escaped JSON.
const galleryMediaByCategory = {};
const galleryTitleByCategory = {};

/**
 * productImageGalleryHTML — options.expandable (default true) controls
 * whether clicking the gallery opens the full-page lightbox. Pass
 * `{ expandable: false }` when rendering the gallery *inside* the lightbox
 * itself — otherwise clicking the already-expanded image would try to open
 * another lightbox on top of itself.
 */
function productImageGalleryHTML(catId, title, media, options = {}) {
  const { expandable = true } = options;
  const multi = media.length > 1;

  galleryMediaByCategory[catId] = media;
  galleryTitleByCategory[catId] = title;

  return `
    <div class="img-gallery${expandable ? ' img-gallery--expandable' : ''}" id="gallery-${catId}"
         onclick="galleryClickGuard(event, '${catId}', ${expandable})"
         ${multi ? `onpointerdown="galleryPointerDown(event, '${catId}', ${media.length})" onpointermove="galleryPointerMove(event, '${catId}')" onpointerup="galleryPointerUp(event, '${catId}')" onpointercancel="galleryPointerCancel('${catId}')"` : ''}>
      <div class="img-gallery-track" id="gallery-track-${catId}">
        ${media.map((src, i) => isVideoSrc(src)
          ? `<video src="${src}" class="img-gallery-slide img-gallery-video" controls playsinline preload="metadata" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation()"></video>`
          : `<img src="${src}" class="img-gallery-slide" alt="${title}" loading="lazy" decoding="async" draggable="false">`
        ).join('')}
      </div>
      ${expandable ? `
        <button class="img-gallery-expand" type="button" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation(); openMediaLightbox('${catId}')" aria-label="Expand ${title}"><i class="ti ti-maximize"></i></button>
      ` : ''}
      ${multi ? `
        <button class="img-gallery-arrow img-gallery-prev" type="button" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation(); galleryPrev('${catId}', ${media.length})" aria-label="Previous item"><i class="ti ti-chevron-left"></i></button>
        <button class="img-gallery-arrow img-gallery-next" type="button" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation(); galleryNext('${catId}', ${media.length})" aria-label="Next item"><i class="ti ti-chevron-right"></i></button>
        <div class="img-gallery-dots">
          ${media.map((src, i) => `<button class="img-gallery-dot${i === 0 ? ' active' : ''}" type="button" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation(); galleryGoTo('${catId}', ${i})" aria-label="${isVideoSrc(src) ? 'Video' : 'Image'} ${i + 1} of ${media.length}">${isVideoSrc(src) ? '<i class="ti ti-player-play-filled"></i>' : ''}</button>`).join('')}
        </div>
      ` : ''}
    </div>`;
}

/**
 * updateGalleryDOM — Moves the track to the current index and, importantly,
 * pauses any video that isn't the now-active slide. Without this, swiping
 * or clicking past a playing video would leave it running silently in the
 * background off-screen.
 */
function updateGalleryDOM(catId) {
  const idx = galleryIndexByCategory[catId] || 0;
  const track = el('gallery-track-' + catId);
  if (track) {
    track.style.transition = '';
    track.style.transform = `translateX(-${idx * 100}%)`;
    track.querySelectorAll('video').forEach((v, i) => { if (i !== idx) v.pause(); });
  }
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
 * to a parent card's own onclick) if a drag just ended.
 *
 * Otherwise, for an expandable gallery, a genuine click directly on an
 * IMAGE opens the full-page lightbox (see openMediaLightbox below). Videos
 * are deliberately excluded from this direct-click behaviour — the native
 * play/pause/seek controls need every click on the video itself, so videos
 * only expand via the dedicated maximize button rendered on top of the
 * gallery. Clicking the arrows/dots doesn't reach here at all (they already
 * stop their own propagation).
 */
function galleryClickGuard(event, catId, expandable) {
  if (galleryJustSwiped[catId]) {
    galleryJustSwiped[catId] = false;
    event.stopPropagation();
    return;
  }
  if (expandable && event.target && event.target.tagName === 'IMG') {
    openMediaLightbox(catId);
  }
}

// ── FULLSCREEN MEDIA LIGHTBOX ─────────────────────────────────────────────
// Clicking a product image (or the maximize button, which also covers
// videos) expands that same gallery to fill the page — same swipe/arrow/dot
// navigation, same video controls, just much bigger. Reuses
// productImageGalleryHTML with a `lightbox-` prefixed id so it's a fully
// independent gallery instance (own index, own drag state) rather than
// trying to relocate the original DOM node.
//
// Stacks above the category preview modal (higher z-index — see styles.css)
// so "expand image" still works from inside that modal's own gallery.

function ensureMediaLightbox() {
  if (el('media-lightbox-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'media-lightbox-overlay';
  overlay.className = 'media-lightbox-overlay';
  overlay.innerHTML = `
    <button class="media-lightbox-close" type="button" onclick="closeMediaLightbox()" aria-label="Close"><i class="ti ti-x"></i></button>
    <div class="media-lightbox-content" id="media-lightbox-content"></div>`;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMediaLightbox();
  });

  document.body.appendChild(overlay);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeMediaLightbox();
  });
}

function openMediaLightbox(sourceCatId) {
  const media = galleryMediaByCategory[sourceCatId];
  const title = galleryTitleByCategory[sourceCatId];
  if (!media || !media.length) return;

  ensureMediaLightbox();

  const startIndex = galleryIndexByCategory[sourceCatId] || 0;
  const lightboxCatId = 'lightbox-' + sourceCatId;
  galleryIndexByCategory[lightboxCatId] = startIndex;

  el('media-lightbox-content').innerHTML = productImageGalleryHTML(lightboxCatId, title, media, { expandable: false });

  // Jump straight to the same slide the inline gallery was on, with no
  // slide-in animation from slide 0 — updateGalleryDOM alone would leave
  // the default CSS transition in place for this first paint.
  const track = el('gallery-track-' + lightboxCatId);
  if (track) {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${startIndex * 100}%)`;
    // eslint-disable-next-line no-unused-expressions
    track.offsetHeight; // force reflow before re-enabling the transition
    track.style.transition = '';
  }

  el('media-lightbox-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMediaLightbox() {
  const overlay = el('media-lightbox-overlay');
  if (!overlay) return;

  overlay.querySelectorAll('video').forEach(v => v.pause());
  overlay.classList.remove('open');

  // Don't release the body scroll lock if the category preview modal is
  // also open underneath — it needs the lock to stay in place.
  const catModal = el('cat-modal-overlay');
  if (!catModal || !catModal.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function renderCategoryCard(line, cat) {
  return (line.renderCard || defaultCategoryCardHTML)(cat);
}
function renderCategoryBody(line, cat) {
  return (line.renderBody || defaultAccordionBodyHTML)(cat, line);
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
window.lineStatsStripHTML = lineStatsStripHTML;
window.isVideoSrc = isVideoSrc;
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
window.ensureMediaLightbox = ensureMediaLightbox;
window.openMediaLightbox = openMediaLightbox;
window.closeMediaLightbox = closeMediaLightbox;