window.C = SITE_CONFIG;

// ── DOM HELPERS ─────────────────────────────────────────────────────────────

/**
 * el — Get a page element by its ID.
 *
 * This is a shorthand wrapper around the browser's built-in
 * `document.getElementById()`. Instead of typing that long
 * method name every time, you can just write `el("myId")`.
 *
 * @param  {string} id  - The ID attribute of the HTML element you want.
 * @returns {HTMLElement|null}  The matching element, or null if not found.
 *
 * Example:
 *   el("hero-banner")   →   same as   document.getElementById("hero-banner")
 */
function el(id) {
  return document.getElementById(id);
}

// ── COMPANY / BRANDING HELPERS ───────────────────────────────────────────────

/**
 * copyrightYear — Build the correct copyright date range for the footer.
 *
 * Automatically works out whether to show just the founding year, or a
 * range from the founding year to the current year. This means the
 * copyright notice in the footer never needs to be updated manually.
 *
 * Logic:
 *   • If the current year is later than the year the company was founded,
 *     it returns a range like "2018-2026".
 *   • If it's still the founding year (e.g. the site launched this year),
 *     it returns just "2026".
 *
 * The company's founding year is pulled from `C.company.yearFounded`
 * (the SITE_CONFIG object set up at the top of this file).
 *
 * @returns {string}  A copyright year string, e.g. "2018-2026" or "2026".
 *
 * Example usage in HTML:
 *   <span>© <script>document.write(copyrightYear())</script> Atlas Industrial Systems</span>
 */
function copyrightYear() {
  const y = new Date().getFullYear();
  return y > C.company.yearFounded ? `${C.company.yearFounded}-${y}` : `${C.company.yearFounded}`;
}

// ── UI COMPONENT GENERATORS ──────────────────────────────────────────────────

/**
 * guidePromptHTML — Generate the HTML for the "Selection Guide" prompt block.
 *
 * This function returns a ready-to-insert block of HTML that shows a
 * call-to-action encouraging visitors to use the product selection guide.
 * It displays a short message and an orange "Open Selection Guide" button.
 *
 * Clicking the button calls `show('guide')`, which opens the selection
 * guide overlay/panel (that function is defined elsewhere on the site).
 *
 * By keeping this HTML in one function, any page that needs this block
 * can simply call `guidePromptHTML()` and insert the result, rather than
 * copy-pasting the same markup across multiple pages.
 *
 * @returns {string}  A string of HTML markup for the selection guide prompt.
 *
 * Example usage:
 *   document.getElementById("guide-container").innerHTML = guidePromptHTML();
 */
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

// ── GLOBAL EXPORTS ───────────────────────────────────────────────────────────

/*
 * Attach all functions to the global `window` object so they are accessible
 * from any other script or inline HTML on the site, regardless of the order
 * scripts are loaded. Without this, functions declared inside a module or
 * script file might not be visible to other scripts.
 */
window.guidePromptHTML = guidePromptHTML;
window.el = el;
window.copyrightYear = copyrightYear;
