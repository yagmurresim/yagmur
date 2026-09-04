"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import {
  addApplicationNote,
  updateApplicationStatus,
  updateLeadFollowUp,
} from "@/server/actions/admin";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

const STATUS_TRANSITIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "NEW", label: "Yeni" },
  { value: "CONTACTED", label: "İletişime Geçildi" },
  { value: "INTRO_PLANNED", label: "Tanışma Dersi" },
  { value: "ENROLLED", label: "Kayıt Oldu" },
  { value: "CLOSED", label: "Kapandı" },
];

interface ApplicationActionsProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  phone: string;
  studentName: string;
  nextActionAt: string | null;
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ApplicationActions({
  applicationId,
  currentStatus,
  phone,
  studentName,
  nextActionAt,
}: ApplicationActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [followUp, setFollowUp] = useState(toDatetimeLocal(nextActionAt));
  const [isPending, startTransition] = useTransition();

  const waUrl = buildWhatsAppUrl(
    phone,
    `Merhaba ${studentName}, Yağmur Sanat Akademisi'nden yazıyorum.`
  );

  const handleStatusChange = (next: ApplicationStatus) => {
    startTransition(async () => {
      try {
        await updateApplicationStatus(applicationId, next);
        setStatus(next);
        toast.success("Durum güncellendi.");
      } catch {
        toast.error("Durum güncellenemedi.");
      }
    });
  };

  const handleAddNote = () => {
    startTransition(async () => {
      try {
        await addApplicationNote(applicationId, note);
        setNote("");
        toast.success("Not eklendi.");
      } catch {
        toast.error("Not eklenemedi.");
      }
    });
  };

  const handleFollowUp = () => {
    startTransition(async () => {
      try {
        await updateLeadFollowUp(applicationId, followUp ? new Date(followUp).toISOString() : null);
        toast.success("Takip tarihi kaydedildi.");
      } catch {
        toast.error("Takip tarihi kaydedilemedi.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-plum text-white text-sm font-medium rounded-[8px] hover:bg-violet transition-colors"
      >
        <MessageCircle size={16} aria-hidden="true" />
        WhatsApp’tan yaz
      </a>

      <div>
        <p className="text-sm font-medium text-ink mb-2">Durum</p>
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

      <div>
        <p className="text-sm font-medium text-ink mb-2">Sonraki takip</p>
        <div className="flex flex-wrap gap-2">
          <input
            type="datetime-local"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            className="h-10 px-3 text-sm rounded-[8px] border border-line bg-white focus:outline-none focus:border-violet"
          />
          <Button onClick={handleFollowUp} variant="secondary" size="sm" loading={isPending}>
            Kaydet
          </Button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-ink mb-2">Not Ekle</p>
        <div className="flex flex-col gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Konuşulanlar, uygun saat, kim aradı…"
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
            Notu Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
}
