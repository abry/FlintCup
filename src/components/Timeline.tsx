import { formatTime, formatDay, getDateKey } from "@/lib/formatTime";

const TYPE_META: Record<string, { label: string; emoji: string }> = {
  match: { label: "Kamp", emoji: "⚽" },
  meeting: { label: "Oppmøte", emoji: "📍" },
  travel: { label: "Kjøring", emoji: "🚗" },
  meal: { label: "Måltid", emoji: "🍴" },
  checkin: { label: "Innsjekk", emoji: "🛏" },
  sleep: { label: "Hvile", emoji: "💤" },
  info: { label: "Info", emoji: "ℹ︎" },
};

export type TimelineEntry = {
  _id: string;
  time: string;
  type: string;
  title: string;
  match?: {
    homeTeam?: string | null;
    awayTeam?: string | null;
    weAre?: string | null;
    pitch?: string | null;
    homeScore?: number | null;
    awayScore?: number | null;
    venue?: { shortName?: string | null; name?: string | null } | null;
  } | null;
  venue?: { name?: string | null; shortName?: string | null; address?: string | null } | null;
  school?: { name?: string | null; address?: string | null } | null;
};

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted">
        Ingen programpunkter ennå — kamper hentes automatisk fra Profixio. Sjekk igjen
        om noen minutter.
      </p>
    );
  }

  const byDay = groupByDay(entries);

  return (
    <div className="space-y-8">
      {byDay.map(({ dateKey, entries: dayEntries }) => (
        <section key={dateKey}>
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted mb-3">
            {formatDay(dayEntries[0].time)}
          </h2>
          <ol className="relative space-y-3 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-line">
            {dayEntries.map((entry) => (
              <li key={entry._id} className="relative pl-12">
                <span
                  aria-hidden
                  className="absolute left-0 top-1 h-8 w-8 rounded-full bg-surface border border-line flex items-center justify-center text-base shadow-sm"
                >
                  {TYPE_META[entry.type]?.emoji ?? "•"}
                </span>
                <div className="card p-3">
                  <div className="flex items-center justify-between gap-3">
                    <time className="font-semibold tabular-nums tracking-tight">
                      {formatTime(entry.time)}
                    </time>
                    <span className="pill">
                      {TYPE_META[entry.type]?.label ?? entry.type}
                    </span>
                  </div>
                  <div className="mt-1 font-medium">{entry.title}</div>
                  {entry.match ? <MatchSummary match={entry.match} /> : null}
                  {entry.venue?.name ? (
                    <div className="mt-1 text-xs text-muted">
                      {entry.venue.shortName ?? entry.venue.name}
                      {entry.venue.address ? ` · ${entry.venue.address}` : ""}
                    </div>
                  ) : null}
                  {entry.school?.name ? (
                    <div className="mt-1 text-xs text-muted">
                      {entry.school.name}
                      {entry.school.address ? ` · ${entry.school.address}` : ""}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

function MatchSummary({ match }: { match: NonNullable<TimelineEntry["match"]> }) {
  const ourHome = match.weAre === "home";
  const hasScore =
    match.homeScore !== null &&
    match.homeScore !== undefined &&
    match.awayScore !== null &&
    match.awayScore !== undefined;
  return (
    <div className="mt-2 grid grid-cols-[1fr_auto] gap-x-3 text-sm">
      <span className={ourHome ? "font-semibold" : ""}>{match.homeTeam}</span>
      <span className="font-bold tabular-nums">
        {hasScore ? match.homeScore : ""}
      </span>
      <span className={!ourHome ? "font-semibold" : ""}>{match.awayTeam}</span>
      <span className="font-bold tabular-nums">
        {hasScore ? match.awayScore : ""}
      </span>
      {match.venue?.shortName || match.pitch ? (
        <span className="col-span-2 text-xs text-muted mt-1">
          {match.venue?.shortName ??
            [match.venue?.name, match.pitch ? `bane ${match.pitch}` : null]
              .filter(Boolean)
              .join(", ")}
        </span>
      ) : null}
    </div>
  );
}

function groupByDay(entries: TimelineEntry[]): {
  dateKey: string;
  entries: TimelineEntry[];
}[] {
  const map = new Map<string, TimelineEntry[]>();
  for (const e of entries) {
    const key = getDateKey(e.time);
    const arr = map.get(key) ?? [];
    arr.push(e);
    map.set(key, arr);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, entries]) => ({ dateKey, entries }));
}
