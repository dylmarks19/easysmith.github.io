const GUIDE_FILTERS = {
  application: [
    { value: 'access', label: 'Personnel Access', icon: 'ti-stairs-up', hint: 'Work at height, maintenance, construction or installation.' },
    { value: 'material', label: 'Material Lifting', icon: 'ti-package', hint: 'Fork-style lifting for goods, stock or equipment.' },
    { value: 'any', label: 'Not Sure', icon: 'ti-adjustments', hint: 'Show both access and material handling options.' }
  ],
  height: [
    { value: 0, label: 'Any Height' },
    { value: 4, label: 'Up to 4m' },
    { value: 6, label: 'Up to 6m' },
    { value: 8, label: 'Up to 8m' },
    { value: 10, label: 'Up to 10m' },
    { value: 12, label: 'Up to 12m' },
    { value: 14, label: 'Up to 14m' },
    { value: 16, label: 'Up to 16m' }
  ],
  capacity: [
    { value: 0, label: 'Any Load' },
    { value: 120, label: '120kg+' },
    { value: 150, label: '150kg+' },
    { value: 200, label: '200kg+' },
    { value: 240, label: '240kg+' },
    { value: 300, label: '300kg+' },
    { value: 450, label: '450kg+' }
  ],
  occupants: [
    { value: 0, label: 'Any' },
    { value: 1, label: '1 Person' },
    { value: 2, label: '2 People' }
  ],
  mobility: [
    { value: 'any', label: 'Any Mobility' },
    { value: 'push', label: 'Push-Around / Manual' },
    { value: 'self', label: 'Self-Propelled' },
    { value: 'tracked', label: 'Tracked / Crawler' }
  ],
  environment: [
    { value: 'any', label: 'Any Site' },
    { value: 'narrow', label: 'Narrow Access' },
    { value: 'uneven', label: 'Uneven Terrain' },
    { value: 'indoor', label: 'Indoor / Slab' }
  ]
};

function renderGuide() {
  const host = el('selection-guide');
  if (!host) return;

  host.innerHTML = `
    <div class="guide-shell">
      <div class="guide-panel">
        <div class="guide-panel-head">
          <div>
            <div class="guide-kicker">Requirements</div>
            <h3>Find a suitable model</h3>
          </div>
          <button class="guide-reset" type="button" onclick="resetGuide()"><i class="ti ti-refresh"></i> Reset</button>
        </div>
        <div class="guide-panel-body">
          ${guideRadioGroup('application', 'Application', GUIDE_FILTERS.application)}
          ${guideSelect('height', 'Required Working / Lift Height', GUIDE_FILTERS.height)}
          ${guideSelect('capacity', 'Required Load Capacity', GUIDE_FILTERS.capacity)}
          ${guideSelect('occupants', 'Operators on Platform', GUIDE_FILTERS.occupants)}
          ${guideSelect('mobility', 'Mobility Preference', GUIDE_FILTERS.mobility)}
          ${guideSelect('environment', 'Site Conditions', GUIDE_FILTERS.environment)}
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

  document.querySelectorAll('[data-guide-input]').forEach(input => {
    input.addEventListener('change', updateGuideResults);
  });

  updateGuideResults();
}

function guideRadioGroup(name, label, options) {
  return `
    <div class="guide-field">
      <label>${label}</label>
      <div class="guide-choice-grid">
        ${options.map((option, i) => `
          <label class="guide-choice">
            <input data-guide-input type="radio" name="${name}" value="${option.value}" ${i === 0 ? 'checked' : ''}>
            <span><i class="ti ${option.icon}"></i><strong>${option.label}</strong><small>${option.hint}</small></span>
          </label>`).join('')}
      </div>
    </div>`;
}

function guideSelect(name, label, options) {
  return `
    <div class="guide-field">
      <label for="guide-${name}">${label}</label>
      <select class="fselect" id="guide-${name}" data-guide-input name="${name}">
        ${options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
      </select>
    </div>`;
}

function getGuideState() {
  return {
    application: document.querySelector('input[name="application"]:checked')?.value || 'access',
    height: Number(el('guide-height')?.value || 0),
    capacity: Number(el('guide-capacity')?.value || 0),
    occupants: Number(el('guide-occupants')?.value || 0),
    mobility: el('guide-mobility')?.value || 'any',
    environment: el('guide-environment')?.value || 'any'
  };
}

function resetGuide() {
  const firstApplication = document.querySelector('input[name="application"][value="access"]');
  if (firstApplication) firstApplication.checked = true;
  ['height','capacity','occupants','mobility','environment'].forEach(name => {
    const field = el(`guide-${name}`);
    if (field) field.selectedIndex = 0;
  });
  updateGuideResults();
}

function updateGuideResults() {
  const state = getGuideState();
  const allModels = getGuideModels();
  const hardMatches = allModels.filter(model => modelMatchesGuide(model, state));
  const scored = hardMatches
    .map(model => ({ ...model, score: scoreGuideModel(model, state) }))
    .sort((a, b) => b.score - a.score || a.height - b.height || a.price - b.price);

  const visible = scored.slice(0, 8);
  el('guide-result-count').textContent = `${scored.length} model${scored.length === 1 ? '' : 's'} matched`;
  el('guide-status').textContent = scored.length <= 2 ? 'Shortlist Ready' : 'Live Match';
  el('guide-summary').innerHTML = guideSummaryText(state, scored.length);
  el('guide-list').innerHTML = visible.length ? visible.map((model, i) => guideResultCard(model, i === 0 && visible.length > 1)).join('') : guideEmptyState(state);
}

function guideSummaryText(state, count) {
  const height = state.height ? `${state.height}m+ height` : 'any height';
  const capacity = state.capacity ? `${state.capacity}kg+ capacity` : 'any load';
  const people = state.occupants ? `${state.occupants} operator${state.occupants === 1 ? '' : 's'}` : 'any operator count';
  const result = count === 1 ? 'There is one strong match.' : count > 1 ? 'Review the strongest matches below.' : 'No exact match found.';
  return `${result} Filtering for ${height}, ${capacity}, ${people}.`;
}

function guideEmptyState(state) {
  return `
    <div class="guide-empty">
      <i class="ti ti-alert-circle"></i>
      <h4>No exact model match</h4>
      <p>Try lowering the height or load requirement, or submit an enquiry so Atlas can check a custom configuration.</p>
      <button class="btn btn-orange" type="button" onclick="prefillGuideEnquiry('${encodeURIComponent(JSON.stringify(state))}')"><i class="ti ti-file-invoice"></i> Enquire Anyway</button>
    </div>`;
}

function guideResultCard(model, isBest = false) {
  return `
    <div class="guide-card${isBest ? ' guide-card--best' : ''}">
      <div class="guide-card-top">
        <div>
          <div class="guide-model">${model.model}</div>
          <div class="guide-category">${model.categoryTitle}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
          ${isBest ? '<span class="tag-best">Best Match</span>' : ''}
          <span class="tag tag-navy">${model.code}</span>
        </div>
      </div>
      <p>${model.description}</p>
      <div class="guide-specs">
        <span><strong>${formatNumber(model.height)}m</strong> height</span>
        <span><strong>${model.capacity}kg</strong> load</span>
        <span><strong>${model.occupants || '-'}</strong> occ.</span>
        <span><strong>${model.mobilityLabel}</strong></span>
      </div>
      <div class="guide-card-actions">
        <button class="btn btn-navy btn-sm" type="button" onclick="openGuideModel('${model.categoryId}')"><i class="ti ti-stack-2"></i> View Range</button>
        <button class="btn btn-outline-orange btn-sm" type="button" onclick="prefillGuideEnquiry('${model.model}')"><i class="ti ti-send"></i> Enquire</button>
      </div>
    </div>`;
}

function getGuideModels() {
  return CATEGORIES.flatMap(category => category.tableRows.map(row => buildGuideModel(category, row)));
}

function buildGuideModel(category, row) {
  const valueFor = (...needles) => {
    const idx = category.tableHeaders.findIndex(header =>
      needles.some(needle => header.toLowerCase().includes(needle))
    );
    return idx >= 0 ? row[idx] : '';
  };

  const height = maxNumber(valueFor('platform ht', 'lift ht'));
  const capacity = maxNumber(valueFor('capacity', 'load @0.36m', 'load @0.61m', 'load @1.07m'));
  const occupants = maxNumber(valueFor('occ.'));
  const width = maxNumber(valueFor('overall w'));
  const rowType = valueFor('type');
  const searchable = `${category.title} ${category.shortDesc} ${row.join(' ')}`.toLowerCase();

  const isMaterial = category.id === 'ml';
  const isTracked = searchable.includes('tracked') || searchable.includes('crawler');
  const isSelf = searchable.includes('self-propelled') || category.id === 'smd' || category.id === 'fmd' || category.id === 'fmt' || category.id === 'tmd' || category.id === 'tmt';
  const isPush = searchable.includes('push') || searchable.includes('outrigger') || category.id.startsWith('smp') || category.id.startsWith('dmp');

  return {
    model: row[0],
    categoryId: category.id,
    categoryTitle: category.title,
    code: category.code,
    price: category.price || 0,
    height,
    capacity,
    occupants,
    width,
    isMaterial,
    isTracked,
    isSelf,
    isPush,
    description: rowType ? `${rowType} model from the ${category.title} range.` : category.shortDesc,
    mobilityLabel: isMaterial ? 'Manual' : isTracked ? 'Tracked' : isSelf ? 'Self-propelled' : isPush ? 'Push-around' : 'Configurable'
  };
}

function modelMatchesGuide(model, state) {
  if (state.application === 'access' && model.isMaterial) return false;
  if (state.application === 'material' && !model.isMaterial) return false;
  if (state.height && model.height < state.height) return false;
  if (state.capacity && model.capacity < state.capacity) return false;
  if (state.occupants && model.occupants < state.occupants) return false;

  if (state.mobility === 'push' && !(model.isPush || model.isMaterial)) return false;
  if (state.mobility === 'self' && !model.isSelf) return false;
  if (state.mobility === 'tracked' && !model.isTracked) return false;

  if (state.environment === 'uneven' && !model.isTracked) return false;
  if (state.environment === 'narrow' && model.width && model.width > 0.85) return false;

  return true;
}

function scoreGuideModel(model, state) {
  let score = 100;
  if (state.height) score -= Math.max(0, model.height - state.height) * 3;
  if (state.capacity) score -= Math.max(0, model.capacity - state.capacity) / 80;
  if (state.environment === 'indoor' && model.width && model.width <= 0.85) score += 10;
  if (state.environment === 'narrow' && model.width && model.width <= 0.8) score += 12;
  if (state.mobility === 'self' && model.isSelf) score += 8;
  if (state.mobility === 'push' && model.isPush) score += 8;
  if (state.mobility === 'tracked' && model.isTracked) score += 8;
  return score;
}

function maxNumber(value) {
  const matches = String(value).match(/\d+(?:\.\d+)?/g);
  return matches ? Math.max(...matches.map(Number)) : 0;
}

function formatNumber(value) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function openGuideModel(categoryId) {
  showCategory(categoryId);
}

function prefillGuideEnquiry(modelOrState) {
  let model = modelOrState;
  let message = '';

  try {
    const state = JSON.parse(decodeURIComponent(modelOrState));
    model = '';
    message = `Selection guide enquiry: ${state.height || 'Any'}m height, ${state.capacity || 'Any'}kg capacity, ${state.occupants || 'Any'} occupants, ${state.mobility} mobility, ${state.environment} site.`;
  } catch {
    message = `I am interested in ${model}. Please advise on suitability, pricing and lead time.`;
  }

  show('contact');
  setTimeout(() => {
    const modelSelect = el('product-models');
    const textarea = document.querySelector('textarea[name="message"]');
    if (modelSelect && model) modelSelect.value = model;
    if (textarea) textarea.value = message;
  }, 80);
}

window.renderGuide = renderGuide;
window.resetGuide = resetGuide;
window.updateGuideResults = updateGuideResults;
window.openGuideModel = openGuideModel;
window.prefillGuideEnquiry = prefillGuideEnquiry;