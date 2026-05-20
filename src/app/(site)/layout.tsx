import type { Metadata } from "next";
import Link from "next/link";

import { sanityFetch } from "@/sanity/fetch";
import { siteSettingsQuery, tournamentQuery } from "@/sanity/queries";

type SiteSettings = {
  title: string | null;
  clubName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  accentColor: string | null;
} | null;

type Tournament = {
  name: string | null;
  groupName: string | null;
  ourTeamName: string | null;
  startDate: string | null;
} | null;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  const title = settings?.title ?? "Sprint-Jeløy G14-2 — Flint Cup 2026";
  return {
    title,
    description:
      "Matchday-programme for Sprint-Jeløy 2 i Flint Cup 2026: kamper, oppmøte, kjøring og overnatting.",
  };
}

const NAV = [
  { href: "/", label: "Hjem" },
  { href: "/program", label: "Program" },
  { href: "/kamper", label: "Kamper" },
  { href: "/innkvartering", label: "Husvik" },
  { href: "/laget", label: "Laget" },
];

const ISSUE_DATE = new Date("2026-05-23T08:00:00+02:00");

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, tournament] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery),
    sanityFetch<Tournament>(tournamentQuery),
  ]);

  const club = settings?.clubName ?? "Sprint-Jeløy Fotballklubb";
  const teamLabel = tournament?.ourTeamName ?? "Sprint-Jeløy 2";
  const groupLabel = tournament?.groupName ?? "Gruppe L";
  const issueLabel = ISSUE_DATE.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <header className="border-b border-[color:var(--rule)]">
        <div className="container-page pt-7 pb-5">
          <div className="flex items-center justify-between gap-3 text-[10px] tracking-[0.28em] uppercase text-[color:var(--ink-mute)]">
            <span>Vol. 1 · No. 1</span>
            <span>{issueLabel}</span>
          </div>
          <hr className="rule-double mt-3 mb-5" />
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="label">{club}</div>
              <h1 className="display-italic mt-1 text-[clamp(2.6rem,9vw,4.2rem)]">
                Flint Cup
                <span className="display-roman not-italic ember-text">
                  &thinsp;2026
                </span>
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[color:var(--ink-soft)]">
                <span className="smallcaps text-xs">Matchday programme</span>
                <span className="text-[color:var(--rule)]">·</span>
                <span className="font-medium">{teamLabel}</span>
                <span className="text-[color:var(--rule)]">·</span>
                <span>{groupLabel}</span>
              </div>
            </div>
            <CrestBadge logoUrl={settings?.logoUrl ?? null} />
          </div>
          <hr className="rule mt-5" />
          <nav className="mt-3">
            <ul className="flex gap-x-5 gap-y-2 flex-wrap text-[13px]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-edit smallcaps text-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1 container-page py-8 sm:py-12">{children}</main>
      <footer className="mt-12 border-t border-[color:var(--rule)]">
        <div className="container-page py-8 text-[11px] tracking-[0.16em] uppercase text-[color:var(--ink-mute)] flex flex-wrap justify-between gap-3">
          <span>
            Trykt for {club} · {teamLabel}
          </span>
          <Link href="/studio" className="link-edit">
            Redaksjon →
          </Link>
        </div>
      </footer>
    </>
  );
}

function CrestBadge({ logoUrl }: { logoUrl: string | null }) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt=""
        className="h-16 w-16 object-contain"
      />
    );
  }
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-16 w-16 shrink-0"
      aria-hidden
    >
      <defs>
        <linearGradient id="crest" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--navy)" />
          <stop offset="100%" stopColor="var(--navy-deep)" />
        </linearGradient>
      </defs>
      <path
        d="M32 2 L62 12 L62 30 C62 46 50 58 32 62 C14 58 2 46 2 30 L2 12 Z"
        fill="url(#crest)"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <path
        d="M32 2 L62 12 L62 30 C62 46 50 58 32 62 C14 58 2 46 2 30 L2 12 Z"
        fill="none"
        stroke="var(--ember)"
        strokeWidth="0.6"
        transform="scale(0.84) translate(6.1 6.1)"
      />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontWeight="600"
        fontSize="20"
        fill="var(--chalk)"
        letterSpacing="-0.04em"
      >
        SJ
      </text>
      <text
        x="32"
        y="52"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        fontSize="5"
        letterSpacing="0.36em"
        fill="var(--ember-soft)"
      >
        1926
      </text>
    </svg>
  );
}
