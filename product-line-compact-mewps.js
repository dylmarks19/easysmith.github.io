// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT LINE: Compact MEWPs (Mobile Elevating Work Platforms)
// ═══════════════════════════════════════════════════════════════════════════
// This file is self-contained: categories, the optional Selection Guide
// logic, the optional Comparison Table config, and this line's own
// certifications all live here. Nothing else in the codebase knows what a
// "mast" or "platform height" is — that knowledge stays inside this file.
//
// TO ADD A NEW PRODUCT LINE LATER:
//   1. Copy this file, rename it product-line-<yourline>.js
//   2. Replace CATEGORIES / GUIDE / COMPARE_ROWS / CERTIFICATIONS with
//      whatever fits that product line — none of the shapes are mandatory
//      except `categories`. Set guide/compareRows/certifications to null
//      if they don't apply.
//   3. If the default card/accordion layout doesn't suit the product,
//      add your own renderCard(cat) / renderBody(cat) on the line object.
//   4. End the file with: window.PRODUCT_LINES.push(YOUR_LINE_OBJECT);
//   5. Add ONE <script> tag for the new file in index.html.
// That's the entire process — no other file needs to change.
// ═══════════════════════════════════════════════════════════════════════════

const COMPACT_MEWPS_CATEGORIES = [
  {
    id: "smp1", icon: "ti-building-arch", code: "SMP1", price: 55000,
    image: "SMP1.png",
    title: "Single Mast — Swing Outrigger",
    shortDesc: "Aluminium single mast with swing outriggers. 1 person, push-around.",
    application: "Personnel Access", mobility: "Push-Around (Outriggers)",
    powerSource: "AC (Mains Power)", bestFor: "Light indoor maintenance, factories",
    tableHeaders: ["Model", "Platform Ht", "Capacity", "Occ.", "Platform Dim", "Overall Len", "Outrigger", "Weight (AC)"],
    tableRows: [
      ["SMP1-6",  "6m",  "150kg", "1", "0.60×0.55m", "1.26m", "1.96×1.7m", "325kg"],
      ["SMP1-8",  "8m",  "150kg", "1", "0.60×0.55m", "1.34m", "1.96×1.7m", "378kg"],
      ["SMP1-9",  "9m",  "150kg", "1", "0.60×0.55m", "1.45m", "1.96×1.7m", "400kg"],
      ["SMP1-10", "10m", "120kg", "1", "0.60×0.55m", "1.45m", "1.96×1.7m", "430kg"],
    ],
  },
  {
    id: "smp2", icon: "ti-building-arch", code: "SMP2", price: 98000,
    image: "SMP2.png",
    title: "Single Mast — Push-Around",
    shortDesc: "Advanced single mast aluminium lifts. AC/DC powered, outrigger-stabilised. Up to 12m platform height.",
    application: "Personnel Access", mobility: "Push-Around (Outriggers)",
    powerSource: "AC Mains or DC Battery", bestFor: "High indoor access, schools, halls",
    tableHeaders: ["Model", "Platform Ht", "Capacity", "Occ.", "Platform Dim", "Overall Len", "Outrigger", "Weight (AC/DC)"],
    tableRows: [
      ["SMP2-5",  "4.7m",  "150kg", "1", "0.67×0.66m", "1.26m", "1.9×1.8m", "330/380kg"],
      ["SMP2-6",  "6.1m",  "150kg", "1", "0.67×0.66m", "1.26m", "1.9×1.8m", "345/395kg"],
      ["SMP2-8",  "7.5m",  "150kg", "1", "0.67×0.66m", "1.30m", "1.9×1.8m", "385/435kg"],
      ["SMP2-9",  "9m",    "150kg", "1", "0.67×0.66m", "1.35m", "2.1×2.0m", "410/460kg"],
      ["SMP2-10", "10.4m", "136kg", "1", "0.67×0.66m", "1.40m", "2.1×2.0m", "430/480kg"],
      ["SMP2-12", "12m",   "120kg", "1", "0.67×0.66m", "1.42m", "2.4×2.2m", "520/570kg"],
    ],
  },
  {
    id: "smd", icon: "ti-steering-wheel", code: "SMD", price: 200000,
    image: "SMD.png",
    title: "Single Mast — Self-Propelled",
    shortDesc: "Self-propelled aluminium single mast. Driven, can turn 360° on its own axis, indoor/outdoor.",
    application: "Personnel Access", mobility: "Self-Propelled (Wheeled)",
    powerSource: "DC Battery (Drivable)", bestFor: "Indoor facilities, narrow-aisle warehouses",
    tableHeaders: ["Model", "Platform Ht (indoor)", "Platform Ht (outdoor)", "Capacity", "Occ.", "Overall Len", "Overall W", "Weight"],
    tableRows: [
      ["SMD-6", "6m",   "4.8m", "160kg", "1", "1.40m", "0.78m", "1160kg"],
      ["SMD-8", "7.5m", "6m",   "125kg", "1", "1.40m", "0.78m", "1280kg"],
    ],
  },
  {
    id: "dmp1", icon: "ti-stack-2", code: "DMP1", price: 90000,
    image: "DMP1.png",
    title: "Double Mast — Swing Outrigger",
    shortDesc: "Double aluminium mast with swing outriggers. 200kg capacity, up to 12m platform height.",
    application: "Personnel Access", mobility: "Push-Around (Outriggers)",
    powerSource: "AC (Mains Power)", bestFor: "Dual-operator work, indoor halls",
    tableHeaders: ["Model", "Platform Ht", "Capacity", "Occ.", "Platform Dim", "Overall Len", "Outrigger", "Weight (AC)"],
    tableRows: [
      ["DMP1-6",  "6m",  "200kg", "1", "1.5×0.67m", "1.70m", "2.4×2.2m", "630kg"],
      ["DMP1-8",  "8m",  "200kg", "1", "1.5×0.67m", "1.70m", "2.4×2.2m", "680kg"],
      ["DMP1-9",  "9m",  "200kg", "1", "1.5×0.67m", "1.70m", "2.4×2.2m", "730kg"],
      ["DMP1-10", "10m", "200kg", "1", "1.5×0.67m", "1.70m", "2.4×2.2m", "800kg"],
      ["DMP1-12", "12m", "200kg", "1", "1.5×0.67m", "1.70m", "2.4×2.2m", "830kg"],
    ],
  },
  {
    id: "dmp2", icon: "ti-stack-2", code: "DMP2", price: 139000,
    image: "DMP2.png",
    title: "Double Mast — Push-Around",
    shortDesc: "Advanced double mast push-around. 2-person platform, AC/DC powered, up to 16m platform height.",
    application: "Personnel Access", mobility: "Push-Around (Outriggers)",
    powerSource: "AC Mains or DC Battery", bestFor: "Heavy dual-operator indoor installation",
    tableHeaders: ["Model", "Platform Ht", "Capacity", "Occ.", "Platform Dim", "Overall Len", "Outrigger", "Weight (AC/DC)"],
    tableRows: [
      ["DMP2-6",  "6m",  "250kg", "2", "1.45×0.7m", "1.48m", "2.1×1.7m", "610/660kg"],
      ["DMP2-8",  "8m",  "250kg", "2", "1.45×0.7m", "1.48m", "2.1×1.7m", "645/695kg"],
      ["DMP2-10", "10m", "250kg", "2", "1.45×0.7m", "1.48m", "2.3×2.2m", "715/765kg"],
      ["DMP2-12", "12m", "200kg", "2", "1.45×0.7m", "1.48m", "2.5×2.4m", "750/800kg"],
      ["DMP2-14", "14m", "200kg", "2", "1.8×0.7m",  "1.88m", "2.9×2.4m", "892/942kg"],
      ["DMP2-16", "16m", "150kg", "1", "1.8×0.7m",  "1.88m", "2.9×2.4m", "996/1046kg"],
    ],
  },
  {
    id: "fmd", icon: "ti-stairs-up", code: "FMD", price: 431000,
    image: "FMD.png",
    title: "Forklift Mast — Wheeled",
    shortDesc: "Heavy-duty self-propelled wheeled steel mast lifts with jib arm. Drivable at full height.",
    application: "Personnel Access", mobility: "Self-Propelled Jib (Wheeled)",
    powerSource: "Heavy Duty Battery (24V/48V)", bestFor: "Industrial warehousing, stock picking",
    tableHeaders: ["Model", "Platform Ht", "Horiz. Reach", "Capacity", "Occ.", "Turret", "Jib", "Battery", "Weight"],
    tableRows: [
      ["FMD1-8J", "8m",     "3.51m", "200kg", "2", "356°", "120°", "24V/220Ah", "2850kg"],
      ["FMD-9J",  "9m",     "3.64m", "200kg", "2", "356°", "120°", "24V/220Ah", "3300kg"],
      ["FMD-10J", "10m",    "5.7m",  "200kg", "2", "340°", "130°", "48V/220Ah", "5900kg"],
      ["FMD-11J", "10.65m", "6.05m", "200kg", "2", "352°", "120°", "48V/260Ah", "4980kg"],
    ],
  },
  {
    id: "fmt", icon: "ti-forklift", code: "FMT", price: 482000,
    image: "FMT.png",
    title: "Forklift Mast — Tracked (Crawler)",
    shortDesc: "Tracked crawler forklift mast lifts with jib. For uneven terrain and construction sites.",
    application: "Personnel Access", mobility: "Self-Propelled Jib (Tracked)",
    powerSource: "Heavy Duty Battery (48V)", bestFor: "Construction sites, uneven soft ground",
    tableHeaders: ["Model", "Platform Ht", "Horiz. Reach", "Capacity", "Occ.", "Turret", "Jib", "Track W", "Battery", "Weight"],
    tableRows: [
      ["FMT-7J", "7m", "3.38m", "200kg", "2", "220°", "120°", "250mm", "48V/220Ah", "2970kg"],
      ["FMT-8J", "8m", "3.63m", "200kg", "2", "220°", "120°", "250mm", "48V/220Ah", "3300kg"],
    ],
  },
  {
    id: "tmd", icon: "ti-arrows-up", code: "TMD", price: 179000,
    image: "TMD.png",
    title: "Telescopic Mast — Wheeled",
    shortDesc: "Self-propelled wheeled telescopic mast lifts. Compact, narrow-profile for tight indoor spaces.",
    application: "Personnel Access", mobility: "Self-Propelled (Wheeled)",
    powerSource: "DC Battery Pack (24V)", bestFor: "Compact indoor spaces, office corridors",
    tableHeaders: ["Model", "Platform Ht", "Capacity", "Occ.", "Overall W", "Travel (stowed)", "Battery", "Weight"],
    tableRows: [
      ["TMD1-4", "3.65m", "230kg", "2", "0.79m", "N/A",      "2×12V/100Ah", "950kg"],
      ["TMD-6",  "5.95m", "200kg", "2", "0.79m", "N/A",      "2×12V/100Ah", "1350kg"],
      ["TMD-9J", "9.2m",  "200kg", "2", "1.0m",  "4.5 km/h", "24V/240Ah",   "2950kg"],
    ],
  },
  {
    id: "tmt", icon: "ti-tank", code: "TMT", price: 192000,
    images: ["TMT.png", "TMTstowed1.png", "TMTstowed2.png", "TMTstowed3.png" ],
    title: "Telescopic Mast — Tracked (Crawler)",
    shortDesc: "Tracked crawler telescopic mast lift. Ultra-compact, can turn 360° on its own axis for restricted access.",
    application: "Personnel Access", mobility: "Self-Propelled (Tracked)",
    powerSource: "DC Battery Pack (24V)", bestFor: "Indoor/outdoor construction, tight gates",
    tableHeaders: ["Model", "Platform Ht", "Capacity", "Occ.", "Overall W", "Overall Len", "Track W", "Battery", "Weight"],
    tableRows: [
      ["TMT2-4", "3.8m", "200kg", "2", "0.79m", "1.44m", "150mm", "2×12V/100Ah", "740kg"],
    ],
  },
  {
    id: "x", icon: "ti-scissors", code: "X", price: 69000,
    image: "XP.png",
    title: "Scissor Lifts",
    shortDesc: "Mini scissor lifts — self-propelled, push-around, and all-electric/oil-free variants.",
    application: "Personnel Access", mobility: "Self-Propelled or Push-Around",
    powerSource: "DC Battery (Oil-Free Option)", bestFor: "General indoor maintenance, flat slabs",
    tableHeaders: ["Model", "Type", "Platform Ht", "Capacity", "Occ.", "Platform Dim", "Overall W", "Gradeability", "Weight"],
    tableRows: [
      ["XD-3",  "Self-propelled",       "3m",   "240kg", "1", "1.15×0.6m",  "0.76m", "25%", "630kg"],
      ["XD-4",  "Self-propelled",       "4m",   "240kg", "1", "1.15×0.6m",  "0.76m", "25%", "660kg"],
      ["XD-3E", "Self-prop. / Oil-free","3.4m", "200kg", "2", "1.24×0.67m", "0.8m",  "—",   "580kg"],
      ["XP-3",  "Push-around",          "3m",   "240kg", "1", "1.15×0.6m",  "0.76m", "—",   "482kg"],
      ["XP-4",  "Push-around",          "3.9m", "240kg", "1", "1.15×0.6m",  "0.76m", "—",   "516kg"],
    ],
  },
  {
    id: "ml", icon: "ti-package", code: "ML", price: 52000,
    image: "MLP.png",
    title: "Material Lifts",
    shortDesc: "Heavy and light duty manual fork-style material lifts. Stabiliser-supported, no power required.",
    application: "Material Lifting", mobility: "Manual Push-Around",
    powerSource: "Manual Winch (No Power)", bestFor: "Material loading, shipping, installation",
    tableHeaders: ["Model", "Duty", "Lift Ht (forks up)", "Load @0.36m", "Load @0.61m", "Load @1.07m", "Stab W", "Weight"],
    tableRows: [
      ["MLP1-3", "Light", "3.8m",  "318kg", "200kg", "84kg",  "1.63m", "125kg"],
      ["MLP1-4", "Light", "4.9m",  "295kg", "195kg", "80kg",  "1.63m", "138kg"],
      ["MLP1-5", "Light", "6.0m",  "272kg", "181kg", "80kg",  "1.63m", "156kg"],
      ["MLP2-3", "Heavy", "3.49m", "454kg", "454kg", "181kg", "1.85m", "148kg"],
      ["MLP2-4", "Heavy", "4.98m", "363kg", "363kg", "227kg", "1.85m", "176kg"],
      ["MLP2-6", "Heavy", "6.46m", "363kg", "295kg", "159kg", "1.85m", "205kg"],
      ["MLP2-7", "Heavy", "7.94m", "295kg", "204kg", "113kg", "1.85m", "231kg"],
    ],
  },
];

// ── Comparison table config ─────────────────────────────────────────────────
const COMPACT_MEWPS_COMPARE_ROWS = [
  { label: "Application",              key: "application" },
  { label: "Mobility Type",            key: "mobility" },
  { label: "Max Lift/Platform Height", key: "maxHt",  headerNeedles: ["platform ht", "lift ht", "ht"], highlight: true },
  { label: "Max Load Capacity",        key: "maxCap", headerNeedles: ["capacity", "load"], highlight: true },
  { label: "Max Operators",            key: "maxOcc", headerNeedles: ["occ"] },
  { label: "Power Source",             key: "powerSource" },
  { label: "Best Suited For",          key: "bestFor" },
];

// ── Selection Guide config ──────────────────────────────────────────────────
const COMPACT_MEWPS_GUIDE = {
  heading: "Find a suitable model",
  fields: [
    {
      name: "application", type: "radio", label: "Application",
      default: "access",
      options: [
        { value: "access",   label: "Personnel Access",   icon: "ti-stairs-up", hint: "Work at height, maintenance, construction or installation." },
        { value: "material", label: "Material Lifting",   icon: "ti-package",   hint: "Fork-style lifting for goods, stock or equipment." },
        { value: "any",      label: "Not Sure",            icon: "ti-adjustments", hint: "Show both access and material handling options." },
      ],
    },
    {
      name: "height", type: "select", label: "Required Working / Lift Height",
      options: [0, 4, 6, 8, 10, 12, 14, 16].map(v => ({ value: v, label: v === 0 ? "Any Height" : `Up to ${v}m` })),
    },
    {
      name: "capacity", type: "select", label: "Required Load Capacity",
      options: [0, 120, 150, 200, 240, 300, 450].map(v => ({ value: v, label: v === 0 ? "Any Load" : `${v}kg+` })),
    },
    {
      name: "occupants", type: "select", label: "Operators on Platform",
      options: [{ value: 0, label: "Any" }, { value: 1, label: "1 Person" }, { value: 2, label: "2 People" }],
    },
    {
      name: "mobility", type: "select", label: "Mobility Preference",
      options: [
        { value: "any",     label: "Any Mobility" },
        { value: "push",    label: "Push-Around / Manual" },
        { value: "self",    label: "Self-Propelled" },
        { value: "tracked", label: "Tracked / Crawler" },
      ],
    },
    {
      name: "environment", type: "select", label: "Site Conditions",
      options: [
        { value: "any",    label: "Any Site" },
        { value: "narrow", label: "Narrow Access" },
        { value: "uneven", label: "Uneven Terrain" },
        { value: "indoor", label: "Indoor / Slab" },
      ],
    },
  ],

  buildModel(category, row) {
    const valueFor = (...needles) => {
      const idx = category.tableHeaders.findIndex(h => needles.some(n => h.toLowerCase().includes(n)));
      return idx >= 0 ? row[idx] : "";
    };
    const maxNumber = (value) => {
      const matches = String(value).match(/\d+(?:\.\d+)?/g);
      return matches ? Math.max(...matches.map(Number)) : 0;
    };

    const height = maxNumber(valueFor("platform ht", "lift ht"));
    const capacity = maxNumber(valueFor("capacity", "load @0.36m", "load @0.61m", "load @1.07m"));
    const occupants = maxNumber(valueFor("occ."));
    const width = maxNumber(valueFor("overall w"));
    const rowType = valueFor("type");
    const searchable = `${category.title} ${category.shortDesc} ${row.join(" ")}`.toLowerCase();

    const isMaterial = category.id === "ml";
    const isTracked = searchable.includes("tracked") || searchable.includes("crawler");
    const isSelf = searchable.includes("self-propelled") || ["smd", "fmd", "fmt", "tmd", "tmt"].includes(category.id);
    const isPush = searchable.includes("push") || searchable.includes("outrigger") || category.id.startsWith("smp") || category.id.startsWith("dmp");

    const mobilityLabel = isMaterial ? "Manual" : isTracked ? "Tracked" : isSelf ? "Self-propelled" : isPush ? "Push-around" : "Configurable";

    return {
      model: row[0],
      categoryId: category.id,
      categoryTitle: category.title,
      code: category.code,
      price: category.price || 0,
      description: rowType ? `${rowType} model from the ${category.title} range.` : category.shortDesc,
      mobilityLabel,
      specBadges: [
        { label: "height", value: `${Number.isInteger(height) ? height : height.toFixed(1)}m` },
        { label: "load",   value: `${capacity}kg` },
        { label: "occ.",   value: occupants || "-" },
        { label: "",       value: mobilityLabel },
      ],
      _height: height, _capacity: capacity, _occupants: occupants, _width: width,
      _isMaterial: isMaterial, _isTracked: isTracked, _isSelf: isSelf, _isPush: isPush,
    };
  },

  matchModel(model, state) {
    if (state.application === "access" && model._isMaterial) return false;
    if (state.application === "material" && !model._isMaterial) return false;
    if (state.height && model._height < state.height) return false;
    if (state.capacity && model._capacity < state.capacity) return false;
    if (state.occupants && model._occupants < state.occupants) return false;

    if (state.mobility === "push" && !(model._isPush || model._isMaterial)) return false;
    if (state.mobility === "self" && !model._isSelf) return false;
    if (state.mobility === "tracked" && !model._isTracked) return false;

    if (state.environment === "uneven" && !model._isTracked) return false;
    if (state.environment === "narrow" && model._width && model._width > 0.85) return false;

    return true;
  },

  scoreModel(model, state) {
    let score = 100;
    if (state.height) score -= Math.max(0, model._height - state.height) * 3;
    if (state.capacity) score -= Math.max(0, model._capacity - state.capacity) / 80;
    if (state.environment === "indoor" && model._width && model._width <= 0.85) score += 10;
    if (state.environment === "narrow" && model._width && model._width <= 0.8) score += 12;
    if (state.mobility === "self" && model._isSelf) score += 8;
    if (state.mobility === "push" && model._isPush) score += 8;
    if (state.mobility === "tracked" && model._isTracked) score += 8;
    return score;
  },

  sortModels(a, b) {
    return b.score - a.score || a._height - b._height || a.price - b.price;
  },

  summaryText(state, count) {
    const height = state.height ? `${state.height}m+ height` : "any height";
    const capacity = state.capacity ? `${state.capacity}kg+ capacity` : "any load";
    const people = state.occupants ? `${state.occupants} operator${state.occupants === 1 ? "" : "s"}` : "any operator count";
    const result = count === 1 ? "There is one strong match." : count > 1 ? "Review the strongest matches below." : "No exact match found.";
    return `${result} Filtering for ${height}, ${capacity}, ${people}.`;
  },

  emptyStateText: "Try lowering the height or load requirement, or submit an enquiry so we can check a custom configuration.",
};

// ── This line's own certifications ──────────────────────────────────────────
const COMPACT_MEWPS_CERTIFICATIONS = [
  { icon: "ti-certificate",  name: "ISO 9001:2015",     body: "Quality Management System — Consistent Product Quality on Every Unit Manufactured.",                  tagType: "green",  tagLabel: "Certified" },
  { icon: "ti-shield-check", name: "CE Certified",      body: "European Conformity for the Machinery Directive — Structural and Electrical Safety Compliance.",       tagType: "green",  tagLabel: "Certified" },
  { icon: "ti-flag-3",       name: "SANS / OHS Act",    body: "Fully Compliant with South African National Standards and the Occupational Health & Safety Act.",      tagType: "green",  tagLabel: "Compliant" },
  { icon: "ti-zoom-check",   name: "EN 280/SANS 16368", body: "European Standard for Mobile Elevating Work Platforms — Design, Safety and Testing Requirements.",    tagType: "green",  tagLabel: "Certified" },
  { icon: "ti-leaf",         name: "RoHS Compliant",    body: "Restriction of Hazardous Substances in All Electrical and Electronic Components.",                    tagType: "green",  tagLabel: "Compliant" },
  { icon: "ti-test-pipe",    name: "Factory FAT",       body: "Every Unit Undergoes a Full Factory Acceptance Test Before Dispatch — 100% of Units, No Exceptions.", tagType: "orange", tagLabel: "Standard"  },
  { icon: "ti-book",         name: "Operator Manuals",  body: "Full Multilingual Operator and Maintenance Manuals Supplied with Every Machine.",                     tagType: "green",  tagLabel: "Included"  },
];

// ── The product line itself ─────────────────────────────────────────────────
const PRODUCT_LINE_COMPACT_MEWPS = {
  id: "compact-mewps",
  name: "Compact MEWPs",
  tagline: "Compact Mobile Elevating Work Platforms (MEWPs) for safe, efficient work at height — aluminium and steel mast lifts, scissor lifts and material handling equipment, all made to order and CE certified.",
  icon: "ti-stairs-up",
  categories: COMPACT_MEWPS_CATEGORIES,
  compareRows: COMPACT_MEWPS_COMPARE_ROWS,
  guide: COMPACT_MEWPS_GUIDE,
  certifications: COMPACT_MEWPS_CERTIFICATIONS,

  // Optional: contributes this line's own marketing stats to the homepage
  // stats bar (computeStatsBar() in utils.js calls this automatically).
  // "Max platform height" only makes sense for equipment like this — a
  // future chemicals or kitchenware line would define its own headlineStats
  // (or omit this entirely) rather than reuse these labels.
  headlineStats() {
    return [
      { num: getMaxAcrossCategories(this.categories, ['platform ht', 'lift ht', 'ht']), lbl: 'Max Platform Height' },
      { num: getMaxAcrossCategories(this.categories, ['capacity', 'load']),             lbl: 'Max Lift Capacity'   },
    ];
  },
};

// Self-register: this is the ONLY line that ties this file into the site.
// No other file needs to know this product line exists.
window.PRODUCT_LINES.push(PRODUCT_LINE_COMPACT_MEWPS);
