"use client";

import { useEffect } from "react";

/** Safari/Firefox fallback: preconnect to ticket shop on first hover/touch. */
export function TicketPreconnect() {
  useEffect(() => {
    const connected: Record<string, boolean> = {};
    const preconnect = (e: Event) => {
      const target = e.target as Element | null;
      const link = target?.closest?.("a[data-ticket]") as HTMLAnchorElement | null;
      if (!link) return;
      let origin: string;
      try {
        origin = new URL(link.href).origin;
      } catch {
        return;
      }
      if (origin === window.location.origin || connected[origin]) return;
      connected[origin] = true;
      const el = document.createElement("link");
      el.rel = "preconnect";
      el.href = origin;
      document.head.appendChild(el);
    };
    document.addEventListener("pointerover", preconnect, { passive: true });
    document.addEventListener("touchstart", preconnect, { passive: true });
    return () => {
      document.removeEventListener("pointerover", preconnect);
      document.removeEventListener("touchstart", preconnect);
    };
  }, []);

  return null;
}
