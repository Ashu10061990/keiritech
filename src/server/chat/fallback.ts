import { FALLBACK_MESSAGE, FAQS, KEYWORD_GROUPS } from "./knowledge";

/**
 * The legacy scripted matcher, ported from `KB.match` in `keiri.js`.
 *
 * This is the chatbot's floor. It runs whenever `ANTHROPIC_API_KEY` is absent or
 * the Anthropic API errors, so the widget degrades to exactly today's behaviour
 * rather than appearing broken (spec D15).
 *
 * Two rules from the original, both load-bearing:
 *   1. An exact (case-insensitive) FAQ question match wins outright. The widget
 *      renders the first four FAQs as clickable chips, so this is the path a
 *      chip click takes.
 *   2. Otherwise the FIRST keyword group with a substring hit wins. Group order
 *      in `KEYWORD_GROUPS` therefore decides ties.
 */
export function matchScripted(text: string): string {
  const input = text.toLowerCase().trim();

  const exact = FAQS.find((faq) => faq.q.toLowerCase() === input);
  if (exact) return exact.a;

  for (const group of KEYWORD_GROUPS) {
    if (group.keywords.some((keyword) => input.includes(keyword))) {
      return group.answer;
    }
  }

  return FALLBACK_MESSAGE;
}

/** The topic label for a message, used to classify captured leads. */
export function classifyTopic(text: string): string {
  const input = text.toLowerCase().trim();
  const group = KEYWORD_GROUPS.find((g) =>
    g.keywords.some((keyword) => input.includes(keyword)),
  );
  return group?.topic ?? "other";
}
