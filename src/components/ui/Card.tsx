import Link from "next/link";
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
  /** Small line above the title, e.g. "Carrollton, TX · Exterior addition". */
  meta?: string;
  text?: string;
  /** Visible link text, e.g. "Explore". */
  linkLabel?: string;
}

/**
 * Image card. The title link is stretched over the whole card, so each card has a
 * single link for keyboard and screen-reader users.
 */
export function Card({
  title,
  level = 3,
  href,
  image,
  ratio = "4/5",
  sizes,
  meta,
  text,
  linkLabel,
}: CardProps) {
  const Title = `h${level}` as const;
  return (
    <article className={styles.card} data-zoom-parent="">
      <ImageFrame image={image} ratio={ratio} sizes={sizes} zoomOnHover />
      <div className={styles.body}>
        {meta && <p className={styles.meta}>{meta}</p>}
        <Title className={styles.title}>
          <Link href={href} className={styles.link}>
            {title}
          </Link>
        </Title>
        {text && <p className={styles.text}>{text}</p>}
        {linkLabel && (
          <p className={styles.more} aria-hidden="true">
            {linkLabel} <span className={styles.arrow}>→</span>
          </p>
        )}
      </div>
    </article>
  );
}
