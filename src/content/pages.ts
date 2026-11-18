import type { CallToAction } from "./types";

/**
 * Page copy that isn't a service, project, FAQ or SEO entry (docs/03-CONTENT.md).
 * Everything here is draft until the client approves it.
 */

const consultation = { label: "Book a Consultation", href: "/contact" };

/** Closing CTA used on Home, /services and /about. */
export const closingCta: CallToAction = {
  heading: "Ready to see what your home could become?",
  text: "Tell us about your project. We'll walk you through ideas, options and next steps.",
  button: consultation,
};

export const home = {
  hero: {
    headline: "Remodeling that raises the standard of your home.",
    sub: "Kitchens, bathrooms, balconies and full-home transformations for homeowners who care about every detail.",
    primary: consultation,
    secondary: { label: "See Our Work", href: "/projects" },
  },
  // Moving strip under the hero (user, 2026-11-18). [DRAFT, new]
  marquee: ["Kitchens", "Bathrooms", "Living Spaces", "Balconies", "Patios", "Second Floors"],
  // Remodeling first: Interior + Exterior only; home flipping is the investors band below.
  services: {
    eyebrow: "Remodeling", // [DRAFT, new]
    heading: "Remodeling, inside and out.", // [DRAFT, new]
    linkLabel: "Explore",
    listHeading: "What we remodel",
  },
  // Heading and text come from the Home Flipping service (services.ts).
  investors: {
    eyebrow: "For investors", // [DRAFT, new]
    link: { label: "Explore home flipping", href: "/services/home-flipping" }, // [DRAFT, new]
  },
  // Every promise needs client approval before launch.
  whyUs: {
    heading: "Built around your home, not a template.",
    items: [
      {
        title: "Design first",
        text: "You see the plan before work begins, so there are no surprises on site.",
      },
      {
        title: "One point of contact",
        text: "One team manages your project from first visit to final walkthrough.",
      },
      {
        title: "Detail-driven finish",
        text: "Materials, trims and transitions are chosen to look right for years, not just on handover day.",
      },
      {
        title: "Clear communication",
        text: "Regular updates, honest timelines and straight answers.",
      },
    ],
  },
  featured: {
    heading: "Recent work",
    linkLabel: "View project",
    items: [
      {
        slug: "carrollton-balcony-addition",
        text: "An existing home gains a new balcony, adding outdoor living space and a stronger front elevation.",
      },
      {
        slug: "alba-home-flip",
        text: "A dated house remodeled inside and out, ready for today's buyers.",
      },
    ],
  },
  process: {
    heading: "How we work",
  },
};

export interface ProcessStep {
  title: string;
  /** Short line (Home). */
  short: string;
  /** Longer line (About). */
  detail: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: "Consult",
    short: "We visit, listen and understand your goals.",
    detail: "A visit to your home to understand goals, budget range and timing.",
  },
  {
    title: "Design",
    short: "You get a clear plan and scope.",
    detail: "A clear plan and scope before any work starts.",
  },
  {
    title: "Build",
    short: "Our team remodels with care for your home.",
    detail: "Organized, respectful work with regular updates.",
  },
  {
    title: "Reveal",
    short: "A final walkthrough to make sure it's right.",
    detail: "A final walkthrough together.",
  },
];

export const servicesIndex = {
  headline: "Remodeling services",
  intro: "We focus on three kinds of work, so every project gets our full attention.",
};

/** Labels on the service detail pages. */
export const servicePage = {
  whoForHeading: "Who it's for",
  featuredHeading: "Featured project",
  featuredLinkLabel: "View project",
};

export const projectsIndex = {
  headline: "Our work",
  intro:
    "Every project starts with an existing home and a clear goal. Here's what we've built.",
  linkLabel: "View project",
};

/** Labels on the project detail pages (docs/03-CONTENT.md → Projects). */
export const projectPage = {
  facts: { city: "City", type: "Type", status: "Status" },
  progressLabels: { completed: "Completed", "in-progress": "In progress" },
  goalHeading: "The goal",
  startingPointHeading: "Starting point",
  workHeading: "The work",
  resultHeading: "The result",
  beforeAfterHeading: "Before and after",
  galleryHeading: "Gallery",
  /** Gallery title while the project is in progress (renderings and drawings). */
  galleryHeadingInProgress: "Design rendering",
};

/** Before/after slider labels. */
export const beforeAfter = {
  before: "Before",
  after: "After",
  sliderLabel: "Before and after comparison",
};

export interface Founder {
  name: string;
  background: string;
}

export const about = {
  headline: "A new company built on an old-fashioned standard.",
  body: [
    "Signature Remodelings was founded to do remodeling the careful way: listen first, plan clearly, and finish every detail as if it were our own home. We focus on three things — interior remodels, exterior additions and home flips — so every project gets our full attention.",
  ],
  /** Hidden until the client provides name, photo and background. */
  founder: undefined as Founder | undefined,
  valuesHeading: "What we stand for", // [DRAFT, new]
  values: ["Craftsmanship", "Honesty", "Respect for your home", "Clear communication"],
  processHeading: "How we work",
};

export const faqPage = {
  headline: "Questions, answered.", // [DRAFT, new]
  intro: "Straight answers about how we work. Don't see your question? Ask us directly.", // [DRAFT, new]
};

export const contact = {
  headline: "Let's talk about your home.",
  text: "Share a few details and we'll get back to you to schedule a consultation.",
  submitLabel: "Request a Consultation",
  consent: "By sending this form you agree to be contacted about your project.",
  success: "Thank you — we've received your request and will contact you soon.",
  error: "Something went wrong and your message wasn't sent. Please try again in a moment.",
  /** Shown until contact delivery exists (T2.9). [DRAFT] */
  unavailable: "Online requests are opening soon. Your message was not sent yet.",
  /** Above the form when fields need fixing. [DRAFT, new] */
  invalid: "Please check the highlighted fields.",
  /** Field labels (03-CONTENT → Contact). */
  labels: {
    name: "Full name",
    phone: "Phone",
    email: "Email",
    location: "Property city or ZIP",
    projectType: "Project type",
    budget: "Budget range",
    timeline: "Timeline",
    message: "Message",
    optional: "optional",
    choose: "Choose one",
  },
  /** Field error messages. [DRAFT, new] */
  errors: {
    name: "Please enter your full name.",
    phone: "Please enter a phone number with at least 10 digits.",
    email: "Please enter a valid email address.",
    location: "Please enter the city or ZIP code of the property.",
    projectType: "Please choose a project type.",
    budget: "Please choose a budget range from the list.",
    timeline: "Please choose a timeline from the list.",
    message: "Please write between 20 and 2,000 characters.",
  },
  sendingLabel: "Sending…",
  /** Side panel labels; the panel shows only details the client has confirmed. */
  panel: {
    label: "Contact details",
    phone: "Phone",
    email: "Email",
    hours: "Hours",
    serviceArea: "Service area",
  },
  projectTypes: ["Interior remodeling", "Exterior & additions", "Home flipping", "Other"],
  /** Hidden until the client provides ranges. */
  budgetRanges: undefined as string[] | undefined,
  timelines: ["As soon as possible", "1–3 months", "3–6 months", "Just exploring"],
  messageMin: 20,
  messageMax: 2000,
};

export const notFound = {
  heading: "This page has moved or doesn't exist.",
  primary: { label: "Back to home", href: "/" },
  secondary: { label: "See our projects", href: "/projects" },
};
