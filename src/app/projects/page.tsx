import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { PageHero } from "@/components/sections/PageHero";
import { stockImages } from "@/content/images";
import { closingCta, projectsIndex } from "@/content/pages";
import { projects } from "@/content/projects";
import { seo } from "@/content/seo";
import { available } from "@/lib/images";
import { projectCardItem } from "@/lib/projectCards";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.projects, "/projects");

export default function ProjectsPage() {
  return (
    <>
      <PageHero headline={projectsIndex.headline} intro={projectsIndex.intro} />
      <FeaturedProjects
        linkLabel={projectsIndex.linkLabel}
        items={projects.map((p) => projectCardItem(p))}
        flushTop
      />
      <CtaBand cta={closingCta} image={available(stockImages.ctaBand)} />
    </>
  );
}
