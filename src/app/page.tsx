import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { WhyUs } from "@/components/sections/WhyUs";
import { serviceCardImages, stockImages } from "@/content/images";
import { closingCta, home, processSteps } from "@/content/pages";
import { getProject } from "@/content/projects";
import { seo } from "@/content/seo";
import { services } from "@/content/services";
import { available } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.home, "/");

export default function Home() {
  const serviceItems = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    summary: s.cardSummary,
    image: available(s.cardImage ?? serviceCardImages[s.slug]),
  }));

  const featuredItems = home.featured.items.flatMap((item) => {
    const project = getProject(item.slug);
    if (!project) return [];
    return [
      {
        slug: project.slug,
        title: project.title,
        meta: `${project.city} · ${project.type}`,
        text: item.text,
        // Company photos only; stock images are never used for projects.
        image: available(project.cardImage),
      },
    ];
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
      <ServiceCards
        eyebrow={home.services.eyebrow}
        heading={home.services.heading}
        linkLabel={home.services.linkLabel}
        items={serviceItems}
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
      <ProcessSteps heading={home.process.heading} steps={processSteps} />
      <CtaBand cta={closingCta} image={available(stockImages.ctaBand)} />
    </>
  );
}
