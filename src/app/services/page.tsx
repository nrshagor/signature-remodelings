import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { stockImages } from "@/content/images";
import { closingCta, home, servicesIndex } from "@/content/pages";
import { seo } from "@/content/seo";
import { available } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { serviceCardItems } from "@/lib/serviceCards";

export const metadata: Metadata = pageMetadata(seo.services, "/services");

export default function ServicesPage() {
  return (
    <>
      <PageHero headline={servicesIndex.headline} intro={servicesIndex.intro} />
      <ServiceCards linkLabel={home.services.linkLabel} items={serviceCardItems()} flushTop />
      <CtaBand cta={closingCta} image={available(stockImages.ctaBand)} />
    </>
  );
}
