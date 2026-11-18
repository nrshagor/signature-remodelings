import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { InvestorBand } from "@/components/sections/InvestorBand";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceBento } from "@/components/sections/ServiceBento";
import { stockImages } from "@/content/images";
import { closingCta, home, servicesIndex } from "@/content/pages";
import { seo } from "@/content/seo";
import { available } from "@/lib/images";
import { investorBandProps } from "@/lib/investorBand";
import { pageMetadata } from "@/lib/seo";
import { remodelingListItems, remodelingTiles } from "@/lib/serviceCards";

export const metadata: Metadata = pageMetadata(seo.services, "/services");

/** Remodeling (Interior + Exterior) first; home flipping as a smaller block at the end. */
export default function ServicesPage() {
  return (
    <>
      <PageHero headline={servicesIndex.headline} intro={servicesIndex.intro} />
      <ServiceBento
        linkLabel={home.services.linkLabel}
        tiles={remodelingTiles()}
        listHeading={home.services.listHeading}
        listItems={remodelingListItems()}
        flushTop
      />
      <InvestorBand {...investorBandProps()} variant="compact" />
      <CtaBand cta={closingCta} image={available(stockImages.ctaBand)} />
    </>
  );
}
