import type { CallToAction, ContentStatus, ImageAsset } from "./types";

export interface ServiceItem {
  title: string;
  detail?: string;
}

export interface Service {
  slug: "interior-remodeling" | "exterior-additions" | "home-flipping";
  title: string;
  /** One line for service cards (Home, /services). */
  cardSummary: string;
  cardImage?: ImageAsset;
  headline: string;
  intro: string;
  itemsHeading: string;
  items: ServiceItem[];
  /** Shown as a numbered list instead of plain items (Home Flipping). */
  itemsOrdered?: boolean;
  whoFor: string;
  featuredProjectSlug?: string;
  cta: CallToAction;
  status: ContentStatus;
}

const consultation = { label: "Book a Consultation", href: "/contact" };

export const services: Service[] = [
  {
    slug: "interior-remodeling",
    title: "Interior Remodeling",
    cardSummary: "Kitchens, bathrooms and living spaces redesigned for the way you live today.",
    headline: "Interiors redesigned around the way you live.",
    intro:
      "Your kitchen and bathrooms work harder than any other rooms in the house. We remodel them to look refined, feel open and function smoothly every day.",
    itemsHeading: "What we remodel",
    // Item list awaits client confirmation: remove anything they don't do.
    items: [
      { title: "Kitchens", detail: "layouts, cabinetry, countertops, islands, lighting" },
      { title: "Bathrooms", detail: "showers, tubs, vanities, tile, fixtures" },
      { title: "Living spaces", detail: "flooring, open-plan changes, built-ins, finishes" },
    ],
    whoFor: "Homeowners who want a lasting upgrade, not a quick cosmetic fix.",
    cta: { heading: "Planning a kitchen or bath remodel?", button: consultation },
    status: "draft",
  },
  {
    slug: "exterior-additions",
    title: "Exterior & Additions",
    cardSummary:
      "Balconies, patios and second-floor rooms that give you more space without leaving the home you love.",
    headline: "More space, without leaving the home you love.",
    intro:
      "Sometimes the best move is not moving. We add balconies, patios and second-floor rooms that fit your home's structure and style, so the addition looks like it was always there.",
    itemsHeading: "What we build",
    items: [
      { title: "Balconies" },
      { title: "Covered and open patios" },
      { title: "Second-floor room additions" },
      { title: "Exterior updates that refresh the look of the home" },
    ],
    whoFor:
      "Families who need more room, and owners who want to add living space and curb appeal.",
    featuredProjectSlug: "carrollton-balcony-addition",
    cta: {
      heading: "Thinking about adding space?",
      text: "Let's look at what your home can support.",
      button: consultation,
    },
    status: "draft",
  },
  {
    slug: "home-flipping",
    title: "Home Flipping",
    cardSummary:
      "We take dated houses and turn them into polished, market-ready homes for investors.",
    headline: "From dated to market-ready.",
    intro:
      "We take older houses and remodel them into clean, modern homes that today's buyers want. For investors, that means a property positioned to sell at a stronger price.",
    itemsHeading: "How it works",
    itemsOrdered: true,
    items: [
      { title: "Evaluate the property and its potential" },
      { title: "Plan a remodel scope that fits the target market" },
      { title: "Remodel inside and out" },
      { title: "Hand over a home ready for listing" },
    ],
    whoFor: "Real estate investors and owners of older properties.",
    featuredProjectSlug: "alba-home-flip",
    cta: {
      heading: "Have a property with potential?",
      text: "Let's talk scope and timeline.",
      button: consultation,
    },
    status: "draft",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
