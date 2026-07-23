import Link from "next/link";

import { KMark } from "@/components/icons";
import { CONTACT_EMAIL } from "@/lib/contact";
import { FOOTER_COLUMNS } from "@/lib/nav-manifest";

/** Site footer, ported from KEIRITECH-INVENTORY.md §8. */
export function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <Link href="/" className="brand" style={{ marginBottom: 6 }}>
              <KMark />
              <b>
                Keiri<span>Tech</span>
              </b>
            </Link>
            <p className="tag">
              AI that runs the financial back office for Indian finance teams —
              so people stop reconciling and start deciding.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div className="foot-col" key={column.heading}>
              <h4>{column.heading}</h4>
              {column.links.map((link) =>
                link.external ? (
                  <a key={link.href} href={link.href} rel="noopener">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>

        <div className="foot-base">
          <span>© 2026 Keiri Tech Pvt Ltd · keiritech.com</span>
          <span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> · Greater
            Noida, India
          </span>
        </div>
      </div>
    </footer>
  );
}
