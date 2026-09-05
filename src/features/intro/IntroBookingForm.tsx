"use client";

import { useMemo, useState, useTransition } from "react";
import { bookIntroLesson } from "@/server/actions/book-intro";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import {
  currentMonthLabel,
  daysInIstanbulMonth,
  formatHourRange,
  istanbulToday,
  slotKind,
} from "@/lib/intro-slots";
import { INTRO_KVKK_COPY } from "@/lib/kvkk";
import { cn } from "@/lib/utils";
import type { IntroOccurrence } from "@/types";

const PROGRAMS = [
  {
    slug: "resim-kursu",
    name: "Resim",
    formats: ["group"] as const,
    note: "Resim dersleri grupça yapılmaktadır.",
  },
  {
    slug: "piyano-kursu",
    name: "Piyano",
    formats: ["individual"] as const,
    note: "Piyano dersleri birebir olarak yapılmaktadır.",
  },
  { slug: "keman-kursu", name: "Keman", formats: ["group", "individual"] as const },
  { slug: "gitar-kursu", name: "Gitar", formats: ["group", "individual"] as const },
];

type Step = "program" | "format" | "day" | "time" | "details";

interface IntroBookingFormProps {
  occurrences: IntroOccurrence[];
}

export function IntroBookingForm({ occurrences }: IntroBookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState<Step>("program");
  const [programSlug, setProgramSlug] = useState("");
  const [format, setFormat] = useState<"group" | "individual" | "">("");
  const [dayKey, setDayKey] = useState("");
  const [selected, setSelected] = useState("");
  const [requestId] = useState(() => crypto.randomUUID());
  const [values, setValues] = useState({
    student_name: "",
    student_age: "",
    parent_name: "",
    phone: "",
    kvkk: false,
  });

  const program = PROGRAMS.find((p) => p.slug === programSlug);

  const filtered = useMemo(() => {
    if (!programSlug || !format) return [];
    return occurrences.filter((o) => {
      if (o.slot.program_slug !== programSlug) return false;
      return slotKind(o.slot) === format;
    });
  }, [occurrences, programSlug, format]);

  const days = useMemo(() => {
    const map = new Map<
      string,
      { label: string; weekday: number; dayNum: number; items: IntroOccurrence[] }
    >();
    for (const o of filtered) {
      const d = new Date(o.startsAt);
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
      }).formatToParts(d);
      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
      const key = `${get("year")}-${get("month")}-${get("day")}`;
      const week: Record<string, number> = {
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
        Sun: 7,
      };
      const long = new Intl.DateTimeFormat("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Europe/Istanbul",
      }).format(d);
      const entry = map.get(key) ?? {
        label: long,
        weekday: week[get("weekday")] ?? 1,
        dayNum: Number(get("day")),
        items: [],
      };
      entry.items.push(o);
      map.set(key, entry);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const calendarWeeks = useMemo(() => {
    const today = istanbulToday();
    const last = daysInIstanbulMonth(today.y, today.m);
    const pad = (n: number) => String(n).padStart(2, "0");
    const firstKey = `${today.y}-${pad(today.m)}-01`;
    const firstWeekday = new Date(`${firstKey}T12:00:00+03:00`).getUTCDay();
    const mondayOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;
    const byKey = new Map(days);
    const todayKey = `${today.y}-${pad(today.m)}-${pad(today.d)}`;
    const cells: Array<{
      key: string;
      dayNum: number;
      available: boolean;
      past: boolean;
    } | null>[] = [];

    for (let i = 0; i < mondayOffset + last; i++) {
      if (i % 7 === 0) cells.push([]);
      if (i < mondayOffset) {
        cells[cells.length - 1].push(null);
        continue;
      }
      const dayNum = i - mondayOffset + 1;
      const key = `${today.y}-${pad(today.m)}-${pad(dayNum)}`;
      cells[cells.length - 1].push({
        key,
        dayNum,
        available: byKey.has(key),
        past: key < todayKey,
      });
    }
    while (cells[cells.length - 1] && cells[cells.length - 1].length < 7) {
      cells[cells.length - 1].push(null);
    }
    return cells;
  }, [days]);

  const times = useMemo(() => {
    const day = days.find(([key]) => key === dayKey);
    return day?.[1].items ?? [];
  }, [days, dayKey]);

  const picked = times.find((o) => `${o.slot.id}|${o.startsAt}` === selected);
  const dayLabel = days.find(([key]) => key === dayKey)?.[1].label;

  const goBack = () => {
    setError(null);
    if (step === "details") {
      setSelected("");
      setStep("time");
      return;
    }
    if (step === "time") {
      setDayKey("");
      setStep("day");
      return;
    }
    if (step === "day") {
      if (program && program.formats.length > 1) {
        setFormat("");
        setStep("format");
      } else {
        setProgramSlug("");
        setFormat("");
        setStep("program");
      }
      return;
    }
    if (step === "format") {
      setProgramSlug("");
      setFormat("");
      setStep("program");
    }
  };

  const pickProgram = (slug: string) => {
    const p = PROGRAMS.find((x) => x.slug === slug);
    setProgramSlug(slug);
    setDayKey("");
    setSelected("");
    if (p?.formats.length === 1) {
      setFormat(p.formats[0]);
      setStep("day");
    } else {
      setFormat("");
      setStep("format");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selected) {
      setError("Bir saat seçin.");
      return;
    }
    const [slot_id, starts_at] = selected.split("|");
    startTransition(async () => {
      const result = await bookIntroLesson({
        student_name: values.student_name,
        student_age: Number(values.student_age),
        parent_name: values.parent_name || undefined,
        phone: values.phone,
        slot_id,
        starts_at,
        kvkk: values.kvkk,
        request_id: requestId,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone(true);
    });
  };

  if (done) {
    return (
      <div className="rounded-[16px] border border-line bg-white p-8">
        <h2 className="font-display text-3xl text-ink">Aldık.</h2>
        <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-ink-muted">
          Tanışma dersi not edildi. Akademi sizi arar veya WhatsApp’tan yazar —
          saati teyit etmek için. Gelmeden bir şey ödemeniz gerekmez.
        </p>
        <p className="mt-5 text-[15px] leading-relaxed text-ink">
          İmbatlı Mahallesi, Yeni Girne No:205/B
          <br />
          Karşıyaka / İzmir
        </p>
        <p className="mt-2 text-[13px] text-ink-muted">
          Gelmeden teyit bekleyin. Ders saatlerinde kapı dolu olabilir.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-[28rem]">
      {error && (
        <p className="mb-6 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {step !== "program" && (
        <button
          type="button"
          onClick={goBack}
          className="mb-5 cursor-pointer text-sm font-medium text-plum hover:text-violet"
        >
          ← Geri
        </button>
      )}

      {step === "program" && (
        <fieldset>
          <legend className="mb-1 font-display text-2xl text-ink">
            Tanışma dersi için eğitiminizi seçin
          </legend>
          <p className="mb-4 text-sm text-ink-muted">Resim, piyano, keman veya gitar.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PROGRAMS.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => pickProgram(p.slug)}
                className={cn(
                  "cursor-pointer rounded-[14px] px-4 py-4 text-left text-[17px] font-medium transition-colors",
                  programSlug === p.slug
                    ? "bg-plum text-ivory"
                    : "bg-white text-ink ring-1 ring-line hover:ring-ink/30"
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === "format" && program && (
        <fieldset>
          <legend className="mb-1 font-display text-2xl text-ink">Grup mu, birebir mi?</legend>
          <p className="mb-4 text-sm text-ink-muted">Grup iki saat, birebir bir saat.</p>
          <div className="grid grid-cols-2 gap-2">
            {program.formats.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFormat(f);
                  setDayKey("");
                  setSelected("");
                  setStep("day");
                }}
                className={cn(
                  "cursor-pointer rounded-[14px] px-4 py-4 text-[17px] font-medium transition-colors",
                  format === f
                    ? "bg-plum text-ivory"
                    : "bg-white text-ink ring-1 ring-line hover:ring-ink/30"
                )}
              >
                {f === "group" ? "Grup" : "Birebir"}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === "day" && (
        <fieldset>
          <legend className="mb-1 font-display text-2xl text-ink">Günü seçin</legend>
          {program?.note && (
            <p className="mb-2 text-sm text-ink">{program.note}</p>
          )}
          <p className="mb-4 text-sm capitalize text-ink-muted">{currentMonthLabel()}</p>
          {days.length === 0 ? (
            <div className="rounded-[12px] border border-line bg-white p-5">
              <p className="text-[15px] text-ink-muted">
                Bu ay için açık saat yok. WhatsApp’tan yazın.
              </p>
              <div className="mt-4">
                <WhatsAppCta size="md" />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-line bg-white">
              <div className="grid grid-cols-7 border-b border-line bg-paper-alt text-center text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
                  <div key={d} className="px-1 py-2">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarWeeks.flat().map((cell, i) => {
                  if (!cell) {
                    return <div key={`empty-${i}`} className="min-h-[3.25rem] bg-paper-alt/40" />;
                  }
                  if (cell.past || !cell.available) {
                    return (
                      <div
                        key={cell.key}
                        className="flex min-h-[3.25rem] items-center justify-center text-sm text-ink-muted/35"
                      >
                        {cell.dayNum}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={cell.key}
                      type="button"
                      onClick={() => {
                        setDayKey(cell.key);
                        setSelected("");
                        setStep("time");
                      }}
                      className={cn(
                        "flex min-h-[3.25rem] cursor-pointer items-center justify-center text-[15px] font-medium transition-colors",
                        dayKey === cell.key
                          ? "bg-plum text-ivory"
                          : "text-ink hover:bg-plum/8"
                      )}
                    >
                      {cell.dayNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </fieldset>
      )}

      {step === "time" && times.length > 0 && (
        <fieldset>
          <legend className="mb-1 font-display text-2xl text-ink">Saati seçin</legend>
          <p className="mb-4 text-sm text-ink-muted">{dayLabel}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {times.map((o) => {
              const value = `${o.slot.id}|${o.startsAt}`;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setSelected(value);
                    setStep("details");
                  }}
                  className={cn(
                    "cursor-pointer rounded-[12px] px-3 py-3.5 text-sm font-medium transition-colors",
                    selected === value
                      ? "bg-plum text-ivory"
                      : "bg-white text-ink ring-1 ring-line hover:ring-ink/30"
                  )}
                >
                  {formatHourRange(o.startsAt, o.slot.duration_minutes)}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {step === "details" && picked && (
        <div className="grid gap-4 rounded-[16px] border border-line bg-white p-5 sm:grid-cols-2">
          <p className="sm:col-span-2 rounded-[10px] bg-paper-alt px-4 py-3 text-[15px] text-ink">
            {program?.name}
            {format === "group" ? " · Grup" : format === "individual" ? " · Birebir" : ""}
            {dayLabel ? ` · ${dayLabel}` : ""}
            {" · "}
            {formatHourRange(picked.startsAt, picked.slot.duration_minutes)}
          </p>
          <FormField
            label="Ad soyad"
            required
            value={values.student_name}
            onChange={(e) => setValues((v) => ({ ...v, student_name: e.target.value }))}
          />
          <FormField
            label="Yaş"
            type="number"
            min={4}
            max={80}
            required
            value={values.student_age}
            onChange={(e) => setValues((v) => ({ ...v, student_age: e.target.value }))}
          />
          <FormField
            label="Veli (çocuksa)"
            value={values.parent_name}
            onChange={(e) => setValues((v) => ({ ...v, parent_name: e.target.value }))}
          />
          <FormField
            label="Telefon"
            type="tel"
            required
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          />
          <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted sm:col-span-2">
            <input
              type="checkbox"
              required
              checked={values.kvkk}
              onChange={(e) => setValues((v) => ({ ...v, kvkk: e.target.checked }))}
              className="mt-1 accent-plum"
            />
            <span>{INTRO_KVKK_COPY}</span>
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" size="xl" disabled={isPending}>
              {isPending ? "Gönderiliyor…" : "Tanışma dersini ayarla"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
