import type { ReactNode } from "react";
import styles from "./Section.module.css";

export type Tone = "paper" | "mist" | "ink";

interface SectionProps {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  /** id of the section's heading, for an accessible region name. */
  labelledBy?: string;
  /** Remove top padding (for a section that continues the one above). */
  flushTop?: boolean;
  className?: string;
}

/** Full-width band with vertical rhythm and a background tone. */
export function Section({ children, tone = "paper", id, labelledBy, flushTop, className }: SectionProps) {
  const classes = [styles.section, styles[tone], flushTop && styles.flushTop, className]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} aria-labelledby={labelledBy} className={classes} data-tone={tone}>
      {children}
    </section>
  );
}
