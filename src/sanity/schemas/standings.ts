import { BarChartIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const standings = defineType({
  name: "standings",
  title: "Tabell",
  type: "document",
  icon: BarChartIcon,
  fields: [
    defineField({
      name: "groupName",
      title: "Gruppe",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "lastSyncedAt",
      title: "Sist synket",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "rows",
      title: "Rader",
      type: "array",
      of: [
        {
          type: "object",
          name: "row",
          fields: [
            defineField({ name: "rank", title: "Plass", type: "number" }),
            defineField({ name: "team", title: "Lag", type: "string" }),
            defineField({ name: "played", title: "Kamper", type: "number" }),
            defineField({ name: "won", title: "V", type: "number" }),
            defineField({ name: "drawn", title: "U", type: "number" }),
            defineField({ name: "lost", title: "T", type: "number" }),
            defineField({ name: "gf", title: "Mål for", type: "number" }),
            defineField({ name: "ga", title: "Mål mot", type: "number" }),
            defineField({ name: "points", title: "Poeng", type: "number" }),
          ],
          preview: {
            select: { rank: "rank", team: "team", points: "points" },
            prepare: ({ rank, team, points }) => ({
              title: `${rank ?? "?"}. ${team ?? "?"}`,
              subtitle: `${points ?? 0} poeng`,
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "groupName", subtitle: "lastSyncedAt" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "Tabell",
      subtitle: subtitle
        ? `Synket ${new Date(subtitle).toLocaleString("nb-NO")}`
        : "Ikke synket",
    }),
  },
});
