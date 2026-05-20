import "server-only";

import * as cheerio from "cheerio";

export type ScrapedMatch = {
  externalId: string;
  matchNumber: number | null;
  kickoff: string;
  homeTeam: string;
  awayTeam: string;
  venueName: string | null;
  pitch: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "played";
};

const TIMESTAMP_RE = /timestamp:\s*(\d+)/;
const HREF_MATCH_ID_RE = /\/match\/(\d+)/;
const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;
const OSLO_OFFSET_FALLBACK_MS = 2 * 60 * 60 * 1000;

export async function fetchGroupMatches(groupUrl: string): Promise<ScrapedMatch[]> {
  const res = await fetch(groupUrl, {
    headers: { "user-agent": "FlintCupSync/1.0 (sprint-jeloy parent)" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Profixio returned ${res.status} for ${groupUrl}`);
  }
  const html = await res.text();
  return parseGroupHtml(html);
}

export function parseGroupHtml(html: string): ScrapedMatch[] {
  const $ = cheerio.load(html);
  const matches: ScrapedMatch[] = [];

  $('li[wire\\:key^="listkamp_"]').each((_, li) => {
    const $li = $(li);
    const wireKey = $li.attr("wire:key") ?? "";
    const externalId = wireKey.replace(/^listkamp_/, "");
    if (!externalId) return;

    const xData = $li.find("[x-data]").first().attr("x-data") ?? "";
    const tsMatch = xData.match(TIMESTAMP_RE);
    const timestamp = tsMatch ? Number(tsMatch[1]) : null;
    if (!timestamp) return;

    const hrefHolder = $li.find("[href*='/match/']").first();
    const href = hrefHolder.attr("href") ?? "";
    const hrefId = href.match(HREF_MATCH_ID_RE)?.[1];
    if (hrefId && hrefId !== externalId) return;

    const matchNumberText = $li
      .find("div.text-xs")
      .filter((_, el) => /^\s*\d+\s*$/.test($(el).text()))
      .first()
      .text()
      .trim();
    const matchNumber = matchNumberText ? Number(matchNumberText) : null;

    const teamEls = $li.find("div.leading-5.truncate, div.leading-5");
    const homeTeam = teamEls.eq(0).text().trim();
    const awayTeam = teamEls.eq(1).text().trim();
    if (!homeTeam || !awayTeam) return;

    const rightEls = $li.find("div.text-xs.text-right");
    let pitch: string | null = null;
    let venueName: string | null = null;
    rightEls.each((_, el) => {
      const t = $(el).text().trim();
      if (!t) return;
      if (/^\d+$/.test(t) && pitch === null) {
        pitch = t;
      } else if (venueName === null) {
        venueName = t;
      }
    });

    let timeText: string | null = null;
    $li.find("div").each((_, el) => {
      if (timeText) return;
      const $el = $(el);
      if ($el.children().length > 0) return;
      const t = $el.text().trim();
      if (TIME_RE.test(t)) timeText = t;
    });

    const kickoff = composeKickoff(timestamp, timeText);

    matches.push({
      externalId,
      matchNumber,
      kickoff,
      homeTeam,
      awayTeam,
      venueName,
      pitch,
      homeScore: null,
      awayScore: null,
      status: "scheduled",
    });
  });

  return matches;
}

export function filterTeamMatches(matches: ScrapedMatch[], teamName: string): ScrapedMatch[] {
  return matches.filter(
    (m) => m.homeTeam === teamName || m.awayTeam === teamName,
  );
}

function composeKickoff(timestamp: number, timeText: string | null): string {
  const dayStartMs = timestamp * 1000;
  if (!timeText) return new Date(dayStartMs).toISOString();
  const match = timeText.match(TIME_RE);
  if (!match) return new Date(dayStartMs).toISOString();
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const dayDate = new Date(dayStartMs);
  const y = dayDate.getUTCFullYear();
  const m = dayDate.getUTCMonth();
  const d = dayDate.getUTCDate();
  const utcGuess = Date.UTC(y, m, d, hour, minute, 0);
  const offsetMs = osloOffsetMs(utcGuess);
  return new Date(utcGuess - offsetMs).toISOString();
}

function osloOffsetMs(utcMs: number): number {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Oslo",
      timeZoneName: "shortOffset",
    });
    const parts = fmt.formatToParts(new Date(utcMs));
    const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    const m = tz.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return OSLO_OFFSET_FALLBACK_MS;
    const sign = m[1] === "-" ? -1 : 1;
    const hours = Number(m[2]);
    const minutes = Number(m[3] ?? "0");
    return sign * (hours * 60 + minutes) * 60 * 1000;
  } catch {
    return OSLO_OFFSET_FALLBACK_MS;
  }
}
