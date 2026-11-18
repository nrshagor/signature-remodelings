"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/*
 * One IntersectionObserver for every Reveal on the page. Threshold 0 with a bottom margin
 * (instead of a ratio threshold) so blocks taller than the viewport still trigger.
 */
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer?.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
  }
  return observer;
}

interface RevealProps {
  children: ReactNode;
  /** Reveal the direct children one after another (80 ms apart) instead of the element. */
  group?: boolean;
  /** Extra delay in ms before this element reveals (single elements only). */
  delay?: number;
  /** Image mask-wipe from the bottom instead of the fade (globals.css → Mask reveal). */
  mask?: boolean;
  as?: ElementType;
  className?: string;
  /** Pass-through for list semantics, e.g. role="list" on a <ul>. */
  role?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
}

/**
 * Fades and slides content in once when it scrolls into view. The hidden start state is
 * pure CSS behind `html.js` (see globals.css → Reveal), so without JavaScript or
 * IntersectionObserver, and with reduced motion, content is simply visible.
 */
export function Reveal({
  children,
  group,
  delay,
  mask,
  as: Tag = "div",
  className,
  role,
  style: styleProp,
  "aria-hidden": ariaHidden,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.setAttribute("data-revealed", "");
      return;
    }
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  const style: CSSProperties | undefined =
    delay && !group ? { ...styleProp, transitionDelay: `${delay}ms` } : styleProp;
  const attrs = group
    ? { "data-reveal-group": "" }
    : mask
      ? { "data-mask": "" }
      : { "data-reveal": "" };

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      role={role}
      aria-hidden={ariaHidden}
      {...attrs}
    >
      {children}
    </Tag>
  );
}
