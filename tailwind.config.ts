import type { Config } from "tailwindcss";

/**
 * Legacy design tokens, ported verbatim from the `:root` block of
 * `BYA& Keiri/keiri-new/keiritech-firebase/public/assets/keiri.css`.
 *
 * These hex values are the site's visual identity. `src/styles/tokens.test.ts`
 * asserts every one of them, so drift fails CI rather than shipping silently.
 */
export default {
  content: ["./src/**/*.{ts,tsx,mdx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#142719",
          mid: "#1E3A26",
          soft: "#306339",
          deep: "#0E1C12",
        },
        gold: {
          DEFAULT: "#E9A23B",
          deep: "#D8932F",
          soft: "#B8F1D2",
        },
        paper: {
          DEFAULT: "#F6F3EC",
          dim: "#ECE7DA",
          card: "#FBF9F4",
        },
        slate: "#8FA596",
        ink: "#0F1E13",
        muted: "#3f5446",
        green: "#7BD3A0",
        line: "rgba(233,162,59,.28)",
      },
      maxWidth: {
        content: "1180px",
        narrow: "820px",
      },
    },
  },
  plugins: [],
} satisfies Config;
