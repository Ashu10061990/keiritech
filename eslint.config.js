import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      // Build output. Created by the NEXT_DIST_DIR override in next.config.mjs;
      // without this eslint lints ~10k generated files.
      "**/.next-build/**",
      "**/out/**",
      "**/coverage/**",
      "**/next-env.d.ts",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // `no-empty` treats a comment-only catch block as non-empty, so it misses
      // `catch { /* ignore */ }` — the exact shape that hid ~20 swallowed errors
      // in the legacy codebase. Comments are not body nodes, so an AST selector
      // on the block is the only reliable check. Spec D9.
      "no-restricted-syntax": [
        "error",
        {
          selector: "CatchClause > BlockStatement[body.length=0]",
          message:
            "Empty catch block. Handle the error, rethrow it, or log it explicitly (logger.warn).",
        },
      ],
    },
  },

  // Config files are plain JS/TS run by tooling, not part of the app graph.
  // They run in Node, so `process` and friends must be declared — otherwise
  // `no-undef` (from js.configs.recommended) fires on them.
  {
    files: ["*.config.{js,mjs,ts}", "eslint.config.js", "vitest.setup.ts"],
    languageOptions: {
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "writable",
        require: "readonly",
      },
    },
    rules: {
      "no-restricted-syntax": "off",
    },
  },
);
