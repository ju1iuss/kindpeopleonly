import { TicketIcon } from "@/components/TicketIcon";

type EventTicketButtonProps = {
  href: string;
};

export function EventTicketButton({ href }: EventTicketButtonProps) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      data-ticket
      className="btn-accent inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-6 text-[0.8rem] font-bold uppercase"
    >
      <TicketIcon className="h-[17px] w-[17px] shrink-0" />
      Tickets
    </a>
  );
}
