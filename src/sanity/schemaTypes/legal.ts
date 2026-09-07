import { defineField, defineType } from "sanity";

export const legalType = defineType({
  name: "legal",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Impressum", value: "impressum" },
          { title: "Datenschutz", value: "datenschutz" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
          ],
          lists: [],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", page: "page" },
    prepare({ title, page }) {
      return { title, subtitle: page };
    },
  },
});
