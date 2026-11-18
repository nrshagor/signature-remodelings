import styles from "./SkipLink.module.css";

/** First focusable element on every page: jumps past the header to <main id="main">. */
export function SkipLink() {
  return (
    <a href="#main" className={styles.skip}>
      Skip to content
    </a>
  );
}
