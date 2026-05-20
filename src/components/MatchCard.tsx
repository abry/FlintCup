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
  matchNumber?: number | null;
};

type Props = {
  match: MatchCardData;
  emphasis?: "hero" | "default";
};

export function MatchCard({ match, emphasis = "default" }: Props) {
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

  const status = match.status;

  return (
    <article
      className={[
        "programme-card relative",
        emphasis === "hero" ? "p-6 sm:p-8" : "p-5",
      ].join(" ")}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {match.matchNumber ? (
            <span className="badge-number num shrink-0">
              {match.matchNumber}
            </span>
          ) : null}
          <div className="space-y-0.5">
            <div className="label">Kickoff · Lørdag</div>
            <time
              className={[
                "block display-italic num",
                emphasis === "hero"
                  ? "text-[clamp(3.5rem,16vw,5.5rem)]"
                  : "text-5xl",
              ].join(" ")}
            >
              {formatTime(match.kickoff)}
            </time>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {isOurs ? (
            <span className="pill pill-ember">
              <SparkIcon /> Vår kamp
            </span>
          ) : null}
          {status === "cancelled" ? (
            <span className="pill pill-cancelled">Avlyst</span>
          ) : status === "played" ? (
            <span className="pill pill-played">Spilt</span>
          ) : status === "live" ? (
            <span className="pill pill-ember pulse-soft">Pågår</span>
          ) : null}
        </div>
      </header>
      <hr className="rule-dashed mt-5 mb-4" />
      <div className="space-y-2">
        <TeamRow
          name={match.homeTeam}
          score={match.homeScore}
          highlight={ourHome}
          showScore={hasScore}
          side="H"
        />
        <TeamRow
          name={match.awayTeam}
          score={match.awayScore}
          highlight={!ourHome && isOurs}
          showScore={hasScore}
          side="B"
        />
      </div>
      {venueLabel ? (
        <>
          <hr className="rule mt-5 mb-3" />
          <div className="flex items-center justify-between text-[12px] tracking-[0.04em] text-[color:var(--ink-mute)]">
            <span className="smallcaps text-[10.5px]">{venueLabel}</span>
            {match.externalId ? (
              <a
                href={`https://www.profixio.com/app/flint-u14-cup-2026/match/${match.externalId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-edit smallcaps text-[10.5px]"
              >
                Profixio →
              </a>
            ) : null}
          </div>
        </>
      ) : null}
    </article>
  );
}

function TeamRow({
  name,
  score,
  highlight,
  showScore,
  side,
}: {
  name: string;
  score: number | null;
  highlight: boolean;
  showScore: boolean;
  side: "H" | "B";
}) {
  return (
    <div
      className={[
        "grid grid-cols-[1.25rem_1fr_auto] items-baseline gap-3",
        highlight ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]",
      ].join(" ")}
    >
      <span
        className="font-display italic num text-base text-[color:var(--ink-mute)]"
        aria-hidden
      >
        {side}
      </span>
      <span
        className={[
          "font-display truncate",
          highlight ? "font-semibold" : "font-medium",
        ].join(" ")}
        style={{
          fontVariationSettings: '"opsz" 32, "wght" ' + (highlight ? "560" : "440"),
          fontSize: "clamp(1.125rem, 4vw, 1.375rem)",
          letterSpacing: "-0.01em",
        }}
      >
        {name}
      </span>
      <span className="num font-display font-semibold text-2xl tabular-nums">
        {showScore ? (score ?? "–") : <span className="text-[color:var(--rule)]">–</span>}
      </span>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 12 12" className="w-3 h-3 -ml-0.5" aria-hidden>
      <path
        d="M6 0L7 4.5L11.5 6L7 7.5L6 12L5 7.5L0.5 6L5 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
