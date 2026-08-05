// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT LINE: Laser Welding Machines (SENFENG)
// ═══════════════════════════════════════════════════════════════════════════
// Real SENFENG models/pricing. Easysmith codes below (LWP-xxx / LWS-xxx /
// LWM-xxx / LWR-xxx) match the "Easysmith Code" column on the Laser Welders
// tab of Price_List_QC.xlsx — keep both in sync when prices or models
// change. See EASYSMITH_MODEL_NUMBERING.md for how these codes are built.
// Prices are Website Price (ZAR, FOB Jinan + landed cost tier), rounded to
// the nearest R1,000, per the xlsx.
// ═══════════════════════════════════════════════════════════════════════════

const LASER_WELDING_CATEGORIES = [
  {
    id: "laser-welding-portable",
    images: ["LWP.png", "LWP.2.png", "LWP.mp4"],
    icon: "ti-bolt",
    code: "LWP",
    price: 92000, // LWP-3, lowest-priced model in this category
    title: "Portable Laser Welders",
    shortDesc: "Air-cooled, no chiller required — the lightest, quickest-to-deploy welders in the range.",
    application: "Portable, on-site metal welding — quick setup with no chiller needed",
    mobility: "Handheld, Portable",
    powerSource: "Single-Phase 220V",
    bestFor: "Field repair, site work, light fabrication",
    setup: "Bench or on-site, no cooling infrastructure needed",
    maxThickness: "CS/SS up to 4mm",
    tableHeaders: ["Model", "Power", "Welding Thickness", "Weight", "Typical Use"],
    tableRows: [
      ["LWP-3", "0.8kW", "CS/SS: 0.5-3mm",          "35kg", "Light repair, thin-gauge fabrication"],
      ["LWP-4", "1.2kW", "CS/SS: 0.5-3mm",          "40kg", "General site & workshop repair"],
      ["LWP-5", "1.5kW", "CS/SS: 0.5-4mm",          "50kg", "Heavier portable fabrication work"],
      ["LWP-6", "1.5kW", "CS/SS: 0.5-4mm",          "50kg", "Heavier portable fabrication work"],
    ],
  },
  {
    id: "laser-welding-standard",
    images: ["LWS.png", "LWS.2.png", "LWS.mp4"],
    icon: "ti-flame",
    code: "LWS",
    price: 104000, // LWS-1500, lowest-priced model in this category
    title: "Standard Water-Cooled Welders",
    shortDesc: "Water-cooled with a light plastic-rubber welding gun — sustained welding of steel, stainless and aluminium.",
    application: "Workshop welding of carbon steel, stainless steel & aluminium",
    mobility: "Handheld, Workshop",
    powerSource: "Single/Three-Phase 220-380V",
    bestFor: "General fabrication, sheet metal, workshop production",
    setup: "Workshop, requires water-cooling unit (included)",
    maxThickness: "CS/SS up to 6mm, AL up to 4mm",
    tableHeaders: ["Model", "Power", "Welding Thickness", "Weight", "Typical Use"],
    tableRows: [
      ["LWS-1500", "1.5kW", "CS/SS: 0.5-4mm / AL: 0.5-3mm", "124kg", "General fabrication & sheet metal"],
      ["LWS-2000", "2.0kW", "CS/SS: 0.5-4mm / AL: 0.5-3mm", "144kg", "Workshop production welding"],
      ["LWS-3000", "3.0kW", "CS/SS: 0.5-6mm / AL: 0.5-4mm", "164kg", "Heavier-gauge workshop welding"],
    ],
  },
  {
    id: "laser-welding-professional",
    images: ["LWM.png", "LWM.2.png", "LWM.mp4"],
    icon: "ti-tool",
    code: "LWM",
    price: 128000, // LWM-1500, lowest-priced model in this category
    title: "Professional Welders (Metal Gun)",
    shortDesc: "Water-cooled with a heavier-duty 4-in-1 metal welding gun — the highest-spec handheld tier, built for continuous professional use.",
    application: "Heavy-duty professional welding — higher-thickness carbon steel, stainless & aluminium work",
    mobility: "Handheld, Workshop",
    powerSource: "Single/Three-Phase 220-380V",
    bestFor: "Continuous production welding, thicker material, professional fabrication shops",
    setup: "Workshop, requires water-cooling unit (included)",
    maxThickness: "CS/SS up to 6mm, AL up to 4mm",
    tableHeaders: ["Model", "Power", "Welding Thickness", "Weight", "Typical Use"],
    tableRows: [
      ["LWM-1500", "1.5kW", "CS/SS: 0.5-4mm / AL: 0.5-3mm", "195kg", "Professional fabrication shops"],
      ["LWM-2000", "2.0kW", "CS/SS: 0.5-4mm / AL: 0.5-3mm", "195kg", "Continuous production welding"],
      ["LWM-3000", "3.0kW", "CS/SS: 0.5-6mm / AL: 0.5-4mm", "240kg", "Heaviest-duty handheld welding"],
    ],
  },
  {
    id: "laser-welding-robotic",
    images: ["LWR.png", "LWR.2.png", "LWR.mp4"],
    icon: "ti-robot",
    code: "LWR",
    price: 0, // POA — engineered-to-order, priced per project
    title: "Robotic & Automated Welding Solutions",
    shortDesc: "Robot-driven laser, arc, and laser-arc hybrid welding cells — from standard robotic arc welding to teaching-free, digital-twin-programmed production lines.",
    application: "Automated, robot-driven welding integrated into a production line or fixed workcell",
    mobility: "Fixed / Installed (mobile cobot variant available)",
    powerSource: "Three-Phase 380V",
    bestFor: "Auto parts, rail transit, equipment manufacturing, shipbuilding, bridge steel structures",
    setup: "Site-integrated — robot cell, protective chamber and/or ground rail",
    maxThickness: "System-dependent (up to 20mm with laser-arc hybrid)",
    tableHeaders: ["System", "Power / Capacity", "Configuration", "Typical Applications"],
    tableRows: [
      ["LWR-HYBRID", "12-20kW laser + arc", "Robot + ground rail, dual heat source",              "Medium-thick sheet, one- or both-sides welding"],
      ["LWR-RW",     "1.5-6kW",             "Standard or protective-chamber robot cell",           "Large-format automated laser welding"],
      ["LWR-RMW",    "350A / 500A",         "Standard or protective-chamber robot cell",           "General-purpose robotic MIG/MAG arc welding"],
      ["LWR-RMWTF",  "500A",                "Teaching-free, 7/8/9-axis, digital twin",             "No-programming robotic welding, multi-station"],
      ["LWR-CMW",    "350A / 500A",         "Mobile trolley-mounted collaborative robot",          "On-site welding of large workpieces (ships, bridges)"],
    ],
  },
];

const LASER_WELDING_COMPARE_ROWS = [
  { label: "Primary Use", key: "application" },
  { label: "Mobility", key: "mobility" },
  { label: "Power Source", key: "powerSource" },
  { label: "Best Suited For", key: "bestFor" },
  { label: "Typical Setup", key: "setup" },
  { label: "Max Welding Thickness", key: "maxThickness" },
];

// Parses a power badge value like "0.8kW" or "3.0kW" into a kW float.
// Kept in kW throughout (never plain "W") so comparisons — and
// getMaxAcrossCategories in utils.js — stay apples-to-apples, and so this
// helper matches the one in product-line-laser-cleaners.js exactly.
function _lwParseKW(value) {
  const num = parseFloat(String(value).replace(/kW/i, ""));
  return isNaN(num) ? 0 : num;
}

// Extracts the highest kW figure from values such as "1.5-6kW",
// "12-20kW laser + arc", or "0.8kW". It intentionally ignores A-based
// current values like "350A / 500A" because those are not laser power.
function _lwExtractMaxPowerKW(value) {
  const text = String(value).toLowerCase();
  const matches = text.match(/\d+(?:\.\d+)?(?=\s*kW)/g);
  if (!matches || !matches.length) return 0;
  return Math.max(...matches.map(Number));
}

const LASER_WELDING_GUIDE = {
  heading: "Find a suitable laser welder",
  fields: [
    {
      // Deliberately its own field name (not "application" or
      // "cleaningNeed") — see product-line-laser-cleaners.js and
      // product-line-compact-mewps.js, which already own those names with
      // different meanings. The "All Products" guide view merges fields by
      // name across every registered line, so reusing either would
      // silently swap in the wrong options here.
      name: "weldingSetting",
      type: "radio",
      label: "Where You'll Weld",
      default: "portable",
      options: [
        { value: "portable",   label: "Portable / Field Repair",       icon: "ti-bolt",  hint: "Light, no chiller needed — grab it and go." },
        { value: "workshop",   label: "Workshop / General Fabrication", icon: "ti-flame", hint: "Water-cooled, sustained welding of steel & aluminium." },
        { value: "industrial", label: "Industrial / Automated Line",    icon: "ti-robot", hint: "Heaviest-duty handheld tier plus robotic & automated solutions." },
      ],
    },
    {
      // Same field name AND same options as product-line-laser-cleaners.js
      // on purpose — "power" means the same thing (a kW threshold) on both
      // laser-based lines, so sharing the control in the merged "All
      // Products" guide view is coherent rather than a collision. If you
      // change one line's options, change the other's to match, or split
      // the name so they stop being shared.
      name: "power",
      type: "select",
      label: "Required Power",
      options: [
        { value: 0, label: "Any" },
        { value: 1000, label: "Up to 1.0kW" },
        { value: 3000, label: "Up to 3.0kW" },
        { value: 6000, label: "Up to 6.0kW" },
      ],
    },
    {
      // Also intentionally shared with product-line-laser-cleaners.js —
      // same reasoning as "power" above.
      name: "cooling",
      type: "radio",
      label: "Cooling Preference",
      default: "any",
      options: [
        { value: "any", label: "No Preference", icon: "ti-adjustments", hint: "Show both." },
        { value: "air-cooled", label: "Air-cooled", icon: "ti-wind", hint: "No chiller — lightest, most portable." },
        { value: "water-cooled", label: "Water-cooled", icon: "ti-droplet", hint: "Sustained higher-power welding." },
      ],
    },
  ],

  buildModel(category, row) {
    if (category.id === "laser-welding-robotic") {
      return {
        model: row[0],
        categoryId: category.id,
        categoryTitle: category.title,
        code: category.code,
        price: 0,
        description: `${category.shortDesc}`,
        mobilityLabel: category.mobility,
        specBadges: [
          { label: "power", value: row[1] },
          { label: "config", value: row[2] },
          { label: "applications", value: row[3] },
        ],
      };
    }
    return {
      model: row[0],
      categoryId: category.id,
      categoryTitle: category.title,
      code: category.code,
      price: category.price || 0,
      description: `${category.shortDesc} Best suited to ${category.bestFor.toLowerCase()}.`,
      mobilityLabel: category.mobility,
      specBadges: [
        { label: "power", value: row[1] },
        { label: "cooling", value: category.id === "laser-welding-portable" ? "Air-cooled" : "Water-cooled" },
        { label: "thickness", value: row[2] },
        { label: "weight", value: row[3] },
      ],
    };
  },

  matchModel(model, state) {
    if (state.weldingSetting === "portable" && model.categoryId !== "laser-welding-portable") return false;
    if (state.weldingSetting === "workshop" &&
        (model.categoryId === "laser-welding-portable" || model.categoryId === "laser-welding-robotic")) return false;
    if (state.weldingSetting === "industrial" &&
        (model.categoryId === "laser-welding-portable" || model.categoryId === "laser-welding-standard")) return false;

    // Robotic/automated systems are POA with range specs, not a single
    // fixed power/cooling value — skip those filters for them rather than
    // mis-parsing "12-20kW" as one number.
    if (model.categoryId === "laser-welding-robotic") return true;

    if (state.power && Number(state.power) > 0) {
      const powerKW = _lwParseKW(model.specBadges[0].value);
      if (powerKW > Number(state.power) / 1000) return false;
    }

    if (state.cooling && state.cooling !== "any") {
      const coolingBadge = model.specBadges.find(b => b.label === "cooling");
      if (coolingBadge && coolingBadge.value.toLowerCase() !== state.cooling) return false;
    }

    return true;
  },

  scoreModel(model, state) {
    let score = 60;

    if (state.weldingSetting === "portable" && model.categoryId === "laser-welding-portable") score += 25;
    if (state.weldingSetting === "workshop" && model.categoryId === "laser-welding-standard") score += 25;
    if (state.weldingSetting === "workshop" && model.categoryId === "laser-welding-professional") score += 15;
    if (state.weldingSetting === "industrial") {
      if (model.categoryId === "laser-welding-robotic") score += 30;
      if (model.categoryId === "laser-welding-professional") score += 15;
    }

    if (model.categoryId !== "laser-welding-robotic") {
      if (state.power && Number(state.power) > 0) {
        const powerKW = _lwParseKW(model.specBadges[0].value);
        if (powerKW <= Number(state.power) / 1000) score += 10;
        else score -= 10;
      }
      if (state.cooling && state.cooling !== "any") {
        const coolingBadge = model.specBadges.find(b => b.label === "cooling");
        if (coolingBadge && coolingBadge.value.toLowerCase() === state.cooling) score += 10;
      }
    }

    return score;
  },

  sortModels(a, b) {
    if (a.price === 0 && b.price !== 0) return 1;
    if (b.price === 0 && a.price !== 0) return -1;
    return a.price - b.price;
  },

  summaryText(state, count) {
    if (count === 0) return "No exact match found. Try broadening your power range or cooling preference, or contact us for a custom configuration.";
    if (count === 1) return "One option fits your requirements closely.";
    if (state.weldingSetting === "industrial") return `${count} options fit your industrial/automated requirement, including robotic welding cells.`;
    if (state.weldingSetting === "workshop") return `${count} water-cooled workshop welders match your requirement.`;
    return `${count} portable welders match your on-site requirement.`;
  },

  emptyStateText: "Try a broader power range or cooling preference, or contact us for a custom configuration.",
};

const LASER_WELDING_CERTIFICATIONS = [
  { icon: "ti-shield-check", name: "TÜV CE Compliance", body: "Welding systems supplied with CE-focused safety and electrical documentation support.", tagType: "green", tagLabel: "Certified" },
  { icon: "ti-certificate", name: "FDA Documentation", body: "Relevant quality and compliance documentation available for regulated and inspection-led applications.", tagType: "green", tagLabel: "Supported" },
  { icon: "ti-zoom-check", name: "SGS / UDEM Verification", body: "Third-party verification support for weld quality, safety and inspection requirements.", tagType: "green", tagLabel: "Verified" },
  { icon: "ti-book", name: "ISO 9001 Quality System", body: "Operational, quality and safety documentation supplied to support commissioning and compliance reviews.", tagType: "green", tagLabel: "Included" },
];

const PRODUCT_LINE_LASER_WELDING = {
  id: "laser-welding",
  name: "Laser Welding Machines",
  tagline: "Handheld and robotic laser welding systems — from portable field repair to fully automated production cells — for automotive, rail, equipment manufacturing and shipbuilding.",
  icon: "ti-bolt",
  cataloguePdf: "SENFENG Laser Welding Machine Catalog20260310.pdf",
  cataloguePdfLabel: "Laser Welding Machines Catalogue",
  leadTimes: {
    standard: "8–10 weeks",
    custom: "10–14 weeks",
    fleet: "Priority scheduling available",
  },
  categories: LASER_WELDING_CATEGORIES,
  compareRows: LASER_WELDING_COMPARE_ROWS,
  guide: LASER_WELDING_GUIDE,
  certifications: LASER_WELDING_CERTIFICATIONS,

  headlineStats() {
    const maxLaserPowerKW = this.categories.reduce((max, category) => {
      return category.tableRows.reduce((categoryMax, row) => {
        return Math.max(categoryMax, _lwExtractMaxPowerKW(row[1]));
      }, max);
    }, 0);

    return [
      { num: maxLaserPowerKW > 0 ? `${maxLaserPowerKW}kW` : '—', lbl: 'Max Laser Power' },
      { num: `${this.categories.length}`, lbl: 'Welding Machine Types' },
    ];
  },
};

window.PRODUCT_LINES.push(PRODUCT_LINE_LASER_WELDING);