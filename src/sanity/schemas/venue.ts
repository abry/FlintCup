import { PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const venue = defineType({
  name: "venue",
  title: "Bane / anlegg",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortName",
      title: "Kortnavn (vises i kort/tidslinje)",
      type: "string",
      description: 'F.eks. "ESSO b.4" eller "Tønsberg Gressb. b.10"',
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "string",
    }),
    defineField({
      name: "lat",
      title: "Breddegrad",
      type: "number",
    }),
    defineField({
      name: "lng",
      title: "Lengdegrad",
      type: "number",
    }),
    defineField({
      name: "drivingMinutesFromBase",
      title: "Kjøretid fra basen (min)",
      type: "number",
      description: "Brukes til å auto-beregne kjøreentries",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "shortName" },
  },
});
