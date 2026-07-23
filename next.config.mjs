/**
 * Node runtime, not a static export — spec D13. The marketing pages are still
 * statically generated; only `/api/contact` and `/api/chat` are dynamic.
 *
 * Security headers and cache tiers carry over the legacy `firebase.json`
 * behaviour (KEIRITECH-INVENTORY.md §9). Task 11 completes this.
 */
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
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
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
