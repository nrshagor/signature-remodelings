import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
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

export const metadata: Metadata = {
  title: "Signature Remodelings",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script changes <html> classes before hydration.
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlagScript }} />
      </head>
      <body>
        <SkipLink />
        <Header />
        {children}
      </body>
    </html>
  );
}
