function renderContact() {
  el('contact-sub').textContent = `Submit your enquiry below - include the model or product type, required specs, quantity and delivery location. ${C.contact.responseTime}.`;
  el('contact-left').innerHTML = `
    ${C.contact.phones.map(p=>`<div class="ci"><div class="ci-icon"><i class="ti ti-phone"></i></div><div><div class="ci-label">Phone - ${p.label}</div><div class="ci-val"><a href="tel:${p.display.replace(/\s/g,'')}">${p.display}</a> <a href="https://wa.me/${p.whatsapp}" target="_blank" rel="noopener" title="Available on WhatsApp" style="margin-left:8px;"><i class="ti ti-brand-whatsapp" style="color:var(--green);"></i></a></div></div></div>`).join('')}
    <div class="ci"><div class="ci-icon"><i class="ti ti-mail"></i></div><div><div class="ci-label">Email</div><div class="ci-val"><a href="mailto:${C.contact.email}">${C.contact.email}</a> <button onclick="copyToClipboard('${C.contact.email}', () => {this.textContent='Copied!';setTimeout(()=>{this.textContent='Copy'},2000)})" style="margin-left:8px;background:none;border:1px solid var(--border);color:var(--text-muted);font-size:11px;padding:2px 8px;border-radius:var(--r);cursor:pointer;">Copy</button></div></div></div>
    <div class="ci"><div class="ci-icon"><i class="ti ti-clock"></i></div><div><div class="ci-label">Business Hours</div><div class="ci-val">${C.contact.hoursWeekday}<br>${C.contact.hoursSat}</div></div></div>`;

  el('lead-times-section').innerHTML = `
    <div class="lead-info">
      ${PRODUCT_LINES.map(line => {
        const leadTimes = line.leadTimes || C.leadTimes;
        return `
          <div class="lead-info-block" style="margin-bottom:12px;">
            <div class="lead-title"><i class="ti ti-clock" style="color:var(--green-dark);margin-right:6px;"></i>Manufacturing Lead Times (${line.name})</div>
            <div class="lead-row">
              Standard units: <strong>${leadTimes.standard}</strong><br>
              Custom / Bespoke: <strong>${leadTimes.custom}</strong><br>
              Bulk (5+ units): <strong>${leadTimes.fleet}</strong>
            </div>
          </div>`;
      }).join('')}
    </div>`;

  el('enquiry-select').innerHTML = C.enquiryTypes.map(t=>`<option>${t}</option>`).join('');
  el('product-category').innerHTML = '<option value="">- Select a category -</option>' + PRODUCT_LINES.map(line =>
    `<optgroup label="${line.name}">${line.categories.map(cat => `<option value="${cat.id}">${cat.title}</option>`).join('')}</optgroup>`
  ).join('');
  updateProductModels();
  setupContactForm();
  applyEnquiryPrefillFromURL();
}

/**
 * applyEnquiryPrefillFromURL — Now that the Selection Guide lives on its
 * own page, "Enquire" from a guide result hands off the model name and/or
 * a suggested message as URL query params (e.g. contact.html?model=SMP1-6)
 * rather than setting form fields directly the way the old single-page
 * version could. This reads those params once the form exists and applies
 * them. The "all categories" model dropdown already lists every model by
 * default, so no category needs to be pre-selected first.
 */
/**
 * applyEnquiryPrefillFromURL — Handles three handoff sources, all via URL
 * query params since there's no shared in-memory JS state across a real
 * page navigation:
 *   - The Selection Guide's "Enquire" button passes ?model=X&message=Y
 *   - The Products page accordion's "Enquire About This Range" button, and
 *     the homepage's category preview modal "Enquire" button, both pass
 *     ?category=X&message=Y (a whole range, not one specific model)
 *   - The Certifications page's "Request Documentation" button passes
 *     ?type=Y&message=Z (no model/category — it's a general documentation
 *     request, not tied to one product)
 * category is applied first (and re-scopes the model dropdown to just that
 * category) so a subsequent model param, if present, resolves against the
 * right option list.
 */
function applyEnquiryPrefillFromURL() {
  const category = getQueryParam('category');
  const model = getQueryParam('model');
  const message = getQueryParam('message');
  const type = getQueryParam('type');

  if (category) {
    const categorySelect = el('product-category');
    if (categorySelect) {
      categorySelect.value = category;
      updateProductModels();
    }
  }
  if (model) {
    const modelSelect = el('product-models');
    if (modelSelect) modelSelect.value = model;
  }
  if (message) {
    const textarea = document.querySelector('textarea[name="message"]');
    if (textarea) textarea.value = message;
  }
  if (type) {
    const typeSelect = el('enquiry-select');
    if (typeSelect) typeSelect.value = type;
  }
}

function updateProductModels() {
  const categoryId = el('product-category').value;
  const modelsSelect = el('product-models');
  modelsSelect.innerHTML = '';

  if (!categoryId) {
    modelsSelect.innerHTML = '<option value="">- Select a model -</option>';
    getAllCategories().forEach(cat => appendModelGroup(modelsSelect, cat));
    return;
  }

  const category = findCategoryById(categoryId);
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
        trackEvent('generate_lead', { form_type: 'enquiry' });
        msgOk.classList.add('show-success');
        submitBtn.innerHTML = '<i class="ti ti-circle-check"></i> Sent!';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="ti ti-send"></i> Submit Enquiry';
        }, 4000);
      } catch {
        trackEvent('form_submit_error', { form_type: 'enquiry' });
        msgErr.innerHTML = `<i class="ti ti-alert-circle" style="font-size:18px;font-style:normal;"></i>
          Something went wrong sending your enquiry. Please email <a href="mailto:${C.contact.email}" style="color:inherit;text-decoration:underline;">${C.contact.email}</a>
          or <a href="https://wa.me/${C.contact.phones[0].whatsapp}" target="_blank" style="color:inherit;text-decoration:underline;">WhatsApp us</a> directly.`;
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