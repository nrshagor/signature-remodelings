import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { HydratedFlag } from "@/components/motion/HydratedFlag";
import { seo } from "@/content/seo";
import { site } from "@/content/site";
import { robotsMeta } from "@/lib/seo";
import "@/styles/globals.css";

// Headings: serif, only the weight in use. Body/UI: Inter variable font (400–600).
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-serif-face",
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-face",
});

/*
 * Runs before first paint. Adds `js` to <html> only when IntersectionObserver exists, so
 * reveal animations hide content only in browsers that can show it again (see
 * globals.css → Reveal). Without JavaScript or IntersectionObserver, everything is visible.
 */
const jsFlagScript =
  "if('IntersectionObserver' in window)document.documentElement.classList.add('js')";

/** Defaults for every page; each page overrides title/description/canonical. */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.home.title, template: "%s" },
  description: seo.home.description,
  applicationName: site.name,
  // SITE_INDEXABLE (build time): anything but "true" → noindex everywhere.
  robots: robotsMeta,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script changes <html> classes before hydration.
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlagScript }} />
      </head>
      <body>
        <HydratedFlag />
        <SkipLink />
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
