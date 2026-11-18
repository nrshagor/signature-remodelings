import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { BeforeAfter } from "@/components/project/BeforeAfter";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import {
  ProjectSections,
  type ProjectFact,
  type ProjectTextBlock,
} from "@/components/project/ProjectSections";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { stockImages } from "@/content/images";
import { beforeAfter, closingCta, projectPage } from "@/content/pages";
import { getProject, projects } from "@/content/projects";
import { seo } from "@/content/seo";
import type { ImageAsset } from "@/content/types";
import { available } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

/** Only the known projects exist; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata(seo[project.slug], `/projects/${project.slug}`);
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const inProgress = project.progress === "in-progress";

  // City and type only — never a street address.
  const facts: ProjectFact[] = [
    { label: projectPage.facts.city, value: project.city },
    { label: projectPage.facts.type, value: project.type },
  ];
  if (project.progress) {
    facts.push({ label: projectPage.facts.status, value: projectPage.progressLabels[project.progress] });
  }

  const blocks: ProjectTextBlock[] = [
    project.goal && { heading: projectPage.goalHeading, paragraphs: [project.goal] },
    project.startingPoint && {
      heading: projectPage.startingPointHeading,
      paragraphs: [project.startingPoint],
    },
    project.work?.length && { heading: projectPage.workHeading, paragraphs: project.work },
    project.result && { heading: projectPage.resultHeading, paragraphs: [project.result] },
  ].filter((b): b is ProjectTextBlock => Boolean(b));

  // Company photos only; a pair is shown only when both photos exist.
  const pairs = project.pairs.flatMap((pair) => {
    const before = available(pair.before);
    const after = available(pair.after);
    return before && after ? [{ before, after }] : [];
  });
  const gallery = project.gallery
    .map((img) => available(img))
    .filter((img): img is ImageAsset => Boolean(img));

  return (
    <>
      <PageHero
        eyebrow={`${project.city} · ${project.type}`}
        headline={project.title}
        intro={project.summary}
        badge={inProgress ? projectPage.progressLabels["in-progress"] : undefined}
        image={available(project.cardImage)}
      />
      <ProjectSections facts={facts} blocks={blocks} />

      {pairs.length > 0 && (
        <Section labelledBy="before-after-heading">
          <Container>
            <Reveal>
              <Heading level={2} id="before-after-heading" className="section-heading">
                {projectPage.beforeAfterHeading}
              </Heading>
            </Reveal>
            {pairs.map((pair) => (
              <Reveal key={pair.before.src} className="stack-item">
                <BeforeAfter before={pair.before} after={pair.after} labels={beforeAfter} />
              </Reveal>
            ))}
          </Container>
        </Section>
      )}

      {gallery.length > 0 && (
        <Section labelledBy="gallery-heading" tone={pairs.length > 0 ? "stone" : "paper"}>
          <Container>
            <Reveal>
              <Heading level={2} id="gallery-heading" className="section-heading">
                {inProgress ? projectPage.galleryHeadingInProgress : projectPage.galleryHeading}
              </Heading>
            </Reveal>
            <ProjectGallery images={gallery} />
          </Container>
        </Section>
      )}

      <CtaBand cta={closingCta} image={available(stockImages.ctaBand)} />
    </>
  );
}
