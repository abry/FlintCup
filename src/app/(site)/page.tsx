import { Timeline, type TimelineEntry } from "@/components/Timeline";
import type { MatchCardData } from "@/components/MatchCard";
import { sanityFetch } from "@/sanity/fetch";
import {
  latestSyncQuery,
  ourMatchesQuery,
  scheduleQuery,
  tournamentQuery,
} from "@/sanity/queries";
import { formatDateTime } from "@/lib/formatTime";

export const revalidate = 60;

type OurMatch = MatchCardData & { _id: string };

type Tournament = {
  name: string | null;
  groupName: string | null;
  ourTeamName: string | null;
  startDate: string | null;
  endDate: string | null;
  accommodation: {
    name: string | null;
    address: string | null;
    checkInTime: string | null;
    checkOutTime: string | null;
  } | null;
} | null;

type LatestSync = {
  timestamp: string;
  status: string;
  summary: string | null;
} | null;

export default async function HomePage() {
  const [tournament, scheduleEntries, ourMatches, lastSync] = await Promise.all([
    sanityFetch<Tournament>(tournamentQuery),
    sanityFetch<TimelineEntry[]>(scheduleQuery),
    sanityFetch<OurMatch[]>(ourMatchesQuery),
    sanityFetch<LatestSync>(latestSyncQuery),
  ]);

  const combined = mergeTimeline(scheduleEntries, ourMatches);

  const school = tournament?.accommodation;

  return (
    <div className="space-y-4">
      <Timeline entries={combined} />

      {school ? (
        <div
          className="rounded-xl border p-4 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="text-sm font-bold mb-2"
            style={{ color: "var(--primary)" }}
          >
            🏠 {school.name}
          </div>
          <div
            className="text-sm leading-relaxed space-y-1"
            style={{ color: "var(--ink-mute)" }}
          >
            {school.address ? <p>📍 {school.address}</p> : null}
            <p>
              Innsjekk{" "}
              <strong style={{ color: "var(--ink)" }}>
                {school.checkInTime ?? "19:00"}
              </strong>{" "}
              · Utsjekk{" "}
              <strong style={{ color: "var(--red)" }}>
                {school.checkOutTime ?? "11:00"}
              </strong>
            </p>
          </div>
        </div>
      ) : null}

      {ourMatches.length === 0 ? (
        <div className="card-info">
          <div
            className="text-sm font-bold mb-2"
            style={{ color: "var(--amber)" }}
          >
            Ingen kamper synket ennå
          </div>
          <p className="text-sm" style={{ color: "var(--ink-mute)" }}>
            Profixio synker hvert 10. minutt under turneringen.
          </p>
        </div>
      ) : null}

      {lastSync ? (
        <p
          className="text-center text-[11px] mt-2"
          style={{ color: "var(--ink-muter)" }}
        >
          Sist synket {formatDateTime(lastSync.timestamp)} ·{" "}
          {lastSync.summary ?? lastSync.status}
        </p>
      ) : null}
    </div>
  );
}

function mergeTimeline(
  entries: TimelineEntry[],
  matches: OurMatch[],
): TimelineEntry[] {
  const fromEntries = entries.filter((e) => e.type !== "match");
  const fromMatches: TimelineEntry[] = matches.map((m) => ({
    _id: `match-${m._id}`,
    time: m.kickoff,
    type: "match",
    title: `${m.homeTeam} – ${m.awayTeam}`,
    match: {
      _id: m._id,
      externalId: m.externalId,
      status: m.status,
      kickoff: m.kickoff,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      weAre: m.weAre,
      pitch: m.pitch,
      venueName: m.venueName,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      venue: m.venue,
    },
  }));
  return [...fromEntries, ...fromMatches].sort((a, b) =>
    a.time.localeCompare(b.time),
  );
}
