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
    <article className="space-y-8">
      <header className="rise">
        <span className="label">Sak 02</span>
        <h2
          className="display-italic mt-2 text-[clamp(2.25rem,7.5vw,3.25rem)]"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
        >
          Gruppespillet
        </h2>
        <p className="mt-3 max-w-md text-[15px] text-[color:var(--ink-soft)] leading-relaxed">
          {groupName} samler åtte lag på lørdag. Resultater hentes inn
          automatisk fra Profixio mens kampene spilles.
        </p>
        <hr className="rule-double mt-6" />
      </header>
      {allMatches.length === 0 ? (
        <div className="programme-card p-6 space-y-2 text-center">
          <span className="stamp">Tomt</span>
          <p className="font-display italic text-xl mt-2">
            Auto-synk fra Profixio hvert 10. minutt under turneringen.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allMatches.map((m, i) => (
            <div
              key={m._id}
              className="rise"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <MatchCard match={m} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
