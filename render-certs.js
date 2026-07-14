// ═══════════════════════════════════════════════════════════════════════════
// Certifications are fully independent per product line — a line with
// nothing relevant to certify (or nothing decided yet) simply omits
// `certifications` and is skipped here, rather than forcing every line to
// share one company-wide list.
// ═══════════════════════════════════════════════════════════════════════════

// Tracks which cert sections are collapsed (open by default).
const collapsedCertSections = new Set();

function toggleCertSection(lineId) {
  const section = el('cert-section-' + lineId);
  if (!section) return;

  const isCollapsed = collapsedCertSections.has(lineId);
  if (isCollapsed) collapsedCertSections.delete(lineId);
  else collapsedCertSections.add(lineId);

  section.classList.toggle('collapsed', !isCollapsed);
  const head = section.querySelector('.line-section-head');
  if (head) head.setAttribute('aria-expanded', String(isCollapsed));
}

function renderCertifications() {
  const host = el('cert-sections');
  if (!host) return;

  const linesWithCerts = PRODUCT_LINES.filter(l => l.certifications && l.certifications.length);

  if (!linesWithCerts.length) {
    host.innerHTML = `
      <div class="guide-empty">
        <i class="ti ti-info-circle"></i>
        <h4>No certifications listed yet</h4>
        <p>Get in touch and we can send through relevant compliance documentation directly.</p>
      </div>`;
    return;
  }

  // One stacked, collapsible section per line — always shows the line's own
  // heading, even with a single line today, so nothing shifts visually the
  // moment a second line's certifications are added.
  host.innerHTML = linesWithCerts.map(line => `
    <div class="line-section${collapsedCertSections.has(line.id) ? ' collapsed' : ''}" id="cert-section-${line.id}">
      <button class="line-section-head" type="button" onclick="toggleCertSection('${line.id}')" aria-expanded="${!collapsedCertSections.has(line.id)}" aria-controls="cert-body-${line.id}">
        <div class="line-section-title"><i class="ti ${line.icon || 'ti-box'}"></i> ${line.name}</div>
        <i class="ti ti-chevron-down line-section-chevron"></i>
      </button>
      <div class="line-section-body" id="cert-body-${line.id}">
        <div class="cert-grid">
          ${(line.renderCertifications || defaultCertGridHTML)(line.certifications)}
        </div>
      </div>
    </div>`
  ).join('');
}

window.renderCertifications = renderCertifications;
window.toggleCertSection = toggleCertSection;
