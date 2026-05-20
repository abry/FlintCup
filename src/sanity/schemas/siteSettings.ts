import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Nettstedinnstillinger",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      initialValue: "Sprint-Jeløy G14-2 — Flint Cup 2026",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "clubName",
      title: "Klubbnavn",
      type: "string",
      initialValue: "Sprint-Jeløy Fotballklubb",
    }),
    defineField({
      name: "logo",
      title: "Klubblogo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "primaryColor",
      title: "Primærfarge (hex)",
      type: "string",
      description: 'F.eks. "#0a2342". Brukes for header og knapper.',
      initialValue: "#0a2342",
    }),
    defineField({
      name: "accentColor",
      title: "Aksentfarge (hex)",
      type: "string",
      initialValue: "#f59e0b",
    }),
    defineField({
      name: "contactName",
      title: "Kontaktperson",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Telefon",
      type: "string",
    }),
    defineField({
      name: "contactEmail",
      title: "E-post",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title ?? "Nettstedinnstillinger" }),
  },
});
