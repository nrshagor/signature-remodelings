"use client";

import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import { isActive } from "./navUtils";
import styles from "./Header.module.css";

const MENU_ID = "mobile-menu";

/**
 * Site header. Always `position: fixed` with a constant height, so scrolling never shifts
 * the layout. On routes in `site.overlayRoutes` it starts transparent over the hero and
 * turns solid after a few pixels of scroll; elsewhere it is solid and a spacer of the
 * same height keeps the page content below it.
 */
export function Header() {
  const pathname = usePathname();
  const overlay = site.overlayRoutes.includes(pathname);
  const [scrolled, setScrolled] = useState(false);
  // The menu is open while this matches the current path, so it closes on navigation.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

  const openMenu = useCallback(() => setMenuPath(pathname), [pathname]);
  const closeMenu = useCallback(() => setMenuPath(null), []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const transparent = overlay && !scrolled;
  const headerClass = [
    styles.header,
    transparent ? styles.transparent : styles.solid,
    scrolled && styles.scrolled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClass}>
        <Container className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label={`${site.name} home`}>
            <Wordmark onDark={transparent} />
          </Link>

          <nav aria-label="Main" className={styles.nav}>
            <ul role="list" className={styles.links}>
              {site.nav.map((link) => (
                <li key={link.href} className={styles.item}>
                  <Link
                    href={link.href}
                    className={styles.link}
                    aria-current={isActive(pathname, link.href, site.nav) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button href={site.cta.href} onDark={transparent}>
              {site.cta.label}
            </Button>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={openMenu}
          >
            <span className="visually-hidden">Open menu</span>
            <span className={styles.bars} aria-hidden="true" />
          </button>
        </Container>
      </header>
      {!overlay && <div className={styles.spacer} aria-hidden="true" />}
      <MobileMenu
        id={MENU_ID}
        open={menuOpen}
        onClose={closeMenu}
        returnFocusRef={toggleRef}
        pathname={pathname}
      />
    </>
  );
}
