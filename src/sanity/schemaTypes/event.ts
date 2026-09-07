import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "titel",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titel", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "datum",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "uhrzeit",
      title: "Time",
      type: "string",
      description: "e.g. 20:00",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "adresse",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "flyer",
      title: "Flyer",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "flyerAspect",
      title: "Flyer aspect",
      type: "string",
      options: {
        list: [
          { title: "Portrait 4:5", value: "4/5" },
          { title: "Square 1:1", value: "1/1" },
        ],
        layout: "radio",
      },
      initialValue: "4/5",
    }),
    defineField({
      name: "ticketUrl",
      title: "Ticket URL",
      type: "url",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "verfuegbar" },
          { title: "Coming soon", value: "coming_soon" },
          { title: "Almost sold out", value: "letzte_tickets" },
          { title: "Sold out", value: "ausverkauft" },
        ],
        layout: "radio",
      },
      initialValue: "verfuegbar",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "info", title: "Description", type: "text" }),
    defineField({ name: "musik", title: "Music", type: "string" }),
    defineField({ name: "lineup", title: "Lineup", type: "string" }),
    defineField({ name: "einlass", title: "Entry", type: "string" }),
    defineField({ name: "preis", title: "Price", type: "string" }),
  ],
  preview: {
    select: { title: "titel", date: "datum", media: "flyer" },
    prepare({ title, date, media }) {
      return { title, subtitle: date, media };
    },
  },
});
