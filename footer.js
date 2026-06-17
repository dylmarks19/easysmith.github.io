function footerHTML() {
  const vat = C.company.vatNumber ? `&nbsp;|&nbsp;VAT ${C.company.vatNumber}` : '';

  return `
    <div class="footer-top">
      <div class="footer-brand">
        <div class="fl"><img src="Atlas-logo.png" alt="Atlas" style="height:118px; width:auto; vertical-align:middle;"></div>
        <div class="ft">${C.company.name} ${C.company.legalSuffix}</div>
        <p>South Africa's industrial equipment specialists. Made to order, delivered nationwide.</p>
      </div>
      <div class="footer-col"><h4>Equipment</h4><ul>
        <li><a onclick="show('products')">Featured Models</a></li>
        <li><a onclick="show('products')">Full Catalogue</a></li>
        <li><a onclick="show('guide')">Selection Guide</a></li>
        <li><a onclick="show('contact')">Custom / Bespoke</a></li>
      </ul></div>
      <div class="footer-col"><h4>Company</h4><ul>
        <li><a onclick="show('offers')">Our Offering</a></li>
        <li><a onclick="show('certs')">Certifications</a></li>
        <li><a onclick="show('contact')">Contact Us</a></li>
      </ul></div>
      <div class="footer-col"><h4>Contact</h4><ul>
        ${C.contact.phones.map(p=>`<li><a href="tel:${p.display.replace(/\s/g,'')}">${p.display}</a> <span style="color:var(--text-muted);font-size:12px;">(${p.label})</span></li>`).join('')}
        <li><a href="mailto:${C.contact.email}">${C.contact.email}</a></li>
        <li><a>${C.contact.hoursWeekday}</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">&copy; ${copyrightYear()} ${C.company.name} ${C.company.legalSuffix}. All rights reserved.${vat}</div>
      <div class="footer-badges">${C.footerBadges.map(b=>`<span class="fbadge">${b}</span>`).join('')}</div>
    </div>`;
}

function renderFooters() {
  ['home','products','guide','offers','certs','contact'].forEach(p => {
    const f = el(`footer-${p}`);
    if (f) f.innerHTML = footerHTML();
  });
}

window.footerHTML = footerHTML;
window.renderFooters = renderFooters;
