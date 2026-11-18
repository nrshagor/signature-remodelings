// Server-only (uses lib/images): props for the home-flipping ("For investors") block.
import { home } from "@/content/pages";
import { getProject } from "@/content/projects";
import { getService } from "@/content/services";
import { available } from "./images";

/** Flipping headline and line from services.ts, the Alba cover photo (company's own). */
export function investorBandProps() {
  const flipping = getService("home-flipping");
  const alba = getProject("alba-home-flip");
  const image = available(alba?.cardImage);
  return {
    eyebrow: home.investors.eyebrow,
    heading: flipping?.headline ?? "",
    text: flipping?.cardSummary ?? "",
    link: home.investors.link,
    image,
    imageLabel: image && alba ? `${alba.city} · ${alba.type}` : undefined,
  };
}
