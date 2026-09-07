"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type HeroProps = {
  logoSrc: string;
  posterSrc: string;
  videoSrc: string;
  claim: string;
};

export function Hero({ logoSrc, posterSrc, videoSrc, claim }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const conn =
      // @ts-expect-error Network Information API
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slow =
      conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (slow || reduced) return;

    const loadVideo = () => {
      video.addEventListener(
        "canplay",
        () => {
          video.classList.add("opacity-100");
          video.classList.remove("opacity-0");
          const playPromise = video.play();
          if (playPromise?.catch) playPromise.catch(() => {});
        },
        { once: true },
      );
      video.src = videoSrc;
      video.load();
    };

    if (document.readyState === "complete") {
      loadVideo();
    } else {
      window.addEventListener("load", loadVideo, { once: true });
      return () => window.removeEventListener("load", loadVideo);
    }
  }, [videoSrc]);

  return (
    <section
      className="hero relative isolate grid h-[100svh] h-[100dvh] min-h-[100svh] place-items-center overflow-hidden supports-[height:100dvh]:h-[100dvh]"
      aria-label="Kind People Only"
    >
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        fetchPriority="high"
        className="hero-media absolute inset-0 -z-20 object-cover grayscale"
        sizes="100vw"
      />
      <video
        ref={videoRef}
        className="hero-media absolute inset-0 -z-10 h-full w-full object-cover opacity-0 grayscale transition-opacity duration-800"
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14,13,18,0.35) 0%, rgba(14,13,18,0.15) 40%, rgba(14,13,18,0.45) 78%, var(--bg) 100%)",
        }}
      />
      <div className="hero-content relative z-[1] p-6 text-center [animation:hero-in_1.2s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]">
        <div className="relative mx-auto w-[min(280px,52vw)]">
          <Image
            src={logoSrc}
            alt="Kind People Only"
            width={420}
            height={373}
            className="h-auto w-full"
            priority
          />
          <span
            className="pointer-events-none absolute right-[2%] bottom-[4%] text-[clamp(1.15rem,4.5vw,1.75rem)] font-bold leading-none text-ink"
            aria-hidden="true"
          >
            ©
          </span>
        </div>
        <p className="mx-auto mt-6 max-w-[40ch] text-[clamp(0.78rem,1.6vw,0.95rem)] font-light uppercase text-[rgba(242,240,236,0.85)]">
          {claim}
        </p>
      </div>
      <a
        href="#events"
        className="btn-accent hero-scroll absolute bottom-[max(clamp(1.25rem,5vh,2.75rem),env(safe-area-inset-bottom))] left-0 right-0 z-[1] mx-auto inline-flex min-h-14 w-fit items-center gap-2 rounded-full px-9 text-[0.95rem] font-bold uppercase"
      >
        Tickets<span aria-hidden="true"> ↓</span>
      </a>
    </section>
  );
}
