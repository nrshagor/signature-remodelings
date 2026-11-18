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
}

/**
 * Four numbered steps with a thin connecting line. Static with CSS reveals here; the
 * GSAP scroll version lives on the About page (T2.6).
 */
export function ProcessSteps({ heading, steps, variant = "short" }: ProcessStepsProps) {
  return (
    <Section tone="stone" labelledBy="process-heading">
      <Container>
        <Reveal className={styles.head}>
          <Heading level={2} id="process-heading">
            {heading}
          </Heading>
        </Reveal>
        <Reveal group as="ol" className={styles.steps}>
          {steps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{variant === "detail" ? step.detail : step.short}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
