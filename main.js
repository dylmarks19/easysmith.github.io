function addSpinAnimation() {
  const spinStyle = document.createElement('style');
  spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(spinStyle);
}

// Each page's <body> declares which page it is, e.g. <body data-page="products">.
// This is the ONLY place that knows which render function(s) a given page
// needs — every render-*.js file itself stays completely page-agnostic.
// Function NAMES (strings) are used rather than bare references, since only
// the relevant render-*.js file is actually loaded per page — referencing
// an undefined function directly by name would throw a ReferenceError and
// crash the whole script before it even runs.
const PAGE_RENDER_FN_NAMES = {
  home:            ['renderHome'],
  products:        ['renderProducts'],
  guide:           ['renderGuide'],
  certifications:  ['renderCertifications'],
  contact:         ['renderContact'],
  // offering.html has no dynamic content of its own — nothing to render.
};

function initSite() {
  const page = document.body.dataset.page;
  (PAGE_RENDER_FN_NAMES[page] || []).forEach(fnName => {
    if (typeof window[fnName] === 'function') window[fnName]();
  });

  renderFooters();        // Injects the footer (every page has one)
  setupNavigation();       // Wires up the mobile hamburger menu and click-outside handler
  addSpinAnimation();      // Injects the CSS spin animation for loaders
}

initSite();
