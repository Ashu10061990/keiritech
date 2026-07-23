"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { MOBILE_SECTIONS } from "@/lib/nav-manifest";

/**
 * The mobile menu. The legacy version was `classList.toggle('open')` and
 * nothing else — no focus management, no Escape, no scroll lock, and it stayed
 * in the tab order while off-screen. All four are fixed here; the visual
 * design and the section grouping are unchanged.
 */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Trap focus inside the panel.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      id="mobileMenu"
      className={open ? "mobile-menu open" : "mobile-menu"}
      // Off-screen menus stay out of the tab order and the accessibility tree.
      // `inert` must be a real boolean: React 19 treats `inert=""` as FALSE, so
      // the string form silently leaves the hidden menu focusable.
      inert={!open}
      aria-hidden={!open}
    >
      <button
        ref={closeRef}
        type="button"
        className="mm-close"
        onClick={onClose}
        aria-label="Close menu"
      >
        &times;
      </button>

      {MOBILE_SECTIONS.map((section) => (
        <div key={section.label}>
          <div className="mm-section">{section.label}</div>
          {section.links.map((link) =>
            link.external ? (
              <a key={link.href} href={link.href} rel="noopener" onClick={onClose}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} onClick={onClose}>
                {link.label}
              </Link>
            ),
          )}
        </div>
      ))}
    </div>
  );
}
