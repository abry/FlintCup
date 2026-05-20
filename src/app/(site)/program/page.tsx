import { Timeline, type TimelineEntry } from "@/components/Timeline";
import { sanityFetch } from "@/sanity/fetch";
import { scheduleQuery } from "@/sanity/queries";

export const revalidate = 60;

export default async function ProgramPage() {
  const entries = await sanityFetch<TimelineEntry[]>(scheduleQuery);
  return (
    <article className="space-y-8">
      <header className="rise">
        <span className="label">Sak 01</span>
        <h2
          className="display-italic mt-2 text-[clamp(2.25rem,7.5vw,3.25rem)]"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
        >
          Programmet
        </h2>
        <p className="mt-3 max-w-md text-[15px] text-[color:var(--ink-soft)] leading-relaxed">
          Hele dagen, time for time. Auto-genererte oppmøter står i kursiv;
          alt annet kan redigeres fritt i Studio uten å miste de automatiske
          punktene.
        </p>
        <hr className="rule-double mt-6" />
      </header>
      <Timeline entries={entries} />
    </article>
  );
}
