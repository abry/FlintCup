import { formatTime } from "@/lib/formatTime";

export type MatchCardData = {
  externalId: string | null;
  status: string;
  kickoff: string;
  homeTeam: string;
  awayTeam: string;
  weAre: "home" | "away" | "none";
  pitch: string | null;
  homeScore: number | null;
  awayScore: number | null;
  venue: { name: string | null; shortName: string | null } | null;
};

const OUR_PILL = (
  <span className="pill pill-accent">Vår kamp</span>
);

export function MatchCard({ match }: { match: MatchCardData }) {
  const isOurs = match.weAre !== "none";
  const ourHome = match.weAre === "home";
  const venueLabel =
    match.venue?.shortName ??
    [match.venue?.name, match.pitch ? `bane ${match.pitch}` : null]
      .filter(Boolean)
      .join(", ");
  const hasScore =
    match.homeScore !== null &&
    match.homeScore !== undefined &&
    match.awayScore !== null &&
    match.awayScore !== undefined;

  return (
    <article
      className={`card p-4 ${isOurs ? "ring-1 ring-[color:var(--color-accent)]/40" : ""}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <time className="text-2xl font-semibold tabular-nums tracking-tight">
          {formatTime(match.kickoff)}
        </time>
        <div className="flex items-center gap-2">
          {match.status === "cancelled" ? (
            <span className="pill pill-live">Avlyst</span>
          ) : match.status === "played" ? (
            <span className="pill pill-played">Ferdig</span>
          ) : match.status === "live" ? (
            <span className="pill pill-live">Pågår</span>
          ) : null}
          {isOurs ? OUR_PILL : null}
        </div>
      </div>
      <div className="space-y-1">
        <TeamRow
          name={match.homeTeam}
          score={match.homeScore}
          highlight={ourHome}
          showScore={hasScore}
        />
        <TeamRow
          name={match.awayTeam}
          score={match.awayScore}
          highlight={!ourHome && isOurs}
          showScore={hasScore}
        />
      </div>
      {venueLabel ? (
        <div className="mt-3 text-xs text-muted">{venueLabel}</div>
      ) : null}
    </article>
  );
}

function TeamRow({
  name,
  score,
  highlight,
  showScore,
}: {
  name: string;
  score: number | null;
  highlight: boolean;
  showScore: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 ${
        highlight ? "text-[color:var(--color-primary)]" : "text-foreground"
      }`}
    >
      <span
        className={`truncate ${highlight ? "font-semibold" : "font-medium"}`}
      >
        {name}
      </span>
      {showScore ? (
        <span className="font-bold tabular-nums">{score ?? "–"}</span>
      ) : null}
    </div>
  );
}
