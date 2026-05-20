import { MatchCard, type MatchCardData } from "@/components/MatchCard";
import { sanityFetch } from "@/sanity/fetch";
import {
  groupMatchesQuery,
  ourMatchesQuery,
  tournamentQuery,
} from "@/sanity/queries";

export const revalidate = 60;

type Match = MatchCardData & { _id: string };
type Tournament = {
  groupName: string | null;
  ourTeamName: string | null;
} | null;

export default async function MatchesPage() {
  const tournament = await sanityFetch<Tournament>(tournamentQuery);
  const groupName = tournament?.groupName ?? "Gruppe L";

  const [groupMatches, ourMatches] = await Promise.all([
    sanityFetch<Match[]>(groupMatchesQuery, { groupName }),
    sanityFetch<Match[]>(ourMatchesQuery),
  ]);

  const all = groupMatches.length > 0 ? groupMatches : ourMatches;

  if (all.length === 0) {
    return (
      <div className="card-info">
        <div
          className="text-sm font-bold mb-2"
          style={{ color: "var(--primary)" }}
        >
          Ingen kamper synket ennå
        </div>
        <p className="text-sm" style={{ color: "var(--ink-mute)" }}>
          Profixio synker hvert 10. minutt under turneringen.
        </p>
      </div>
    );
  }

  return (
    <div>
      <DayDivider label={`⚽ ${groupName}`} />
      {all.map((m) => (
        <MatchCard key={m._id} match={m} />
      ))}
    </div>
  );
}

function DayDivider({ label }: { label: string }) {
  return (
    <div className="day-divider">
      <span>{label}</span>
    </div>
  );
}
