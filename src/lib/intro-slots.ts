const WEEKDAY_LABELS = [
  "",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

export function weekdayLabel(day: number): string {
  return WEEKDAY_LABELS[day] ?? String(day);
}

export function formatTime(value: string): string {
  return value.slice(0, 5);
}

export function ageBandLabel(min: number, max: number | null): string {
  if (max == null) return `${min}+ yaş`;
  if (min === max) return `${min} yaş`;
  return `${min}–${max} yaş`;
}

export function formatSlotWhen(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(new Date(iso));
}

export function formatHourRange(iso: string, durationMinutes: number): string {
  const start = new Date(iso);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const fmt = new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
  return `${fmt.format(start)}–${fmt.format(end)}`;
}

export function slotKind(
  slot: { lesson_format?: "group" | "individual" | null; duration_minutes: number }
): "group" | "individual" {
  if (slot.lesson_format === "group" || slot.lesson_format === "individual") {
    return slot.lesson_format;
  }
  return slot.duration_minutes >= 90 ? "group" : "individual";
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function istanbulParts(d: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const week: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
    weekday: week[get("weekday")] ?? 1,
  };
}

function istanbulDate(y: number, m: number, d: number, hh: number, mm: number): Date {
  return new Date(`${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00+03:00`);
}

export function nextOccurrences(
  weekday: number,
  startTime: string,
  count = 2
): Date[] {
  const now = new Date();
  const today = istanbulParts(now);
  const [hh, mm] = formatTime(startTime).split(":").map(Number);
  const results: Date[] = [];
  const startOffset = (weekday - today.weekday + 7) % 7;

  for (let week = 0; results.length < count && week < 8; week++) {
    const cursor = istanbulDate(today.y, today.m, today.d + startOffset + week * 7, hh, mm);
    if (cursor.getTime() <= now.getTime() + 60 * 60 * 1000) continue;
    results.push(cursor);
  }

  return results;
}
