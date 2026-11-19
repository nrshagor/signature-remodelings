import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/seo";

/**
 * robots.txt, from the same build-time switch as the page meta tags (lib/seo.ts).
 * Preview/staging (SITE_INDEXABLE not "true"): disallow everything.
 * Production at launch: allow everything. The sitemap line is added in T3.2.
 */
export default function robots(): MetadataRoute.Robots {
  return isIndexable
    ? { rules: { userAgent: "*", allow: "/" } }
    : { rules: { userAgent: "*", disallow: "/" } };
}
