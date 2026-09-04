"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateApplicationStatus } from "@/server/actions/admin";
import type { ApplicationStatus } from "@/types";

const OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "NEW", label: "Yeni" },
  { value: "CONTACTED", label: "İletişime geçildi" },
  { value: "INTRO_PLANNED", label: "Tanışma dersi" },
  { value: "ENROLLED", label: "Kayıt oldu" },
  { value: "CLOSED", label: "Kapandı" },
];

interface LeadRowActionsProps {
  id: string;
  status: ApplicationStatus;
}

export function LeadRowActions({ id, status }: LeadRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      aria-label="Durum"
      onChange={(e) => {
        const next = e.target.value as ApplicationStatus;
        startTransition(async () => {
          try {
            await updateApplicationStatus(id, next);
            toast.success("Durum güncellendi.");
          } catch {
            toast.error("Durum güncellenemedi.");
          }
        });
      }}
      className="h-8 max-w-[160px] px-2 text-xs rounded-[7px] border border-line bg-white text-ink focus:outline-none focus:border-violet disabled:opacity-60"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
