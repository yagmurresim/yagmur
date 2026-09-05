"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createIntroSlot, updateIntroSlot } from "@/server/actions/admin";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { IntroSlot, Program } from "@/types";

const DAYS = [
  { value: 1, label: "Pazartesi" },
  { value: 2, label: "Salı" },
  { value: 3, label: "Çarşamba" },
  { value: 4, label: "Perşembe" },
  { value: 5, label: "Cuma" },
  { value: 6, label: "Cumartesi" },
  { value: 7, label: "Pazar" },
];

interface IntroSlotFormProps {
  programs: Pick<Program, "id" | "name">[];
  slot?: IntroSlot;
}

export function IntroSlotForm({ programs, slot }: IntroSlotFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    program_id: slot?.program_id ?? programs[0]?.id ?? "",
    weekday: String(slot?.weekday ?? 1),
    start_time: slot?.start_time?.slice(0, 5) ?? "16:00",
    duration_minutes: String(slot?.duration_minutes ?? 45),
    lesson_format: slot?.lesson_format ?? "individual",
    age_min: String(slot?.age_min ?? 4),
    age_max: slot?.age_max != null ? String(slot.age_max) : "",
    capacity: String(slot?.capacity ?? 1),
    active: slot?.active ?? true,
    notes: slot?.notes ?? "",
  });

  const set = (key: keyof typeof values, val: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          program_id: values.program_id,
          weekday: Number(values.weekday),
          start_time: values.start_time,
          duration_minutes: Number(values.duration_minutes),
          lesson_format: values.lesson_format as "group" | "individual",
          age_min: Number(values.age_min),
          age_max: values.age_max ? Number(values.age_max) : null,
          capacity: Number(values.capacity),
          active: values.active,
          notes: values.notes || null,
        };
        if (slot) {
          await updateIntroSlot(slot.id, payload);
        } else {
          await createIntroSlot(payload);
        }
        router.push("/admin/saatler");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kaydedilemedi.");
      }
    });
  };

  const inputClass =
    "w-full h-11 px-3.5 rounded-[8px] border border-line bg-white text-sm text-ink focus:outline-none focus:ring-1 focus:ring-violet";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="slot-program">
          Eğitim
        </label>
        <select
          id="slot-program"
          required
          value={values.program_id}
          onChange={(e) => set("program_id", e.target.value)}
          className={inputClass}
        >
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="slot-format">
          Format
        </label>
        <select
          id="slot-format"
          value={values.lesson_format}
          onChange={(e) => set("lesson_format", e.target.value)}
          className={inputClass}
        >
          <option value="group">Grup</option>
          <option value="individual">Birebir</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="slot-day">
            Gün
          </label>
          <select
            id="slot-day"
            value={values.weekday}
            onChange={(e) => set("weekday", e.target.value)}
            className={inputClass}
          >
            {DAYS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <FormField
          label="Saat"
          type="time"
          required
          value={values.start_time}
          onChange={(e) => set("start_time", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          label="Süre (dk)"
          type="number"
          min={15}
          max={180}
          value={values.duration_minutes}
          onChange={(e) => set("duration_minutes", e.target.value)}
        />
        <FormField
          label="Yaş (min)"
          type="number"
          min={4}
          max={80}
          required
          value={values.age_min}
          onChange={(e) => set("age_min", e.target.value)}
        />
        <FormField
          label="Yaş (max)"
          hint="Boş = üst sınır yok"
          type="number"
          min={4}
          max={80}
          value={values.age_max}
          onChange={(e) => set("age_max", e.target.value)}
        />
      </div>

      <FormField
        label="Kontenjan"
        type="number"
        min={1}
        max={20}
        value={values.capacity}
        onChange={(e) => set("capacity", e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(e) => set("active", e.target.checked)}
        />
        Sitede görünsün
      </label>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Kaydediliyor…" : slot ? "Güncelle" : "Saat ekle"}
      </Button>
    </form>
  );
}
