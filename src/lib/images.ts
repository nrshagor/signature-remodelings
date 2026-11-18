// Server-only: uses the file system. Import from server components only.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ImageAsset } from "@/content/types";

/**
 * Returns the image only if its file exists in /public, otherwise undefined, so a slot
 * whose photo hasn't been added yet renders as a neutral panel instead of a broken image.
 * Pages are prerendered, so this runs at build time: add the file, then rebuild.
 */
export function available(image: ImageAsset | undefined): ImageAsset | undefined {
  if (!image) return undefined;
  const file = join(process.cwd(), "public", ...image.src.split("/").filter(Boolean));
  return existsSync(file) ? image : undefined;
}
