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
    <article className="space-y-8">
      <header className="rise">
        <span className="label">Sak 04</span>
        <h2
          className="display-italic mt-2 text-[clamp(2.25rem,7.5vw,3.25rem)]"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
        >
          Mannskapet
        </h2>
        <p className="mt-3 max-w-md text-[15px] text-[color:var(--ink-soft)] leading-relaxed">
          Stallen og foreldrekontakter for {players.length || "—"}{" "}
          spillere. Trykk på nummer for å ringe.
        </p>
        <hr className="rule-double mt-6" />
      </header>

      {players.length === 0 ? (
        <div className="programme-card p-6 text-center">
          <span className="stamp">Tomt rosterskap</span>
          <p className="font-display italic text-xl mt-3">
            Trener legger spillerne inn i Studio.
          </p>
        </div>
      ) : (
        <ol className="space-y-0">
          {players.map((p, i) => (
            <li
              key={p._id}
              className="border-b border-[color:var(--rule-soft)] py-5 rise"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="grid grid-cols-[3.5rem_1fr] gap-4 items-baseline">
                <span className="display-italic num text-4xl tabular-nums text-[color:var(--ember)]">
                  {p.shirtNumber !== null
                    ? String(p.shirtNumber).padStart(2, "0")
                    : "—"}
                </span>
                <div className="min-w-0">
                  <div
                    className="font-display text-xl tracking-[-0.01em]"
                    style={{ fontVariationSettings: '"opsz" 36, "wght" 560' }}
                  >
                    {p.name}
                  </div>
                  {p.position ? (
                    <div className="smallcaps text-[10.5px] text-[color:var(--ink-mute)] mt-0.5">
                      {p.position}
                    </div>
                  ) : null}
                  {p.parents && p.parents.length > 0 ? (
                    <ul className="mt-2 space-y-0.5 text-sm">
                      {p.parents.map((parent, j) => (
                        <li
                          key={j}
                          className="flex flex-wrap gap-x-3 text-[color:var(--ink-mute)]"
                        >
                          <span className="text-[color:var(--ink)] font-medium">
                            {parent.name ?? "—"}
                          </span>
                          {parent.phone ? (
                            <a
                              href={`tel:${parent.phone}`}
                              className="num link-edit"
                            >
                              {parent.phone}
                            </a>
                          ) : null}
                          {parent.carSeats ? (
                            <span className="num">
                              {parent.carSeats} bilplasser
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
