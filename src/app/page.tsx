import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { InvestorBand } from "@/components/sections/InvestorBand";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceBento } from "@/components/sections/ServiceBento";
import { WhyUs } from "@/components/sections/WhyUs";
import { stockImages } from "@/content/images";
import { closingCta, home, processSteps } from "@/content/pages";
import { getProject } from "@/content/projects";
import { seo } from "@/content/seo";
import { available } from "@/lib/images";
import { investorBandProps } from "@/lib/investorBand";
import { projectCardItem } from "@/lib/projectCards";
import { pageMetadata } from "@/lib/seo";
import { remodelingListItems, remodelingTiles } from "@/lib/serviceCards";

export const metadata: Metadata = pageMetadata(seo.home, "/");

/** Remodeling first (hero + Interior/Exterior bento); home flipping lower, for investors. */
export default function Home() {
  const featuredItems = home.featured.items.flatMap((item) => {
    const project = getProject(item.slug);
    return project ? [projectCardItem(project, item.text)] : [];
  });

  return (
    <>
      <Hero
        headline={home.hero.headline}
        sub={home.hero.sub}
        primary={home.hero.primary}
        secondary={home.hero.secondary}
        image={available(stockImages.heroHome)}
      />
      <ServiceBento
        eyebrow={home.services.eyebrow}
        heading={home.services.heading}
        linkLabel={home.services.linkLabel}
        tiles={remodelingTiles()}
        listHeading={home.services.listHeading}
        listItems={remodelingListItems()}
      />
      <WhyUs
        heading={home.whyUs.heading}
        items={home.whyUs.items}
        image={available(stockImages.processPlans)}
      />
      <FeaturedProjects
        heading={home.featured.heading}
        linkLabel={home.featured.linkLabel}
        items={featuredItems}
      />
      <InvestorBand {...investorBandProps()} />
      <ProcessSteps heading={home.process.heading} steps={processSteps} />
      <CtaBand cta={closingCta} image={available(stockImages.ctaBand)} />
    </>
  );
}
