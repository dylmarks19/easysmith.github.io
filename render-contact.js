function renderContact() {
  el('contact-sub').textContent = `Submit your enquiry below - include the model or product type, required specs, quantity and delivery location. ${C.contact.responseTime}.`;
  el('contact-left').innerHTML = `
    ${C.contact.phones.map(p=>`<div class="ci"><div class="ci-icon"><i class="ti ti-phone"></i></div><div><div class="ci-label">Phone - ${p.label}</div><div class="ci-val"><a href="tel:${p.display.replace(/\s/g,'')}">${p.display}</a> <a href="https://wa.me/${p.whatsapp}" target="_blank" rel="noopener" title="Available on WhatsApp" style="margin-left:8px;"><i class="ti ti-brand-whatsapp" style="color:var(--green);"></i></a></div></div></div>`).join('')}
    <div class="ci"><div class="ci-icon"><i class="ti ti-mail"></i></div><div><div class="ci-label">Email</div><div class="ci-val"><a href="mailto:${C.contact.email}">${C.contact.email}</a></div></div></div>
    <div class="ci"><div class="ci-icon"><i class="ti ti-clock"></i></div><div><div class="ci-label">Business Hours</div><div class="ci-val">${C.contact.hoursWeekday}<br>${C.contact.hoursSat}</div></div></div>
    <div class="lead-info">
      <div class="lead-title"><i class="ti ti-clock" style="color:var(--green-dark);margin-right:6px;"></i>Manufacturing Lead Times</div>
      <div class="lead-row">
        Standard units: <strong>${C.leadTimes.standard}</strong><br>
        Custom / Bespoke: <strong>${C.leadTimes.custom}</strong><br>
        Fleet (5+ units): <strong>${C.leadTimes.fleet}</strong>
      </div>
    </div>`;

  el('enquiry-select').innerHTML = C.enquiryTypes.map(t=>`<option>${t}</option>`).join('');
  el('product-category').innerHTML = '<option value="">- Select a category -</option>' + CATEGORIES.map(cat=>`<option value="${cat.id}">${cat.title}</option>`).join('');
  updateProductModels();
  setupContactForm();
}

function updateProductModels() {
  const categoryId = el('product-category').value;
  const modelsSelect = el('product-models');
  modelsSelect.innerHTML = '';

  if (!categoryId) {
    modelsSelect.innerHTML = '<option value="">- Select a model -</option>';
    CATEGORIES.forEach(cat => appendModelGroup(modelsSelect, cat));
    return;
  }

  const category = CATEGORIES.find(c => c.id === categoryId);
  if (category) appendModelGroup(modelsSelect, category);
}

function appendModelGroup(modelsSelect, category) {
  const group = document.createElement('optgroup');
  group.label = category.title;

  category.tableRows.forEach(row => {
    const opt = document.createElement('option');
    opt.value = row[0];
    opt.textContent = row[0];
    group.appendChild(opt);
  });

  modelsSelect.appendChild(group);
}

function setupContactForm() {
  const form      = el('enquiry-form');
  const submitBtn = el('form-submit-btn');
  const msgOk     = el('form-success');
  const msgErr    = el('form-error');

  if (C.formspreeId) {
    form.action = `https://formspree.io/f/${C.formspreeId}`;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite;"></i> Sending...';
      msgOk.classList.remove('show-success');
      msgErr.classList.remove('show-error');

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error('Server error');

        form.reset();
        msgOk.classList.add('show-success');
        submitBtn.innerHTML = '<i class="ti ti-circle-check"></i> Sent!';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="ti ti-send"></i> Submit Enquiry';
        }, 4000);
      } catch {
        msgErr.classList.add('show-error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="ti ti-send"></i> Submit Enquiry';
      }
    });
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msgErr.innerHTML = `<i class="ti ti-alert-circle" style="font-size:18px;font-style:normal;"></i>
      Form not yet connected. Please email <a href="mailto:${C.contact.email}" style="color:inherit;text-decoration:underline;">${C.contact.email}</a>
      or <a href="https://wa.me/${C.contact.phones[0].whatsapp}" target="_blank" style="color:inherit;text-decoration:underline;">WhatsApp us</a> directly.`;
    msgErr.classList.add('show-error');
  });
}

window.renderContact = renderContact;
window.updateProductModels = updateProductModels;
