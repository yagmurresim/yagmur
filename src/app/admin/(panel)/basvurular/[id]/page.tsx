import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getApplicationById, getApplicationNotes } from "@/server/queries/applications";
import {
  formatDate,
  formatDateShort,
  isOverdue,
  leadSourceLabel,
} from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ApplicationActions } from "@/features/admin/ApplicationActions";
import type { ApplicationStatus } from "@/types";

export const metadata: Metadata = { title: "Kayıt Detayı" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;

  let application = null;
  let notes: Awaited<ReturnType<typeof getApplicationNotes>> = [];

  try {
    [application, notes] = await Promise.all([
      getApplicationById(id),
      getApplicationNotes(id),
    ]);
  } catch {
    // DB not configured
  }

  if (!application) notFound();

  const overdue =
    !!application.next_action_at &&
    isOverdue(application.next_action_at) &&
    application.status !== "CLOSED" &&
    application.status !== "ENROLLED";

  return (
    <div className="max-w-[860px]">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/basvurular"
          className="text-ink-muted hover:text-ink transition-colors"
          aria-label="Takip listesine dön"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl text-ink">
          {application.student_name}
        </h1>
        <StatusBadge status={application.status as ApplicationStatus} />
      </div>

      <div className="flex flex-col gap-6">
          <div className="bg-white border border-line rounded-[10px] p-6">
            <h2 className="font-medium text-ink mb-4">Kayıt bilgileri</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Kişi" value={application.student_name} />
              <InfoRow
                label="Yaş"
                value={application.student_age != null ? `${application.student_age}` : "—"}
              />
              {application.parent_name && (
                <InfoRow label="Veli" value={application.parent_name} />
              )}
              <InfoRow label="Telefon" value={application.phone} />
              {application.email && <InfoRow label="E-posta" value={application.email} />}
              <InfoRow label="Eğitim" value={application.program_name ?? "—"} />
              {(application.intro_occurrence_at ?? application.next_action_at) &&
                application.intro_slot_id && (
                <InfoRow
                  label="Tanışma saati"
                  value={formatDateShort(
                    application.intro_occurrence_at ?? application.next_action_at!
                  )}
                />
              )}
              <InfoRow label="Kaynak" value={leadSourceLabel(application.source_channel)} />
              {application.message && (
                <div className="col-span-2">
                  <dt className="text-xs font-medium text-ink-muted mb-1">İlk not</dt>
                  <dd className="text-ink bg-gray-50 p-3 rounded-[6px]">{application.message}</dd>
                </div>
              )}
              <InfoRow label="Kayıt tarihi" value={formatDate(application.created_at)} />
              {application.last_contacted_at && (
                <InfoRow label="Son iletişim" value={formatDate(application.last_contacted_at)} />
              )}
              <div className="col-span-2">
                <dt className="text-xs font-medium text-ink-muted mb-0.5">Sonraki takip</dt>
                <dd className={`text-sm ${overdue ? "text-orange-700 font-medium" : "text-ink"}`}>
                  {application.next_action_at
                    ? `${formatDateShort(application.next_action_at)}${overdue ? " · geçti" : ""}`
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-line rounded-[10px] p-6">
            <h2 className="font-medium text-ink mb-4">Notlar</h2>
            {notes.length === 0 ? (
              <p className="text-sm text-ink-muted mb-4">Henüz not eklenmemiş.</p>
            ) : (
              <div className="flex flex-col gap-3 mb-4">
                {notes.map((note) => (
                  <div key={note.id} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-[6px]">
                    <p className="text-sm text-ink">{note.note}</p>
                    <p className="text-xs text-ink-muted">
                      {note.author_name} · {formatDate(note.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <ApplicationActions
              applicationId={application.id}
              currentStatus={application.status as ApplicationStatus}
              phone={application.phone}
              studentName={application.student_name}
              nextActionAt={application.next_action_at}
            />
          </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-muted mb-0.5">{label}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}
