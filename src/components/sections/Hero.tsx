import Image from "next/image";
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
 * Full-height hero under the transparent header. The headline, text and buttons enter
 * with CSS (no JavaScript needed); the photo zooms very slowly (Ken Burns).
 */
export function Hero({ headline, sub, primary, secondary, image }: HeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {image && (
        <div className={styles.media}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.shade} aria-hidden="true" />
      <Container className={styles.content}>
        <h1 id="hero-heading" className={styles.headline}>
          {headline}
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
