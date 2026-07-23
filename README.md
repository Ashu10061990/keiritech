# keiritech

The Keiri Tech marketing site — enterprise finance automation for CFOs, controllers
and CA firms.

A rebuild of the 24-page static site at `keiritech.com` as a Next.js 15 App Router
app, with a minimal MVP backend: a contact endpoint that emails
`business@keiritech.com`, and a Claude-powered chatbot that captures visitor
contact details as leads.

## Status

Phase 2 of the GARP Associates rebuild. The backend is complete; page migration,
navigation, the chat widget and the SEO/GEO work are in progress. See
`PARITY-CHECKLIST.md` once page migration begins.

⛔ **Feature parity is the prime directive.** Nothing from the legacy site is
dropped — see `../BYA& Keiri/KEIRITECH-INVENTORY.md`, the authority on what must
not be lost.

## Commands

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # vitest
pnpm lint
pnpm typecheck
pnpm build
```

All four gates must pass. `pnpm test` and `pnpm typecheck` passing is **not**
sufficient — `pnpm build` catches things neither does (Next restricts what a
route file may export).

## Environment

Copy `.env.example` to `.env.local`. Every secret is server-only; nothing is
prefixed `NEXT_PUBLIC_` except the site URL.

- `ANTHROPIC_API_KEY` — chatbot. **Optional**: without it the widget falls back
  to the ported legacy keyword matcher rather than failing.
- `RESEND_API_KEY` — contact form and chatbot lead capture.

## Architecture

Node runtime, not a static export. Marketing pages are statically generated;
only `/api/contact` and `/api/chat` are dynamic.

| Path | Purpose |
|---|---|
| `src/app/api/contact` | Zod → Resend → `business@keiritech.com`. Accepts JSON and url-encoded form posts. |
| `src/app/api/chat` | SSE proxy to `claude-opus-4-8` with a `capture_lead` tool. Never returns an error to the widget. |
| `src/server/chat/knowledge.ts` | The legacy 6 FAQs + 12 keyword groups, ported verbatim. Grounds the prompt, backs the fallback, and will source the `FAQPage` JSON-LD. |
| `src/server/chat/fallback.ts` | The legacy scripted matcher — the chatbot's floor. |

Full design: `../docs/specs/2026-07-23-garp-architecture-design.md` §5.
Plan: `../docs/plans/2026-07-23-keiritech-rebuild.md`.
