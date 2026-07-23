import Link from "next/link";

import { KMark } from "@/components/icons";

/** ⛔ Copy verbatim from the legacy `404.html`. */
export default function NotFound() {
  return (
    <div className="nf">
      <div className="glow" />
      <Link href="/" className="brand">
        <KMark />
        <b>
          Keiri<span>Tech</span>
        </b>
      </Link>
      <div className="code">Error 404</div>
      <h1>This page didn&rsquo;t reconcile.</h1>
      <p>
        The page you&rsquo;re looking for isn&rsquo;t here. Let&rsquo;s get you
        back to something that balances.
      </p>
      <div className="row">
        <Link href="/" className="btn btn-gold">
          Back to home
        </Link>
        <Link href="/solutions" className="btn btn-ghost">
          Explore solutions
        </Link>
      </div>
    </div>
  );
}
