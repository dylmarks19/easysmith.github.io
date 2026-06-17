function addSpinAnimation() {
  const spinStyle = document.createElement('style');
  spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(spinStyle);
}

function initSite() {
  renderHome();
  renderProducts();
  renderGuide();
  renderCertifications();
  renderContact();
  renderFooters();
  setupNavigation();
  addSpinAnimation();
  routeFromHash();
}

initSite();
