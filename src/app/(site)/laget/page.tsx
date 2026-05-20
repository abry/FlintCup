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

  if (players.length === 0) {
    return (
      <div className="card-info">
        <div
          className="text-sm font-bold mb-2"
          style={{ color: "var(--primary)" }}
        >
          👥 Spillerliste
        </div>
        <p className="text-sm" style={{ color: "var(--ink-mute)" }}>
          Trener legger inn spillere og foreldrekontakter i Studio.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="day-divider">
        <span>👥 Mannskap</span>
      </div>
      {players.map((p) => (
        <div
          key={p._id}
          className="rounded-xl border p-3 mb-2"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold tabular-nums shrink-0"
              style={{
                background: "var(--primary-bg)",
                color: "var(--primary)",
              }}
            >
              {p.shirtNumber !== null ? p.shirtNumber : "–"}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold" style={{ color: "var(--ink)" }}>
                {p.name}
              </div>
              {p.position ? (
                <div className="text-xs" style={{ color: "var(--ink-mute)" }}>
                  {p.position}
                </div>
              ) : null}
            </div>
          </div>
          {p.parents && p.parents.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs">
              {p.parents.map((parent, j) => (
                <li
                  key={j}
                  className="flex flex-wrap gap-x-2"
                  style={{ color: "var(--ink-mute)" }}
                >
                  <span
                    className="font-semibold"
                    style={{ color: "var(--ink)" }}
                  >
                    {parent.name ?? "—"}
                  </span>
                  {parent.phone ? (
                    <a
                      href={`tel:${parent.phone}`}
                      className="tabular-nums underline underline-offset-2"
                      style={{ color: "var(--primary)" }}
                    >
                      {parent.phone}
                    </a>
                  ) : null}
                  {parent.carSeats ? (
                    <span className="tabular-nums">
                      {parent.carSeats} plasser
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
