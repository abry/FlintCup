import Link from "next/link";

import { MatchCard, type MatchCardData } from "@/components/MatchCard";
import { formatDateTime } from "@/lib/formatTime";
import { sanityFetch } from "@/sanity/fetch";
import {
  latestSyncQuery,
  ourMatchesQuery,
  tournamentQuery,
} from "@/sanity/queries";

export const revalidate = 60;

type OurMatch = MatchCardData & { _id: string };

type Tournament = {
  name: string | null;
  groupName: string | null;
  ourTeamName: string | null;
  startDate: string | null;
} | null;

type LatestSync = {
  timestamp: string;
  status: string;
  summary: string | null;
} | null;

export default async function HomePage() {
  const [tournament, matches, lastSync] = await Promise.all([
    sanityFetch<Tournament>(tournamentQuery),
    sanityFetch<OurMatch[]>(ourMatchesQuery),
    sanityFetch<LatestSync>(latestSyncQuery),
  ]);

  const now = Date.now();
  const upcoming = matches.find((m) => new Date(m.kickoff).getTime() > now - 30 * 60_000);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {tournament?.groupName ?? "Gruppe L"} ·{" "}
          {tournament?.ourTeamName ?? "Sprint-Jeløy 2"}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">
          {tournament?.name ?? "Flint Cup 2026"}
        </h2>
        <p className="text-muted">
          {matches.length === 0
            ? "Kampene hentes automatisk fra Profixio. Sjekk igjen om et øyeblikk."
            : `${matches.length} kamp${matches.length === 1 ? "" : "er"} på programmet.`}
        </p>
      </section>

      {upcoming ? (
        <section>
          <h3 className="text-xs uppercase tracking-[0.18em] text-muted mb-2">
            Neste kamp
          </h3>
          <MatchCard match={upcoming} />
        </section>
      ) : null}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-[0.18em] text-muted">
            Våre kamper
          </h3>
          <Link
            href="/kamper"
            className="text-xs text-muted underline-offset-4 hover:underline"
          >
            Se gruppen →
          </Link>
        </div>
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map((m) => (
              <MatchCard key={m._id} match={m} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Ingen kamper synket ennå. Kjør{" "}
            <code className="text-xs">/api/cron/profixio-sync</code> eller vent til
            neste auto-synk.
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickLink href="/program" label="Program" sub="Hele dagen, time for time" />
        <QuickLink href="/kamper" label="Kamper" sub="Gruppe og resultater" />
        <QuickLink href="/innkvartering" label="Innkvartering" sub="Skole & pakkeliste" />
        <QuickLink href="/laget" label="Laget" sub="Spillere & foreldre" />
      </section>

      {lastSync ? (
        <p className="text-[11px] text-muted">
          Sist synket fra Profixio: {formatDateTime(lastSync.timestamp)} ·{" "}
          {lastSync.summary ?? lastSync.status}
        </p>
      ) : null}
    </div>
  );
}

function QuickLink({
  href,
  label,
  sub,
}: {
  href: string;
  label: string;
  sub: string;
}) {
  return (
    <Link href={href} className="card p-3 hover:shadow-md transition-shadow">
      <div className="font-semibold">{label}</div>
      <div className="text-xs text-muted">{sub}</div>
    </Link>
  );
}
