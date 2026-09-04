"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createLead } from "@/server/actions/admin";
import { FormField, TextareaField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { Program } from "@/types";

const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Telefon" },
  { value: "instagram", label: "Instagram" },
  { value: "walk_in", label: "Yüz yüze" },
  { value: "other", label: "Diğer" },
] as const;

interface LeadFormProps {
  programs: Pick<Program, "id" | "name">[];
  compact?: boolean;
}

export function LeadForm({ programs, compact = false }: LeadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [more, setMore] = useState(!compact);
  const [values, setValues] = useState({
    student_name: "",
    student_age: "",
    parent_name: "",
    phone: "",
    program_id: "",
    source_channel: "whatsapp",
    next_action_at: "",
    message: "",
  });

  const set = (key: keyof typeof values, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const reset = () =>
    setValues({
      student_name: "",
      student_age: "",
      parent_name: "",
      phone: "",
      program_id: "",
      source_channel: "whatsapp",
      next_action_at: "",
      message: "",
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const id = await createLead({
          student_name: values.student_name,
          student_age: values.student_age ? Number(values.student_age) : null,
          parent_name: values.parent_name || null,
          phone: values.phone,
          program_id: values.program_id || null,
          source_channel: values.source_channel as
            | "whatsapp"
            | "phone"
            | "instagram"
            | "walk_in"
            | "other",
          next_action_at: values.next_action_at || null,
          message: values.message || null,
        });
        toast.success("Kayıt eklendi.");
        if (compact) {
          reset();
          router.refresh();
        } else {
          router.push(`/admin/basvurular/${id}`);
        }
      } catch {
        toast.error("Kayıt eklenemedi. Ad ve telefon gerekli.");
      }
    });
  };

  const extras = (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <FormField
          label="Yaş"
          type="number"
          min={4}
          max={100}
          value={values.student_age}
          onChange={(e) => set("student_age", e.target.value)}
        />
        <FormField
          label="Veli adı"
          value={values.parent_name}
          onChange={(e) => set("parent_name", e.target.value)}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-program" className="text-sm font-medium text-ink">
            Eğitim
          </label>
          <select
            id="lead-program"
            value={values.program_id}
            onChange={(e) => set("program_id", e.target.value)}
            className="h-11 w-full px-3.5 rounded-[8px] border border-line bg-white text-sm text-ink focus:outline-none focus:ring-1 focus:ring-violet focus:border-violet"
          >
            <option value="">Henüz seçilmedi</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-channel" className="text-sm font-medium text-ink">
            Kaynak
          </label>
          <select
            id="lead-channel"
            value={values.source_channel}
            onChange={(e) => set("source_channel", e.target.value)}
            className="h-11 w-full px-3.5 rounded-[8px] border border-line bg-white text-sm text-ink focus:outline-none focus:ring-1 focus:ring-violet focus:border-violet"
          >
            {CHANNELS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <FormField
        label="Sonraki takip"
        type="datetime-local"
        value={values.next_action_at}
        onChange={(e) => set("next_action_at", e.target.value)}
      />
      <TextareaField
        label="Not"
        value={values.message}
        onChange={(e) => set("message", e.target.value)}
        placeholder="WhatsApp’ta ne konuşuldu, hangi saat uygun…"
      />
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <FormField
          label="Ad soyad"
          required
          value={values.student_name}
          onChange={(e) => set("student_name", e.target.value)}
        />
        <FormField
          label="Telefon"
          required
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="0554 595 95 75"
        />
      </div>
      {more && extras}
      {compact && (
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          className="self-start text-xs font-medium text-plum hover:text-violet"
        >
          {more ? "Daha az alan" : "Eğitim, yaş, not ekle"}
        </button>
      )}
      <div className="flex gap-3">
        <Button type="submit" variant="primary" size={compact ? "md" : "lg"} loading={isPending}>
          Kaydı Ekle
        </Button>
        {!compact && (
          <Button type="button" variant="ghost" size="lg" onClick={() => router.push("/admin/basvurular")}>
            Vazgeç
          </Button>
        )}
      </div>
    </form>
  );
}
