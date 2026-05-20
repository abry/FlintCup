import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

const SINGLETONS = new Set(["siteSettings", "tournament"]);

export default defineConfig({
  name: "default",
  title: "Flint Cup 2026 — Sprint-Jeløy G14-2",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    actions: (input, context) => {
      if (SINGLETONS.has(context.schemaType)) {
        return input.filter(
          ({ action }) =>
            !["duplicate", "unpublish", "delete"].includes(action ?? ""),
        );
      }
      return input;
    },
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
