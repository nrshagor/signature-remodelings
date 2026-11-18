import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import styles from "./ProjectSections.module.css";

export interface ProjectFact {
  label: string;
  value: string;
}

export interface ProjectTextBlock {
  heading: string;
  paragraphs: string[];
}

interface ProjectSectionsProps {
  facts: ProjectFact[];
  blocks: ProjectTextBlock[];
}

/**
 * Facts row (city, type, status) and the story blocks (goal, starting point, work,
 * result). Callers pass only blocks that have content, so nothing empty is rendered.
 */
export function ProjectSections({ facts, blocks }: ProjectSectionsProps) {
  return (
    <Section tone="stone">
      <Container>
        <Reveal as="dl" className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt className={styles.factLabel}>{fact.label}</dt>
              <dd className={styles.factValue}>{fact.value}</dd>
            </div>
          ))}
        </Reveal>
        {blocks.map((block, i) => (
          <Reveal key={block.heading} className={styles.block}>
            <Heading level={2} size="h3" id={`project-block-${i}`} className={styles.blockHeading}>
              {block.heading}
            </Heading>
            <div className={styles.blockBody}>
              {block.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        ))}
      </Container>
    </Section>
  );
}
