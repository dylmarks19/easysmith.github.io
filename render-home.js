function renderHome() {
  el('hero-eyebrow').textContent = C.hero.eyebrow;

  el('hero-h1').innerHTML = `${C.hero.line1}<br><em>${C.hero.line2}</em>`;

  el('hero-sub').textContent = C.hero.sub;

  el('hero-trust').innerHTML = C.trustBadges.map(b =>
    `<div class="trust-item"><i class="ti ${b.icon}"></i> ${b.label}</div>`
  ).join('');

  el('stats-bar').innerHTML = C.stats.map(s =>
    `<div class="stat-item">
       <div class="stat-num">${s.num}</div>
       <div class="stat-lbl">${s.lbl}</div>
     </div>`
  ).join('');

  el('home-cat-grid').innerHTML = CATEGORIES.map(cat => `
    <div class="cat-card" onclick="openCatModal('${cat.id}')">
      <div class="cat-thumb">

        ${cat.image
          ? `<img src="${cat.image}" alt="${cat.title}" class="cat-thumb-img" loading="lazy" decoding="async">`
          : `<i class="ti ${cat.icon}"></i>`
        }

        <span class="cat-lbl">${cat.code}</span>
      </div>

      <div class="cat-body">
        <div class="cat-title">${cat.title}</div>

        <p class="cat-text">${cat.shortDesc.substring(0, 85)}...</p>

        <a class="btn btn-outline-navy" style="font-size:11px;padding:7px 12px;" onclick="event.stopPropagation(); showCategory('${cat.id}')">View Models <i class="ti ti-arrow-right"></i></a>
      </div>
    </div>`
  ).join('');

  el('guide-prompt-home').innerHTML = guidePromptHTML();

  ensureCatModal();

function ensureCatModal() {

  if (el('cat-modal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'cat-modal-overlay';
  overlay.className = 'cat-modal-overlay';

  overlay.innerHTML = `<div class="cat-modal" id="cat-modal-content"></div>`;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCatModal();
  });

  document.body.appendChild(overlay);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCatModal();
  });
}

function openCatModal(id) {

  const cat = CATEGORIES.find(c => c.id === id);

  if (!cat) return;

  el('cat-modal-content').innerHTML = `
    <button class="cat-modal-close" type="button" onclick="closeCatModal()"><i class="ti ti-x"></i></button>

    <div class="cat-modal-img-wrap">
      ${cat.image
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

  el('cat-modal-overlay').classList.add('open');

  document.body.style.overflow = 'hidden';
}

function closeCatModal() {

  const overlay = el('cat-modal-overlay');

  if (!overlay) return;

  overlay.classList.remove('open');

  document.body.style.overflow = '';
}

function showCategory(id) {

  show('products');

  setTimeout(() => {

    document.querySelectorAll('.acc-item').forEach(a => {
      a.classList.remove('open');
      a.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
    });

    const target = el('acc-' + id);

    if (target) {
      target.classList.add('open');
      target.querySelector('.acc-trigger').setAttribute('aria-expanded', 'true');

      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

  }, 60);
}

window.renderHome    = renderHome;
window.showCategory  = showCategory;
window.openCatModal  = openCatModal;
window.closeCatModal = closeCatModal;
}