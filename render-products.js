function renderProducts() {
  el('acc-list').innerHTML = CATEGORIES.map((cat) => {
    const theadHtml = cat.tableHeaders.map(h => `<th>${h}</th>`).join('');
    const tbodyHtml = cat.tableRows.map(row =>
      `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
    ).join('');

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
        <div class="acc-body-inner">
          <div class="acc-table-side">
            <h4>Full Model Range - ${cat.title}</h4>
            <div style="overflow-x:auto;">
              <table class="prod-table">
                <thead><tr>${theadHtml}</tr></thead>
                <tbody>${tbodyHtml}</tbody>
              </table>
            </div>
            <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
              <a class="btn btn-navy btn-sm" onclick="show('contact')"><i class="ti ti-file-invoice"></i> Enquire About This Range</a>
              <a class="btn btn-ghost btn-sm" onclick="show('products')"><i class="ti ti-file-download"></i> Full Catalogue</a>
            </div>
            <p style="font-size:11px;color:var(--text-faint);margin-top:10px;">Platform heights shown. All units are made to order. Custom specifications available on request.</p>
          </div>
            <div class="acc-img-side">
              ${cat.image
                ? `<img src="${cat.image}" alt="${cat.title}" class="acc-product-img" loading="lazy" decoding="async">`
                : `<div class="acc-img-placeholder">
                    <i class="ti ti-photo-off"></i>
                    <span>Product image coming soon</span>
                  </div>`
              }
              <div class="acc-img-actions">
                <a class="btn btn-outline-orange btn-sm" onclick="show('products')"><i class="ti ti-file-text"></i> View in Catalogue</a>
              </div>
            </div>
        </div>
      </div>
    </div>`;
  }).join('');

  const dlBtn = el('catalogue-download-btn');
  if (dlBtn) {
    dlBtn.href = C.cataloguePdf;
    dlBtn.setAttribute('download', C.cataloguePdfLabel + '.pdf');
    dlBtn.setAttribute('title', C.cataloguePdfLabel);
  }
  el('guide-prompt-products').innerHTML = guidePromptHTML();
  renderComparisonTable();
}

function getMaxVal(cat, headerNeedles) {
  const idx = cat.tableHeaders.findIndex(h => headerNeedles.some(n => h.toLowerCase().includes(n)));
  if (idx < 0) return '—';
  let max = 0;
  let unit = '';
  cat.tableRows.forEach(row => {
    const valStr = row[idx];
    if (!valStr) return;
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > max) {
      max = num;
      const match = valStr.match(/[a-zA-Z]+/);
      if (match) unit = match[0];
    }
  });
  return max ? `${max}${unit}` : '—';
}

const hiddenCategoryIds = new Set();
let isCompareDropdownOpen = false;

function toggleCompareDropdown(event) {
  event.stopPropagation();
  isCompareDropdownOpen = !isCompareDropdownOpen;
  renderComparisonTable();
}

function showCategoryColumn(id, event) {
  event.stopPropagation();
  hiddenCategoryIds.delete(id);
  if (hiddenCategoryIds.size === 0) {
    isCompareDropdownOpen = false;
  }
  renderComparisonTable();
}

function hideCategoryColumn(id) {
  hiddenCategoryIds.add(id);
  renderComparisonTable();
}

function resetComparisonColumns() {
  hiddenCategoryIds.clear();
  isCompareDropdownOpen = false;
  renderComparisonTable();
}

function clearComparisonColumns(event) {
  if (event) event.stopPropagation();
  CATEGORIES.forEach(cat => hiddenCategoryIds.add(cat.id));
  isCompareDropdownOpen = false;
  renderComparisonTable();
}

// Close comparison dropdown when clicking anywhere else
document.addEventListener('click', () => {
  if (isCompareDropdownOpen) {
    isCompareDropdownOpen = false;
    renderComparisonTable();
  }
});

function renderComparisonTable() {
  const host = el('comparison-section');
  if (!host) return;

  const envMap = {
    smp1: "Light indoor maintenance, factories",
    smp2: "High indoor access, schools, halls",
    smd: "Indoor facilities, narrow-aisle warehouses",
    dmp1: "Dual-operator work, indoor halls",
    dmp2: "Heavy dual-operator indoor installation",
    fmd: "Industrial warehousing, stock picking",
    fmt: "Construction sites, uneven soft ground",
    tmd: "Compact indoor spaces, office corridors",
    tmt: "Indoor/outdoor construction, tight gates",
    x: "General indoor maintenance, flat slabs",
    ml: "Material loading, shipping, installation"
  };

  const powerMap = {
    smp1: "AC (Mains Power)",
    dmp1: "AC (Mains Power)",
    smp2: "AC Mains or DC Battery",
    dmp2: "AC Mains or DC Battery",
    smd: "DC Battery (Drivable)",
    fmd: "Heavy Duty Battery (24V/48V)",
    fmt: "Heavy Duty Battery (48V)",
    tmd: "DC Battery Pack (24V)",
    tmt: "DC Battery Pack (24V)",
    x: "DC Battery (Oil-Free Option)",
    ml: "Manual Winch (No Power)"
  };

  const mobilityMap = {
    smp1: "Push-Around (Outriggers)",
    smp2: "Push-Around (Outriggers)",
    smd: "Self-Propelled (Wheeled)",
    dmp1: "Push-Around (Outriggers)",
    dmp2: "Push-Around (Outriggers)",
    fmd: "Self-Propelled Jib (Wheeled)",
    fmt: "Self-Propelled Jib (Tracked)",
    tmd: "Self-Propelled (Wheeled)",
    tmt: "Self-Propelled (Tracked)",
    x: "Self-Propelled or Push-Around",
    ml: "Manual Push-Around"
  };

  const cols = CATEGORIES.map(cat => {
    const maxHt = getMaxVal(cat, ['platform ht', 'lift ht', 'ht']);
    const maxCap = getMaxVal(cat, ['capacity', 'load']);
    const maxOcc = getMaxVal(cat, ['occ']);
    return {
      id: cat.id,
      code: cat.code,
      title: cat.title,
      app: cat.id === 'ml' ? 'Material Lifting' : 'Personnel Access',
      mobility: mobilityMap[cat.id] || 'Push-Around',
      maxHt,
      maxCap,
      maxOcc: maxOcc === '—' ? '0' : maxOcc,
      power: powerMap[cat.id] || 'AC/DC',
      env: envMap[cat.id] || 'Indoor'
    };
  }).filter(c => !hiddenCategoryIds.has(c.id));

  const hasHidden = hiddenCategoryIds.size > 0;
  const allHidden = hiddenCategoryIds.size === CATEGORIES.length;

  const headers = `
    <th>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <span>Comparison Criteria</span>
        <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
          ${hasHidden ? `
            <div class="comp-dropdown">
              <button class="btn btn-ghost btn-sm" style="font-size: 10px; padding: 5px 8px; border-color: rgba(232,99,10,0.4); color: var(--orange);" onclick="toggleCompareDropdown(event)">
                <i class="ti ti-plus"></i> Column...
              </button>
              ${isCompareDropdownOpen ? `
                <div class="comp-dropdown-menu">
                  <button class="comp-dropdown-item comp-dropdown-all" onclick="resetComparisonColumns()">
                    <i class="ti ti-eye"></i> Show All
                  </button>
                  <div class="comp-dropdown-divider"></div>
                  ${Array.from(hiddenCategoryIds).map(id => {
                    const cat = CATEGORIES.find(c => c.id === id);
                    return `
                      <button class="comp-dropdown-item" onclick="showCategoryColumn('${id}', event)">
                        <i class="ti ti-plus"></i> <strong>${cat.code}</strong> — ${cat.title}
                      </button>
                    `;
                  }).join('')}
                </div>
              ` : ''}
            </div>
          ` : ''}
          ${!allHidden ? `
            <button class="btn btn-ghost btn-sm" style="font-size: 10px; padding: 5px 8px; border-color: rgba(255,255,255,0.15); color: var(--text-faint);" onclick="clearComparisonColumns(event)">
              <i class="ti ti-trash"></i> Clear All
            </button>
          ` : ''}
        </div>
      </div>
    </th>
    ${cols.map(c => `
      <th style="position: relative; padding-top: 30px;">
        <button class="comp-hide-btn" onclick="hideCategoryColumn('${c.id}')" title="Hide this column">
          <i class="ti ti-x"></i>
        </button>
        <div class="comp-code-tag">${c.code}</div>
        <div class="comp-title">${c.title}</div>
        <button class="btn btn-orange btn-sm" style="font-size: 10px; padding: 4px 8px; margin-top: 8px; letter-spacing: 0;" onclick="showCategory('${c.id}')">View Range</button>
      </th>
    `).join('')}
  `;

  const rows = [
    { label: 'Application', key: 'app' },
    { label: 'Mobility Type', key: 'mobility' },
    { label: 'Max Lift/Platform Height', key: 'maxHt', highlight: true },
    { label: 'Max Load Capacity', key: 'maxCap', highlight: true },
    { label: 'Max Operators', key: 'maxOcc' },
    { label: 'Power Source', key: 'power' },
    { label: 'Best Suited For', key: 'env' }
  ];

  const tbodyHtml = rows.map(r => `
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
    <p class="sec-sub">Quickly compare specifications across all 11 Atlas product series to find the right equipment class. Click the "X" on a column to hide it, or clear all and select exactly what you want to compare side-by-side.</p>
    <div class="comp-table-container">
      <table class="comp-table">
        <thead><tr>${headers}</tr></thead>
        <tbody>${tbodyHtml}</tbody>
      </table>
    </div>
  `;
}
function toggleAcc(id) {
  const item = el('acc-' + id);
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
window.toggleAcc = toggleAcc;
window.hideCategoryColumn = hideCategoryColumn;
window.resetComparisonColumns = resetComparisonColumns;
window.toggleCompareDropdown = toggleCompareDropdown;
window.showCategoryColumn = showCategoryColumn;
window.clearComparisonColumns = clearComparisonColumns;
