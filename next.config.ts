import type { NextConfig } from "next";

/**
 * Security headers for every response. Nginx sets none of these (checked against the
 * other HBS site configs), so the app sends them. If Nginx ever adds one, remove it
 * here to avoid duplicate headers.
 *
 * No full Content-Security-Policy: Next.js inline scripts would need a nonce, which
 * makes every page dynamic. `frame-ancestors 'none'` is sent alone as the modern
 * equivalent of X-Frame-Options.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Self-hosted with PM2 behind Nginx, same as the other HBS sites.
  output: "standalone",
  poweredByHeader: false,
  // Static marketing site: no `use cache`, so Cache Components stay off.
  // (partialPrefetching requires cacheComponents, so it is off too.)
  cacheComponents: false,
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: false,
    // Local images only: no remotePatterns.
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
