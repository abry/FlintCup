import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const match = defineType({
  name: "match",
  title: "Kamp",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "externalId",
      title: "Profixio-id",
      description: "Unik id fra Profixio-skraping; brukes til diff/oppdatering.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Planlagt", value: "scheduled" },
          { title: "Pågår", value: "live" },
          { title: "Ferdigspilt", value: "played" },
          { title: "Avlyst", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "scheduled",
    }),
    defineField({
      name: "kickoff",
      title: "Kickoff",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "homeTeam",
      title: "Hjemmelag",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "awayTeam",
      title: "Bortelag",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "weAre",
      title: "Vi er",
      type: "string",
      options: {
        list: [
          { title: "Hjemme", value: "home" },
          { title: "Borte", value: "away" },
          { title: "Følger bare", value: "none" },
        ],
        layout: "radio",
      },
      initialValue: "home",
    }),
    defineField({
      name: "venue",
      title: "Bane",
      type: "reference",
      to: [{ type: "venue" }],
    }),
    defineField({
      name: "pitch",
      title: "Pitch / banenr. (fallback hvis venue mangler)",
      type: "string",
    }),
    defineField({
      name: "groupName",
      title: "Gruppe",
      type: "string",
    }),
    defineField({
      name: "homeScore",
      title: "Hjemmemål",
      type: "number",
    }),
    defineField({
      name: "awayScore",
      title: "Bortemål",
      type: "number",
    }),
    defineField({
      name: "lastSyncedAt",
      title: "Sist synket",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      home: "homeTeam",
      away: "awayTeam",
      kickoff: "kickoff",
      pitch: "pitch",
      venueName: "venue.shortName",
    },
    prepare: ({ home, away, kickoff, pitch, venueName }) => {
      const time = kickoff
        ? new Date(kickoff).toLocaleString("nb-NO", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "?";
      return {
        title: `${home} – ${away}`,
        subtitle: `${time} · ${venueName ?? pitch ?? "?"}`,
      };
    },
  },
});
