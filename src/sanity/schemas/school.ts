import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const school = defineType({
  name: "school",
  title: "Skole / innkvartering",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "string",
    }),
    defineField({
      name: "checkInTime",
      title: "Innsjekk (HH:MM)",
      type: "string",
      initialValue: "19:00",
    }),
    defineField({
      name: "checkOutTime",
      title: "Utsjekk (HH:MM)",
      type: "string",
      initialValue: "11:00",
    }),
    defineField({
      name: "rules",
      title: "Regler / praktisk",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "packingList",
      title: "Pakkeliste",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "address" },
  },
});
