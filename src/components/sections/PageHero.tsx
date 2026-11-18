import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { ImageAsset } from "@/content/types";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  eyebrow?: string;
  headline: string;
  intro?: string;
  /** Small status chip next to the eyebrow, e.g. "In progress". */
  badge?: string;
  /** With an image (or an image slot) the hero is a 7/5 text/image split. */
  image?: ImageAsset;
  /** Reserve the image column even while the photo is missing. */
  withImage?: boolean;
}

/** Top of inner pages: eyebrow, h1 and intro, optionally beside a 4:5 image. */
export function PageHero({ eyebrow, headline, intro, badge, image, withImage }: PageHeroProps) {
  const split = withImage || Boolean(image);
  return (
    <section className={styles.hero}>
      <Container className={split ? styles.split : undefined}>
        <div className={styles.text}>
          {(eyebrow || badge) && (
            <div className={styles.meta}>
              {eyebrow && <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow>}
              {badge && <span className={styles.badge}>{badge}</span>}
            </div>
          )}
          <Heading level={1}>{headline}</Heading>
          {intro && <p className={styles.intro}>{intro}</p>}
        </div>
        {split && (
          <Reveal className={styles.media} delay={120}>
            <ImageFrame
              image={image}
              ratio="4/5"
              sizes="(min-width: 900px) 40vw, 100vw"
              shape="organic"
              priority
            />
          </Reveal>
        )}
      </Container>
    </section>
  );
}
