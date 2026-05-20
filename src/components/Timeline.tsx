import { formatDay, formatTime, getDateKey } from "@/lib/formatTime";

const TYPE_META: Record<string, { label: string; mark: string; tone?: string }> = {
  match: { label: "Kamp", mark: "⚑", tone: "ember" },
  meeting: { label: "Oppmøte", mark: "◎" },
  travel: { label: "Kjøring", mark: "→" },
  meal: { label: "Måltid", mark: "✱" },
  checkin: { label: "Innsjekk", mark: "□" },
  sleep: { label: "Hvile", mark: "·" },
  info: { label: "Info", mark: "i" },
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
    venueName?: string | null;
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
      <div className="programme-card p-6 text-center space-y-2">
        <div className="label">Programmet trykkes</div>
        <p className="font-display italic text-2xl text-[color:var(--ink-soft)]">
          Kamper hentes automatisk fra Profixio
        </p>
        <p className="text-sm text-[color:var(--ink-mute)]">
          Sjekk igjen om et øyeblikk eller kjør synk manuelt.
        </p>
      </div>
    );
  }

  const byDay = groupByDay(entries);

  return (
    <div className="space-y-12">
      {byDay.map(({ dateKey, entries: dayEntries }, dayIndex) => (
        <section key={dateKey} className="rise" style={{ animationDelay: `${dayIndex * 80}ms` }}>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <span className="label">{`Dag ${dayIndex + 1}`}</span>
              <h2 className="display-italic text-[clamp(1.875rem,5vw,2.5rem)] mt-0.5">
                {formatDay(dayEntries[0].time)}
              </h2>
            </div>
            <span className="text-[11px] tracking-[0.18em] uppercase text-[color:var(--ink-mute)]">
              {dayEntries.length} punkter
            </span>
          </div>
          <hr className="rule-double mb-2" />
          <ol className="divide-y divide-[color:var(--rule-soft)]">
            {dayEntries.map((entry, i) => (
              <TimelineRow key={entry._id} entry={entry} index={i} />
            ))}
          </ol>
          <hr className="rule mt-2" />
        </section>
      ))}
    </div>
  );
}

function TimelineRow({ entry, index }: { entry: TimelineEntry; index: number }) {
  const meta = TYPE_META[entry.type] ?? { label: entry.type, mark: "•" };
  const isMatch = entry.type === "match";
  const isOurMatch = entry.match?.weAre === "home" || entry.match?.weAre === "away";

  const matchVenueLabel = entry.match
    ? [
        entry.match.venue?.shortName ??
          entry.match.venue?.name ??
          entry.match.venueName ??
          null,
        entry.match.pitch ? `bane ${entry.match.pitch}` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";
  const where =
    matchVenueLabel ||
    entry.venue?.shortName ||
    entry.venue?.name ||
    entry.school?.name ||
    null;

  return (
    <li
      className="grid grid-cols-[3.5rem_1.5rem_1fr] items-baseline gap-x-4 py-3.5 rise"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <time className="num font-display italic text-2xl tabular-nums text-[color:var(--ink)]">
        {formatTime(entry.time)}
      </time>
      <span
        aria-hidden
        className={[
          "self-baseline text-center font-display italic text-lg leading-none translate-y-[2px]",
          meta.tone === "ember"
            ? "text-[color:var(--ember)]"
            : "text-[color:var(--ink-mute)]",
        ].join(" ")}
      >
        {meta.mark}
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className={[
              "font-display tracking-[-0.01em]",
              isMatch ? "text-[clamp(1.125rem,3.4vw,1.375rem)]" : "text-lg",
              isOurMatch ? "font-semibold" : "font-medium",
            ].join(" ")}
            style={{ fontVariationSettings: '"opsz" 24, "wght" 520' }}
          >
            {entry.title}
          </span>
          <span className="smallcaps text-[10px] text-[color:var(--ink-mute)]">
            {meta.label}
          </span>
        </div>
        {entry.match ? <MatchSummary match={entry.match} /> : null}
        {where ? (
          <div className="text-[12px] text-[color:var(--ink-mute)] mt-1 tracking-[0.02em]">
            {where}
          </div>
        ) : null}
      </div>
    </li>
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
    <div className="mt-1.5 text-[14px] text-[color:var(--ink-soft)] leading-tight">
      <span className={ourHome ? "font-medium text-[color:var(--ink)]" : ""}>
        {match.homeTeam}
      </span>
      <span className="text-[color:var(--rule)] mx-2 italic font-display">vs.</span>
      <span className={!ourHome ? "font-medium text-[color:var(--ink)]" : ""}>
        {match.awayTeam}
      </span>
      {hasScore ? (
        <span className="ml-2 font-display font-semibold num">
          ({match.homeScore}–{match.awayScore})
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
