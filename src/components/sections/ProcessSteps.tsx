import { ProcessAnimator } from "@/components/motion/ProcessAnimator";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { ProcessStep } from "@/content/pages";
import styles from "./ProcessSteps.module.css";

interface ProcessStepsProps {
  heading: string;
  steps: ProcessStep[];
  /** "short" on Home, "detail" on About. */
  variant?: "short" | "detail";
  /** GSAP sequence (steps and line draw in on scroll) instead of the CSS reveal. About only. */
  animated?: boolean;
}

/**
 * Four numbered steps with a thin connecting line. Home: CSS reveal. About: `animated`,
 * the GSAP scroll sequence (loaded on demand, skipped with reduced motion).
 */
export function ProcessSteps({ heading, steps, variant = "short", animated }: ProcessStepsProps) {
  const items = steps.map((step, i) => (
    <li key={step.title} className={styles.step} data-process-step="">
      <span className={styles.number} aria-hidden="true">
        {String(i + 1).padStart(2, "0")}
      </span>
      <h3 className={styles.title}>{step.title}</h3>
      <p className={styles.text}>{variant === "detail" ? step.detail : step.short}</p>
    </li>
  ));

  return (
    <Section tone="stone" labelledBy="process-heading">
      <Container>
        <Reveal className={styles.head}>
          <Heading level={2} id="process-heading">
            {heading}
          </Heading>
        </Reveal>
        {animated ? (
          <ProcessAnimator className={styles.steps}>{items}</ProcessAnimator>
        ) : (
          <Reveal group as="ol" className={styles.steps}>
            {items}
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
