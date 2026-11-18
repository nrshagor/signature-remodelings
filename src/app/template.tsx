"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./template.module.css";

/** True once the first page has hydrated: later templates are client navigations. */
let hydrated = false;

/**
 * Page enter transition (docs/04-DESIGN.md → Motion): on every client navigation the new
 * page's content fades in and rises 16px (CSS, 500 ms). Skipped on the very first load,
 * which has its own hero entrance and must not delay the first paint.
 */
export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => hydrated);
  useEffect(() => {
    hydrated = true;
  }, []);
  return <div className={animate ? styles.enter : undefined}>{children}</div>;
}
