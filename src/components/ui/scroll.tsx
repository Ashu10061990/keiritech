"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The three scroll behaviours from `keiri.js`, ported with their thresholds and
 * — importantly — their differing observer semantics:
 *
 *   Reveal   threshold 0.12, unobserves after firing (one-shot)
 *   Ledger   threshold 0.50, does NOT unobserve (re-triggers on re-entry)
 *   FillBar  threshold 0.40, unobserves after firing, animates to `data-w`
 *
 * The Ledger difference is easy to miss and is deliberate in the original.
 */

function useInView(threshold: number, once: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // No IntersectionObserver (old browser, or a test env that hasn't stubbed
    // it): show the content rather than leaving the page blank. Deferred by a
    // frame so this isn't a synchronous setState inside the effect.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, inView };
}

export function Reveal({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { ref, inView } = useInView(0.12, true);
  return (
    <div
      ref={ref}
      className={[className, "reveal", inView ? "in" : ""]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

/** The animated hairline rule that draws itself across the page. */
export function Ledger() {
  const { ref, inView } = useInView(0.5, false);
  return (
    <div ref={ref} className={inView ? "ledger in" : "ledger"} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}

export function FillBar({ width = "70%" }: { width?: string }) {
  const { ref, inView } = useInView(0.4, true);
  return (
    <div className="barwrap" ref={ref}>
      <div className="fillbar" style={{ width: inView ? width : "0" }} />
    </div>
  );
}
