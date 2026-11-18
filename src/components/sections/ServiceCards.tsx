import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { ImageAsset } from "@/content/types";
import styles from "./ServiceCards.module.css";

export interface ServiceCardItem {
  slug: string;
  title: string;
  summary: string;
  image?: ImageAsset;
}

interface ServiceCardsProps {
  eyebrow?: string;
  /** Section heading (h2). Leave out under a page h1 (/services): card titles become h2. */
  heading?: string;
  linkLabel: string;
  items: ServiceCardItem[];
  /** Remove top padding when the section follows a page hero. */
  flushTop?: boolean;
}

/** Three service cards (4:5 images) linking to the service pages. */
export function ServiceCards({ eyebrow, heading, linkLabel, items, flushTop }: ServiceCardsProps) {
  return (
    <Section labelledBy={heading ? "services-heading" : undefined} flushTop={flushTop}>
      <Container>
        {heading && (
          <Reveal className={styles.head}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Heading level={2} id="services-heading">
              {heading}
            </Heading>
          </Reveal>
        )}
        <Reveal group as="ul" role="list" className={styles.grid}>
          {items.map((item) => (
            <li key={item.slug} className={styles.item}>
              <Card
                title={item.title}
                level={heading ? 3 : 2}
                href={`/services/${item.slug}`}
                image={item.image}
                ratio="4/5"
                sizes="(min-width: 900px) 33vw, (min-width: 640px) 50vw, 100vw"
                text={item.summary}
                linkLabel={linkLabel}
              />
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
