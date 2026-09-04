import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { getApplicationById, getApplicationNotes } from "@/server/queries/applications";
import { buildWhatsAppUrl, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ApplicationActions } from "@/features/admin/ApplicationActions";

export const metadata: Metadata = { title: "Başvuru Detayı" };

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

  const whatsappUrl = buildWhatsAppUrl(
    application.phone,
    `Merhaba, ${application.student_name} için başvurunuzla ilgili görüşmek istiyoruz.`
  );

  return (
    <div className="max-w-[860px]">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/basvurular"
          className="text-ink-muted hover:text-ink transition-colors"
          aria-label="Başvurular listesine dön"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl text-ink">
          {application.student_name}
        </h1>
        <StatusBadge status={application.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-line rounded-[10px] p-6">
            <h2 className="font-medium text-ink mb-4">Başvuru Bilgileri</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Öğrenci" value={application.student_name} />
              <InfoRow label="Yaş" value={`${application.student_age}`} />
              {application.parent_name && (
                <InfoRow label="Veli" value={application.parent_name} />
              )}
              <InfoRow label="Telefon" value={application.phone} />
              {application.email && <InfoRow label="E-posta" value={application.email} />}
              <InfoRow label="Eğitim" value={application.program_name ?? "—"} />
              {application.current_level && (
                <InfoRow label="Seviye" value={application.current_level} />
              )}
              {application.preferred_contact_channel && (
                <InfoRow label="İletişim Tercihi" value={application.preferred_contact_channel === "whatsapp" ? "WhatsApp" : "Telefon"} />
              )}
              {application.message && (
                <div className="col-span-2">
                  <dt className="text-xs font-medium text-ink-muted mb-1">Mesaj</dt>
                  <dd className="text-ink bg-gray-50 p-3 rounded-[6px]">{application.message}</dd>
                </div>
              )}
              <InfoRow label="Başvuru Tarihi" value={formatDate(application.created_at)} />
              <InfoRow label="Kaynak" value={application.source_page ?? "—"} />
            </dl>
          </div>

          {/* Notes */}
          <div className="bg-white border border-line rounded-[10px] p-6">
            <h2 className="font-medium text-ink mb-4">Notlar</h2>
            {notes.length === 0 ? (
              <p className="text-sm text-ink-muted">Henüz not eklenmemiş.</p>
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
            <ApplicationActions applicationId={application.id} currentStatus={application.status as import("@/types").ApplicationStatus} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-line rounded-[10px] p-5">
            <h2 className="font-medium text-ink mb-4">İletişim</h2>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${application.phone}`}
                className="flex items-center gap-2 text-sm text-ink hover:text-plum transition-colors py-1"
              >
                <Phone size={15} aria-hidden="true" />
                {application.phone}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-ink hover:text-plum transition-colors py-1"
              >
                <MessageCircle size={15} aria-hidden="true" />
                WhatsApp&apos;tan Yaz
              </a>
            </div>
          </div>

          <div className="bg-white border border-line rounded-[10px] p-5">
            <h2 className="font-medium text-ink mb-2 text-sm">KVKK Onayı</h2>
            <p className="text-xs text-ink-muted">
              {application.kvkk_consent ? "✓ Onaylandı" : "✗ Onaylanmadı"}
            </p>
            {application.consented_at && (
              <p className="text-xs text-ink-muted mt-1">
                {formatDate(application.consented_at)}
              </p>
            )}
          </div>
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