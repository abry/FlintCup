import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const player = defineType({
  name: "player",
  title: "Spiller",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shirtNumber",
      title: "Draktnummer",
      type: "number",
    }),
    defineField({
      name: "position",
      title: "Posisjon",
      type: "string",
    }),
    defineField({
      name: "parents",
      title: "Foreldre / pårørende",
      type: "array",
      of: [
        {
          type: "object",
          name: "parent",
          fields: [
            defineField({ name: "name", title: "Navn", type: "string" }),
            defineField({ name: "phone", title: "Telefon", type: "string" }),
            defineField({ name: "email", title: "E-post", type: "string" }),
            defineField({
              name: "carSeats",
              title: "Antall plasser i bil",
              type: "number",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "phone" },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Draktnummer",
      name: "shirtNumberAsc",
      by: [{ field: "shirtNumber", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "shirtNumber", position: "position" },
    prepare: ({ title, subtitle, position }) => ({
      title,
      subtitle: subtitle ? `#${subtitle}${position ? ` · ${position}` : ""}` : position,
    }),
  },
});
