import { PortableText, type PortableTextBlock } from "next-sanity";

import { sanityFetch } from "@/sanity/fetch";
import { schoolQuery } from "@/sanity/queries";

export const revalidate = 60;

type School = {
  name: string;
  address: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  rules: PortableTextBlock[] | null;
  packingList: PortableTextBlock[] | null;
} | null;

export default async function AccommodationPage() {
  const school = await sanityFetch<School>(schoolQuery);

  if (!school) {
    return (
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight">Innkvartering</h2>
        <p className="text-sm text-muted">
          Innkvarteringsinfo er ikke lagt inn ennå. Trener legger inn skole,
          regler og pakkeliste i Studio.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          Innkvartering
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">{school.name}</h2>
        {school.address ? (
          <p className="text-sm text-muted">{school.address}</p>
        ) : null}
      </header>

      <section className="card p-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-muted">
            Innsjekk
          </div>
          <div className="text-lg font-semibold tabular-nums">
            {school.checkInTime ?? "—"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-muted">
            Utsjekk
          </div>
          <div className="text-lg font-semibold tabular-nums">
            {school.checkOutTime ?? "—"}
          </div>
        </div>
      </section>

      {school.rules ? (
        <section className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.18em] text-muted">
            Regler og praktisk
          </h3>
          <div className="prose prose-sm max-w-none [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
            <PortableText value={school.rules} />
          </div>
        </section>
      ) : null}

      {school.packingList ? (
        <section className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.18em] text-muted">
            Pakkeliste
          </h3>
          <div className="prose prose-sm max-w-none [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
            <PortableText value={school.packingList} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
