const NAV_ORDER = ['home','products','offers','certs','contact'];

function show(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  const target = el('section-' + section);
  if (!target) return;

  target.classList.add('active');
  document.querySelectorAll('#nav-links li a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('#mobile-menu a').forEach(a => a.classList.remove('active'));

  const idx = NAV_ORDER.indexOf(section);
  if (idx >= 0) {
    const desktopLinks = document.querySelectorAll('#nav-links li a');
    const mobileLinks  = document.querySelectorAll('#mobile-menu a');
    if (desktopLinks[idx]) desktopLinks[idx].classList.add('active');
    if (mobileLinks[idx])  mobileLinks[idx].classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (location.hash !== `#${section}`) history.pushState({ section }, '', `#${section}`);
}
function toggleMenu() {
  const menu = el('mobile-menu');
  const ham  = el('hamburger');
  const open = menu.classList.toggle('open');
  ham.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeMenu() {
  el('mobile-menu').classList.remove('open');
  el('hamburger').classList.remove('open');
  document.body.style.overflow = '';
}

function setupNavigation() {
  document.addEventListener('click', (e) => {
    const menu = el('mobile-menu');
    const ham  = el('hamburger');

    if (menu.classList.contains('open') && !menu.contains(e.target) && !ham.contains(e.target)) {
      closeMenu();
    }
  });
}
function routeFromHash() {
  const section = location.hash.replace('#', '') || 'home';
  if (NAV_ORDER.includes(section)) show(section);
  else show('home');
}
window.addEventListener('popstate', routeFromHash);
window.show = show;
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.setupNavigation = setupNavigation;
