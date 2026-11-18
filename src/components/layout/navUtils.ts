import type { NavLink } from "@/content/types";

/** True when `href` is the current page or one of its sub-pages (e.g. /services/…). */
function matches(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * True when `href` is the most specific link in `links` that matches the current page, so
 * /services/home-flipping highlights "Home Flipping" and not also "Remodeling" (/services).
 */
export function isActive(pathname: string, href: string, links: NavLink[]): boolean {
  let best: string | undefined;
  for (const link of links) {
    if (matches(pathname, link.href) && (!best || link.href.length > best.length)) best = link.href;
  }
  return best === href;
}
