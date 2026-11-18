import { Reveal } from "@/components/motion/Reveal";
import type { AnsweredFaq } from "@/content/faq";
import styles from "./FaqList.module.css";

/**
 * Native <details>/<summary> accordion: keyboard and screen-reader support built in,
 * works without JavaScript. Only the +/− icon animates (transform).
 */
export function FaqList({ items }: { items: AnsweredFaq[] }) {
  if (items.length === 0) return null;
  return (
    <Reveal group className={styles.list}>
      {items.map((item) => (
        <details key={item.question} className={styles.item}>
          <summary className={styles.summary}>
            <span className={styles.question}>{item.question}</span>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </Reveal>
  );
}
