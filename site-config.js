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

  formspreeId: "xrewprpb",

  cataloguePdf: "HYNEE_catalogue.pdf",
  cataloguePdfLabel: "Easysmith — Full Product Catalogue",

  hero: {
    eyebrow: "South Africa's Industrial Equipment Specialists", 
    line1:   "MAKE THINGS EASY.",
    line2:   "easysmith.",
    sub:     "Easysmith supplies world-class industrial equipment across South Africa — made to order.",
  },

  // These are the ONLY stats that don't come from product data — things like
  // compliance posture or business practice that apply company-wide.
  // "Product Categories", "Models Available", and any per-line headline
  // stats (e.g. "Max Platform Height") are computed automatically in
  // utils.js's computeStatsBar() and don't belong here.
  companyStats: [
    { num: "SANS / OHS", lbl: "Compliant"     },
    { num: "MTO",        lbl: "Make to Order" },
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

};

// CATEGORIES and certifications used to live here as flat, single-line-
// assumptions. Both now live inside each product-line-*.js file instead
// (see product-line-compact-mewps.js), since a future line's categories and
// certifications may look nothing alike. PRODUCT_LINES is populated
// automatically — each product-line-*.js self-registers into it as it
// loads (see index.html). Nothing here needs to change when a line is added.
