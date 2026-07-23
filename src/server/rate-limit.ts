/**
 * Fixed-window per-IP rate limiter.
 *
 * ⚠️ In-memory, so the budget is per server instance. On a platform that runs
 * several instances a client gets up to `limit × instances`. That is acceptable
 * for MVP traffic on endpoints whose worst case is spam mail, and is recorded in
 * OPEN-ITEMS.md. Move to Redis before this guards anything expensive.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

export interface RateLimitResult {
  readonly allowed: boolean;
  /** Seconds until the window resets. Sent as `Retry-After` on a block. */
  readonly retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
  if (existing.count >= limit) {
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds };
}

/**
 * Best-effort client IP. Vercel sets `x-forwarded-for`; the leftmost entry is
 * the client. Falls back to a shared bucket so a missing header cannot be used
 * to bypass the limit entirely.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first && first.length > 0 ? first : "unknown";
}

/** Test-only. Clears state so cases cannot leak counts into one another. */
export function __resetRateLimitForTests(): void {
  windows.clear();
}
