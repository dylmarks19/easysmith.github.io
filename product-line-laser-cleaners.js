// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT LINE: Laser Cleaners (SENFENG)
// ═══════════════════════════════════════════════════════════════════════════
// Real SENFENG models/pricing. Easysmith codes below (LCP-xxx / LCC-xxx)
// match the "Easysmith Code" column on the Laser Cleaners tab of
// Price_List_QC.xlsx — keep both in sync when prices or models change.
// Prices are Website Price (ZAR, FOB Jinan + landed cost tier), rounded to
// the nearest R1,000, per the xlsx.
// ═══════════════════════════════════════════════════════════════════════════

const LASER_CLEANERS_CATEGORIES = [
  {
    id: "laser-cw",
    images: ["LCC.png", "LCC.2.png","LCC.mp4"],
    icon: "ti-sparkles",
    code: "LCC",
    price: 139000, // LCC-1500, lowest-priced model with confirmed pricing
    title: "Continuous-Wave Laser Cleaners",
    shortDesc: "Continuous-beam cleaning built for speed across larger surfaces — sheet metal, rust and coating removal at up to 300mm cleaning width.",
    application: "Large-area, fast surface cleaning — heavy rust removal & thick coating/paint stripping",
    mobility: "Handheld",
    powerSource: "Single/Three-Phase 220–380V",
    bestFor: "Sheet metal, robot production, automotive repair, ship maintenance",
    setup: "Workshop or on-site handheld use",
    cleaningWidth: "300mm (500mm on LCC-6000)",
    tableHeaders: ["Model", "Power", "Cooling", "Cleaning Width", "Weight", "Typical Use"],
    tableRows: [
      ["LCC-1200", "1.2kW", "Air-cooled",   "300mm",     "36kg",  "Sheet metal, robot production (pricing TBC)"],
      ["LCC-1500", "1.5kW", "Water-cooled", "300mm",     "190kg", "Sheet metal, automotive repair, ship maintenance"],
      ["LCC-2000", "2.0kW", "Water-cooled", "300mm",     "190kg", "Sheet metal, automotive repair, ship maintenance"],
      ["LCC-3000", "3.0kW", "Water-cooled", "300mm",     "235kg", "Heavy-duty sheet metal & ship maintenance"],
      ["LCC-6000", "6.0kW", "Water-cooled", "200-500mm", "235kg", "High-throughput industrial line cleaning (pricing TBC)"],
    ],
  },
  {
    id: "laser-pulsed",
    images: ["LCP.png", "LCP.2.png","LCP.mp4"],
    icon: "ti-bucket",
    code: "LCP",
    price: 174000, // LCP-200, lowest-priced model in this category
    title: "Pulsed Laser Cleaners",
    shortDesc: "Nanosecond-pulse cleaning with minimal heat-affected zone — precise rust, paint and oxide removal without damaging the substrate.",
    application: "Precision surface prep — rust, paint & oxide removal with minimal heat damage to the substrate",
    mobility: "Handheld",
    powerSource: "Single-Phase 220V",
    bestFor: "Mold, automotive repair, ship maintenance, aircraft restoration",
    setup: "Workshop or on-site handheld use",
    cleaningWidth: "100–120mm",
    tableHeaders: ["Model", "Power", "Cooling", "Cleaning Width", "Weight", "Typical Use"],
    tableRows: [
      ["LCP-200",  "0.2kW", "Air-cooled",   "100mm", "25kg",  "Spot rust/paint removal, mold cleaning"],
      ["LCP-300",  "0.3kW", "Air-cooled",   "100mm", "25kg",  "Automotive manufacturing & repair"],
      ["LCP-500",  "0.5kW", "Air-cooled",   "120mm", "30kg",  "Ship maintenance, aircraft restoration"],
      ["LCP-1000", "1.0kW", "Water-cooled", "120mm", "200kg", "Heavy-duty mold & production line cleaning"],
   ],
  },
  {
    id: "laser-solutions",
    images: ["LCS.png", "LCS.2.png","LCS.mp4"],
    icon: "ti-tools",
    code: "LCS",
    price: 0, // POA — engineered-to-order, priced per project
    title: "Automated Laser Cleaning Solutions",
    shortDesc: "Engineered-to-order automated lines built around the SF-HC handheld laser head range, for conveyorised or robotic cleaning at production scale.",
    application: "In-line, automated cleaning integrated into a production or conveyor system",
    mobility: "Fixed / Installed",
    powerSource: "0.5–20kW (system-dependent)",
    bestFor: "Steel plate lines, tyre inner liner prep, LNG pressure vessel cleaning",
    setup: "Site-integrated — conveyor, robotics and/or MES integration",
    cleaningWidth: "System-dependent",
    tableHeaders: ["System", "Power Range", "Cleaning Mode", "Typical Applications"],
    tableRows: [
      ["LCS-STEEL",  "1.5-20kW", "Non-contact, conveyorised", "Oxidation/rust/paint removal on steel plate, 800mm+ length"],
      ["LCS-TYRE",   "0.5-1kW",  "Non-contact, MES-integrated", "Tyre inner liner prep — raises frictional coefficient"],
      ["LCS-VESSEL", "0.5-1kW",  "Non-contact, robotic arms", "LNG pressure vessel outer walls, seal heads, weld seams"],
    ],
  },
];

const LASER_CLEANERS_COMPARE_ROWS = [
  { label: "Primary Use", key: "application" },
  { label: "Mobility", key: "mobility" },
  { label: "Power Source", key: "powerSource" },
  { label: "Best Suited For", key: "bestFor" },
  { label: "Typical Setup", key: "setup" },
  { label: "Cleaning Width", key: "cleaningWidth" },
];

// Parses a power badge value like "0.2kW" or "6.0kW" into a kW float.
// All Power values in this file are normalised to kW so comparisons
// (and getMaxAcrossCategories in utils.js) are apples-to-apples.
function _lcParseKW(value) {
  const num = parseFloat(String(value).replace(/kW/i, ""));
  return isNaN(num) ? 0 : num;
}

const LASER_CLEANERS_GUIDE = {
  heading: "Find a suitable laser cleaner",
  fields: [
    {
      // NOTE: deliberately NOT named "application" — the Compact MEWPs guide
      // already owns that field name with a totally different meaning
      // (Personnel Access / Material Lifting). Under the "All Products" guide
      // view, fields are merged by name and the first-registered line wins —
      // reusing "application" here would silently replace these options with
      // the MEWP ones whenever both lines are in play. Keep this name unique.
      name: "cleaningNeed",
      type: "radio",
      label: "Cleaning Need",
      default: "surface",
      options: [
        { value: "surface", label: "Precision Surface Prep", icon: "ti-bucket", hint: "Restore, clean and de-rust metal surfaces with minimal heat damage." },
        { value: "paint", label: "Paint / Coating Removal", icon: "ti-sparkles", hint: "Strip coatings quickly across larger areas." },
        { value: "production", label: "Production / High-Throughput", icon: "ti-tools", hint: "Repeatable industrial-scale cleaning, including automated lines." },
      ],
    },
    {
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
      name: "cooling",
      type: "radio",
      label: "Cooling Preference",
      default: "any",
      options: [
        { value: "any", label: "No Preference", icon: "ti-adjustments", hint: "Show both." },
        { value: "air-cooled", label: "Air-cooled", icon: "ti-wind", hint: "No chiller — simpler for field/on-site work." },
        { value: "water-cooled", label: "Water-cooled", icon: "ti-droplet", hint: "Sustained higher-power runs." },
      ],
    },
  ],

  buildModel(category, row) {
    if (category.id === "laser-solutions") {
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
          { label: "mode", value: row[2] },
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
        { label: "cooling", value: row[2] },
        { label: "width", value: row[3] },
        { label: "weight", value: row[4] },
      ],
    };
  },

  matchModel(model, state) {
    // Cleaning-need is a hard filter, not just a scoring nudge, matching
    // Senfeng's own guidance on which mode suits which job:
    //  - Surface Prep    -> Pulsed only (minimal heat damage, per catalogue)
    //  - Paint/Coating   -> Continuous-wave only (built for large-area, fast removal)
    //  - Production      -> Continuous-wave handhelds + automated Solutions lines
    if (state.cleaningNeed === "surface" && model.categoryId !== "laser-pulsed") return false;
    if (state.cleaningNeed === "paint" && model.categoryId !== "laser-cw") return false;
    if (state.cleaningNeed === "production" && model.categoryId === "laser-pulsed") return false;

    // Automated Solutions are engineered-to-order with a power *range*, not a
    // fixed spec — skip the power/cooling filters for them rather than
    // mis-parsing "1.5-20kW" as a single number.
    if (model.categoryId === "laser-solutions") return true;

    if (state.power && Number(state.power) > 0) {
      const powerKW = _lcParseKW(model.specBadges[0].value);
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

    if (state.cleaningNeed === "surface" && model.categoryId === "laser-pulsed") score += 25;
    if (state.cleaningNeed === "paint" && model.categoryId === "laser-cw") score += 25;
    if (state.cleaningNeed === "production") {
      if (model.categoryId === "laser-solutions") score += 30;
      if (model.categoryId === "laser-cw") score += 15;
    }

    if (model.categoryId !== "laser-solutions") {
      if (state.power && Number(state.power) > 0) {
        const powerKW = _lcParseKW(model.specBadges[0].value);
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

  // NOTE: render-guide.js currently sorts results itself (by score, then by
  // price) and does not call this — kept here as the intended tie-break
  // logic if that ever changes. Custom Solutions carry price:0 (POA) and
  // should sort after priced models, not before, hence the explicit check
  // rather than a plain a.price - b.price.
  sortModels(a, b) {
    if (a.price === 0 && b.price !== 0) return 1;
    if (b.price === 0 && a.price !== 0) return -1;
    return a.price - b.price;
  },

  summaryText(state, count) {
    if (count === 0) return "No exact match found. Try broadening your power range or cooling preference, or contact us for a custom configuration.";
    if (count === 1) return "One option fits your requirements closely.";
    if (state.cleaningNeed === "production") return `${count} options fit your production/high-throughput requirement, including automated lines.`;
    if (state.cleaningNeed === "paint") return `${count} continuous-wave systems fit your coating-removal requirement.`;
    return `${count} pulsed laser cleaners match your surface-prep requirement.`;
  },

  emptyStateText: "Try a broader power range or cooling preference, or contact us for a custom configuration.",
};

const LASER_CLEANERS_CERTIFICATIONS = [
  { icon: "ti-shield-check", name: "TÜV CE Compliance", body: "Laser systems supplied with CE-focused safety and electrical documentation support.", tagType: "green", tagLabel: "Certified" },
  { icon: "ti-certificate", name: "FDA Documentation", body: "Relevant quality and compliance documentation available for regulated and inspection-led applications.", tagType: "green", tagLabel: "Supported" },
  { icon: "ti-zoom-check", name: "ETL / SGS Verification", body: "Third-party verification support for quality, safety and inspection requirements.", tagType: "green", tagLabel: "Verified" },
  { icon: "ti-book", name: "RoHS / ISO-aligned Docs", body: "Operational, quality and safety documentation supplied to support commissioning and compliance reviews.", tagType: "green", tagLabel: "Included" },
];

const PRODUCT_LINE_LASER_CLEANERS = {
  id: "laser-cleaners",
  name: "Laser Cleaners",
  tagline: "High-performance laser cleaning systems for surface preparation, paint removal and industrial maintenance — with CE, FDA, ETL and SGS-aligned documentation support.",
  icon: "ti-sparkles",
  cataloguePdf: "SENFENG Laser Cleaning Machine -20260311.pdf",
  cataloguePdfLabel: "Laser Cleaners Catalogue",
  leadTimes: {
    standard: "8–10 weeks",
    custom: "10–14 weeks",
    fleet: "Priority scheduling available",
  },
  categories: LASER_CLEANERS_CATEGORIES,
  compareRows: LASER_CLEANERS_COMPARE_ROWS,
  guide: LASER_CLEANERS_GUIDE,
  certifications: LASER_CLEANERS_CERTIFICATIONS,

  headlineStats() {
    return [
      { num: `${getMaxAcrossCategories(this.categories, ['power'])}`, lbl: 'Max Power' },
      { num: `${this.categories.length}`, lbl: 'Laser Cleaner Types' },
    ];
  },
};

window.PRODUCT_LINES.push(PRODUCT_LINE_LASER_CLEANERS);