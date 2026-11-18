import type { ImageAsset } from "./types";

/**
 * Stock image slots (docs/05-IMAGES.md). Mood only: never on project pages and never
 * presented as the company's work. Files go in public/images/stock/ with exactly these
 * names; a slot whose file is missing renders as a neutral panel (see lib/images.ts).
 */
export const stockImages = {
  heroHome: {
    src: "/images/stock/hero-home.jpg",
    width: 2400,
    height: 1600,
    alt: "Bright open kitchen with a marble waterfall island, white cabinets and pendant lights",
  },
  serviceInterior: {
    src: "/images/stock/service-interior.jpg",
    width: 2400,
    height: 1590,
    alt: "White kitchen with an island, marble backsplash and globe pendant lights",
  },
  serviceExterior: {
    src: "/images/stock/service-exterior.jpg",
    width: 2400,
    height: 1589,
    alt: "Two-story grey suburban house with a stone accent and a wide front lawn",
  },
  serviceFlipping: {
    src: "/images/stock/service-flipping.jpg",
    width: 2400,
    height: 1600,
    alt: "Kitchen under renovation with cabinets and counters covered in protective plastic",
  },
  serviceInteriorBath: {
    src: "/images/stock/service-interior-bath.jpg",
    width: 1600,
    height: 1200,
    alt: "Remodeled bathroom with a walk-in glass shower and stone tile",
  },
  serviceInteriorLiving: {
    src: "/images/stock/service-interior-living.jpg",
    width: 1600,
    height: 1200,
    alt: "Open living room with built-in shelving and wide-plank floors",
  },
  serviceExteriorPatio: {
    src: "/images/stock/service-exterior-patio.jpg",
    width: 1600,
    height: 1200,
    alt: "Covered backyard patio with outdoor seating",
  },
  serviceFlippingStaged: {
    src: "/images/stock/service-flipping-staged.jpg",
    width: 1600,
    height: 1200,
    alt: "Freshly remodeled, staged living room ready for sale",
  },
  processPlans: {
    src: "/images/stock/process-plans.jpg",
    width: 2400,
    height: 1615,
    alt: "Floor plan drawings with drafting pencils, a ruler and a plan tube",
  },
  ctaBand: {
    src: "/images/stock/cta-band.jpg",
    width: 2400,
    height: 1600,
    alt: "Bright living room with a coffered ceiling, built-in shelves and a marble fireplace",
  },
} satisfies Record<string, ImageAsset>;

/** Card image per service (Home and /services); also the service page hero. */
export const serviceCardImages = {
  "interior-remodeling": stockImages.serviceInterior,
  "exterior-additions": stockImages.serviceExterior,
  "home-flipping": stockImages.serviceFlipping,
} as const;

/** Supporting images beside the "what we do" list on each service page. */
export const serviceDetailImages = {
  "interior-remodeling": [stockImages.serviceInteriorBath, stockImages.serviceInteriorLiving],
  "exterior-additions": [stockImages.serviceExteriorPatio],
  "home-flipping": [stockImages.serviceFlippingStaged],
} as const;
