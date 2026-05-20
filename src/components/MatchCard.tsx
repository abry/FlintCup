import { formatTime } from "@/lib/formatTime";

export type MatchCardData = {
  externalId: string | null;
  status: string;
  kickoff: string;
  homeTeam: string;
  awayTeam: string;
  weAre: "home" | "away" | "none";
  pitch: string | null;
  venueName: string | null;
  homeScore: number | null;
  awayScore: number | null;
  venue: { name: string | null; shortName: string | null } | null;
  matchNumber?: number | null;
};

const OUR_TEAM_HINT = "Sprint-Jeløy";

export function MatchCard({ match }: { match: MatchCardData }) {
  const isOurs = match.weAre !== "none";
  const ourHome = match.weAre === "home";
  const ourAway = match.weAre === "away";

  const venue = match.venueName ?? match.venue?.name ?? null;
  const pitch = match.pitch ? `b.${match.pitch}` : null;
  const venueLabel =
    venue && pitch
      ? `${shortenVenue(venue)} ${pitch}`
      : (venue && shortenVenue(venue)) || pitch || "TBD";

  const hasScore =
    match.homeScore !== null &&
    match.homeScore !== undefined &&
    match.awayScore !== null &&
    match.awayScore !== undefined;

  return (
    <div className="tile tile-match">
      <span
        className="tile-time tile-time-match"
        style={{ color: "var(--amber-warm)" }}
      >
        {formatTime(match.kickoff)}
      </span>
      <span className="flex-1 text-sm">
        <span
          style={{
            color: ourHome ? "var(--primary)" : "var(--ink)",
            fontWeight: ourHome ? 700 : 500,
          }}
        >
          {match.homeTeam}
        </span>
        <span className="mx-1.5" style={{ color: "var(--ink-muter)" }}>
          –
        </span>
        <span
          style={{
            color: ourAway ? "var(--primary)" : "var(--ink)",
            fontWeight: ourAway ? 700 : 500,
          }}
        >
          {match.awayTeam}
        </span>
        {hasScore ? (
          <span
            className="ml-2 text-xs font-bold tabular-nums"
            style={{ color: "var(--ink)" }}
          >
            {match.homeScore}–{match.awayScore}
          </span>
        ) : null}
        {!isOurs ? (
          <span className="ml-1" style={{ color: "var(--ink-muter)" }}>
            {" "}
          </span>
        ) : null}
      </span>
      <span
        className="text-xs px-2 py-0.5 rounded-lg font-medium whitespace-nowrap"
        style={{ background: "var(--primary)", color: "#fff" }}
        title={[venue, pitch].filter(Boolean).join(" ")}
      >
        {venueLabel}
      </span>
    </div>
  );
}

function shortenVenue(name: string): string {
  if (/ESSO/i.test(name)) return "ESSO";
  if (/Tønsberg Gressbane/i.test(name)) return "T. Gress.";
  if (/Åsgårdstrand/i.test(name)) return "Åsgård.";
  if (/Greveskogen/i.test(name)) return "Grevesk.";
  return name.length > 10 ? name.slice(0, 10).trimEnd() + "." : name;
}
