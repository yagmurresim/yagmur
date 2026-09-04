"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateApplicationStatus, addApplicationNote } from "@/server/actions/admin";
import { Button } from "@/components/ui/Button";
import type { ApplicationStatus } from "@/types";

const STATUS_TRANSITIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "NEW", label: "Yeni" },
  { value: "CONTACTED", label: "İletişime Geçildi" },
  { value: "INTRO_PLANNED", label: "Tanışma Dersi / Görüşme" },
  { value: "ENROLLED", label: "Kayıt Oldu" },
  { value: "CLOSED", label: "Kapandı" },
];

interface ApplicationActionsProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export function ApplicationActions({ applicationId, currentStatus }: ApplicationActionsProps) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    startTransition(async () => {
      try {
        await updateApplicationStatus(applicationId, newStatus);
        setStatus(newStatus);
        toast.success("Durum güncellendi.");
        router.refresh();
      } catch {
        toast.error("Durum güncellenemedi.");
      }
    });
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    startTransition(async () => {
      try {
        await addApplicationNote(applicationId, note);
        setNote("");
        toast.success("Not eklendi.");
        router.refresh();
      } catch {
        toast.error("Not eklenemedi.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Status change */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">Durum Güncelle</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_TRANSITIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              disabled={isPending || s.value === status}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                s.value === status
                  ? "bg-plum/10 border-plum text-plum font-medium"
                  : "border-line text-ink-muted hover:border-plum hover:text-plum"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add note */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">Not Ekle</p>
        <div className="flex flex-col gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Not ekleyin..."
            rows={3}
            maxLength={2000}
            className="w-full p-3 text-sm rounded-[8px] border border-line bg-white focus:outline-none focus:border-violet resize-y"
          />
          <Button
            onClick={handleAddNote}
            variant="secondary"
            size="sm"
            loading={isPending}
            disabled={!note.trim()}
            className="self-start"
          >
            Not Ekle
          </Button>
        </div>
      </div>
    </div>
  );
}