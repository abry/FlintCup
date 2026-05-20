import type { SchemaTypeDefinition } from "sanity";

import { day } from "./day";
import { match } from "./match";
import { player } from "./player";
import { scheduleEntry } from "./scheduleEntry";
import { school } from "./school";
import { siteSettings } from "./siteSettings";
import { standings } from "./standings";
import { syncLog } from "./syncLog";
import { tournament } from "./tournament";
import { venue } from "./venue";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  tournament,
  match,
  venue,
  school,
  scheduleEntry,
  day,
  player,
  standings,
  syncLog,
];
