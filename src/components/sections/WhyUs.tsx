import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Section } from "@/components/ui/Section";
import type { ImageAsset } from "@/content/types";
import styles from "./WhyUs.module.css";

interface WhyUsProps {
  heading: string;
  items: { title: string; text: string }[];
  image?: ImageAsset;
}

/** "Why Signature": four short promises beside an image (7/5 split on desktop). */
export function WhyUs({ heading, items, image }: WhyUsProps) {
  return (
    <Section tone="stone" labelledBy="why-heading">
      <Container className={styles.layout}>
        <div className={styles.text}>
          <Reveal>
            <Heading level={2} id="why-heading">
              {heading}
            </Heading>
          </Reveal>
          <Reveal group as="ul" role="list" className={styles.list}>
            {items.map((item) => (
              <li key={item.title} className={styles.item}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.body}>{item.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
        <Reveal className={styles.media} delay={150}>
          <ImageFrame image={image} ratio="4/5" sizes="(min-width: 900px) 40vw, 100vw" />
        </Reveal>
      </Container>
    </Section>
  );
}
