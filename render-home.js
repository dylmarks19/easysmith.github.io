/* ============================================================
 *  render-home.js
 *  Atlas Industrial Systems — Home Page Renderer
 * ============================================================
 *
 *  PURPOSE
 *  -------
 *  This file is responsible for building and displaying every
 *  visible element on the Home page. It reads content from the
 *  global data objects (C for site-wide copy, CATEGORIES for
 *  product categories) and injects that content directly into
 *  the page's HTML placeholders.
 *
 *  It also manages the "category preview modal" — the pop-up
 *  panel that slides in when a visitor clicks one of the product
 *  category cards.
 *
 *  SECTIONS IN THIS FILE
 *  ----------------------
 *  1. renderHome()       — Master function that builds the whole Home page
 *  2. ensureCatModal()   — One-time setup for the category modal overlay
 *  3. openCatModal()     — Populates and opens the category modal
 *  4. closeCatModal()    — Hides the category modal
 *  5. showCategory()     — Navigates to the Products page and opens a category accordion
 *  6. Global exports     — Makes all functions available to inline HTML event handlers
 *
 * ============================================================ */


// ── 1. RENDER HOME ──────────────────────────────────────────────────────────
//
// renderHome() is the main entry point for the Home page.
// Call this once when the page loads to fill in every section:
//   • Hero banner (eyebrow text, headline, sub-headline, trust badges)
//   • Stats bar (key company numbers like years in business, products stocked, etc.)
//   • "What We Supply" category card grid
//   • "Guide prompt" call-to-action block at the bottom
// It also triggers the one-time modal setup so the pop-up is ready to use.

function renderHome() {

  // ── Hero Banner ────────────────────────────────────────────────────────────
  // The hero is the large banner at the top of the Home page.
  // It has three text layers: eyebrow (small label above headline),
  // the main headline (split over two lines, with the second line in italics),
  // and a sub-headline / supporting sentence.

  // Small label that sits above the main headline (e.g. "South Africa's Premier Supplier")
  el('hero-eyebrow').textContent = C.hero.eyebrow;

  // Main headline — line1 is plain text, line2 is wrapped in <em> for italic styling
  el('hero-h1').innerHTML = `${C.hero.line1}<br><em>${C.hero.line2}</em>`;

  // Supporting sentence beneath the headline
  el('hero-sub').textContent = C.hero.sub;

  // Trust badges — small icon + label combos that reinforce credibility
  // (e.g. "ISO Certified", "20+ Years Experience"). Built from the C.trustBadges array.
  el('hero-trust').innerHTML = C.trustBadges.map(b =>
    `<div class="trust-item"><i class="ti ${b.icon}"></i> ${b.label}</div>`
  ).join('');


  // ── Stats Bar ─────────────────────────────────────────────────────────────
  // A horizontal strip of key numbers (e.g. "500+ Products", "20 Years").
  // Each stat has a large number (num) and a small label beneath it (lbl).
  // Built from the C.stats array.

  el('stats-bar').innerHTML = C.stats.map(s =>
    `<div class="stat-item">
       <div class="stat-num">${s.num}</div>
       <div class="stat-lbl">${s.lbl}</div>
     </div>`
  ).join('');


  // ── "What We Supply" Category Card Grid ───────────────────────────────────
  // Loops through every product category and builds a clickable card for each one.
  // Each card shows:
  //   • A thumbnail (photo if available, or an icon as fallback)
  //   • The category code as a small label on the thumbnail
  //   • The category title and a short description (trimmed to 85 characters)
  //   • A "View Models" button
  // Clicking any card calls openCatModal() with that category's ID,
  // which opens the preview pop-up.

  el('home-cat-grid').innerHTML = CATEGORIES.map(cat => `
    <div class="cat-card" onclick="openCatModal('${cat.id}')">
      <div class="cat-thumb" style="background:${cat.color};">

        ${cat.image
          /* If the category has a photo, show it; otherwise fall back to an icon */
          ? `<img src="${cat.image}" alt="${cat.title}" class="cat-thumb-img" loading="lazy" decoding="async">`
          : `<i class="ti ${cat.icon}"></i>`
        }

        <span class="cat-lbl">${cat.code}</span>
      </div>

      <div class="cat-body">
        <div class="cat-title">${cat.title}</div>

        <!-- Truncated description — only the first 85 characters are shown on the card -->
        <p class="cat-text">${cat.shortDesc.substring(0, 85)}...</p>

        <a class="btn btn-outline-navy" style="font-size:11px;padding:7px 12px;">View Models <i class="ti ti-arrow-right"></i></a>
      </div>
    </div>`
  ).join('');


  // ── Guide Prompt (Bottom CTA) ──────────────────────────────────────────────
  // Renders the "Not sure what you need?" call-to-action block at the bottom
  // of the Home page. The HTML for this block comes from the shared
  // guidePromptHTML() helper (defined elsewhere in the codebase).

  el('guide-prompt-home').innerHTML = guidePromptHTML();


  // ── Modal Setup ───────────────────────────────────────────────────────────
  // Make sure the category modal overlay exists in the DOM before
  // any cards are clicked. This is safe to call multiple times —
  // it will do nothing if the modal was already created.

  ensureCatModal();
}


// ── 2. ENSURE CAT MODAL ─────────────────────────────────────────────────────
//
// ensureCatModal() is a one-time setup function.
// It checks whether the category modal overlay already exists in the page.
// If it does, it exits immediately (no duplicate modals).
// If it doesn't, it creates the overlay <div>, adds it to the page,
// and wires up two ways to close it:
//   • Clicking the dark backdrop behind the modal box
//   • Pressing the Escape key on the keyboard

function ensureCatModal() {

  // If the modal overlay already exists, do nothing — no need to create it again
  if (el('cat-modal-overlay')) return;

  // Create the dark semi-transparent backdrop that covers the page behind the modal
  const overlay = document.createElement('div');
  overlay.id = 'cat-modal-overlay';
  overlay.className = 'cat-modal-overlay';

  // The inner white modal box sits inside the overlay
  overlay.innerHTML = `<div class="cat-modal" id="cat-modal-content"></div>`;

  // Close the modal if the user clicks on the dark backdrop
  // (but NOT if they click inside the modal box itself)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCatModal();
  });

  // Attach the overlay to the bottom of the <body> so it covers the whole page
  document.body.appendChild(overlay);

  // Also close the modal when the visitor presses the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCatModal();
  });
}


// ── 3. OPEN CAT MODAL ───────────────────────────────────────────────────────
//
// openCatModal(id) is triggered when a visitor clicks a category card.
// It receives the category's unique ID (e.g. 'hydraulics'), looks it up
// in the CATEGORIES array, then builds the modal's inner HTML and opens it.
//
// The modal displays:
//   • A close (x) button in the top-right corner
//   • The category's photo (or an icon placeholder if no photo exists)
//   • Category code, full title, and complete description
//   • A "from" price (only shown if a price is set for the category)
//   • Two action buttons: "View Full Range" (goes to Products page) and "Enquire" (goes to Contact page)
//
// While the modal is open, page scrolling is disabled so the backdrop feels solid.

function openCatModal(id) {

  // Find the category object that matches the clicked card's ID
  const cat = CATEGORIES.find(c => c.id === id);

  // Safety check — if no matching category is found, stop here
  if (!cat) return;

  // Build and inject the modal's content HTML
  el('cat-modal-content').innerHTML = `
    <button class="cat-modal-close" type="button" onclick="closeCatModal()"><i class="ti ti-x"></i></button>

    <div class="cat-modal-img-wrap" style="background:${cat.color};">
      ${cat.image
        /* Show the category photo if available; otherwise show an icon placeholder */
        ? `<img src="${cat.image}" alt="${cat.title}" class="cat-modal-img" decoding="async">`
        : `<div class="cat-modal-icon-fallback"><i class="ti ${cat.icon}"></i><span>Image coming soon</span></div>`}
    </div>

    <div class="cat-modal-body">
      <!-- Small label showing the series code (e.g. "HYD Series") -->
      <span class="cat-modal-code">${cat.code} Series</span>

      <!-- Full category name -->
      <div class="cat-modal-title">${cat.title}</div>

      <!-- Full description text (not truncated, unlike the card) -->
      <p class="cat-modal-desc">${cat.shortDesc}</p>

      <!-- "Priced from" line — only rendered if the category has a price greater than zero -->
      ${cat.price > 0 ? `<div class="cat-modal-price"><i class="ti ti-tag" style="font-size:11px;margin-right:4px;"></i>Priced from: ZAR ${cat.price.toLocaleString()}</div>` : ''}

      <div class="cat-modal-actions">
        <!-- "View Full Range" — closes the modal, then navigates to the Products page
             and opens this category's accordion section -->
        <button class="btn btn-navy" type="button" onclick="closeCatModal(); showCategory('${cat.id}')"><i class="ti ti-stack-2"></i> View Full Range</button>

        <!-- "Enquire" — closes the modal, then takes the user to the Contact page -->
        <button class="btn btn-outline-orange" type="button" onclick="closeCatModal(); show('contact')"><i class="ti ti-send"></i> Enquire</button>
      </div>
    </div>`;

  // Show the modal by adding the 'open' CSS class to the overlay
  el('cat-modal-overlay').classList.add('open');

  // Lock the page scroll so the background doesn't move while the modal is open
  document.body.style.overflow = 'hidden';
}


// ── 4. CLOSE CAT MODAL ──────────────────────────────────────────────────────
//
// closeCatModal() hides the category preview modal.
// It removes the 'open' class from the overlay (which hides it via CSS)
// and re-enables page scrolling.
// Called by: the close (x) button, the Escape key, and the backdrop click listener.

function closeCatModal() {

  const overlay = el('cat-modal-overlay');

  // Safety check — if the modal doesn't exist in the DOM, do nothing
  if (!overlay) return;

  // Hide the modal by removing the 'open' class
  overlay.classList.remove('open');

  // Re-enable page scrolling now that the modal is gone
  document.body.style.overflow = '';
}


// ── 5. SHOW CATEGORY ────────────────────────────────────────────────────────
//
// showCategory(id) navigates the visitor to the Products page and
// automatically opens the accordion section for the specified category.
//
// How it works:
//   1. Calls show('products') to switch the visible page to Products.
//   2. Waits a short moment (60ms) for the Products page to render.
//   3. Collapses all other accordion items so only one is open at a time.
//   4. Finds the target accordion item by its ID and expands it.
//   5. Waits another moment (100ms) then smoothly scrolls to it.
//
// This function is triggered by the "View Full Range" button inside the modal.

function showCategory(id) {

  // Switch to the Products page view
  show('products');

  // Wait briefly to ensure the Products page DOM is fully rendered
  // before trying to find and open the accordion
  setTimeout(() => {

    // Collapse all existing accordion items and mark them as not expanded
    // (so we don't end up with multiple sections open at once)
    document.querySelectorAll('.acc-item').forEach(a => {
      a.classList.remove('open');
      a.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
    });

    // Find the accordion item for the requested category.
    // Accordion items are expected to have IDs like "acc-hydraulics", "acc-pumps", etc.
    const target = el('acc-' + id);

    if (target) {
      // Expand the target accordion section
      target.classList.add('open');
      target.querySelector('.acc-trigger').setAttribute('aria-expanded', 'true');

      // After a further short delay, smoothly scroll the page to bring
      // the opened section into view at the top of the viewport
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

  }, 60);
}


// ── 6. GLOBAL EXPORTS ───────────────────────────────────────────────────────
//
// These lines attach each function to the global `window` object.
// This is necessary because the HTML markup uses inline event handlers
// like onclick="openCatModal('...')" — those handlers can only call
// functions that are available globally on `window`.
// Without these lines, the buttons would throw "function not defined" errors.

window.renderHome    = renderHome;
window.showCategory  = showCategory;
window.openCatModal  = openCatModal;
window.closeCatModal = closeCatModal;
