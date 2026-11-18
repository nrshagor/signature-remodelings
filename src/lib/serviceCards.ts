// Server-only (uses lib/images): card data for the three services.
import type { ServiceCardItem } from "@/components/sections/ServiceCards";
import { serviceCardImages } from "@/content/images";
import { services } from "@/content/services";
import { available } from "./images";

export function serviceCardItems(): ServiceCardItem[] {
  return services.map((s) => ({
    slug: s.slug,
    title: s.title,
    summary: s.cardSummary,
    image: available(s.cardImage ?? serviceCardImages[s.slug]),
  }));
}
