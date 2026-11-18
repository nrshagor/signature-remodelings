import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section, type Tone } from "@/components/ui/Section";
import type { ImageAsset } from "@/content/types";
import styles from "./FeaturedProjects.module.css";

export interface FeaturedProjectItem {
  slug: string;
  title: string;
  /** City and type, e.g. ["Carrollton, TX", "Exterior addition"]. City only, never an address. */
  labels: string[];
  text: string;
  /** Company photo only. */
  image?: ImageAsset;
}

interface FeaturedProjectsProps {
  /** Section heading (h2). Leave out under a page h1 (/projects): card titles become h2. */
  heading?: string;
  linkLabel: string;
  items: FeaturedProjectItem[];
  tone?: Tone;
  flushTop?: boolean;
}

/** Project cards (3:2), two side by side on desktop. */
export function FeaturedProjects({
  heading,
  linkLabel,
  items,
  tone,
  flushTop,
}: FeaturedProjectsProps) {
  if (items.length === 0) return null;
  return (
    <Section tone={tone} labelledBy={heading ? "projects-heading" : undefined} flushTop={flushTop}>
      <Container>
        {heading && (
          <Reveal className={styles.head}>
            <Heading level={2} id="projects-heading">
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
                href={`/projects/${item.slug}`}
                image={item.image}
                ratio="3/2"
                sizes="(min-width: 900px) 50vw, 100vw"
                labels={item.labels}
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
