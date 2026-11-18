import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Section } from "@/components/ui/Section";
import type { ServiceItem } from "@/content/services";
import type { ImageAsset } from "@/content/types";
import styles from "./ServiceDetail.module.css";

interface ServiceDetailProps {
  heading: string;
  items: ServiceItem[];
  ordered?: boolean;
  /** Supporting photos beside the list; slots keep their shape while photos are missing. */
  images: (ImageAsset | undefined)[];
  whoForHeading: string;
  whoFor: string;
}

/** "What we remodel / build / How it works" list beside images, then "Who it's for". */
export function ServiceDetail({
  heading,
  items,
  ordered,
  images,
  whoForHeading,
  whoFor,
}: ServiceDetailProps) {
  const List = ordered ? "ol" : "ul";
  return (
    <>
      <Section tone="mist" labelledBy="detail-heading">
        <Container className={styles.layout}>
          <div className={styles.text}>
            <Reveal>
              <Heading level={2} id="detail-heading">
                {heading}
              </Heading>
            </Reveal>
            <Reveal
              group
              as={List}
              role={ordered ? undefined : "list"}
              className={[styles.list, ordered && styles.ordered].filter(Boolean).join(" ")}
            >
              {items.map((item, i) => (
                <li key={item.title} className={styles.item}>
                  {ordered && (
                    <span className={styles.number} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span className={styles.itemTitle}>{item.title}</span>
                  {item.detail && <span className={styles.itemDetail}>{item.detail}</span>}
                </li>
              ))}
            </Reveal>
          </div>
          {images.length > 0 && (
            <Reveal group className={styles.media}>
              {images.map((image, i) => (
                <div key={image?.src ?? i} className={styles.mediaItem}>
                  <ImageFrame image={image} ratio="3/2" sizes="(min-width: 900px) 40vw, 100vw" />
                </div>
              ))}
            </Reveal>
          )}
        </Container>
      </Section>

      <Section labelledBy="who-heading">
        <Container narrow>
          <Reveal>
            <h2 id="who-heading" className={styles.whoHeading}>
              {whoForHeading}
            </h2>
            <p className={styles.who}>{whoFor}</p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
