import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { CallToAction, ImageAsset } from "@/content/types";
import styles from "./CtaBand.module.css";

interface CtaBandProps {
  cta: CallToAction;
  /** Decorative background; the band is plain ink without it. */
  image?: ImageAsset;
}

/** Closing call to action: dark band with a darkened background photo. */
export function CtaBand({ cta, image }: CtaBandProps) {
  return (
    <section className={styles.band} aria-labelledby="cta-heading">
      {image && (
        <Image src={image.src} alt="" fill sizes="100vw" className={styles.image} />
      )}
      <div className={styles.shade} aria-hidden="true" />
      <Container className={styles.content}>
        <Reveal>
          <h2 id="cta-heading" className={styles.heading}>
            {cta.heading}
          </h2>
          {cta.text && <p className={styles.text}>{cta.text}</p>}
          <div className={styles.action}>
            <Button href={cta.button.href} onDark>
              {cta.button.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
