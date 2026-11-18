import Image from "next/image";
import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { ImageAsset } from "@/content/types";
import styles from "./ServiceBento.module.css";

export interface ServiceCardItem {
  slug: string;
  title: string;
  summary: string;
  image?: ImageAsset;
}

interface ServiceBentoProps {
  eyebrow?: string;
  /** Section heading (h2). Leave out under a page h1 (/services): tile titles become h2. */
  heading?: string;
  linkLabel: string;
  /** [large feature tile, second tile]: Interior, then Exterior. */
  tiles: [ServiceCardItem, ServiceCardItem];
  listHeading: string;
  /** Short item names shown as chips in the light tile. */
  listItems: string[];
  flushTop?: boolean;
}

/**
 * Remodeling services as a bento grid: one large feature tile, one wide tile and a light
 * tile listing what we remodel. Desktop 12 columns (7 / 5 + 5), tablet 2 columns, mobile
 * stacked. Each image tile is a single link.
 */
export function ServiceBento({
  eyebrow,
  heading,
  linkLabel,
  tiles,
  listHeading,
  listItems,
  flushTop,
}: ServiceBentoProps) {
  const level = heading ? 3 : 2;
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
          {tiles.map((tile, i) => (
            <li key={tile.slug} className={i === 0 ? styles.feature : styles.wide}>
              <ServiceTile tile={tile} level={level} linkLabel={linkLabel} large={i === 0} />
            </li>
          ))}
          {listItems.length > 0 && (
            <li className={styles.listTile}>
              <Heading level={level} size="h4">
                {listHeading}
              </Heading>
              <ul role="list" className={styles.chips}>
                {listItems.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          )}
        </Reveal>
      </Container>
    </Section>
  );
}

function ServiceTile({
  tile,
  level,
  linkLabel,
  large,
}: {
  tile: ServiceCardItem;
  level: 2 | 3;
  linkLabel: string;
  large: boolean;
}) {
  const Title = `h${level}` as const;
  return (
    <article className={styles.tile} data-zoom-parent="">
      <div className={tile.image ? styles.media : `${styles.media} ${styles.noImage}`}>
        {tile.image && (
          <Image
            src={tile.image.src}
            alt=""
            fill
            sizes={large ? "(min-width: 900px) 58vw, 100vw" : "(min-width: 900px) 42vw, (min-width: 640px) 50vw, 100vw"}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.body}>
        <Title className={large ? styles.titleLarge : styles.title}>
          <Link href={`/services/${tile.slug}`} className={styles.link}>
            {tile.title}
          </Link>
        </Title>
        <p className={styles.text}>{tile.summary}</p>
        <p className={styles.more} aria-hidden="true">
          {linkLabel}
          <span className={styles.circle}>
            <span className={styles.arrow}>→</span>
          </span>
        </p>
      </div>
    </article>
  );
}
