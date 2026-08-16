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
      //   display: "+27 73 230 4984",
      //   whatsapp: "27732304984",
      //   whatsappDisplay: "+27 (0)73 230 4984"
      // },
      {
        label: "Dylan",
        display: "+27 84 391 8732",
        whatsapp: "27843918732",
        whatsappDisplay: "+27 (0)84 391 8732"
      }
    ],
    email:        "info@easysmith.co",
    // address: "Pretoria, Gauteng, South Africa", // Uncomment to show an address
    hoursWeekday: "Mon–Fri: 08:00 – 17:00",
    hoursSat:     "Saturday: 08:00 – 12:00",
    responseTime: "Response within 2 business days",
  },

  leadTimes: {
    standard: "8–10 weeks",
    custom:   "10–14 weeks",
    fleet:    "Priority scheduling available",
  },

  formspreeId: "xbdvqpyn",
  analyticsMeasurementId: "",

  cataloguePdf: "easysmith_catalogue.pdf",
  cataloguePdfLabel: "Easysmith — Full Product Catalogue",

  hero: {
    eyebrow: "South Africa's Industrial Equipment Specialists", 
    line1:   "MAKE THINGS EASY.",
    line2:   "easysmith.",
    sub:     "Easysmith supplies world-class industrial equipment across South Africa — made to order.",
  },

  // These are the ONLY stats that don't come from product data — things like
  // compliance posture or business practice that apply company-wide.
  // "Product Lines" and "Industries Served" are computed automatically in
  // utils.js's computeStatsBar() (from PRODUCT_LINES.length and
  // industriesServed.length below) and don't need an entry here — the top
  // bar shows those two plus the FIRST TWO entries below, so put whichever
  // pair you want leading at the top of this list.
  // Per-line technical stats (e.g. "Max Platform Height") no longer appear
  // in this top bar at all — they render in each product line's own
  // lineStatsStripHTML() instead, right above that line's section, where
  // they have a specific product in view to describe.
  companyStats: [
    { num: "ISO 9001:2015", lbl: "Certified Suppliers" },
    { num: "Nationwide",    lbl: "Delivery Coverage"  },
    { num: "SANS / OHS",    lbl: "Compliant"          },
    { num: "MTO",           lbl: "Make to Order"      },
  ],

  // Curated, not auto-derived from product copy — an "industry" isn't a
  // clean thing to parse out of freeform bestFor text, so this is a
  // maintained list instead. Grounded in what the two current lines are
  // actually sold into (MEWP bestFor fields + Laser Cleaner bestFor
  // fields), grouped into industries a South African B2B buyer would
  // recognise. Update this as lines are added/changed — it's a factual
  // claim about the company, so it's worth a sense-check against what
  // Easysmith has actually served before it goes live.
  industriesServed: [
    "Construction",
    "Warehousing & Logistics",
    "Manufacturing & Engineering",
    "Facilities & Property Maintenance",
    "Automotive",
    "Marine & Ship Maintenance",
    "Retail, Hospitality & Institutional",
    "Energy & Heavy Industry",
  ],

  trustBadges: [
    { icon: "ti-certificate",    label: "ISO 9001:2015 certified suppliers" },
    { icon: "ti-shield-check",   label: "CE Certified"                     },
    { icon: "ti-truck-delivery", label: "Nationwide Delivery"              },
    { icon: "ti-zoom-check",     label: "EN 280/SANS 16368 Compliant"     },
  ],

  //footerBadges: ["ISO 9001:2015", "CE Certified", "SANS Compliant", "EN 280/SANS 16368"],

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

};

// CATEGORIES and certifications used to live here as flat, single-line-
// assumptions. Both now live inside each product-line-*.js file instead
// (see product-line-compact-mewps.js), since a future line's categories and
// certifications may look nothing alike. PRODUCT_LINES is populated
// automatically — each product-line-*.js self-registers into it as it
// loads (see index.html). Nothing here needs to change when a line is added.