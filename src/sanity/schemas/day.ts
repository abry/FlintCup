import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const day = defineType({
  name: "day",
  title: "Turneringsdag",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "date",
      title: "Dato",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      title: "Etikett (f.eks. 'Turneringsdag')",
      type: "string",
    }),
    defineField({
      name: "accommodation",
      title: "Innkvartering denne natten",
      type: "reference",
      to: [{ type: "school" }],
    }),
    defineField({
      name: "entries",
      title: "Programpunkter",
      type: "array",
      of: [{ type: "reference", to: [{ type: "scheduleEntry" }] }],
    }),
  ],
  preview: {
    select: { date: "date", label: "label" },
    prepare: ({ date, label }) => {
      const d = date
        ? new Date(date).toLocaleDateString("nb-NO", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
        : "?";
      return { title: d, subtitle: label };
    },
  },
});
