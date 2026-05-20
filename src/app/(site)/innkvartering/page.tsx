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
      <div className="card-info">
        <div
          className="text-sm font-bold mb-2"
          style={{ color: "var(--amber)" }}
        >
          Innhold mangler
        </div>
        <p className="text-sm" style={{ color: "var(--ink-mute)" }}>
          Skole, regler og pakkeliste legges inn i Studio.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl border p-4"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="text-sm font-bold mb-2"
          style={{ color: "var(--primary)" }}
        >
          🏠 {school.name}
        </div>
        <div
          className="text-sm leading-relaxed space-y-1"
          style={{ color: "var(--ink-mute)" }}
        >
          {school.address ? <p>📍 {school.address}</p> : null}
          <p>
            Innsjekk{" "}
            <strong style={{ color: "var(--ink)" }}>
              {school.checkInTime ?? "19:00"}
            </strong>
          </p>
          <p>
            Utsjekk{" "}
            <strong style={{ color: "var(--red)" }}>
              {school.checkOutTime ?? "11:00"}
            </strong>
          </p>
        </div>
      </div>

      {school.rules ? (
        <Panel title="📋 Regler & rytme" body={school.rules} />
      ) : null}

      {school.packingList ? (
        <Panel title="🎒 Pakkeliste" body={school.packingList} />
      ) : null}

      <div className="card-warning">
        <div
          className="text-sm font-bold mb-1"
          style={{ color: "var(--red)" }}
        >
          ⚠️ Utsjekk siste dag kl 11:00
        </div>
        <p className="text-sm" style={{ color: "var(--ink-mute)" }}>
          Rom leveres i samme stand som ved innsjekk. Bagasje kan ikke
          oppbevares etter dette.
        </p>
      </div>
    </div>
  );
}

function Panel({
  title,
  body,
}: {
  title: string;
  body: PortableTextBlock[];
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="text-sm font-bold mb-2"
        style={{ color: "var(--primary)" }}
      >
        {title}
      </div>
      <div
        className="text-sm leading-relaxed space-y-1 [&_p]:my-0.5 [&_ul]:list-disc [&_ul]:pl-5"
        style={{ color: "var(--ink-mute)" }}
      >
        <PortableText value={body} />
      </div>
    </div>
  );
}
