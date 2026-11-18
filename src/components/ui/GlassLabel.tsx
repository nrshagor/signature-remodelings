import styles from "./GlassLabel.module.css";

interface GlassLabelsProps {
  /** Short labels, e.g. ["Carrollton, TX", "Exterior addition"]. City only, never an address. */
  items: string[];
  className?: string;
}

/**
 * Frosted pills laid over an image (top left). Light glass with ink text, so the text
 * stays readable over any photo; browsers without backdrop-filter get a solid pill.
 */
export function GlassLabels({ items, className }: GlassLabelsProps) {
  if (items.length === 0) return null;
  return (
    <ul role="list" className={[styles.list, className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <li key={item} className={styles.label}>
          {item}
        </li>
      ))}
    </ul>
  );
}
