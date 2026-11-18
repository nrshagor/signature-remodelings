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
  /** City and type of the project in the photo, shown as glass labels. City only. */
  imageLabels?: string[];
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
  imageLabels,
  variant = "band",
}: InvestorBandProps) {
  const dark = variant === "band";
  return (
    <Section tone={dark ? "ink" : "paper"} labelledBy="investors-heading" flushTop={!dark}>
      <Container>
        <div className={dark ? styles.band : `${styles.band} ${styles.compact}`}>
          {image && (
            <div className={styles.media}>
              <ImageFrame
                image={image}
                ratio="3/2"
                sizes={dark ? "(min-width: 900px) 55vw, 100vw" : "(min-width: 900px) 40vw, 100vw"}
                shape="organic"
                labels={imageLabels}
                mask
              />
            </div>
          )}
          <Reveal className={styles.text}>
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
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
