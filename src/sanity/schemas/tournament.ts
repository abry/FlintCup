import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const tournament = defineType({
  name: "tournament",
  title: "Turnering",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      initialValue: "Flint Cup 2026",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ourTeamName",
      title: "Vårt lag (akkurat som det står i Profixio)",
      type: "string",
      initialValue: "Sprint-Jeløy 2",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "groupName",
      title: "Gruppenavn",
      type: "string",
      initialValue: "Gruppe L",
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      initialValue: "G 2012",
    }),
    defineField({
      name: "startDate",
      title: "Startdato",
      type: "date",
      initialValue: "2026-05-23",
    }),
    defineField({
      name: "endDate",
      title: "Sluttdato",
      type: "date",
      initialValue: "2026-05-24",
    }),
    defineField({
      name: "intro",
      title: "Introtekst",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "accommodation",
      title: "Innkvartering",
      type: "reference",
      to: [{ type: "school" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "groupName" },
  },
});
