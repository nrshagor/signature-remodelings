import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  children: ReactNode;
  /** Use on dark backgrounds. */
  onDark?: boolean;
  className?: string;
}

/** Small uppercase label with a short accent line before it. */
export function Eyebrow({ children, onDark, className }: EyebrowProps) {
  const classes = [styles.eyebrow, onDark && styles.onDark, className].filter(Boolean).join(" ");
  return <p className={classes}>{children}</p>;
}
