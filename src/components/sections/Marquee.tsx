import { MarqueeStrip } from "./MarqueeStrip";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  /** Words for the strip, e.g. the kinds of rooms we remodel. */
  items: string[];
  /** Accessible name of the list. */
  label: string;
}

/**
 * A slow, endless strip of words (CSS animation). The first copy is the real list; a
 * second, aria-hidden copy follows it so the loop is seamless. It moves only while on
 * screen and after the first scroll or tap (MarqueeStrip); paused on hover; under reduced
 * motion the strip is static and the copy is hidden.
 */
export function Marquee({ items, label }: MarqueeProps) {
  if (items.length === 0) return null;
  const list = (hidden: boolean) => (
    <ul
      role="list"
      aria-label={hidden ? undefined : label}
      aria-hidden={hidden || undefined}
      className={hidden ? `${styles.list} ${styles.copy}` : styles.list}
    >
      {items.map((item) => (
        <li key={item} className={styles.item}>
          {item}
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <MarqueeStrip className={styles.strip}>
      <div className={styles.track}>
        {list(false)}
        {list(true)}
      </div>
    </MarqueeStrip>
  );
}
