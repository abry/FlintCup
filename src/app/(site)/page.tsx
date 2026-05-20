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
  const upcoming =
    matches.find((m) => new Date(m.kickoff).getTime() > now - 30 * 60_000) ??
    matches[0];
  const rest = upcoming ? matches.filter((m) => m._id !== upcoming._id) : matches;

  return (
    <div className="space-y-14 sm:space-y-16">
      <Hero
        teamLabel={tournament?.ourTeamName ?? "Sprint-Jeløy 2"}
        groupLabel={tournament?.groupName ?? "Gruppe L"}
        matchCount={matches.length}
      />

      {upcoming ? (
        <section className="rise" style={{ animationDelay: "120ms" }}>
          <SectionHead label="Neste fløyte" suffix="Hovedkamp" />
          <MatchCard match={upcoming} emphasis="hero" />
        </section>
      ) : (
        <EmptyHero />
      )}

      <section className="rise" style={{ animationDelay: "200ms" }}>
        <SectionHead
          label="Dagens kupp"
          suffix={`${matches.length || "0"} kamper · ${tournament?.groupName ?? "Gruppe L"}`}
        />
        {rest.length > 0 ? (
          <div className="space-y-4">
            {rest.map((m, i) => (
              <div
                key={m._id}
                className="rise"
                style={{ animationDelay: `${260 + i * 60}ms` }}
              >
                <MatchCard match={m} />
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <EmptyMatches />
        ) : null}
      </section>

      <Sections />

      {lastSync ? (
        <p className="text-[11px] tracking-[0.18em] uppercase text-[color:var(--ink-mute)] text-center">
          Synket {formatDateTime(lastSync.timestamp)} · {lastSync.summary ?? lastSync.status}
        </p>
      ) : null}
    </div>
  );
}

function Hero({
  teamLabel,
  groupLabel,
  matchCount,
}: {
  teamLabel: string;
  groupLabel: string;
  matchCount: number;
}) {
  return (
    <section className="rise">
      <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <span className="label">Tønsberg · 23. mai 2026</span>
          <p
            className="display-italic mt-3 text-[clamp(2rem,7vw,3.25rem)]"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            En lang lørdag i{" "}
            <span className="not-italic display-roman ember-text">grus, gress og adrenalin</span>{" "}
            — fire kamper, én gruppe, ett lag.
          </p>
          <p className="mt-4 max-w-md text-[15px] text-[color:var(--ink-soft)] leading-relaxed">
            Matchday-programme for {teamLabel} i Flint Cup 2026. Kampene
            oppdateres automatisk fra Profixio. Trener legger inn øvrig
            informasjon i Studio.
          </p>
        </div>
        <Datum
          rows={[
            { k: "Lag", v: teamLabel },
            { k: "Gruppe", v: groupLabel },
            { k: "Kamper", v: matchCount > 0 ? `${matchCount}` : "—" },
            { k: "Bo", v: "Husvik" },
          ]}
        />
      </div>
    </section>
  );
}

function Datum({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <dl className="border border-[color:var(--rule)] bg-[color:var(--surface-warm)] p-4 min-w-[14rem]">
      {rows.map((r, i) => (
        <div
          key={r.k}
          className={[
            "flex items-baseline justify-between gap-3 py-1.5",
            i !== rows.length - 1 ? "border-b border-dashed border-[color:var(--rule-soft)]" : "",
          ].join(" ")}
        >
          <dt className="smallcaps text-[10.5px] text-[color:var(--ink-mute)]">{r.k}</dt>
          <dd className="font-display italic num text-base text-[color:var(--ink)]">
            {r.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SectionHead({ label, suffix }: { label: string; suffix?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <h3
        className="display-italic text-[clamp(1.5rem,4.5vw,2rem)]"
        style={{ fontVariationSettings: '"opsz" 60, "wght" 480' }}
      >
        {label}
      </h3>
      {suffix ? (
        <span className="smallcaps text-[10.5px] text-[color:var(--ink-mute)] shrink-0">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function EmptyHero() {
  return (
    <section className="programme-card p-7 text-center space-y-2 rise">
      <span className="stamp stamp-ember">Trykt i overmorgen</span>
      <h3 className="display-italic text-3xl mt-3">
        Kampene plottes så snart Profixio publiserer.
      </h3>
      <p className="text-sm text-[color:var(--ink-mute)]">
        Auto-synk hvert 10. minutt under turneringen.
      </p>
    </section>
  );
}

function EmptyMatches() {
  return (
    <div className="programme-card p-6 space-y-2">
      <span className="label">Ennå tom</span>
      <p className="font-display italic text-xl text-[color:var(--ink-soft)]">
        Kampene synkes inn fra{" "}
        <a
          href="https://www.profixio.com/app/flint-u14-cup-2026/category/1180966/group/3403950"
          target="_blank"
          rel="noopener noreferrer"
          className="link-edit ember-text not-italic font-medium"
        >
          Gruppe L
        </a>
        .
      </p>
      <p className="text-sm text-[color:var(--ink-mute)]">
        Trener kan trigge synk manuelt fra Studio.
      </p>
    </div>
  );
}

function Sections() {
  const items = [
    {
      href: "/program",
      title: "Programmet",
      kicker: "Sak 01",
      blurb: "Time for time. Oppmøte, kjøring og hvile.",
    },
    {
      href: "/kamper",
      title: "Gruppespillet",
      kicker: "Sak 02",
      blurb: "Alle åtte lag, tabell og resultater.",
    },
    {
      href: "/innkvartering",
      title: "Husvik skole",
      kicker: "Sak 03",
      blurb: "Innsjekk, regler, pakkeliste.",
    },
    {
      href: "/laget",
      title: "Mannskapet",
      kicker: "Sak 04",
      blurb: "Spillere og foreldrekontakter.",
    },
  ];
  return (
    <section>
      <SectionHead label="Innhold" suffix="Velg sak" />
      <ol className="border-t border-[color:var(--rule)]">
        {items.map((item, i) => (
          <li
            key={item.href}
            className="border-b border-[color:var(--rule)] rise"
            style={{ animationDelay: `${i * 60 + 400}ms` }}
          >
            <Link
              href={item.href}
              className="grid grid-cols-[3.5rem_1fr_1.25rem] gap-4 items-baseline py-4 group hover:bg-[color:var(--surface-warm)] transition-colors px-1"
            >
              <span className="num font-display italic text-2xl text-[color:var(--ember)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="smallcaps text-[10.5px] text-[color:var(--ink-mute)]">
                  {item.kicker}
                </div>
                <div
                  className="font-display text-xl tracking-[-0.01em] group-hover:italic transition-[font-style] duration-150"
                  style={{ fontVariationSettings: '"opsz" 32, "wght" 540' }}
                >
                  {item.title}
                </div>
                <div className="text-sm text-[color:var(--ink-mute)] mt-0.5">
                  {item.blurb}
                </div>
              </div>
              <span className="font-display italic text-[color:var(--ink-mute)] group-hover:text-[color:var(--ember)] transition-colors text-xl self-center">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
