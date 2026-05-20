import { Timeline, type TimelineEntry } from "@/components/Timeline";
import type { MatchCardData } from "@/components/MatchCard";
import { sanityFetch } from "@/sanity/fetch";
import { ourMatchesQuery, scheduleQuery } from "@/sanity/queries";

export const revalidate = 60;

type OurMatch = MatchCardData & { _id: string };

export default async function ProgramPage() {
  const [scheduleEntries, ourMatches] = await Promise.all([
    sanityFetch<TimelineEntry[]>(scheduleQuery),
    sanityFetch<OurMatch[]>(ourMatchesQuery),
  ]);

  const combined = mergeTimeline(scheduleEntries, ourMatches);
  return <Timeline entries={combined} />;
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
