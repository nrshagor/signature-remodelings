import type { ReactNode } from "react";
import styles from "./Heading.module.css";

type Level = 1 | 2 | 3 | 4;
type Size = "display" | "h2" | "h3" | "h4";

interface HeadingProps {
  children: ReactNode;
  /** Semantic level (document outline). */
  level: Level;
  /** Visual size; defaults to the level's size (level 1 → display). */
  size?: Size;
  id?: string;
  className?: string;
  /** Word reveal on scroll (MotionEngine, ≥ 768px). Default: on for h2 section headings. */
  split?: boolean;
}

const defaultSize: Record<Level, Size> = { 1: "display", 2: "h2", 3: "h3", 4: "h4" };

/** Heading in the heading font. Level and visual size are separate, so the outline stays correct. */
export function Heading({ children, level, size, id, className, split = level === 2 }: HeadingProps) {
  const Tag = `h${level}` as const;
  const classes = [styles.heading, styles[size ?? defaultSize[level]], className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag id={id} className={classes} data-split={split ? "" : undefined}>
      {children}
    </Tag>
  );
}
