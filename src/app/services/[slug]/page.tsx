import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { serviceCardImages, serviceDetailImages, stockImages } from "@/content/images";
import { servicePage } from "@/content/pages";
import { getProject } from "@/content/projects";
import { seo } from "@/content/seo";
import { getService, services } from "@/content/services";
import { available } from "@/lib/images";
import { projectCardItem } from "@/lib/projectCards";
import { pageMetadata } from "@/lib/seo";

/** Only the three known services exist; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata(seo[service.slug], `/services/${service.slug}`);
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  const featured = service.featuredProjectSlug ? getProject(service.featuredProjectSlug) : undefined;

  return (
    <>
      <PageHero
        eyebrow={service.title}
        headline={service.headline}
        intro={service.intro}
        image={available(service.cardImage ?? serviceCardImages[service.slug])}
        withImage
      />
      <ServiceDetail
        heading={service.itemsHeading}
        items={service.items}
        ordered={service.itemsOrdered}
        images={serviceDetailImages[service.slug].map((img) => available(img))}
        whoForHeading={servicePage.whoForHeading}
        whoFor={service.whoFor}
      />
      {featured && (
        <FeaturedProjects
          heading={servicePage.featuredHeading}
          linkLabel={servicePage.featuredLinkLabel}
          items={[projectCardItem(featured)]}
          tone="stone"
        />
      )}
      <CtaBand cta={service.cta} image={available(stockImages.ctaBand)} />
    </>
  );
}
