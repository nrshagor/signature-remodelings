import type { ContentStatus, ImageAsset, NavLink } from "./types";

export interface SiteContact {
  phone?: string;
  email?: string;
  /** Business address; the client may prefer none. Never a project address. */
  address?: string;
  hours?: string;
}

export interface Site {
  name: string;
  nameStatus: ContentStatus;
  /** Company legal name (privacy policy, footer, JSON-LD). */
  legalName?: string;
  /** Absolute site URL without a trailing slash. */
  url: string;
  tagline?: string;
  taglineStatus: ContentStatus;
  /** One line for the footer and default meta description. */
  description: string;
  /** e.g. "Serving homeowners and property investors across North Texas." */
  serviceAreaLine?: string;
  /** Confirmed cities/counties served. */
  serviceArea?: string[];
  contact: SiteContact;
  /** SVG/PNG logo once the client provides one; until then the text wordmark is used. */
  logo?: ImageAsset;
  socials: NavLink[];
  nav: NavLink[];
  cta: NavLink;
  /** Footer "Company" column. */
  companyLinks: NavLink[];
  /** True once /privacy-policy exists (T2.11); until then it is hidden everywhere. */
  hasPrivacyPolicy: boolean;
  /** Routes whose page starts with a full-bleed hero: the header is transparent there. */
  overlayRoutes: string[];
}

const fallbackUrl = "https://signatureremodelings.com";

export const site: Site = {
  name: "Signature Remodelings",
  nameStatus: "draft", // singular or plural to confirm
  legalName: undefined,
  url: (process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl).replace(/\/+$/, ""),
  tagline: "Remodeling, signed with care.",
  taglineStatus: "draft",
  description: "Interior remodeling, exterior additions and home flipping in Texas.",
  serviceAreaLine: "Serving homeowners and property investors across North Texas.",
  serviceArea: undefined,
  contact: {
    phone: undefined,
    email: undefined,
    address: undefined,
    hours: undefined,
  },
  logo: undefined,
  socials: [],
  nav: [
    // Remodeling first, home flipping second (client feedback 2026-11-18).
    { label: "Remodeling", href: "/services" },
    { label: "Home Flipping", href: "/services/home-flipping" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
  ],
  cta: { label: "Book a Consultation", href: "/contact" },
  companyLinks: [
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  hasPrivacyPolicy: false,
  overlayRoutes: ["/"],
};
