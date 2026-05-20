import type { Metadata } from "next";
import Link from "next/link";

import { sanityFetch } from "@/sanity/fetch";
import { siteSettingsQuery, tournamentQuery } from "@/sanity/queries";

type SiteSettings = {
  title: string | null;
  clubName: string | null;
  logoUrl: string | null;
} | null;

type Tournament = {
  name: string | null;
  ourTeamName: string | null;
  startDate: string | null;
  endDate: string | null;
} | null;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  const title = settings?.title ?? "Sprint-Jeløy G14, 2 — Flint Cup 2026";
  return {
    title,
    description:
      "Lagprogram for Sprint-Jeløy G14, 2 i Flint Cup 2026: kjøreplan, kamper, og oppmøte.",
  };
}

const NAV = [
  { href: "/", label: "🗺 Program", short: "Program" },
  { href: "/kamper", label: "⚽ Kamper", short: "Kamper" },
  { href: "/innkvartering", label: "🏠 Husvik", short: "Husvik" },
  { href: "/laget", label: "👥 Laget", short: "Laget" },
];

const SPRINT_LOGO =
  "https://www.sprintjeloy.no/wp-content/uploads/2018/05/cropped-sprint_organisasjonslogo.png";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, tournament] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery),
    sanityFetch<Tournament>(tournamentQuery),
  ]);

  const teamLabel = tournament?.ourTeamName ?? "Sprint-Jeløy G14, 2";
  const tournamentLabel = tournament?.name ?? "Flint Micasa U14 Cup 2026";
  const dateRangeLabel = formatDateRange(
    tournament?.startDate ?? "2026-05-23",
    tournament?.endDate ?? "2026-05-25",
  );
  const logoUrl = settings?.logoUrl ?? SPRINT_LOGO;

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="px-4 pt-5 pb-4 text-white"
        style={{ background: "var(--primary)" }}
      >
        <div className="container-page">
          <div className="flex items-center gap-3 mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Sprint-Jeløy logo"
              className="h-10 w-10 object-contain rounded-lg"
              style={{ background: "#fff", padding: "2px" }}
            />
            <div className="min-w-0">
              <h1 className="font-bold text-white text-base leading-tight truncate">
                {teamLabel}
              </h1>
              <p
                className="text-xs"
                style={{ color: "var(--primary-tint)" }}
              >
                {tournamentLabel}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="chip">📍 Tønsberg · {dateRangeLabel}</span>
            <span className="chip">⚽ Sprint-Jeløy 2 · Gruppe L</span>
          </div>
        </div>
      </header>
      <nav className="px-4 pt-3 pb-1 border-b border-[color:var(--border)] bg-white">
        <div className="container-page flex gap-2 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-full border transition-colors"
              style={{
                color: "var(--ink-mute)",
                borderColor: "var(--border)",
                background: "#fff",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="flex-1 container-page py-4">{children}</main>
      <footer className="px-4 py-6 mt-4">
        <div
          className="container-page text-center text-xs"
          style={{ color: "var(--ink-mute)" }}
        >
          <p>{settings?.clubName ?? "Sprint-Jeløy Fotballklubb"}</p>
          <p className="mt-1">
            <Link
              href="/studio"
              className="underline underline-offset-2 hover:text-[color:var(--primary)]"
            >
              Studio
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function formatDateRange(startISO: string, endISO: string): string {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = end.toLocaleDateString("nb-NO", { month: "long" });
  return `${startDay}.–${endDay}. ${month}`;
}
