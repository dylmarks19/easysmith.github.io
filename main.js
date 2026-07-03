function addSpinAnimation() {
  const spinStyle = document.createElement('style');
  spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(spinStyle);
}

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

initSite();
