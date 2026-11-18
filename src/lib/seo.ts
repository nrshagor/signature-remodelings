import type { Metadata } from "next";
import { site } from "@/content/site";
import type { PageSeo } from "@/content/seo";

/**
 * Search indexing switch, read at build time (pages are static). Anything other than
 * SITE_INDEXABLE=true (staging, preview, unset) → every page is noindex/nofollow and
 * robots.txt disallows all. Set it to true only for the live production build.
 */
export const isIndexable = process.env.SITE_INDEXABLE === "true";

export const robotsMeta: Metadata["robots"] = isIndexable
  ? { index: true, follow: true }
  : { index: false, follow: false, googleBot: { index: false, follow: false } };

/**
 * Per-page metadata: full title (used as-is), description, canonical, Open Graph and
 * Twitter. Pattern adapted from the solum-constructions `pageMetadata` helper.
 * Share images are added in T3.1.
 */
export function pageMetadata(page: PageSeo, path: string): Metadata {
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      url: path,
      title: page.title,
      description: page.description,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}
