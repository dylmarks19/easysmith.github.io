// ═══════════════════════════════════════════════════════════════════════════
// Each major section (Home, Products, Guide, Offering, Certifications,
// Contact) is now a real, separate HTML page with its own URL — navigating
// between them is just a normal <a href="..."> link, handled natively by
// the browser. All that's left here is the mobile hamburger menu, which
// every page needs.
// ═══════════════════════════════════════════════════════════════════════════

function toggleMenu() {
  const menu = el('mobile-menu');  // The sliding mobile nav panel
  const ham  = el('hamburger');    // The hamburger / close icon button

  const open = menu.classList.toggle('open');

  ham.classList.toggle('open', open);

  document.body.style.overflow = open ? 'hidden' : '';
}

function closeMenu() {
  el('mobile-menu').classList.remove('open'); // Hide the nav panel
  el('hamburger').classList.remove('open');   // Reset the hamburger icon
  document.body.style.overflow = '';          // Re-enable body scrolling
}

function setupNavigation() {
  document.addEventListener('click', (e) => {
    const menu = el('mobile-menu');
    const ham  = el('hamburger');

    if (
      menu.classList.contains('open') &&
      !menu.contains(e.target) &&
      !ham.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

window.toggleMenu      = toggleMenu;
window.closeMenu       = closeMenu;
window.setupNavigation = setupNavigation;
