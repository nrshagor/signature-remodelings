// Server-only (uses lib/images): card data for the services.
import type { ServiceCardItem } from "@/components/sections/ServiceBento";
import { serviceCardImages } from "@/content/images";
import { getService, type Service } from "@/content/services";
import { available } from "./images";

function cardItem(s: Service): ServiceCardItem {
  return {
    slug: s.slug,
    title: s.title,
    summary: s.cardSummary,
    image: available(s.cardImage ?? serviceCardImages[s.slug]),
  };
}

const REMODELING = ["interior-remodeling", "exterior-additions"] as const;

/** The two remodeling services for the bento: Interior (feature tile), then Exterior. */
export function remodelingTiles(): [ServiceCardItem, ServiceCardItem] {
  const [interior, exterior] = REMODELING.map((slug) => getService(slug));
  if (!interior || !exterior) throw new Error("Remodeling services missing in content/services.ts");
  return [cardItem(interior), cardItem(exterior)];
}

/** Item names from both remodeling service pages, for the bento's list tile. */
export function remodelingListItems(): string[] {
  return REMODELING.flatMap((slug) => getService(slug)?.items.map((i) => i.title) ?? []);
}
