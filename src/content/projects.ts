import type { ContentStatus, ImageAsset } from "./types";

/** Same-angle before/after photos (company's own) for the slider. */
export interface BeforeAfterPair {
  before: ImageAsset;
  after: ImageAsset;
}

export interface Project {
  slug: "carrollton-balcony-addition" | "alba-home-flip";
  title: string;
  /** e.g. "Exterior addition". */
  type: string;
  /** City only, never a street address. */
  city: string;
  summary: string;
  /** Owner's goal. */
  goal?: string;
  /** Condition before the work. */
  startingPoint?: string;
  /** Paragraphs describing the work. */
  work?: string[];
  result?: string;
  /** Undefined until the client confirms; "in-progress" shows a label. */
  progress?: "completed" | "in-progress";
  cardImage?: ImageAsset;
  /** Company photos and drawings only. Renderings carry a "Design rendering" caption. */
  gallery: ImageAsset[];
  pairs: BeforeAfterPair[];
  status: ContentStatus;
}

function alba(file: string, width: number, height: number, alt: string): ImageAsset {
  return { src: `/images/projects/alba-home-flip/${file}`, width, height, alt };
}

export const projects: Project[] = [
  {
    slug: "carrollton-balcony-addition",
    title: "Balcony Addition",
    type: "Exterior addition",
    city: "Carrollton, TX",
    summary:
      "An existing home in Carrollton gains a new balcony, adding outdoor living space and a stronger front elevation.",
    goal: undefined,
    work: [
      "The new balcony ties into the existing structure and matches the home's materials and lines.",
    ],
    progress: undefined,
    gallery: [],
    pairs: [],
    status: "draft",
  },
  {
    slug: "alba-home-flip",
    title: "Full Home Flip",
    type: "Home flipping",
    city: "Alba, TX",
    summary: "An older house remodeled into a bright, move-in-ready home.",
    startingPoint: undefined,
    // [DRAFT] client to confirm.
    work: [
      "Inside, the house was refreshed from end to end: new wood-look flooring, a white-cabinet kitchen with stone-look countertops, tile backsplash and stainless appliances, updated bathrooms with new vanities and a tiled shower, new ceiling fans and fresh paint throughout. Outside, the front porch and exterior were cleaned up for a stronger first impression.",
    ],
    result: "A home ready for today's buyers.",
    progress: undefined,
    cardImage: alba("after-1.jpg", 1024, 682, "Front of the remodeled single-story house with a covered porch, light siding with grey trim and a wide lawn"),
    // Client photos (permission confirmed). No "before" photos exist, so no slider.
    gallery: [
      alba("gallery-1.jpg", 665, 441, "Kitchen with white shaker cabinets, a stone-look countertop peninsula, tile backsplash and a stainless range and microwave"),
      alba("gallery-2.jpg", 1024, 682, "Open-plan living area with wood-look flooring and a ceiling fan, opening into the white kitchen and a room with a staircase"),
      alba("gallery-3.jpg", 1024, 682, "Living room with wood-look flooring, a ceiling fan, bright windows and the tiled side of the kitchen peninsula"),
      alba("gallery-4.jpg", 1024, 682, "Room with wood-look flooring, a ceiling fan, tall windows and a staircase with dark treads"),
      alba("gallery-5.jpg", 665, 441, "Wide view of the kitchen with white cabinets, a stainless range, microwave and dishwasher, and wood-look flooring"),
      alba("gallery-6.jpg", 1024, 682, "Close-up of the stainless double sink, pull-down faucet and glossy tile backsplash"),
      alba("gallery-7.jpg", 665, 441, "Bathroom with a white vanity, stone-look top, oval mirror and glass light fixture"),
      alba("gallery-8.jpg", 1024, 682, "Shower with marble-look wall tile and a black-framed glass sliding door"),
      alba("gallery-9.jpg", 665, 441, "Close-up of a brushed-nickel faucet on the white vanity top"),
      alba("gallery-10.jpg", 665, 441, "Side and rear of the house with light siding, white trim and a lawn"),
      alba("gallery-11.jpg", 665, 441, "Large fenced yard with trees, the house in the distance"),
    ],
    pairs: [],
    status: "draft",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
