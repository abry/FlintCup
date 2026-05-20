# Oppsett

## Sanity-token (VIKTIG)

Det første du må gjøre er å lage en API-token som har **skrive-tilgang**. Den token-en som ble brukt under utvikling er en "Access Manager"-token og kan ikke skrive innhold.

### Lag ny token

1. Gå til https://www.sanity.io/manage/project/sumcnioi/api
2. Velg **API tokens** → **Add API token**
3. Navn: `flintcup-write`
4. Permissions: **Editor** (eller **Administrator** hvis du vil)
5. Kopier token-en (vises bare én gang)
6. Lim inn i `.env.local`:

   ```
   SANITY_API_WRITE_TOKEN=sk...
   ```

7. Restart `pnpm dev` slik at den nye verdien plukkes opp

## Env-variabler

`.env.local` skal inneholde:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=sumcnioi
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-20

SANITY_API_WRITE_TOKEN=<Editor- eller Administrator-token>

PROFIXIO_GROUP_URL=https://www.profixio.com/app/flint-u14-cup-2026/category/1180966/group/3403950
PROFIXIO_TOURNAMENT_URL=https://www.profixio.com/app/flint-u14-cup-2026
PROFIXIO_TEAM_NAME=Sprint-Jeløy 2

CRON_SECRET=<lang tilfeldig streng>
```

## Første synk

Når token-en er på plass:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/profixio-sync
```

Forventet respons: `{"ok": true, "scraped": 28, "summary": {"created": 4, ...}}`. De 4 Sprint-Jeløy 2-kampene legges inn som `match`-dokumenter, og hver får et auto-generert "Oppmøte"-`scheduleEntry` 30 min før kickoff.

Sjekk i Studio (`/studio`) at:
- 4 nye `match`-dokumenter er opprettet
- 4 `scheduleEntry`-dokumenter merket "Auto-generert"

## Fyll inn resten manuelt

I Studio:

1. **Nettstedinnstillinger** — klubbnavn, primær-/aksentfarge (default er Sprint-Jeløy navy `#0a2342` + amber `#f59e0b`)
2. **Turnering** — verifiser at "Sprint-Jeløy 2" og "Gruppe L" stemmer (driver synkens filtrering)
3. **Skoler** — opprett "Husvik barneskole" med innsjekk 19:00, utsjekk 11:00, regler og pakkeliste som Portable Text. Sett som `accommodation` på turneringen.
4. **Spillere** — legg til navn, draktnummer, foreldrekontakter (telefon, bilplasser)
5. **Programpunkter** — legg til reise mellom baner, måltider, hvile osv. utover de auto-genererte oppmøtene

## Vercel deploy

```bash
gh repo create OozzieNorth/FlintCup --public --source=. --remote=origin --push
```

Koble repo i Vercel. Sett følgende secrets:

| Navn | Verdi |
|------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `sumcnioi` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-05-20` |
| `SANITY_API_WRITE_TOKEN` | (samme som lokalt) |
| `PROFIXIO_GROUP_URL` | (samme som lokalt) |
| `PROFIXIO_TOURNAMENT_URL` | (samme som lokalt) |
| `PROFIXIO_TEAM_NAME` | `Sprint-Jeløy 2` |
| `CRON_SECRET` | (lang tilfeldig streng — ikke gjenbruk fra lokal dev) |

Etter deploy: gå til Vercel → Project → Settings → Cron Jobs. Du skal se `/api/cron/profixio-sync` planlagt hvert 10. minutt. Test første kjøring manuelt fra dashboardet.

## Sanity TypeGen (valgfritt, men anbefalt)

For å få typer for GROQ-spørringene:

```bash
pnpm sanity schema extract
pnpm sanity typegen generate
```

Genererer `sanity.types.ts` som kan importeres i koden.
