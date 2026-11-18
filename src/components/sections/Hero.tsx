import Image from "next/image";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { ImageAsset, NavLink } from "@/content/types";
import styles from "./Hero.module.css";

interface HeroProps {
  headline: string;
  sub: string;
  primary: NavLink;
  secondary?: NavLink;
  /** Undefined until the photo is added: the hero is solid ink. */
  image?: ImageAsset;
}

/**
 * Full-height hero under the transparent header. Everything enters with CSS, so nothing
 * waits for JavaScript: the headline is split into words here, on the server, and the
 * words rise one after another (from 768px; phones get one fade). The photo scales in
 * slowly; on desktop MotionEngine adds a light parallax to `[data-parallax]`.
 */
export function Hero({ headline, sub, primary, secondary, image }: HeroProps) {
  const words = headline.split(" ");
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {image && (
        <div className={styles.media} data-parallax="">
          <div className={styles.zoom}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              className={styles.image}
            />
          </div>
        </div>
      )}
      <div className={styles.shade} aria-hidden="true" />
      <Container className={styles.content}>
        <h1 id="hero-heading" className={styles.headline}>
          {words.map((word, i) => (
            <span key={i}>
              <span className={styles.word}>
                <span className={styles.wordInner} style={{ "--i": i } as CSSProperties}>
                  {word}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p className={styles.sub}>{sub}</p>
        <div className={styles.actions}>
          <Button href={primary.href} onDark block large>
            {primary.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} variant="secondary" onDark block large>
              {secondary.label}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
