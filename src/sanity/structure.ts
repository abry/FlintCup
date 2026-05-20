import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteSettings", "tournament"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innhold")
    .items([
      S.listItem()
        .title("Nettstedinnstillinger")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Turnering")
        .id("tournament")
        .child(S.document().schemaType("tournament").documentId("tournament")),
      S.divider(),
      S.documentTypeListItem("day").title("Turneringsdager"),
      S.documentTypeListItem("scheduleEntry").title("Programpunkter"),
      S.documentTypeListItem("match").title("Kamper"),
      S.documentTypeListItem("standings").title("Tabeller"),
      S.divider(),
      S.documentTypeListItem("venue").title("Baner"),
      S.documentTypeListItem("school").title("Skoler"),
      S.documentTypeListItem("player").title("Spillere"),
      S.divider(),
      S.documentTypeListItem("syncLog").title("Synk-logg"),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            ...SINGLETONS,
            "day",
            "scheduleEntry",
            "match",
            "standings",
            "venue",
            "school",
            "player",
            "syncLog",
          ].includes(item.getId() as string),
      ),
    ]);
