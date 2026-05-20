import { MatchCard, type MatchCardData } from "@/components/MatchCard";
import { sanityFetch } from "@/sanity/fetch";
import {
  groupMatchesQuery,
  ourMatchesQuery,
  tournamentQuery,
} from "@/sanity/queries";

export const revalidate = 60;

type GroupMatch = MatchCardData & { _id: string };
type Tournament = {
  groupName: string | null;
  ourTeamName: string | null;
} | null;

export default async function MatchesPage() {
  const tournament = await sanityFetch<Tournament>(tournamentQuery);
  const groupName = tournament?.groupName ?? "Gruppe L";

  const [groupMatches, ourMatches] = await Promise.all([
    sanityFetch<GroupMatch[]>(groupMatchesQuery, { groupName }),
    sanityFetch<GroupMatch[]>(ourMatchesQuery),
  ]);

  const allMatches = groupMatches.length > 0 ? groupMatches : ourMatches;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {groupName}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">Kamper</h2>
      </header>
      {allMatches.length === 0 ? (
        <p className="text-sm text-muted">
          Ingen kamper synket ennå. Auto-synk fra Profixio går hvert 10. minutt
          under turneringen.
        </p>
      ) : (
        <div className="space-y-3">
          {allMatches.map((m) => (
            <MatchCard key={m._id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
