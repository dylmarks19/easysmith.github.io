window.C = SITE_CONFIG;

function el(id) {
  return document.getElementById(id);
}

function copyrightYear() {
  const y = new Date().getFullYear();
  return y > C.company.yearFounded ? `${C.company.yearFounded}-${y}` : `${C.company.yearFounded}`;
}

function guidePromptHTML() {
  return `
    <div class="guide-prompt">
      <div>
        <h3>Uncertain about what would suit you best?</h3>
        <p>Check out the selection guide and we'll match you to the right model.</p>
      </div>
      <button class="btn btn-orange" type="button" onclick="show('guide')"><i class="ti ti-compass"></i> Open Selection Guide</button>
    </div>`;
}
window.guidePromptHTML = guidePromptHTML;

window.el = el;
window.copyrightYear = copyrightYear;
