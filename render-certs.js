function renderCertifications() {
  el('cert-grid').innerHTML = C.certifications.map(c=>`
    <div class="cert-card">
      <div class="cert-icon"><i class="ti ${c.icon}"></i></div>
      <div class="cert-name">${c.name}</div>
      <p class="cert-body">${c.body}</p>
      <span class="tag tag-${c.tagType}">${c.tagLabel}</span>
    </div>`).join('');
}

window.renderCertifications = renderCertifications;
