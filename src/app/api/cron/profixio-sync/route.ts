import { NextResponse } from "next/server";

import { fetchGroupMatches } from "@/lib/profixio";
import { syncMatchesToSanity, writeSyncLog } from "@/lib/syncMatches";
import { getSanityWriteClient } from "@/sanity/writeClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TournamentSettings = {
  ourTeamName: string | null;
  groupName: string | null;
};

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const groupUrl = process.env.PROFIXIO_GROUP_URL;
  if (!groupUrl) {
    return NextResponse.json({ ok: false, error: "PROFIXIO_GROUP_URL not configured" }, { status: 500 });
  }

  const fallbackTeam = process.env.PROFIXIO_TEAM_NAME ?? "Sprint-Jeløy 2";

  try {
    const client = getSanityWriteClient();
    const settings = await client.fetch<TournamentSettings | null>(
      `*[_type == "tournament"][0]{ ourTeamName, groupName }`,
    );
    const ourTeamName = settings?.ourTeamName ?? fallbackTeam;
    const groupName = settings?.groupName ?? null;

    const scraped = await fetchGroupMatches(groupUrl);
    const summary = await syncMatchesToSanity(
      client,
      scraped,
      ourTeamName,
      groupName,
    );

    const status = summary.errors.length > 0 ? "error" : "success";
    await writeSyncLog(client, summary, status);

    return NextResponse.json({
      ok: status === "success",
      scraped: scraped.length,
      summary,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    try {
      const client = getSanityWriteClient();
      await writeSyncLog(
        client,
        { created: 0, updated: 0, unchanged: 0, cancelled: 0, errors: [message] },
        "error",
        message,
      );
    } catch {
      // swallow log error
    }
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
