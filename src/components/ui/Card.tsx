import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import type { ImageAsset } from "@/content/types";
import { GlassLabels } from "./GlassLabel";
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
  /** Labels on the image, e.g. ["Carrollton, TX", "Exterior addition"]. */
  labels?: string[];
  /** Status chip, e.g. "In progress". */
  badge?: string;
  text?: string;
  /** Visible link text, e.g. "Explore". */
  linkLabel?: string;
}

/** Height ÷ width of the image area, so the photo-less card keeps the same size. */
const ratioPadding: Record<Ratio, string> = {
  "4/5": "125%",
  "3/2": "66.6667%",
  "16/10": "62.5%",
  "16/9": "56.25%",
  "1/1": "100%",
};

/**
 * Project card. With a photo: white card with an inset image. Without one: a designed
 * navy card of the same size (blueprint pattern where the photo would be), so a project
 * without photos never looks empty. The title link is stretched over the whole card (one
 * link per card). Hover (pointer devices only): lift, shadow, image zoom, arrow slide.
 */
export function Card({
  title,
  level = 3,
  href,
  image,
  ratio = "4/5",
  sizes,
  labels,
  badge,
  text,
  linkLabel,
}: CardProps) {
  const Title = `h${level}` as const;
  const dark = !image;
  return (
    <article className={dark ? `${styles.card} ${styles.dark}` : styles.card} data-zoom-parent="">
      {image ? (
        <ImageFrame
          image={image}
          ratio={ratio}
          sizes={sizes}
          labels={labels}
          zoomOnHover
          className={styles.media}
        />
      ) : (
        <div className={styles.panel} style={{ paddingTop: ratioPadding[ratio] }}>
          <div className={styles.pattern} aria-hidden="true" />
          {labels && <GlassLabels items={labels} />}
          {badge && <span className={styles.badge}>{badge}</span>}
        </div>
      )}
      <div className={styles.body}>
        {image && badge && <span className={`${styles.badge} ${styles.badgeInline}`}>{badge}</span>}
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
