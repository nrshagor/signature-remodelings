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
    work: undefined,
    result: "A home ready for today's buyers.",
    progress: undefined,
    gallery: [],
    pairs: [],
    status: "draft",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
