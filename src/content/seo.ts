/** Per-page title and description (docs/03-CONTENT.md → SEO copy). All draft. */
export interface PageSeo {
  /** Full title, used as-is (no template suffix). ≤ 60 characters. */
  title: string;
  /** ≤ 160 characters. */
  description: string;
}

export const seo = {
  home: {
    title: "Signature Remodelings — Home Remodeling in North Texas",
    description:
      "Kitchen, bathroom, balcony and second-floor remodeling plus home flipping for investors. Book a consultation with Signature Remodelings.",
  },
  services: {
    title: "Remodeling Services — Signature Remodelings",
    description:
      "Interior remodeling, exterior additions and home flipping for Texas homeowners and investors.",
  },
  "interior-remodeling": {
    title: "Kitchen & Bathroom Remodeling — Signature Remodelings",
    description:
      "Kitchens, bathrooms and living spaces remodeled with care and detail. Plan your interior remodel with Signature Remodelings.",
  },
  "exterior-additions": {
    title: "Balconies, Patios & Room Additions — Signature",
    description:
      "Add space with a balcony, patio or second-floor room designed to match your home. Talk to Signature Remodelings.",
  },
  "home-flipping": {
    title: "Home Flipping Remodels for Investors — Signature",
    description:
      "We remodel dated houses into market-ready homes for real estate investors. See our Alba, TX flip and start your project.",
  },
  projects: {
    title: "Remodeling Projects — Signature Remodelings",
    description:
      "Before-and-after remodeling projects in Texas, from a Carrollton balcony addition to a full home flip in Alba.",
  },
  "carrollton-balcony-addition": {
    title: "Balcony Addition in Carrollton, TX — Signature",
    description:
      "A covered second-floor balcony and patio added to the back of an existing Carrollton, TX home for new outdoor living space.", // [DRAFT]
  },
  "alba-home-flip": {
    title: "Full Home Flip in Alba, TX — Signature Remodelings",
    description: "A dated Alba, TX house remodeled inside and out into a move-in-ready home.",
  },
  about: {
    title: "About Signature Remodelings",
    description:
      "A Texas remodeling company focused on careful planning, clear communication and detail-driven craftsmanship.",
  },
  faq: {
    title: "Remodeling FAQ — Signature Remodelings",
    description:
      "Answers about consultations, timelines, additions and investor flips from Signature Remodelings.",
  },
  contact: {
    title: "Book a Remodeling Consultation — Signature",
    description:
      "Tell us about your kitchen, bathroom, addition or flip project and we'll contact you to schedule a consultation.",
  },
} satisfies Record<string, PageSeo>;

export type SeoKey = keyof typeof seo;
