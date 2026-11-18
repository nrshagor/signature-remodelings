import Image from "next/image";
import { site } from "@/content/site";
import styles from "./Wordmark.module.css";

interface WordmarkProps {
  /** White text, for the transparent header over the hero and dark sections. */
  onDark?: boolean;
  className?: string;
}

/**
 * Brand mark. Until the client sends a logo (site.logo), a text wordmark: the first word
 * of the brand name in uppercase sans, the rest in the heading font below it.
 */
export function Wordmark({ onDark, className }: WordmarkProps) {
  const classes = [styles.wordmark, onDark && styles.onDark, className].filter(Boolean).join(" ");

  if (site.logo) {
    return (
      <span className={classes}>
        <Image
          src={site.logo.src}
          alt={site.logo.alt}
          width={site.logo.width}
          height={site.logo.height}
          className={styles.logo}
        />
      </span>
    );
  }

  const [first, ...rest] = site.name.split(" ");
  return (
    <span className={classes}>
      <span className={styles.top}>{first}</span>
      {rest.length > 0 && <span className={styles.bottom}>{rest.join(" ")}</span>}
    </span>
  );
}
