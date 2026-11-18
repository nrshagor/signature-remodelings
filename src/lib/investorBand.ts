// Server-only (uses lib/images): props for the home-flipping ("For investors") block.
import { home } from "@/content/pages";
import { getProject } from "@/content/projects";
import { getService } from "@/content/services";
import { available } from "./images";

/**
 * Flipping headline and line from services.ts, with the Alba kitchen photo (company's own).
 * Not the cover: the front photo is already on the Alba card in "Recent work" on Home.
 */
export function investorBandProps() {
  const flipping = getService("home-flipping");
  const alba = getProject("alba-home-flip");
  const image = available(alba?.gallery.find((img) => img.src.endsWith("/gallery-1.jpg")));
  return {
    eyebrow: home.investors.eyebrow,
    heading: flipping?.headline ?? "",
    text: flipping?.cardSummary ?? "",
    link: home.investors.link,
    image,
    imageLabels: image && alba ? [alba.city, alba.type] : undefined,
  };
}
