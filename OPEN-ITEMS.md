# Open technical items

Known gaps, found during the build and consciously deferred rather than fixed
mid-flight. None are blockers. Ordered by when they start to hurt.

---

## Before first real deployment

**Rate limiting is in-memory, so the budget is per instance.**
`src/server/rate-limit.ts` uses a module-scoped `Map`. On a platform that runs
several instances a client gets up to `limit × instances`, and every deploy
resets the counters. Acceptable while the worst case is spam mail and a modest
Anthropic bill; move to Redis (or Vercel KV) before it guards anything
expensive.

**No env validation.** `ANTHROPIC_API_KEY` and `RESEND_API_KEY` are read ad hoc.
A missing `RESEND_API_KEY` surfaces only when someone submits the contact form,
as a 502. A missing `ANTHROPIC_API_KEY` is silent by design — the chatbot
degrades to the scripted matcher — which means a misconfigured production deploy
looks identical to a working one. Validate at boot and log loudly.

**No CI.** Task 11. Until then the four gates are only run by hand.

**No structured logging or redaction.** `console.error` only. Contact-form and
chatbot payloads contain names, emails and phone numbers; nothing currently
stops those reaching logs verbatim if someone adds a debug line.

---

## Nice to have

**`/contact` renders dynamically.** It reads `searchParams` for the no-JS
redirect state, which opts the whole route out of static generation. Moving the
banner into a small client component that reads the query string would make the
page static again. Minor for a contact page, but it is an SEO-indexed route.

**No chatbot eval suite.** There is no automated check that the model stays
inside the knowledge base, refuses to invent pricing, or asks for contact
details at a sensible moment. The prompt instructs all three and the server
enforces what it can, but nothing measures whether the model complies. Build
this before calling the chatbot production-grade — it is the main gap between
MVP and that claim.

**Conversation state is client-held and unauthenticated.** The transcript is
posted back each turn, so a caller can fabricate an assistant turn. The blast
radius is limited (they can only make the bot talk to itself, and lead capture
is validated server-side), but it also means turn caps are per-request rather
than per-conversation — a caller who resets the transcript resets the cap. The
per-IP rate limit is the real control.

**No lead persistence.** Capture is email-only, so a failed send is a lost lead
and there is no way to review what the bot collected. Deliberate for MVP.

---

## Needs a decision from the user

- **GA4 measurement ID.** The legacy site shipped the `G-XXXXXXXXXX` placeholder,
  so nothing has ever been collected. Analytics cannot be wired without a real ID.
- **Office addresses and coordinates** for the `LocalBusiness` / geo markup in
  Task 10. The inventory records the email and phone, not a postal address.
- **Resend sending domain** — `CONTACT_FROM_EMAIL` defaults to
  `website@keiritech.com`, which needs the domain verified in Resend before any
  mail actually leaves.
