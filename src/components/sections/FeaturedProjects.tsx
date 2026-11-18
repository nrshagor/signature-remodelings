import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { ImageAsset } from "@/content/types";
import styles from "./FeaturedProjects.module.css";

export interface FeaturedProjectItem {
  slug: string;
  title: string;
  /** City and type, e.g. "Carrollton, TX · Exterior addition". City only, never an address. */
  meta: string;
  text: string;
  /** Company photo only. */
  image?: ImageAsset;
}

interface FeaturedProjectsProps {
  heading: string;
  linkLabel: string;
  items: FeaturedProjectItem[];
}

/** Project cards (3:2), two side by side on desktop. */
export function FeaturedProjects({ heading, linkLabel, items }: FeaturedProjectsProps) {
  return (
    <Section labelledBy="projects-heading">
      <Container>
        <Reveal className={styles.head}>
          <Heading level={2} id="projects-heading">
            {heading}
          </Heading>
        </Reveal>
        <Reveal group as="ul" role="list" className={styles.grid}>
          {items.map((item) => (
            <li key={item.slug} className={styles.item}>
              <Card
                title={item.title}
                href={`/projects/${item.slug}`}
                image={item.image}
                ratio="3/2"
                sizes="(min-width: 900px) 50vw, 100vw"
                meta={item.meta}
                text={item.text}
                linkLabel={linkLabel}
              />
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
