"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/content/site";
import { isActive } from "./navUtils";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  id: string;
  open: boolean;
  /** Must be stable (useCallback): it is an effect dependency. */
  onClose: () => void;
  /** The button that opened the menu; focus returns to it on close. */
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  pathname: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen menu below 900px. While open: focus is trapped inside, Esc closes it, page
 * scroll is locked, and it closes when the viewport grows to desktop width. Closed, it is
 * `visibility: hidden`, so its links are not focusable or announced.
 */
export function MobileMenu({ id, open, onClose, returnFocusRef, pathname }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;

    const returnTo = returnFocusRef.current;
    const openPath = window.location.pathname;

    // Scroll lock that also holds on iOS Safari: pin the body at the current offset.
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!panel.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 900px)");
    const onViewport = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewport);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewport);
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      // Closed by navigating to another page: the new page starts at the top and the
      // router handles focus. Otherwise restore the scroll position and the focus.
      if (window.location.pathname === openPath) {
        window.scrollTo(0, scrollY);
        returnTo?.focus();
      }
    };
  }, [open, onClose, returnFocusRef]);

  const { phone, email } = site.contact;

  return (
    <div
      id={id}
      ref={panelRef}
      className={[styles.menu, open && styles.open].filter(Boolean).join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <Container className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label={`${site.name} home`} onClick={onClose}>
          <Wordmark />
        </Link>
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
          <span className="visually-hidden">Close menu</span>
          <span className={styles.cross} aria-hidden="true" />
        </button>
      </Container>

      <Container className={styles.body}>
        <nav aria-label="Main">
          <ul role="list" className={styles.list}>
            {site.nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.link}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.cta}>
          <Button href={site.cta.href} block>
            {site.cta.label}
          </Button>
        </div>
        {(phone || email) && (
          <ul role="list" className={styles.contact}>
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
          </ul>
        )}
      </Container>
    </div>
  );
}
