import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import styles from "./StatusPage.module.css";

interface StatusPageProps {
  /** Small label above the heading, e.g. "404". */
  label: string;
  heading: string;
  text?: string;
  /** Buttons or links. */
  children: ReactNode;
}

/** Centered message for the 404 and error pages. */
export function StatusPage({ label, heading, text, children }: StatusPageProps) {
  return (
    <section className={styles.page} aria-labelledby="status-heading">
      <Container className={styles.inner}>
        <Eyebrow>{label}</Eyebrow>
        <Heading level={1} id="status-heading" className={styles.heading}>
          {heading}
        </Heading>
        {text && <p className={styles.text}>{text}</p>}
        <div className={styles.actions}>{children}</div>
      </Container>
    </section>
  );
}
