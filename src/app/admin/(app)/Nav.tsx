"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/admin/ui";

const ITEMS = [
  { href: "/admin", label: "Übersicht", icon: "overview" },
  { href: "/admin/events", label: "Events", icon: "calendar" },
  { href: "/admin/konto", label: "Konto", icon: "bank" },
  { href: "/admin/belege", label: "Rechnungen & Belege", icon: "receipt" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="adm-nav" aria-label="Admin">
      <div className="adm-nav-label">Finanzen</div>
      {ITEMS.map((i) => {
        const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} aria-current={active ? "page" : undefined}>
            <Icon name={i.icon} />
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function RefreshButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={pending ? "adm-btn spin" : "adm-btn"} disabled={pending}>
      <Icon name="refresh" />
      {pending ? "Gleicht ab …" : "Aktualisieren"}
    </button>
  );
}
