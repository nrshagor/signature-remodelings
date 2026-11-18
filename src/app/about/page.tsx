import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Values } from "@/components/sections/Values";
import { stockImages } from "@/content/images";
import { about, closingCta, processSteps } from "@/content/pages";
import { seo } from "@/content/seo";
import { available } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.about, "/about");

/**
 * About: story, values, the animated process, closing CTA. No founder block yet: it is
 * built in T4.1 once the client sends name, photo and background (about.founder).
 */
export default function AboutPage() {
  return (
    <>
      <PageHero headline={about.headline} intro={about.body[0]} />
      <Values heading={about.valuesHeading} values={about.values} />
      <ProcessSteps heading={about.processHeading} steps={processSteps} variant="detail" animated />
      <CtaBand cta={closingCta} image={available(stockImages.ctaBand)} />
    </>
  );
}
