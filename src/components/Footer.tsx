import Link from "next/link";
import { siteConfig } from "@/lib/site";

type FooterProps = {
  email?: string;
  instagram?: string;
};

export function Footer({
  email = siteConfig.email,
  instagram = siteConfig.instagram,
}: FooterProps) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[var(--max-w)] flex-wrap items-center justify-between gap-x-10 gap-y-3 px-[clamp(1.25rem,4vw,3rem)] py-[clamp(2rem,5vw,3rem)] pb-[clamp(2.5rem,5vw,3.5rem)]">
        <p className="m-0 text-[0.82rem] font-light uppercase text-muted">
          Kind People Only · Karlsruhe
        </p>
        <nav className="flex flex-wrap gap-x-7" aria-label="Footer">
          <a
            href={instagram}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex min-h-11 items-center text-[0.9rem] font-light text-ink opacity-85 transition-opacity hover:opacity-100"
          >
            Instagram
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex min-h-11 items-center text-[0.9rem] font-light text-ink opacity-85 transition-opacity hover:opacity-100"
          >
            Contact
          </a>
          <Link
            href="/impressum"
            className="inline-flex min-h-11 items-center text-[0.9rem] font-light text-ink opacity-85 transition-opacity hover:opacity-100"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="inline-flex min-h-11 items-center text-[0.9rem] font-light text-ink opacity-85 transition-opacity hover:opacity-100"
          >
            Datenschutz
          </Link>
        </nav>
      </div>
    </footer>
  );
}
