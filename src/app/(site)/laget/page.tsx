import { sanityFetch } from "@/sanity/fetch";
import { playersQuery } from "@/sanity/queries";

export const revalidate = 60;

type Player = {
  _id: string;
  name: string;
  shirtNumber: number | null;
  position: string | null;
  parents:
    | {
        name: string | null;
        phone: string | null;
        email: string | null;
        carSeats: number | null;
      }[]
    | null;
};

export default async function TeamPage() {
  const players = await sanityFetch<Player[]>(playersQuery);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Laget</p>
        <h2 className="text-3xl font-semibold tracking-tight">
          Spillere og foreldre
        </h2>
      </header>
      {players.length === 0 ? (
        <p className="text-sm text-muted">
          Spillerlisten er ikke lagt inn ennå. Trener legger inn navn,
          draktnummer og foreldrekontakter i Studio.
        </p>
      ) : (
        <ul className="space-y-3">
          {players.map((p) => (
            <li key={p._id} className="card p-4">
              <div className="flex items-baseline gap-3">
                {p.shirtNumber !== null ? (
                  <span className="text-2xl font-black tabular-nums text-[color:var(--color-primary)]">
                    {p.shirtNumber}
                  </span>
                ) : null}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{p.name}</div>
                  {p.position ? (
                    <div className="text-xs text-muted">{p.position}</div>
                  ) : null}
                </div>
              </div>
              {p.parents && p.parents.length > 0 ? (
                <ul className="mt-3 space-y-1 text-sm">
                  {p.parents.map((parent, i) => (
                    <li key={i} className="flex flex-wrap gap-x-3 text-muted">
                      <span className="font-medium text-foreground">
                        {parent.name ?? "—"}
                      </span>
                      {parent.phone ? (
                        <a href={`tel:${parent.phone}`} className="hover:underline">
                          {parent.phone}
                        </a>
                      ) : null}
                      {parent.carSeats ? (
                        <span>{parent.carSeats} bilplasser</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
