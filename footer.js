function footerHTML() {
  const vat = C.company.vatNumber ? `&nbsp;|&nbsp;VAT ${C.company.vatNumber}` : '';

  return `
    <div class="footer-top">
      <div class="footer-brand">
        <div class="fl"><img src="easysmith-logo-2.png" alt="Easysmith" style="height:75px; width:auto; vertical-align:middle;"></div>
        <div class="ft">${C.company.name} ${C.company.legalSuffix}</div>
        <p>South Africa's industrial equipment specialists. Made to order, delivered nationwide.</p>
      </div>
      <div class="footer-col"><h4>Equipment</h4><ul>
        <li><a href="products.html">Featured Models</a></li>
        <li><a href="products.html">Full Catalogue</a></li>
        <li><a href="guide.html">Selection Guide</a></li>
        <li><a href="contact.html">Custom / Bespoke</a></li>
      </ul></div>
      <div class="footer-col"><h4>Company</h4><ul>
        <li><a href="offering.html">Our Offering</a></li>
        <li><a href="certifications.html">Certifications</a></li>
        <li><a href="contact.html">Contact Us</a></li>
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
  const f = el('footer');
  if (f) f.innerHTML = footerHTML();
}

window.footerHTML = footerHTML;
window.renderFooters = renderFooters;
