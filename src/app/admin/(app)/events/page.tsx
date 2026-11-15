import type { Metadata } from "next";
import { buildEvents, loadAll } from "@/lib/admin/data";
import { Card, PageHead, Tabs } from "@/components/admin/ui";
import { EventTable } from "@/components/admin/EventTable";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { f } = await searchParams;
  const filter = f === "kommend" || f === "vergangen" ? f : "alle";
  const data = await loadAll();
  const all = buildEvents(data);
  const upcoming = all.filter((e) => e.upcoming).reverse();
  const past = all.filter((e) => !e.upcoming);
  const list = filter === "kommend" ? upcoming : filter === "vergangen" ? past : all;

  return (
    <>
      <PageHead title="Events" sub="Tickets, Umsatz und Ergebnis pro Event. Kosten kommen aus der Kalkulation und den Qonto-Buchungen in der App." />
      <Tabs
        current={filter}
        items={[
          { key: "alle", label: "Alle", href: "/admin/events", count: all.length },
          { key: "kommend", label: "Kommend", href: "/admin/events?f=kommend", count: upcoming.length },
          { key: "vergangen", label: "Vergangen", href: "/admin/events?f=vergangen", count: past.length },
        ]}
      />
      <Card flush>
        <EventTable events={list} totals provisional={!data.sync.find((s) => s.key === "qonto")?.ok} />
      </Card>
      <p className="faint" style={{ margin: 0, fontSize: 12.5 }}>
        Netto = Ticketumsatz nach geschätzten Stripe-Gebühren. Ergebnis erscheint, sobald Kosten gebucht sind; bis dahin steht der Plan aus der Kalkulation da. * = vorläufig, solange Qonto fehlt.
      </p>
    </>
  );
}
