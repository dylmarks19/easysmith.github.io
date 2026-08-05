// ═══════════════════════════════════════════════════════════════════════════
// Generic, cross-line Selection Guide engine.
//
// Every product line that defines a `guide` contributes its own filter
// fields and its own matchModel/scoreModel/buildModel logic. This file:
//   1. Lets the visitor pick which product line(s) they're interested in
//      via a selector at the top — "All Products" (default) or one
//      specific line. This is what keeps the form from accumulating every
//      field from every line at once as more lines are added; picking a
//      line shows only that line's fields.
//   2. Merges fields (by name) from whichever line(s) are currently
//      selected into one shared form — if two lines reuse a field name
//      like "height", the same control drives filtering for both at once.
//   3. Pools every model from the selected line(s) into one result list,
//      each still filtered/scored using ITS OWN line's matchModel/scoreModel
//      — a model never gets evaluated against criteria its own line
//      doesn't understand.
//   4. Shows which product line each result belongs to whenever more than
//      one line is actually in play, so results stay unambiguous.
//
// Lines that don't define a guide at all are simply left out of the pool
// and don't appear in the line selector. If NO line defines a guide, the
// page shows a friendly fallback.
// ═══════════════════════════════════════════════════════════════════════════

// Which line the visitor has selected in the picker — 'all' (default) or a
// specific line id. Optionally pre-set via a ?line=<id> URL param, so a
// future "Selection Guide" link elsewhere on the site can deep-link
// straight into one line's filters.
let selectedGuideLineId = 'all';

function getGuidedLines() {
  return PRODUCT_LINES.filter(l => l.guide);
}

/**
 * getActiveGuidedLines — The line(s) the guide should actually build its
 * form and results from right now, based on the line selector.
 */
function getActiveGuidedLines() {
  const guidedLines = getGuidedLines();
  if (selectedGuideLineId === 'all') return guidedLines;
  return guidedLines.filter(l => l.id === selectedGuideLineId);
}

/**
 * mergeGuideFields — Combine the active line(s)' fields into one ordered,
 * deduplicated list (first line to define a given field name wins that
 * field's definition). This is the shared form the visitor actually sees.
 */
function mergeGuideFields(guidedLines) {
  const seen = new Map();
  guidedLines.forEach(line => {
    line.guide.fields.forEach(f => {
      if (!seen.has(f.name)) seen.set(f.name, f);
    });
  });
  return Array.from(seen.values());
}

function renderGuide() {
  const host = el('selection-guide');
  if (!host) return;

  const guidedLines = getGuidedLines();

  if (!guidedLines.length) {
    host.innerHTML = `
      <div class="guide-empty">
        <i class="ti ti-info-circle"></i>
        <h4>No selection guide available yet</h4>
        <p>Browse the full product range instead, or get in touch and we'll help you find the right fit.</p>
        <a class="btn btn-orange" href="products.html"><i class="ti ti-stack-2"></i> Browse Products</a>
      </div>`;
    return;
  }

  const requestedLine = getQueryParam('line');
  if (requestedLine && guidedLines.some(l => l.id === requestedLine)) selectedGuideLineId = requestedLine;

  host.innerHTML = `
    ${guidedLines.length > 1 ? guideLineSelectorHTML(guidedLines) : ''}
    <div class="guide-shell">
      <div class="guide-panel">
        <div class="guide-panel-head">
          <div>
            <div class="guide-kicker">Requirements</div>
            <h3>Find a suitable model</h3>
          </div>
          <button class="guide-reset" type="button" onclick="resetGuide()"><i class="ti ti-refresh"></i> Reset</button>
        </div>
        <div class="guide-panel-body" id="guide-panel-body">
          ${renderGuideFieldsHTML()}
        </div>
      </div>
      <div class="guide-results">
        <div class="guide-results-head">
          <div>
            <div class="guide-kicker">Recommendations</div>
            <h3 id="guide-result-count"></h3>
          </div>
          <span class="tag tag-green" id="guide-status">Live Match</span>
        </div>
        <div class="guide-results-body">
          <div class="guide-summary" id="guide-summary"></div>
          <div class="guide-list" id="guide-list"></div>
        </div>
      </div>
    </div>`;

  attachGuideFieldListeners();
  updateGuideResults();
}

/**
 * guideLineSelectorHTML — "Which product line?" picker, only rendered once
 * there's more than one guided line (with a single line, there'd be
 * nothing to pick between, so it stays hidden and the form behaves exactly
 * as it did before this existed).
 */
function guideLineSelectorHTML(guidedLines) {
  return `
    <div class="guide-line-selector">
      <label class="guide-line-selector-label">Which product line are you interested in?</label>
      <div class="guide-choice-grid">
        <label class="guide-choice">
          <input type="radio" name="guideLineSelector" value="all" ${selectedGuideLineId === 'all' ? 'checked' : ''} onchange="selectGuideLine('all')">
          <span><i class="ti ti-apps"></i><strong>All Products</strong><small>Search our whole range at once.</small></span>
        </label>
        ${guidedLines.map(line => `
          <label class="guide-choice">
            <input type="radio" name="guideLineSelector" value="${line.id}" ${selectedGuideLineId === line.id ? 'checked' : ''} onchange="selectGuideLine('${line.id}')">
            <span><i class="ti ${line.icon || 'ti-box'}"></i><strong>${line.name}</strong>${line.tagline ? `<small>${line.tagline}</small>` : ''}</span>
          </label>`).join('')}
      </div>
    </div>`;
}

/**
 * selectGuideLine — Switching the line selector rebuilds ONLY the field
 * panel (not the whole page) to whichever line's fields are now relevant,
 * then re-scores results against the new field set.
 */
function selectGuideLine(lineId) {
  selectedGuideLineId = lineId;
  const body = el('guide-panel-body');
  if (body) body.innerHTML = renderGuideFieldsHTML();
  attachGuideFieldListeners();
  updateGuideResults();
}

function renderGuideFieldsHTML() {
  const fields = mergeGuideFields(getActiveGuidedLines());
  return fields.map(f => f.type === 'radio' ? guideRadioGroup(f) : guideSelect(f)).join('');
}

function attachGuideFieldListeners() {
  document.querySelectorAll('[data-guide-input]').forEach(input => {
    input.addEventListener('change', updateGuideResults);
  });
}

function guideRadioGroup(field) {
  return `
    <div class="guide-field">
      <label>${field.label}</label>
      <div class="guide-choice-grid">
        ${field.options.map(option => `
          <label class="guide-choice">
            <input data-guide-input type="radio" name="${field.name}" value="${option.value}" ${option.value === (field.default ?? field.options[0].value) ? 'checked' : ''}>
            <span><i class="ti ${option.icon || 'ti-circle'}"></i><strong>${option.label}</strong>${option.hint ? `<small>${option.hint}</small>` : ''}</span>
          </label>`).join('')}
      </div>
    </div>`;
}

function guideSelect(field) {
  return `
    <div class="guide-field">
      <label for="guide-${field.name}">${field.label}</label>
      <select class="fselect" id="guide-${field.name}" data-guide-input name="${field.name}">
        ${field.options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
      </select>
    </div>`;
}

function getGuideState(fields) {
  const state = {};
  fields.forEach(f => {
    if (f.type === 'radio') {
      state[f.name] = document.querySelector(`input[name="${f.name}"]:checked`)?.value || (f.default ?? f.options[0].value);
    } else {
      const raw = el(`guide-${f.name}`)?.value;
      const isNumeric = typeof f.options[0].value === 'number';
      state[f.name] = isNumeric ? Number(raw || 0) : (raw || f.options[0].value);
    }
  });
  return state;
}

function resetGuide() {
  const fields = mergeGuideFields(getActiveGuidedLines());

  fields.forEach(f => {
    if (f.type === 'radio') {
      const def = f.default ?? f.options[0].value;
      const input = document.querySelector(`input[name="${f.name}"][value="${def}"]`);
      if (input) input.checked = true;
    } else {
      const select = el(`guide-${f.name}`);
      if (select) select.selectedIndex = 0;
    }
  });
  updateGuideResults();
}

/**
 * getAllGuideModels — Pool every model from the given line(s), each one
 * carrying a reference back to its own line's matchModel/scoreModel and to
 * its parent line's id/name/icon (for the "which line is this?" badge).
 */
function getAllGuideModels(guidedLines) {
  return guidedLines.flatMap(line =>
    line.categories.flatMap(category =>
      category.tableRows.map(row => ({
        ...line.guide.buildModel(category, row),
        _lineId: line.id,
        _lineName: line.name,
        _lineIcon: line.icon,
        _matchModel: line.guide.matchModel,
        _scoreModel: line.guide.scoreModel,
      }))
    )
  );
}

function updateGuideResults() {
  const guidedLines = getActiveGuidedLines();
  if (!guidedLines.length) return;

  const fields = mergeGuideFields(guidedLines);
  const state = getGuideState(fields);

  const allModels = getAllGuideModels(guidedLines);
  const hardMatches = allModels.filter(model => model._matchModel(model, state));
  const scored = hardMatches
    .map(model => ({ ...model, score: model._scoreModel(model, state) }))
    .sort((a, b) => b.score - a.score || (a.price || 0) - (b.price || 0));

  const visible = scored.slice(0, 8);
  const showLineBadge = guidedLines.length > 1;

  el('guide-result-count').textContent = `${scored.length} model${scored.length === 1 ? '' : 's'} matched`;
  el('guide-status').textContent = scored.length <= 2 ? 'Shortlist Ready' : 'Live Match';
  el('guide-summary').innerHTML = buildGuideSummary(guidedLines, scored.length);
  el('guide-list').innerHTML = visible.length
    ? visible.map((model, i) => guideResultCard(model, i === 0 && visible.length > 1, showLineBadge)).join('')
    : guideEmptyState(state);
}

function buildGuideSummary(guidedLines, count) {
  if (count === 0) return 'No exact match found. Try adjusting your requirements below.';
  if (count === 1) return 'There is one strong match.';
  const scope = guidedLines.length > 1 ? `across ${guidedLines.length} product lines` : `in ${guidedLines[0].name}`;
  return `Review the strongest matches below, ${scope}.`;
}

function guideEmptyState(state) {
  return `
    <div class="guide-empty">
      <i class="ti ti-alert-circle"></i>
      <h4>No exact model match</h4>
      <p>Try adjusting your requirements, or submit an enquiry so we can check a custom configuration.</p>
      <button class="btn btn-orange" type="button" onclick="prefillGuideEnquiry('${encodeURIComponent(JSON.stringify(state))}')"><i class="ti ti-file-invoice"></i> Enquire Anyway</button>
    </div>`;
}

function guideResultCard(model, isBest, showLineBadge) {
  return `
    <div class="guide-card${isBest ? ' guide-card--best' : ''}">
      <div class="guide-card-top">
        <div>
          <div class="guide-model">${model.model}</div>
          <div class="guide-category">${model.categoryTitle}${showLineBadge ? ` <span class="guide-line-badge"><i class="ti ${model._lineIcon || 'ti-box'}"></i> ${model._lineName}</span>` : ''}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
          ${isBest ? '<span class="tag-best">Best Match</span>' : ''}
          <span class="tag tag-navy">${model.code}</span>
        </div>
      </div>
      <p>${model.description}</p>
      <div class="guide-specs">
        ${(model.specBadges || []).map(b => `<span><strong>${b.value}</strong>${b.label ? ` ${b.label}` : ''}</span>`).join('')}
      </div>
      <div class="guide-card-actions">
        <button class="btn btn-navy btn-sm" type="button" onclick="openGuideModel('${model.categoryId}')"><i class="ti ti-stack-2"></i> View Range</button>
        <button class="btn btn-outline-orange btn-sm" type="button" onclick="prefillGuideEnquiry('${model.model}')"><i class="ti ti-send"></i> Enquire</button>
      </div>
    </div>`;
}

function openGuideModel(categoryId) {
  goToCategory(categoryId);
}

/**
 * prefillGuideEnquiry — The guide lives on its own page now (guide.html),
 * separate from the enquiry form (contact.html), so there's no shared
 * in-memory JS state to just set directly like the old single-page version
 * could. Instead, pass the model/message as URL query params and let
 * contact.html's own load logic read and apply them (see render-contact.js).
 */
function prefillGuideEnquiry(modelOrState) {
  let model = modelOrState;
  let message = '';

  try {
    const state = JSON.parse(decodeURIComponent(modelOrState));
    model = '';
    message = `Selection guide enquiry: ${JSON.stringify(state)}`;
  } catch {
    message = `I am interested in ${model}. Please advise on suitability, pricing and lead time.`;
  }

  const params = new URLSearchParams();
  if (model) params.set('model', model);
  if (message) params.set('message', message);

  window.location.href = 'contact.html?' + params.toString();
}

window.renderGuide = renderGuide;
window.resetGuide = resetGuide;
window.selectGuideLine = selectGuideLine;
window.updateGuideResults = updateGuideResults;
window.openGuideModel = openGuideModel;
window.prefillGuideEnquiry = prefillGuideEnquiry;