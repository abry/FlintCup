import type { Metadata } from "next";
import Link from "next/link";

import { sanityFetch } from "@/sanity/fetch";
import { siteSettingsQuery } from "@/sanity/queries";

type SiteSettings = {
  title: string | null;
  clubName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  accentColor: string | null;
} | null;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  const title = settings?.title ?? "Sprint-Jeløy G14-2 — Flint Cup 2026";
  return {
    title,
    description:
      "Lagprogram for Sprint-Jeløy 2 i Flint Cup 2026: kamper, oppmøte, kjøring og overnatting.",
  };
}

const NAV = [
  { href: "/", label: "Hjem" },
  { href: "/program", label: "Program" },
  { href: "/kamper", label: "Kamper" },
  { href: "/innkvartering", label: "Innkvartering" },
  { href: "/laget", label: "Laget" },
];

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  const primary = settings?.primaryColor ?? "#0a2342";
  const accent = settings?.accentColor ?? "#f59e0b";
  const title = settings?.title ?? "Sprint-Jeløy G14-2 — Flint Cup 2026";
  const club = settings?.clubName ?? "Sprint-Jeløy Fotballklubb";

  return (
    <>
      <style>{`
        :root {
          --color-primary: ${primary};
          --color-accent: ${accent};
        }
      `}</style>
      <header
        className="text-white"
        style={{
          background: `linear-gradient(180deg, ${primary} 0%, ${shade(primary, 12)} 100%)`,
        }}
      >
        <div className="container-page py-5 flex items-center gap-3">
          {settings?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logoUrl}
              alt={club}
              className="h-10 w-10 rounded-full bg-white/10 object-contain p-1"
            />
          ) : (
            <span
              className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center font-black text-base"
              style={{ color: accent }}
              aria-hidden
            >
              SJ
            </span>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">
              {club}
            </div>
            <h1 className="text-base font-semibold leading-tight truncate">
              {title}
            </h1>
          </div>
        </div>
        <nav className="container-page pb-3 -mt-1">
          <ul className="flex gap-1 overflow-x-auto text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex-1 container-page py-6">{children}</main>
      <footer className="border-t border-line bg-surface/60 text-xs text-muted">
        <div className="container-page py-6 flex flex-wrap gap-2 justify-between">
          <span>{club} · Flint Cup 2026</span>
          <Link href="/studio" className="underline-offset-2 hover:underline">
            Studio
          </Link>
        </div>
      </footer>
    </>
  );
}

function shade(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const lighten = (c: number) =>
    Math.min(255, Math.round(c + (255 - c) * (amount / 100)));
  return `#${[lighten(r), lighten(g), lighten(b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}
