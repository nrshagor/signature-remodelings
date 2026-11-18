/** True when `href` is the current page or one of its sub-pages (e.g. /services/…). */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
