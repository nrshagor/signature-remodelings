import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

interface ContainerProps {
  children: ReactNode;
  /** Narrow column for long text (≈ 760px). */
  narrow?: boolean;
  as?: ElementType;
  className?: string;
}

/** Centred content column with the responsive side gutter. */
export function Container({ children, narrow, as: Tag = "div", className }: ContainerProps) {
  const classes = [styles.container, narrow && styles.narrow, className].filter(Boolean).join(" ");
  return <Tag className={classes}>{children}</Tag>;
}
