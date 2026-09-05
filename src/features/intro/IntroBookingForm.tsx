"use client";

import { useMemo, useState, useTransition } from "react";
import { bookIntroLesson } from "@/server/actions/book-intro";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { ageBandLabel } from "@/lib/intro-slots";
import { INTRO_KVKK_COPY } from "@/lib/kvkk";
import type { IntroOccurrence } from "@/types";

interface IntroBookingFormProps {
  occurrences: IntroOccurrence[];
}

export function IntroBookingForm({ occurrences }: IntroBookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [age, setAge] = useState("");
  const [selected, setSelected] = useState("");
  const [requestId] = useState(() => crypto.randomUUID());
  const [values, setValues] = useState({
    student_name: "",
    parent_name: "",
    phone: "",
    kvkk: false,
  });

  const ageNum = Number(age);
  const matching = useMemo(() => {
    if (!Number.isFinite(ageNum) || ageNum < 4) return [];
    return occurrences.filter((o) => {
      if (ageNum < o.slot.age_min) return false;
      if (o.slot.age_max != null && ageNum > o.slot.age_max) return false;
      return true;
    });
  }, [occurrences, ageNum]);

  const grouped = useMemo(() => {
    const map = new Map<string, IntroOccurrence[]>();
    for (const o of matching) {
      const key = new Intl.DateTimeFormat("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Europe/Istanbul",
      }).format(new Date(o.startsAt));
      const list = map.get(key) ?? [];
      list.push(o);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [matching]);

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
        student_age: ageNum,
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
      <div className="rounded-[12px] border border-line bg-white p-8">
        <h2 className="font-display text-3xl text-ink">Aldık.</h2>
        <p className="mt-3 max-w-[42ch] text-[16px] leading-relaxed text-ink-muted">
          Tanışma dersi not edildi. Akademi sizi arar veya WhatsApp’tan yazar —
          saati teyit etmek için. Gelmeden bir şey ödemeniz gerekmez.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <p className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
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
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
            setSelected("");
          }}
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
      </div>

      <fieldset>
        <legend className="mb-4 text-sm font-medium text-ink">Saat</legend>
        {!age && (
          <p className="text-sm text-ink-muted">Önce yaşı yazın; uygun saatler çıksın.</p>
        )}
        {age && matching.length === 0 && (
          <div className="rounded-[10px] border border-line bg-white p-5">
            <p className="text-[15px] text-ink-muted">
              Bu yaş için açık saat yok. WhatsApp’tan yazın, ekip uydurur.
            </p>
            <div className="mt-4">
              <WhatsAppCta size="md" />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-6">
          {grouped.map(([day, list]) => (
            <div key={day}>
              <p className="mb-2 text-[13px] font-medium text-ink-muted">{day}</p>
              <div className="flex flex-col gap-2">
                {list.map((o) => {
                  const value = `${o.slot.id}|${o.startsAt}`;
                  const time = new Intl.DateTimeFormat("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Istanbul",
                  }).format(new Date(o.startsAt));
                  return (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-[10px] border px-4 py-3 text-sm transition-colors ${
                        selected === value
                          ? "border-plum bg-plum/5"
                          : "border-line bg-white hover:border-ink/30"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="slot"
                          value={value}
                          checked={selected === value}
                          onChange={() => setSelected(value)}
                          className="accent-plum"
                        />
                        <span className="font-medium text-ink">
                          {time}
                          <span className="ml-2 font-normal text-ink-muted">
                            {o.slot.program_name}
                          </span>
                        </span>
                      </span>
                      <span className="text-xs text-ink-muted">
                        {ageBandLabel(o.slot.age_min, o.slot.age_max)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          required
          checked={values.kvkk}
          onChange={(e) => setValues((v) => ({ ...v, kvkk: e.target.checked }))}
          className="mt-1 accent-plum"
        />
        <span>
          {INTRO_KVKK_COPY}
        </span>
      </label>

      <Button type="submit" size="xl" disabled={isPending || matching.length === 0}>
        {isPending ? "Gönderiliyor…" : "Tanışma dersini ayarla"}
      </Button>
    </form>
  );
}
