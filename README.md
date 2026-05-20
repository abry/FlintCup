# Flint Cup 2026 — Sprint-Jeløy G14-2

Lagprogram for Sprint-Jeløy 2 i Flint Cup 2026 (Gruppe L, lørdag 23. mai). Henter kampplanen automatisk fra Profixio og lagrer alt i Sanity slik at trener/foreldre kan oppdatere innhold uten å redigere kode.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind v4
- Sanity v5 (embedded Studio på `/studio`)
- Cheerio (skraper Profixio sin offentlige gruppe-side hvert 10. minutt via Vercel Cron)

## Kom i gang

```bash
pnpm install
cp .env.example .env.local         # fyll inn verdiene; se SETUP.md
pnpm dev                            # http://localhost:3000
```

Sider:

| Rute | Hva |
|------|-----|
| `/` | Hjem: neste hendelse + våre kamper |
| `/program` | Hele dagen, time for time |
| `/kamper` | Gruppespill og resultater |
| `/innkvartering` | Husvik barneskole, regler, pakkeliste |
| `/laget` | Spillere og foreldre |
| `/studio` | Sanity Studio (krever innlogging) |

## Auto-synk

Profixio-skraperen ligger i `src/lib/profixio.ts` og leser den offentlige gruppe-siden. `src/lib/syncMatches.ts` differensierer mot eksisterende `match`-dokumenter i Sanity og oppretter / oppdaterer / markerer avlyste. Hver gang en ny kamp dukker opp (sluttspill-runde), genererer `src/lib/generateProgram.ts` automatisk en "Oppmøte"-`scheduleEntry` 30 min før kickoff.

Cron-ruten ligger i `src/app/api/cron/profixio-sync/route.ts` og er beskyttet av `CRON_SECRET`. `vercel.json` planlegger den hvert 10. minutt.

Trigge manuelt:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/profixio-sync
```

## Mappe-oversikt

```
src/
  app/
    (site)/            # publikum-siden (header/footer)
    api/cron/          # Profixio-sync route handler
    studio/[[...tool]] # embedded Studio
  components/          # MatchCard, Timeline, StudioClient
  lib/                 # profixio, syncMatches, generateProgram, formatTime
  sanity/              # client, env, queries, schemas, structure, fetch
archive/               # opprinnelig single-file HTML (referanse)
sanity.config.ts       # Studio-konfig
vercel.json            # cron-plan
```

## Deploy

- Push til `OozzieNorth/FlintCup`
- Koble til Vercel
- Sett env-variabler (se `SETUP.md`)
- Cron-jobben dukker opp under Vercel → Cron Jobs
