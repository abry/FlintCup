const TZ = "Europe/Oslo";

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("nb-NO", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("nb-NO", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatDayShort(iso: string): string {
  return new Date(iso).toLocaleDateString("nb-NO", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatDateTime(iso: string): string {
  return `${formatDayShort(iso)} · ${formatTime(iso)}`;
}

export function getDateKey(iso: string): string {
  const d = new Date(iso);
  const oslo = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  return oslo;
}
