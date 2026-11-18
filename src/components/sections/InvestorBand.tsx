import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Section } from "@/components/ui/Section";
import type { ImageAsset, NavLink } from "@/content/types";
import styles from "./InvestorBand.module.css";

interface InvestorBandProps {
  eyebrow: string;
  heading: string;
  text: string;
  link: NavLink;
  /** Company project photo (Alba flip); the band still works without it. */
  image?: ImageAsset;
  /** City and type of the project in the photo, e.g. "Alba, TX · Home flipping". */
  imageLabel?: string;
  /**
   * "band": dark full section lower on Home. "compact": a smaller light block at the end
   * of /services.
   */
  variant?: "band" | "compact";
}

/** Home flipping as the secondary offer: project photo beside a short pitch and a link. */
export function InvestorBand({
  eyebrow,
  heading,
  text,
  link,
  image,
  imageLabel,
  variant = "band",
}: InvestorBandProps) {
  const dark = variant === "band";
  return (
    <Section tone={dark ? "ink" : "paper"} labelledBy="investors-heading" flushTop={!dark}>
      <Container>
        <Reveal className={dark ? styles.band : `${styles.band} ${styles.compact}`}>
          {image && (
            <figure className={styles.media}>
              <ImageFrame
                image={image}
                ratio="3/2"
                sizes={dark ? "(min-width: 900px) 55vw, 100vw" : "(min-width: 900px) 40vw, 100vw"}
              />
              {imageLabel && <figcaption className={styles.label}>{imageLabel}</figcaption>}
            </figure>
          )}
          <div className={styles.text}>
            <Eyebrow onDark={dark}>{eyebrow}</Eyebrow>
            <Heading level={2} size={dark ? "h2" : "h3"} id="investors-heading">
              {heading}
            </Heading>
            <p className={styles.copy}>{text}</p>
            <div className={styles.action}>
              <Button href={link.href} variant={dark ? "primary" : "secondary"} onDark={dark}>
                {link.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
