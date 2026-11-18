import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import styles from "./Values.module.css";

interface ValuesProps {
  heading: string;
  values: string[];
}

/** Large numbered list of the company's values (About). */
export function Values({ heading, values }: ValuesProps) {
  if (values.length === 0) return null;
  return (
    <Section labelledBy="values-heading" flushTop>
      <Container>
        <Reveal className={styles.head}>
          <Heading level={2} id="values-heading">
            {heading}
          </Heading>
        </Reveal>
        <Reveal group as="ul" role="list" className={styles.list}>
          {values.map((value, i) => (
            <li key={value} className={styles.item}>
              <span className={styles.number} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.value}>{value}</span>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
