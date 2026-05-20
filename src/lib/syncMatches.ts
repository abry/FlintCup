import "server-only";

import type { SanityClient } from "next-sanity";

import { ensureMeetingEntry } from "./generateProgram";
import type { ScrapedMatch } from "./profixio";

type ExistingMatchDoc = {
  _id: string;
  externalId: string;
  status: string;
  kickoff: string;
  homeTeam: string;
  awayTeam: string;
  pitch: string | null;
  venueName: string | null;
  homeScore: number | null;
  awayScore: number | null;
};

export type SyncSummary = {
  created: number;
  updated: number;
  unchanged: number;
  cancelled: number;
  errors: string[];
};

const matchDocId = (externalId: string) => `match-${externalId}`;

export async function syncMatchesToSanity(
  client: SanityClient,
  scraped: ScrapedMatch[],
  ourTeamName: string,
  groupName: string | null,
): Promise<SyncSummary> {
  const summary: SyncSummary = {
    created: 0,
    updated: 0,
    unchanged: 0,
    cancelled: 0,
    errors: [],
  };
  const now = new Date().toISOString();

  const existingDocs = await client.fetch<ExistingMatchDoc[]>(
    `*[_type == "match" && defined(externalId)]{
      _id, externalId, status, kickoff, homeTeam, awayTeam, pitch, venueName, homeScore, awayScore
    }`,
  );
  const existingByExternalId = new Map(existingDocs.map((d) => [d.externalId, d]));
  const seenIds = new Set<string>();

  if (scraped.length === 0 && existingDocs.length > 0) {
    summary.errors.push(
      `Profixio returned 0 matches but ${existingDocs.length} exist in Sanity — refusing to cancel them.`,
    );
    return summary;
  }

  for (const match of scraped) {
    seenIds.add(match.externalId);
    const docId = matchDocId(match.externalId);
    const weAre =
      match.homeTeam === ourTeamName
        ? "home"
        : match.awayTeam === ourTeamName
          ? "away"
          : "none";

    const desiredFields = {
      externalId: match.externalId,
      status: match.status,
      kickoff: match.kickoff,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      weAre,
      pitch: match.pitch,
      venueName: match.venueName,
      groupName,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      lastSyncedAt: now,
    };

    const existing = existingByExternalId.get(match.externalId);

    try {
      if (!existing) {
        await client.createIfNotExists({
          _id: docId,
          _type: "match",
          ...desiredFields,
        });
        summary.created++;
        if (weAre !== "none") {
          await ensureMeetingEntry({ client, match, matchDocId: docId });
        }
        continue;
      }

      const drift =
        existing.kickoff !== match.kickoff ||
        existing.homeTeam !== match.homeTeam ||
        existing.awayTeam !== match.awayTeam ||
        (existing.pitch ?? null) !== (match.pitch ?? null) ||
        (existing.venueName ?? null) !== (match.venueName ?? null) ||
        (existing.homeScore ?? null) !== (match.homeScore ?? null) ||
        (existing.awayScore ?? null) !== (match.awayScore ?? null) ||
        existing.status !== match.status;

      if (drift) {
        await client.patch(existing._id).set(desiredFields).commit();
        summary.updated++;
        if (weAre !== "none") {
          await ensureMeetingEntry({ client, match, matchDocId: existing._id });
        }
      } else {
        await client.patch(existing._id).set({ lastSyncedAt: now }).commit();
        summary.unchanged++;
      }
    } catch (err) {
      summary.errors.push(
        `Match ${match.externalId}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  for (const [externalId, doc] of existingByExternalId) {
    if (seenIds.has(externalId) || doc.status === "cancelled") continue;
    try {
      await client.patch(doc._id).set({ status: "cancelled", lastSyncedAt: now }).commit();
      summary.cancelled++;
    } catch (err) {
      summary.errors.push(
        `Cancel ${externalId}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return summary;
}

export async function writeSyncLog(
  client: SanityClient,
  summary: SyncSummary,
  status: "success" | "error",
  detailMessage?: string,
): Promise<void> {
  await client.create({
    _type: "syncLog",
    timestamp: new Date().toISOString(),
    status,
    summary:
      status === "success"
        ? `${summary.created} opprettet, ${summary.updated} oppdatert, ${summary.unchanged} uendret, ${summary.cancelled} avlyst`
        : detailMessage ?? "Ukjent feil",
    matchesCreated: summary.created,
    matchesUpdated: summary.updated,
    details:
      summary.errors.length > 0
        ? summary.errors.join("\n")
        : detailMessage,
  });
}
