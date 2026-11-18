import type { Metadata } from "next";
import { FaqList } from "@/components/faq/FaqList";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { faqJsonLd, visibleFaqs } from "@/content/faq";
import { stockImages } from "@/content/images";
import { closingCta, faqPage } from "@/content/pages";
import { seo } from "@/content/seo";
import { available } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.faq, "/faq");

/**
 * Only answered questions are shown ([NEEDS CLIENT] ones stay hidden). FAQ JSON-LD is
 * added only for confirmed answers; none are confirmed yet, so there is no schema.
 */
export default function FaqPage() {
  const items = visibleFaqs();
  const schema = faqJsonLd();
  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\u003c") }}
        />
      )}
      <PageHero headline={faqPage.headline} intro={faqPage.intro} />
      <Section flushTop>
        <Container>
          <FaqList items={items} />
        </Container>
      </Section>
      <CtaBand cta={closingCta} image={available(stockImages.ctaBand)} />
    </>
  );
}
