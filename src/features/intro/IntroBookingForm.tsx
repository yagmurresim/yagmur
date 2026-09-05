"use client";

import { useMemo, useState, useTransition } from "react";
import { bookIntroLesson } from "@/server/actions/book-intro";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { formatHourRange, slotKind } from "@/lib/intro-slots";
import { INTRO_KVKK_COPY } from "@/lib/kvkk";
import { cn } from "@/lib/utils";
import type { IntroOccurrence } from "@/types";

const PROGRAMS = [
  { slug: "resim-kursu", name: "Resim", formats: ["group"] as const },
  { slug: "piyano-kursu", name: "Piyano", formats: ["individual"] as const },
  { slug: "keman-kursu", name: "Keman", formats: ["group", "individual"] as const },
  { slug: "gitar-kursu", name: "Gitar", formats: ["group", "individual"] as const },
];

interface IntroBookingFormProps {
  occurrences: IntroOccurrence[];
}

export function IntroBookingForm({ occurrences }: IntroBookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
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
    const map = new Map<string, { label: string; short: string; items: IntroOccurrence[] }>();
    for (const o of filtered) {
      const d = new Date(o.startsAt);
      const key = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
      const weekday = new Intl.DateTimeFormat("tr-TR", {
        weekday: "short",
        timeZone: "Europe/Istanbul",
      }).format(d);
      const day = new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "short",
        timeZone: "Europe/Istanbul",
      }).format(d);
      const long = new Intl.DateTimeFormat("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Europe/Istanbul",
      }).format(d);
      const entry = map.get(key) ?? { label: long, short: `${weekday}\n${day}`, items: [] };
      entry.items.push(o);
      map.set(key, entry);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const times = useMemo(() => {
    const day = days.find(([key]) => key === dayKey);
    return day?.[1].items ?? [];
  }, [days, dayKey]);

  const picked = times.find((o) => `${o.slot.id}|${o.startsAt}` === selected);
  const dayLabel = days.find(([key]) => key === dayKey)?.[1].label;

  const pickProgram = (slug: string) => {
    setProgramSlug(slug);
    const p = PROGRAMS.find((x) => x.slug === slug);
    setFormat(p?.formats.length === 1 ? p.formats[0] : "");
    setDayKey("");
    setSelected("");
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
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <p className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink">Eğitim</legend>
        <div className="flex flex-wrap gap-2">
          {PROGRAMS.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => pickProgram(p.slug)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
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

      {program && program.formats.length > 1 && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-ink">Format</legend>
          <div className="flex flex-wrap gap-2">
            {program.formats.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFormat(f);
                  setDayKey("");
                  setSelected("");
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
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

      {format && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-ink">Gün</legend>
          {days.length === 0 ? (
            <div className="rounded-[12px] border border-line bg-white p-5">
              <p className="text-[15px] text-ink-muted">
                Bu eğitim için açık saat yok. WhatsApp’tan yazın.
              </p>
              <div className="mt-4">
                <WhatsAppCta size="md" />
              </div>
            </div>
          ) : (
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
              {days.map(([key, day]) => {
                const [weekday, rest] = day.short.split("\n");
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setDayKey(key);
                      setSelected("");
                    }}
                    className={cn(
                      "flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-[12px] px-3 py-3 text-center transition-colors",
                      dayKey === key
                        ? "bg-plum text-ivory"
                        : "bg-white text-ink ring-1 ring-line hover:ring-ink/30"
                    )}
                  >
                    <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">
                      {weekday}
                    </span>
                    <span className="mt-1 text-sm font-medium">{rest}</span>
                  </button>
                );
              })}
            </div>
          )}
        </fieldset>
      )}

      {dayKey && times.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-ink">Saat</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {times.map((o) => {
              const value = `${o.slot.id}|${o.startsAt}`;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelected(value)}
                  className={cn(
                    "rounded-[12px] px-3 py-3 text-sm font-medium transition-colors",
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

      {selected && picked && (
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
