// Server-only (uses lib/images): card data for projects.
import type { FeaturedProjectItem } from "@/components/sections/FeaturedProjects";
import type { Project } from "@/content/projects";
import { available } from "./images";

/** City and type only, never an address. Company photos only, never stock. */
export function projectCardItem(project: Project, text = project.summary): FeaturedProjectItem {
  return {
    slug: project.slug,
    title: project.title,
    labels: [project.city, project.type],
    text,
    image: available(project.cardImage),
  };
}
