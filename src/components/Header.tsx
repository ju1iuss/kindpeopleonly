import Link from "next/link";

type HeaderProps = {
  logoSrc?: string;
  homeHref?: string;
};

export function Header(_props: HeaderProps = {}) {
  return (
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-transparent bg-transparent px-[clamp(1.25rem,4vw,3rem)]"
    >
      <nav
        className="flex h-full items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/#events"
          className="inline-flex min-h-11 items-center px-3 text-[0.8rem] font-semibold uppercase text-ink transition-opacity hover:opacity-70"
        >
          Events
        </Link>
        <Link
          href="/#about"
          className="inline-flex min-h-11 items-center px-3 text-[0.8rem] font-semibold uppercase text-ink transition-opacity hover:opacity-70"
        >
          About
        </Link>
      </nav>
    </header>
  );
}
