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

export function istanbulToday() {
  return istanbulParts(new Date());
}

export function daysInIstanbulMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function currentMonthLabel(): string {
  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date());
}

export function istanbulDateKey(d: Date): string {
  const p = istanbulParts(d);
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

export function monthEndHorizon(): Date {
  const t = istanbulToday();
  const last = daysInIstanbulMonth(t.y, t.m);
  return istanbulDate(t.y, t.m, last, 23, 59);
}

export function occurrencesInCurrentMonth(weekday: number, startTime: string): Date[] {
  const now = new Date();
  const today = istanbulToday();
  const [hh, mm] = formatTime(startTime).split(":").map(Number);
  const last = daysInIstanbulMonth(today.y, today.m);
  const results: Date[] = [];

  for (let day = 1; day <= last; day++) {
    const cursor = istanbulDate(today.y, today.m, day, hh, mm);
    if (istanbulParts(cursor).weekday !== weekday) continue;
    if (cursor.getTime() <= now.getTime() + 60 * 60 * 1000) continue;
    results.push(cursor);
  }

  return results;
}

export function nextOccurrences(
  weekday: number,
  startTime: string,
  _count = 2
): Date[] {
  return occurrencesInCurrentMonth(weekday, startTime);
}
