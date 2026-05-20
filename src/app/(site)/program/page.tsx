import { Timeline, type TimelineEntry } from "@/components/Timeline";
import { sanityFetch } from "@/sanity/fetch";
import { scheduleQuery } from "@/sanity/queries";

export const revalidate = 60;

export default async function ProgramPage() {
  const entries = await sanityFetch<TimelineEntry[]>(scheduleQuery);
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          Program
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">
          Hele dagen, time for time
        </h2>
      </header>
      <Timeline entries={entries} />
    </div>
  );
}
