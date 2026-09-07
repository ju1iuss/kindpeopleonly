import { defineField, defineType } from "sanity";

export const settingsType = defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  fields: [
    defineField({ name: "claim", title: "Hero claim", type: "string" }),
    defineField({ name: "about", title: "About text", type: "text" }),
    defineField({ name: "email", title: "Contact email", type: "string" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroPoster",
      title: "Hero poster",
      type: "image",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero video",
      type: "file",
      options: { accept: "video/mp4" },
    }),
    defineField({
      name: "aboutBg",
      title: "About background",
      type: "image",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});
