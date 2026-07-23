"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CaretIcon, Icon, KMark, MenuIcon } from "@/components/icons";
import { NAV_GROUPS } from "@/lib/nav-manifest";
import { useChat } from "@/components/chat/chat-context";

import { MobileMenu } from "./MobileMenu";

/**
 * The mega-menu header (KEIRITECH-INVENTORY.md §3).
 *
 * Two behaviours ported from `keiri.js`:
 *  - the home page ships transparent and gains `.scrolled` past 40px
 *  - interior pages ship `.solid`
 *
 * Dropdowns open on hover as before, and now also on keyboard focus — the
 * legacy markup used a bare `<a>` with no href as the trigger, so the menus
 * were unreachable by keyboard entirely.
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openChat } = useChat();

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    // Deferred rather than called inline: a synchronous setState in an effect
    // cascades a second render before paint. rAF also means the first read
    // happens after hydration, so it can't mismatch the server's markup.
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHome]);

  const headerClass = [
    "site-header",
    isHome ? (scrolled ? "scrolled" : "") : "solid",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={headerClass}>
        <div className="navbar">
          <Link href="/" className="brand" aria-label="Keiri Tech — home">
            <KMark />
            <b>
              Keiri<span>Tech</span>
            </b>
          </Link>

          <nav className="links" aria-label="Primary">
            {NAV_GROUPS.map((group) =>
              group.href ? (
                <div className="navlink" key={group.label}>
                  <Link
                    href={group.href}
                    className={pathname === group.href ? "active" : undefined}
                  >
                    {group.label}
                  </Link>
                </div>
              ) : (
                <div className="navlink" key={group.label}>
                  <button
                    type="button"
                    className="navtrigger"
                    aria-expanded={false}
                    aria-haspopup="true"
                  >
                    {group.label} <CaretIcon />
                  </button>
                  <div className="dropdown">
                    {group.items?.map((item) =>
                      item.external ? (
                        <a
                          key={item.href}
                          href={item.href}
                          rel="noopener"
                        >
                          <Icon name={item.icon} className="dd-ic" />
                          <span>
                            <span className="dd-t">{item.title}</span>
                            <span className="dd-d">{item.description}</span>
                          </span>
                        </a>
                      ) : (
                        <Link key={item.href} href={item.href}>
                          <Icon name={item.icon} className="dd-ic" />
                          <span>
                            <span className="dd-t">{item.title}</span>
                            <span className="dd-d">{item.description}</span>
                          </span>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </nav>

          <div className="navactions">
            <button type="button" className="btn btn-ghost" onClick={openChat}>
              Ask Keiri
            </button>
            <Link href="/contact" className="btn btn-gold">
              Book a demo
            </Link>
            <button
              type="button"
              className="nav-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
