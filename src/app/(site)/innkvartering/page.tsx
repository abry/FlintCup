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
      <article className="space-y-8">
        <Heading />
        <div className="programme-card p-6 space-y-2 text-center">
          <span className="stamp">Innhold mangler</span>
          <p className="font-display italic text-xl mt-2">
            Trener legger inn skole, regler og pakkeliste i Studio.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="space-y-8">
      <Heading />
      <section className="programme-card p-6 rise">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <span className="smallcaps text-[10.5px] text-[color:var(--ink-mute)]">
              Skole
            </span>
            <h3
              className="display-italic text-[clamp(2rem,6vw,2.75rem)] mt-1"
              style={{ fontVariationSettings: '"opsz" 96, "wght" 400' }}
            >
              {school.name}
            </h3>
            {school.address ? (
              <p className="text-sm text-[color:var(--ink-mute)] mt-1">
                {school.address}
              </p>
            ) : null}
          </div>
          <span className="stamp stamp-ember">Husvik</span>
        </div>
        <hr className="rule-dashed my-5" />
        <div className="grid grid-cols-2 gap-6 text-center">
          <ClockField label="Innsjekk" value={school.checkInTime ?? "—"} />
          <ClockField label="Utsjekk" value={school.checkOutTime ?? "—"} />
        </div>
      </section>

      {school.rules ? (
        <Column
          label="Sak 03A"
          title="Regler & rytme"
          body={school.rules}
          delay={120}
        />
      ) : null}

      {school.packingList ? (
        <Column
          label="Sak 03B"
          title="Pakk dette"
          body={school.packingList}
          delay={200}
        />
      ) : null}
    </article>
  );
}

function Heading() {
  return (
    <header className="rise">
      <span className="label">Sak 03</span>
      <h2
        className="display-italic mt-2 text-[clamp(2.25rem,7.5vw,3.25rem)]"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
      >
        Innkvartering
      </h2>
      <p className="mt-3 max-w-md text-[15px] text-[color:var(--ink-soft)] leading-relaxed">
        Praktisk informasjon om overnattingen — tider, regler og hva som
        bør pakkes ned før avreise.
      </p>
      <hr className="rule-double mt-6" />
    </header>
  );
}

function ClockField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="smallcaps text-[10.5px] text-[color:var(--ink-mute)]">
        {label}
      </div>
      <div className="display-italic num text-5xl mt-1 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function Column({
  label,
  title,
  body,
  delay,
}: {
  label: string;
  title: string;
  body: PortableTextBlock[];
  delay: number;
}) {
  return (
    <section className="rise" style={{ animationDelay: `${delay}ms` }}>
      <span className="label">{label}</span>
      <h3
        className="display-italic text-2xl mt-1 mb-3"
        style={{ fontVariationSettings: '"opsz" 36, "wght" 520' }}
      >
        {title}
      </h3>
      <div className="prose-feel space-y-2 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
        <PortableText value={body} />
      </div>
    </section>
  );
}
