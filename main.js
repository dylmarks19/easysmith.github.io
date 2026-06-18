/**
 * ============================================================================
 * MAIN ENTRY POINT (main.js)
 * ============================================================================
 * This is the primary JavaScript file that starts the website. It runs
 * automatically when the page loads, calling each section's render function
 * in order, setting up navigation, and handling URL-based routing.
 *
 * HOW THE SITE WORKS:
 *   - All site data (products, company info, etc.) lives in site-config.js
 *   - Each page section has its own render-*.js file that builds its HTML
 *   - main.js calls all of them in the correct order on page load
 */

/**
 * Adds a global CSS keyframe animation for spinning loader icons.
 * Injected dynamically so it doesn't need to live in styles.css.
 */
function addSpinAnimation() {
  const spinStyle = document.createElement('style');
  spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(spinStyle);
}

/**
 * Master initialization — runs once when the page loads.
 * Each function below builds a different section of the site.
 * To disable or change a section, find its corresponding render-*.js file.
 */
function initSite() {
  renderHome();           // Builds the Home page (hero, category cards, stats)
  renderProducts();       // Builds the Products page (accordion, comparison table)
  renderGuide();          // Builds the Selection Guide (filter form + results)
  renderCertifications(); // Builds the Certifications page (cert cards grid)
  renderContact();        // Builds the Contact page (enquiry form + contact info)
  renderFooters();        // Injects the footer into every page section
  setupNavigation();      // Wires up the mobile hamburger menu and click-outside handler
  addSpinAnimation();     // Injects the CSS spin animation for loaders
  routeFromHash();        // On load, checks the URL hash (e.g. #products) and shows that section
}

// ── Kick off the site ──
initSite();
