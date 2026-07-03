const SITE_CONFIG = {

  company: {
    name:        "Easysmith",
    shortName:   "EASYSMITH",
    tagline:     "Make Things Easy",
    legalSuffix: "(Pty) Ltd",
    yearFounded: 2026,
    // vatNumber: ""  // Uncomment and fill in when VAT registered
  },

  contact: {
    phones: [
      // {
      //   label: "Ivan",
      //   display: "+27 (0) 73 230 4984",
      //   whatsapp: "27732304984",
      //   whatsappDisplay: "+27 (0)73 230 4984"
      // },
      {
        label: "Dylan",
        display: "+27 (0) 84 391 8732",
        whatsapp: "27843918732",
        whatsappDisplay: "+27 (0)84 391 8732"
      }
    ],
    email:        "info@easysmith.co",
    // address: "Pretoria, Gauteng, South Africa", // Uncomment to show an address
    hoursWeekday: "Mon–Fri: 07:30 – 17:00",
    hoursSat:     "Saturday: 08:00 – 12:00",
    responseTime: "Response within 1 business day",
  },

  leadTimes: {
    standard: "8–10 weeks",
    custom:   "10–14 weeks",
    fleet:    "Priority scheduling available",
  },

  formspreeId: "xrewprpb",

  cataloguePdf: "HYNEE_catalogue.pdf",
  cataloguePdfLabel: "Easysmith — Full Product Catalogue",

  hero: {
    eyebrow: "South Africa's Industrial Equipment Specialists", 
    line1:   "Precision Equipment.",
    line2:   "Delivered.",
    sub:     "Easysmith supplies world-class lifting and access equipment across South Africa — made to order.",
  },

  stats: [
    { num: "11",         lbl: "Product Categories" },
    { num: "40+",        lbl: "Models Available"   },
    { num: "16m",        lbl: "Max Platform Height" },
    { num: "454kg",      lbl: "Max Lift Capacity"  },
    { num: "SANS / OHS", lbl: "Compliant"          },
    { num: "MTO",        lbl: "Make to Order"      },
  ],

  trustBadges: [
    { icon: "ti-certificate",    label: "ISO 9001:2015 certified supplier" },
    { icon: "ti-shield-check",   label: "CE Certified"                     },
    { icon: "ti-truck-delivery", label: "Nationwide Delivery"              },
    { icon: "ti-zoom-check",     label: "EN 280/SANS 16368 Compliant"     },
  ],

  footerBadges: ["ISO 9001:2015", "CE Certified", "SANS Compliant", "EN 280/SANS 16368"],

  enquiryTypes: [
    "Product / Quote Request",
    "B2B Enquiry",
    "Custom / Bespoke Order",
    "Technical Specification",
    "Catalogue / Documentation Request",
    "Certification Documents",
    "Financing Enquiry",
    "After-Sales / Service",
    "General Enquiry",
  ],

  certifications: [
    { icon: "ti-certificate",  name: "ISO 9001:2015",     body: "Quality Management System — Consistent Product Quality on Every Unit Manufactured.",                  tagType: "green",  tagLabel: "Certified" },
    { icon: "ti-shield-check", name: "CE Certified",      body: "European Conformity for the Machinery Directive — Structural and Electrical Safety Compliance.",       tagType: "green",  tagLabel: "Certified" },
    { icon: "ti-flag-3",       name: "SANS / OHS Act",    body: "Fully Compliant with South African National Standards and the Occupational Health & Safety Act.",      tagType: "green",  tagLabel: "Compliant" },
    { icon: "ti-zoom-check",   name: "EN 280/SANS 16368", body: "European Standard for Mobile Elevating Work Platforms — Design, Safety and Testing Requirements.",    tagType: "green",  tagLabel: "Certified" },
    { icon: "ti-leaf",         name: "RoHS Compliant",    body: "Restriction of Hazardous Substances in All Electrical and Electronic Components.",                    tagType: "green",  tagLabel: "Compliant" },
    { icon: "ti-test-pipe",    name: "Factory FAT",       body: "Every Unit Undergoes a Full Factory Acceptance Test Before Dispatch — 100% of Units, No Exceptions.", tagType: "orange", tagLabel: "Standard"  },
    { icon: "ti-book",         name: "Operator Manuals",  body: "Full Multilingual Operator and Maintenance Manuals Supplied with Every Machine.",                     tagType: "green",  tagLabel: "Included"  },
  ],
};

const CATEGORIES = [
  {
    // ── SMP1: Single Mast — Swing Outrigger ──────────────────────────────
    id: "smp1", icon: "ti-building-arch", code: "SMP1", color: "#12181f", price: 55000,
    image: "AWP1-raised.png",
    title: "Single Mast — Swing Outrigger",
    shortDesc: "Aluminium single mast with swing outriggers. 1 person, push-around.",
    tableHeaders: ["Model", "Platform Ht", "Capacity", "Occ.", "Platform Dim", "Overall Len", "Outrigger", "Weight (AC)"],
    tableRows: [
      ["SMP1-6",  "6m",  "150kg", "1", "0.60×0.55m", "1.26m", "1.96×1.7m", "325kg"],
      ["SMP1-8",  "8m",  "150kg", "1", "0.60×0.55m", "1.34m", "1.96×1.7m", "378kg"],
      ["SMP1-9",  "9m",  "150kg", "1", "0.60×0.55m", "1.45m", "1.96×1.7m", "400kg"],
      ["SMP1-10", "10m", "120kg", "1", "0.60×0.55m", "1.45m", "1.96×1.7m", "430kg"],
    ],
  },
  {
    // ── SMP2: Single Mast — Push-Around ──────────────────────────────────
    id: "smp2", icon: "ti-building-arch", code: "SMP2", color: "#151a12", price: 98000,
    image: "GTWY1-raised.png",
    title: "Single Mast — Push-Around",
    shortDesc: "Advanced single mast aluminium lifts. AC/DC powered, outrigger-stabilised. Up to 12m platform height.",
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
    // ── SMD: Single Mast — Self-Propelled ────────────────────────────────
    id: "smd", icon: "ti-steering-wheel", code: "SMD", color: "#0f1a22", price: 200000,
    image: "MVL8S-raised.png",
    title: "Single Mast — Self-Propelled",
    shortDesc: "Self-propelled aluminium single mast. Driven, can turn 360° on its own axis, indoor/outdoor.",
    tableHeaders: ["Model", "Platform Ht (indoor)", "Platform Ht (outdoor)", "Capacity", "Occ.", "Overall Len", "Overall W", "Weight"],
    tableRows: [
      ["SMD-6", "6m",   "4.8m", "160kg", "1", "1.40m", "0.78m", "1160kg"],
      ["SMD-8", "7.5m", "6m",   "125kg", "1", "1.40m", "0.78m", "1280kg"],
    ],
  },
  {
    // ── DMP1: Double Mast — Swing Outrigger ──────────────────────────────
    id: "dmp1", icon: "ti-stack-2", code: "DMP1", color: "#1a1209", price: 90000,
    image: "AWP2-raised.png",
    title: "Double Mast — Swing Outrigger",
    shortDesc: "Double aluminium mast with swing outriggers. 200kg capacity, up to 12m platform height.",
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
    // ── DMP2: Double Mast — Push-Around ──────────────────────────────────
    id: "dmp2", icon: "ti-stack-2", code: "DMP2", color: "#1a0d1a", price: 139000,
    image: "GTWY2-raised.png",
    title: "Double Mast — Push-Around",
    shortDesc: "Advanced double mast push-around. 2-person platform, AC/DC powered, up to 16m platform height.",
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
    // ── FMD: Forklift Mast — Wheeled ─────────────────────────────────────
    id: "fmd", icon: "ti-stairs-up", code: "FMD", color: "#0d1a35", price: 431000,
    image: "Hi10-raised.png",
    title: "Forklift Mast — Wheeled",
    shortDesc: "Heavy-duty self-propelled wheeled steel mast lifts with jib arm. Drivable at full height.",
    tableHeaders: ["Model", "Platform Ht", "Horiz. Reach", "Capacity", "Occ.", "Turret", "Jib", "Battery", "Weight"],
    tableRows: [
      ["FMD1-8J", "8m",     "3.51m", "200kg", "2", "356°", "120°", "24V/220Ah", "2850kg"],
      ["FMD-9J",  "9m",     "3.64m", "200kg", "2", "356°", "120°", "24V/220Ah", "3300kg"],
      ["FMD-10J", "10m",    "5.7m",  "200kg", "2", "340°", "130°", "48V/220Ah", "5900kg"],
      ["FMD-11J", "10.65m", "6.05m", "200kg", "2", "352°", "120°", "48V/260Ah", "4980kg"],
    ],
  },
  {
    // ── FMT: Forklift Mast — Tracked (Crawler) ───────────────────────────
    id: "fmt", icon: "ti-forklift", code: "FMT", color: "#0a1f14", price: 482000,
    image: "4C-raised.png",
    title: "Forklift Mast — Tracked (Crawler)",
    shortDesc: "Tracked crawler forklift mast lifts with jib. For uneven terrain and construction sites.",
    tableHeaders: ["Model", "Platform Ht", "Horiz. Reach", "Capacity", "Occ.", "Turret", "Jib", "Track W", "Battery", "Weight"],
    tableRows: [
      ["FMT-7J", "7m", "3.38m", "200kg", "2", "220°", "120°", "250mm", "48V/220Ah", "2970kg"],
      ["FMT-8J", "8m", "3.63m", "200kg", "2", "220°", "120°", "250mm", "48V/220Ah", "3300kg"],
    ],
  },
  {
    // ── TMD: Telescopic Mast — Wheeled ────────────────────────────────────
    id: "tmd", icon: "ti-arrows-up", code: "TMD", color: "#0d2218", price: 179000,
    image: "HI11T-raised.png",
    title: "Telescopic Mast — Wheeled",
    shortDesc: "Self-propelled wheeled telescopic mast lifts. Compact, narrow-profile for tight indoor spaces.",
    tableHeaders: ["Model", "Platform Ht", "Capacity", "Occ.", "Overall W", "Travel (stowed)", "Battery", "Weight"],
    tableRows: [
      ["TMD1-4", "3.65m", "230kg", "2", "0.79m", "N/A",      "2×12V/100Ah", "950kg"],
      ["TMD-6",  "5.95m", "200kg", "2", "0.79m", "N/A",      "2×12V/100Ah", "1350kg"],
      ["TMD-9J", "9.2m",  "200kg", "2", "1.0m",  "4.5 km/h", "24V/240Ah",   "2950kg"],
    ],
  },
  {
    // ── TMT: Telescopic Mast — Tracked (Crawler) ─────────────────────────
    id: "tmt", icon: "ti-tank", code: "TMT", color: "#1a160a", price: 192000,
    image: "Hi9C-raised.png",
    title: "Telescopic Mast — Tracked (Crawler)",
    shortDesc: "Tracked crawler telescopic mast lift. Ultra-compact, can turn 360° on it's own axis for restricted access.",
    tableHeaders: ["Model", "Platform Ht", "Capacity", "Occ.", "Overall W", "Overall Len", "Track W", "Battery", "Weight"],
    tableRows: [
      ["TMT2-4", "3.8m", "200kg", "2", "0.79m", "1.44m", "150mm", "2×12V/100Ah", "740kg"],
    ],
  },
  {
    // ── X: Scissor Lifts ──────────────────────────────────────────────────
    id: "x", icon: "ti-scissors", code: "X", color: "#0d1a1a", price: 69000,
    image: "SP0607-raised.png",
    title: "Scissor Lifts",
    shortDesc: "Mini scissor lifts — self-propelled, push-around, and all-electric/oil-free variants.",
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
    // ── ML: Material Lifts ────────────────────────────────────────────────
    id: "ml", icon: "ti-package", code: "ML", color: "#1a0d0d", price: 52000,
    image: "AML-raised.png",
    title: "Material Lifts",
    shortDesc: "Heavy and light duty manual fork-style material lifts. Stabiliser-supported, no power required.",
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