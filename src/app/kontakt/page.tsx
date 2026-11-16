"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/site";
import { KpoText } from "@/components/KpoText";

export default function KontaktPage() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <Header homeHref="/" />
      <main className="mx-auto max-w-[44rem] px-[clamp(1.25rem,4vw,3rem)] pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4rem))] pb-[clamp(3rem,6vw,5rem)]">
        <p className="mb-5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-muted">Get in touch</p>
        <h1 className="font-display text-[clamp(2.8rem,8vw,5rem)] uppercase leading-none"><KpoText text="Contact" /></h1>
        <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">For bookings, collaborations, press and everything else, reach out directly.</p>
        <div className="mt-12 flex flex-wrap items-center gap-4 border-y border-line py-6">
          <a href={`mailto:${siteConfig.email}`} className="break-all text-[clamp(1.2rem,4vw,2rem)] font-semibold text-ink underline decoration-line underline-offset-8">{siteConfig.email}</a>
          <button type="button" onClick={copyEmail} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-xs font-bold uppercase text-ink transition-colors hover:bg-surface" aria-label="Copy email address">
            <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>{copied ? "Copied" : "Copy"}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
