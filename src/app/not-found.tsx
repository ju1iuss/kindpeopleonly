import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header logoSrc="/assets/logo.png" homeHref="/" />
      <main className="mx-auto flex min-h-[60vh] max-w-[44rem] flex-col justify-center px-[clamp(1.25rem,4vw,3rem)] pt-[calc(var(--header-h)+2rem)] pb-16">
        <h1 className="mb-4 font-display text-[clamp(2.5rem,7vw,4rem)] leading-none uppercase">
          Not found
        </h1>
        <p className="mb-8 text-muted">
          This page does not exist — maybe the night already happened.
        </p>
        <Link
          href="/#events"
          className="inline-flex min-h-11 w-fit items-center rounded-full bg-accent px-6 text-[0.8rem] font-bold uppercase text-accent-ink"
        >
          All Events
        </Link>
      </main>
      <Footer />
    </>
  );
}
