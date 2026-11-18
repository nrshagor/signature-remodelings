import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import type { ImageAsset } from "@/content/types";
import { ImageFrame, type Ratio } from "./ImageFrame";
import styles from "./Card.module.css";

interface CardProps {
  title: string;
  /** Heading level of the title, to fit the page outline. */
  level?: 2 | 3;
  href: string;
  image?: ImageAsset;
  ratio?: Ratio;
  sizes: string;
  /** Glass labels on the image, e.g. ["Carrollton, TX", "Exterior addition"]. */
  labels?: string[];
  text?: string;
  /** Visible link text, e.g. "Explore". */
  linkLabel?: string;
}

/**
 * White card with an inset image. The title link is stretched over the whole card, so
 * each card has a single link for keyboard and screen-reader users. Hover (pointer
 * devices only): lift, shadow, image zoom, arrow slide (Card.module.css).
 */
export function Card({
  title,
  level = 3,
  href,
  image,
  ratio = "4/5",
  sizes,
  labels,
  text,
  linkLabel,
}: CardProps) {
  const Title = `h${level}` as const;
  return (
    <article className={styles.card} data-zoom-parent="">
      <ImageFrame
        image={image}
        ratio={ratio}
        sizes={sizes}
        labels={labels}
        zoomOnHover
        className={styles.media}
      />
      <div className={styles.body}>
        <Title className={styles.title}>
          <Link href={href} className={styles.link}>
            {title}
          </Link>
        </Title>
        {text && <p className={styles.text}>{text}</p>}
        {linkLabel && (
          <p className={styles.more} aria-hidden="true">
            {linkLabel}
            <span className={styles.circle}>
              <span className={styles.arrow}>→</span>
            </span>
          </p>
        )}
      </div>
    </article>
  );
}
