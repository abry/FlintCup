import { WarningOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const syncLog = defineType({
  name: "syncLog",
  title: "Synk-logg",
  type: "document",
  icon: WarningOutlineIcon,
  fields: [
    defineField({
      name: "timestamp",
      title: "Tidspunkt",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "OK", value: "success" },
          { title: "Feil", value: "error" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Sammendrag",
      type: "string",
    }),
    defineField({
      name: "details",
      title: "Detaljer",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "matchesCreated",
      title: "Kamper opprettet",
      type: "number",
    }),
    defineField({
      name: "matchesUpdated",
      title: "Kamper oppdatert",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Nyeste først",
      name: "timestampDesc",
      by: [{ field: "timestamp", direction: "desc" }],
    },
  ],
  preview: {
    select: { status: "status", timestamp: "timestamp", summary: "summary" },
    prepare: ({ status, timestamp, summary }) => ({
      title: `${status === "success" ? "✓" : "✕"} ${summary ?? "(uten sammendrag)"}`,
      subtitle: timestamp
        ? new Date(timestamp).toLocaleString("nb-NO")
        : "",
    }),
  },
});
