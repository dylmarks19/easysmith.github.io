// Tracks which line sections are collapsed (open by default — nothing in
// this Set on first load means every section starts expanded).
const collapsedLineSections = new Set();

function toggleLineSection(lineId) {
  const section = el('line-section-' + lineId);
  if (!section) return;

  const isCollapsed = collapsedLineSections.has(lineId);
  if (isCollapsed) collapsedLineSections.delete(lineId);
  else collapsedLineSections.add(lineId);

  section.classList.toggle('collapsed', !isCollapsed);
  const head = section.querySelector('.line-section-head');
  if (head) head.setAttribute('aria-expanded', String(isCollapsed));
}

function renderHome() {
  el('hero-eyebrow').textContent = C.hero.eyebrow;

  el('hero-h1').innerHTML = `${C.hero.line1}<br><em>${C.hero.line2}</em>`;

  el('hero-sub').textContent = C.hero.sub;

  el('hero-trust').innerHTML = C.trustBadges.map(b =>
    `<div class="trust-item"><i class="ti ${b.icon}"></i> ${b.label}</div>`
  ).join('');

  el('stats-bar').innerHTML = computeStatsBar().map(s =>
    `<div class="stat-item">
       <div class="stat-num">${s.num}</div>
       <div class="stat-lbl">${s.lbl}</div>
     </div>`
  ).join('');

  // One stacked section per product line — always shows the line's own
  // heading/tagline, even with a single line today, so nothing shifts
  // visually the moment a second line is added. Each section is
  // collapsible (open by default) via the chevron next to its heading.
  el('home-lines').innerHTML = PRODUCT_LINES.map(line => `
    <div class="line-section${collapsedLineSections.has(line.id) ? ' collapsed' : ''}" id="line-section-${line.id}">
      <button class="line-section-head" type="button" onclick="toggleLineSection('${line.id}')" aria-expanded="${!collapsedLineSections.has(line.id)}" aria-controls="line-body-${line.id}">
        <div class="line-section-title"><i class="ti ${line.icon || 'ti-box'}"></i> ${line.name}</div>
        <i class="ti ti-chevron-down line-section-chevron"></i>
      </button>
      ${line.tagline ? `<p class="line-section-tagline">${line.tagline}</p>` : ''}
      <div class="line-section-body" id="line-body-${line.id}">
        <div class="cat-grid">
          ${line.categories.map(cat => renderCategoryCard(line, cat)).join('')}
        </div>
      </div>
    </div>`
  ).join('');

  el('guide-prompt-home').innerHTML = guidePromptHTML();

  ensureCatModal();
}

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
  const cat = findCategoryById(id);
  if (!cat) return;

  el('cat-modal-content').innerHTML = `
    <button class="cat-modal-close" type="button" onclick="closeCatModal()"><i class="ti ti-x"></i></button>

    <div class="cat-modal-img-wrap">
      ${getCategoryImages(cat).length
        ? productImageGalleryHTML(cat.id + '-modal', cat.title, getCategoryImages(cat))
        : `<div class="cat-modal-icon-fallback"><i class="ti ${cat.icon}"></i><span>Image coming soon</span></div>`}
    </div>

    <div class="cat-modal-body">
      <span class="cat-modal-code">${cat.code} Series</span>
      <div class="cat-modal-title">${cat.title}</div>
      <p class="cat-modal-desc">${cat.shortDesc}</p>
      ${cat.price > 0 ? `<div class="cat-modal-price"><i class="ti ti-tag" style="font-size:11px;margin-right:4px;"></i>Priced from: ZAR ${cat.price.toLocaleString()}</div>` : ''}

      <div class="cat-modal-actions">
        <button class="btn btn-navy" type="button" onclick="goToCategory('${cat.id}')"><i class="ti ti-stack-2"></i> View Full Range</button>
        <a class="btn btn-outline-orange" href="contact.html"><i class="ti ti-send"></i> Enquire</a>
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

window.renderHome    = renderHome;
window.openCatModal  = openCatModal;
window.closeCatModal = closeCatModal;
window.toggleLineSection = toggleLineSection;