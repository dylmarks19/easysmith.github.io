// ═══════════════════════════════════════════════════════════════════════════
// Every product line gets its own stacked section here — full accordion plus
// its own comparison table (if it defines compareRows) — all rendered at
// once, consistent with the Home page. There's no "currently selected line"
// state: everything is always visible, so adding a line never requires any
// switching logic anywhere.
// ═══════════════════════════════════════════════════════════════════════════

// Per-line state for the comparison table's hide/show columns feature.
// Keyed by line id so each line's table is independent of the others.
const hiddenColumnsByLine = {};
const compareDropdownOpenByLine = {};

// Tracks which Products-page line sections are collapsed (open by default).
// Uses its own "products-line-section-*" id namespace — deliberately
// distinct from Home's "line-section-*" ids, since both pages' sections
// exist in the DOM at the same time (only one page is visually shown at
// once via CSS) and sharing ids would make getElementById silently grab
// the wrong one.
const collapsedProductsLineSections = new Set();

function toggleProductsLineSection(lineId) {
  const section = el('products-line-section-' + lineId);
  if (!section) return;

  const isCollapsed = collapsedProductsLineSections.has(lineId);
  if (isCollapsed) collapsedProductsLineSections.delete(lineId);
  else collapsedProductsLineSections.add(lineId);

  section.classList.toggle('collapsed', !isCollapsed);
  const head = section.querySelector('.line-section-head');
  if (head) head.setAttribute('aria-expanded', String(isCollapsed));
}

function getHiddenSet(lineId) {
  if (!hiddenColumnsByLine[lineId]) hiddenColumnsByLine[lineId] = new Set();
  return hiddenColumnsByLine[lineId];
}

function renderProducts() {
  const host = el('product-lines');
  if (!host) return;

  host.innerHTML = PRODUCT_LINES.map(line => `
    <div class="line-section${collapsedProductsLineSections.has(line.id) ? ' collapsed' : ''}" id="products-line-section-${line.id}">
      <button class="line-section-head" type="button" onclick="toggleProductsLineSection('${line.id}')" aria-expanded="${!collapsedProductsLineSections.has(line.id)}" aria-controls="products-line-body-${line.id}">
        <div class="line-section-title"><i class="ti ${line.icon || 'ti-box'}"></i> ${line.name}</div>
        <i class="ti ti-chevron-down line-section-chevron"></i>
      </button>
      ${line.tagline ? `<p class="line-section-tagline">${line.tagline}</p>` : ''}
      <div class="line-section-body" id="products-line-body-${line.id}">
        <div class="acc-list">
          ${line.categories.map(cat => accordionItemHTML(line, cat)).join('')}
        </div>
        ${line.compareRows ? `<div id="comparison-${line.id}"></div>` : ''}
      </div>
    </div>`
  ).join('');

  const dlBtn = el('catalogue-download-btn');
  if (dlBtn) {
    dlBtn.href = C.cataloguePdf;
    dlBtn.setAttribute('download', C.cataloguePdfLabel + '.pdf');
    dlBtn.setAttribute('title', C.cataloguePdfLabel);
  }
  el('guide-prompt-products').innerHTML = guidePromptHTML();

  PRODUCT_LINES.forEach(line => {
    if (line.compareRows) renderComparisonTable(line);
  });

  openProductsFromHash();
}

function accordionItemHTML(line, cat) {
  return `
    <div class="acc-item" id="acc-${cat.id}">
      <button class="acc-trigger" onclick="toggleAcc('${cat.id}')" aria-expanded="false">
        <div class="acc-code-box">
          <span class="code-lbl">${cat.code}</span>
          <span class="code-sub">Series</span>
        </div>
        <div class="acc-title-area">
          <div>
            <div class="acc-title-main">${cat.title}</div>
            <div class="acc-title-desc">${cat.shortDesc}</div>
          </div>
          <div class="acc-right">
            <span class="acc-price"><i class="ti ti-tag" style="font-size:10px;margin-right:4px;"></i>${cat.price > 0 ? 'Priced from: ZAR ' + cat.price.toLocaleString() : 'Priced on enquiry'}</span>
            <span class="acc-arrow"><i class="ti ti-chevron-down"></i></span>
          </div>
        </div>
      </button>
      <div class="acc-body">
        ${renderCategoryBody(line, cat)}
      </div>
    </div>`;
}

// ── Comparison table (fully generic — driven by line.compareRows) ───────────
function renderComparisonTable(line) {
  const host = el('comparison-' + line.id);
  if (!host) return;

  const hidden = getHiddenSet(line.id);
  const isDropdownOpen = !!compareDropdownOpenByLine[line.id];

  const cols = line.categories.map(cat => {
    const row = { id: cat.id, code: cat.code, title: cat.title };
    line.compareRows.forEach(r => {
      row[r.key] = r.headerNeedles ? getMaxSpecValue(cat, r.headerNeedles) : (cat[r.key] ?? '—');
    });
    return row;
  }).filter(c => !hidden.has(c.id));

  const hasHidden = hidden.size > 0;
  const allHidden = hidden.size === line.categories.length;

  const headers = `
    <th>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <span>Comparison Criteria</span>
        <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
          ${hasHidden ? `
            <div class="comp-dropdown">
              <button class="btn btn-ghost btn-sm" style="font-size: 10px; padding: 5px 8px; border-color: rgba(232,99,10,0.4); color: var(--orange);" onclick="toggleCompareDropdown('${line.id}', event)">
                <i class="ti ti-plus"></i> Column...
              </button>
              ${isDropdownOpen ? `
                <div class="comp-dropdown-menu">
                  <button class="comp-dropdown-item comp-dropdown-all" onclick="resetComparisonColumns('${line.id}')">
                    <i class="ti ti-eye"></i> Show All
                  </button>
                  <div class="comp-dropdown-divider"></div>
                  ${Array.from(hidden).map(id => {
                    const cat = line.categories.find(c => c.id === id);
                    return `
                      <button class="comp-dropdown-item" onclick="showCategoryColumn('${line.id}', '${id}', event)">
                        <i class="ti ti-plus"></i> <strong>${cat.code}</strong> — ${cat.title}
                      </button>
                    `;
                  }).join('')}
                </div>
              ` : ''}
            </div>
          ` : ''}
          ${!allHidden ? `
            <button class="btn btn-ghost btn-sm" style="font-size: 10px; padding: 5px 8px; border-color: rgba(20,18,15,0.14); color: var(--text-faint);" onclick="clearComparisonColumns('${line.id}', event)">
              <i class="ti ti-trash"></i> Clear All
            </button>
          ` : ''}
        </div>
      </div>
    </th>
    ${cols.map(c => `
      <th style="position: relative; padding-top: 30px;">
        <button class="comp-hide-btn" onclick="hideCategoryColumn('${line.id}', '${c.id}')" title="Hide this column">
          <i class="ti ti-x"></i>
        </button>
        <div class="comp-code-tag">${c.code}</div>
        <div class="comp-title">${c.title}</div>
        <button class="btn btn-orange btn-sm" style="font-size: 10px; padding: 4px 8px; margin-top: 8px; letter-spacing: 0;" onclick="showCategory('${c.id}')">View Range</button>
      </th>
    `).join('')}
  `;

  const tbodyHtml = line.compareRows.map(r => `
    <tr>
      <td>${r.label}</td>
      ${cols.map(c => {
        const val = c[r.key];
        const displayVal = r.highlight ? `<span class="comp-val-highlight">${val}</span>` : val;
        return `<td>${displayVal}</td>`;
      }).join('')}
    </tr>
  `).join('');

  host.innerHTML = `
    <div class="sec-head" style="font-size: 32px; margin-top: 3.5rem;">Category <em>Comparison</em></div>
    <p class="sec-sub">Quickly compare specifications across all ${line.categories.length} ${line.name} series to find the right equipment class. Click the "X" on a column to hide it, or clear all and select exactly what you want to compare side-by-side.</p>
    <div class="comp-table-container">
      <table class="comp-table">
        <thead><tr>${headers}</tr></thead>
        <tbody>${tbodyHtml}</tbody>
      </table>
    </div>
  `;
}

function toggleCompareDropdown(lineId, event) {
  event.stopPropagation();
  compareDropdownOpenByLine[lineId] = !compareDropdownOpenByLine[lineId];
  renderComparisonTable(PRODUCT_LINES.find(l => l.id === lineId));
}

function showCategoryColumn(lineId, id, event) {
  event.stopPropagation();
  const hidden = getHiddenSet(lineId);
  hidden.delete(id);
  if (hidden.size === 0) compareDropdownOpenByLine[lineId] = false;
  renderComparisonTable(PRODUCT_LINES.find(l => l.id === lineId));
}

function hideCategoryColumn(lineId, id) {
  getHiddenSet(lineId).add(id);
  renderComparisonTable(PRODUCT_LINES.find(l => l.id === lineId));
}

function resetComparisonColumns(lineId) {
  getHiddenSet(lineId).clear();
  compareDropdownOpenByLine[lineId] = false;
  renderComparisonTable(PRODUCT_LINES.find(l => l.id === lineId));
}

function clearComparisonColumns(lineId, event) {
  if (event) event.stopPropagation();
  const line = PRODUCT_LINES.find(l => l.id === lineId);
  const hidden = getHiddenSet(lineId);
  line.categories.forEach(cat => hidden.add(cat.id));
  compareDropdownOpenByLine[lineId] = false;
  renderComparisonTable(line);
}

document.addEventListener('click', () => {
  let anyOpen = false;
  Object.keys(compareDropdownOpenByLine).forEach(lineId => {
    if (compareDropdownOpenByLine[lineId]) {
      anyOpen = true;
      compareDropdownOpenByLine[lineId] = false;
      renderComparisonTable(PRODUCT_LINES.find(l => l.id === lineId));
    }
  });
});

/**
 * showCategory — Navigates to the Products page, expands that category's
 * line section if it's currently collapsed, then opens and scrolls to the
 * matching accordion item. Called from products.html's own comparison
 * table "View Range" buttons, and automatically on page load if arriving
 * here via a #categoryId link from another page (see openProductsFromHash).
 */
function showCategory(id) {
  const line = findLineForCategory(id);
  if (line) {
    const section = el('products-line-section-' + line.id);
    if (section && section.classList.contains('collapsed')) {
      toggleProductsLineSection(line.id);
    }
  }

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
}

/**
 * openProductsFromHash — Runs once on page load. If we arrived here via a
 * link like products.html#tmt (from Home, the Selection Guide, etc.), open
 * and scroll to that category automatically. Retries briefly rather than
 * assuming a fixed delay is enough, since renderProducts() building the
 * accordion and this running are both part of the same load sequence and
 * timing can vary.
 */
function openProductsFromHash() {
  const id = window.location.hash.replace('#', '');
  if (!id) return;

  let attempts = 0;
  const tryOpen = () => {
    if (el('acc-' + id)) {
      showCategory(id);
    } else if (attempts < 20) {
      attempts++;
      setTimeout(tryOpen, 50);
    }
  };
  tryOpen();
}

function toggleAcc(id) {
  const item = el('acc-' + id);
  if (!item) return;
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.acc-item').forEach(a => {
    a.classList.remove('open');
    a.querySelector('.acc-trigger').setAttribute('aria-expanded','false');
  });

  if (!isOpen) {
    item.classList.add('open');
    item.querySelector('.acc-trigger').setAttribute('aria-expanded','true');
    setTimeout(() => {
      item.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }, 80);
  }
}

window.renderProducts = renderProducts;
window.showCategory = showCategory;
window.toggleAcc = toggleAcc;
window.toggleProductsLineSection = toggleProductsLineSection;
window.hideCategoryColumn = hideCategoryColumn;
window.resetComparisonColumns = resetComparisonColumns;
window.toggleCompareDropdown = toggleCompareDropdown;
window.showCategoryColumn = showCategoryColumn;
window.clearComparisonColumns = clearComparisonColumns;