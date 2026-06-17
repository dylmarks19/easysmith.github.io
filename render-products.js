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
            <p style="font-size:11px;color:var(--text-faint);margin-top:10px;">Platform heights shown. All units made to order. Custom specifications available on request.</p>
          </div>
            <div class="acc-img-side">
              ${cat.image
                ? `<img src="${cat.image}" alt="${cat.title}" class="acc-product-img">`
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
