import { MatchCard } from "@/components/MatchCard";
import { formatTime, formatDay, getDateKey } from "@/lib/formatTime";

const TYPE_META: Record<string, { icon: string; tile: string; time: string; text?: string }> = {
  meeting: {
    icon: "📍",
    tile: "tile tile-meeting",
    time: "tile-time tile-time-meeting",
  },
  info: {
    icon: "📍",
    tile: "tile tile-info",
    time: "tile-time tile-time-info",
  },
  travel: {
    icon: "🚗",
    tile: "tile tile-travel",
    time: "tile-time tile-time-travel",
  },
  meal: {
    icon: "🍽",
    tile: "tile tile-meal",
    time: "tile-time tile-time-meal",
  },
  checkin: {
    icon: "🛏",
    tile: "tile tile-checkin",
    time: "tile-time tile-time-checkin",
  },
  sleep: {
    icon: "😴",
    tile: "tile tile-sleep",
    time: "tile-time tile-time-sleep",
    text: "tile-text tile-text-sleep",
  },
};

const DAY_NAMES_NB = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];

export type TimelineEntry = {
  _id: string;
  time: string;
  type: string;
  title: string;
  match?: {
    _id?: string;
    externalId?: string | null;
    status?: string | null;
    kickoff?: string | null;
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
      <div className="card-info">
        <div
          className="text-sm font-bold mb-2"
          style={{ color: "var(--primary)" }}
        >
          Programmet trykkes ennå
        </div>
        <div className="text-sm" style={{ color: "var(--ink-mute)" }}>
          Kampene hentes automatisk fra Profixio.
        </div>
      </div>
    );
  }

  const byDay = groupByDay(entries);

  return (
    <div>
      {byDay.map(({ entries: dayEntries }) => (
        <section key={getDateKey(dayEntries[0].time)}>
          <DayDivider iso={dayEntries[0].time} />
          {dayEntries.map((entry) => (
            <Row key={entry._id} entry={entry} />
          ))}
        </section>
      ))}
    </div>
  );
}

function DayDivider({ iso }: { iso: string }) {
  const d = new Date(iso);
  const weekday = DAY_NAMES_NB[d.getDay()];
  const dayMonth = formatDay(iso).replace(/^(\S+\s)/, ""); // drop weekday from "lørdag 23. mai"
  return (
    <div className="day-divider">
      <span>🗓 {weekday} {dayMonth}</span>
    </div>
  );
}

function Row({ entry }: { entry: TimelineEntry }) {
  if (entry.type === "match" && entry.match) {
    return (
      <MatchCard
        match={{
          externalId: entry.match.externalId ?? null,
          status: entry.match.status ?? "scheduled",
          kickoff: entry.match.kickoff ?? entry.time,
          homeTeam: entry.match.homeTeam ?? "",
          awayTeam: entry.match.awayTeam ?? "",
          weAre: (entry.match.weAre as "home" | "away" | "none") ?? "none",
          pitch: entry.match.pitch ?? null,
          venueName: entry.match.venueName ?? null,
          homeScore: entry.match.homeScore ?? null,
          awayScore: entry.match.awayScore ?? null,
          venue: entry.match.venue
            ? {
                name: entry.match.venue.name ?? null,
                shortName: entry.match.venue.shortName ?? null,
              }
            : null,
        }}
      />
    );
  }

  const meta = TYPE_META[entry.type] ?? TYPE_META.info;

  return (
    <div className={meta.tile}>
      <span className={meta.time}>{formatTime(entry.time)}</span>
      <span className={meta.text ?? "tile-text"}>
        {meta.icon} {entry.title}
      </span>
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
