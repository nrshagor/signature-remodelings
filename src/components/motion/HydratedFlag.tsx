"use client";

import { useEffect } from "react";

/**
 * Marks <html data-hydrated> once the app has hydrated. Until then, a CSS failsafe in
 * globals.css shows every reveal target after 3 s, so content never stays hidden if
 * JavaScript fails or is very slow. Render once, in the root layout.
 */
export function HydratedFlag() {
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "");
  }, []);
  return null;
}
