/**
 * Node runtime, not a static export — spec D13. The marketing pages are still
 * statically generated; only `/api/contact` and `/api/chat` are dynamic.
 *
 * Security headers and cache tiers carry over the legacy `firebase.json`
 * behaviour (KEIRITECH-INVENTORY.md §9). Task 11 completes this.
 */
const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A production build and a running `next dev` cannot share one output
  // directory — the build replaces files the dev server holds open, and every
  // route then 500s with a missing routes-manifest. CI and local builds set
  // NEXT_DIST_DIR so `pnpm build` never disturbs a live dev server.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Security headers, carried over from the legacy firebase.json
        // (KEIRITECH-INVENTORY.md §9).
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            // Fonts are self-hosted via next/font, so no font CDN is needed.
            // `connect-src 'self'` covers the SSE chat endpoint. 'unsafe-inline'
            // on style-src is required by Next's inlined critical CSS.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 'unsafe-eval' is DEVELOPMENT ONLY. Next's dev/HMR runtime
              // evaluates code at runtime; without it every client bundle is
              // blocked, React never hydrates, and the whole site renders as
              // dead markup — routes still 200 and screenshots still look
              // right, which is exactly how this shipped past every gate.
              // Production builds do not need it.
              isDev
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
      {
        // Cache tiers, matching the legacy config: images 30 days.
        source: "/:path*.(png|jpg|jpeg|gif|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, immutable",
          },
        ],
      },
      {
        // Hashed build assets never change under the same name.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [{ source: "/home", destination: "/", permanent: true }];
  },
};

export default nextConfig;
