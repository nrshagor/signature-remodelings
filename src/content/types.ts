/**
 * Shared content types. Copy lives in src/content/*; components never hard-code it.
 * Facts the client has not confirmed are optional and left undefined: components
 * render nothing for them.
 */

/** "draft": written from the brief, fine in preview, needs client approval before launch. */
export type ContentStatus = "confirmed" | "draft";

export interface NavLink {
  label: string;
  href: string;
}

export interface ImageAsset {
  /** Path under /public, e.g. "/images/projects/alba/kitchen-after.jpg". */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Visible caption. AI renderings must say "Design rendering". */
  caption?: string;
}

export interface CallToAction {
  heading: string;
  text?: string;
  button: NavLink;
}
