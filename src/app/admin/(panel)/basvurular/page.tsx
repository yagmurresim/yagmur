import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MessageCircle, ChevronRight } from "lucide-react";
import { getApplicationsAdmin } from "@/server/queries/applications";
import { getAllProgramsAdmin } from "@/server/queries/programs";
import {
  buildWhatsAppUrl,
  formatDateShort,
  isOverdue,
  leadSourceLabel,
} from "@/lib/utils";
import { LeadForm } from "@/features/admin/LeadForm";
import { LeadRowActions } from "@/features/admin/LeadRowActions";
import type { ApplicationStatus } from "@/types";

export const metadata: Metadata = { title: "Takip" };

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "NEW", label: "Yeni" },
  { value: "CONTACTED", label: "İletişime Geçildi" },
  { value: "INTRO_PLANNED", label: "Tanışma Dersi" },
  { value: "ENROLLED", label: "Kayıt Oldu" },
  { value: "CLOSED", label: "Kapandı" },
];

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function AdminTakipPage({ searchParams }: Props) {
  const { q = "", status = "" } = await searchParams;
  let applications: Awaited<ReturnType<typeof getApplicationsAdmin>> = [];
  let programs: Awaited<ReturnType<typeof getAllProgramsAdmin>> = [];

  try {
    [applications, programs] = await Promise.all([
      getApplicationsAdmin(),
      getAllProgramsAdmin(),
    ]);
  } catch {
    // DB not configured
  }

  const query = q.trim().toLowerCase();
  const filtered = applications.filter((app) => {
    if (status && app.status !== status) return false;
    if (!query) return true;
    const haystack = [
      app.student_name,
      app.phone,
      app.parent_name,
      app.program_name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  const openLeads = applications.filter(
    (app) => app.status !== "CLOSED" && app.status !== "ENROLLED"
  );
  const overdue = openLeads.filter(
    (app) => app.next_action_at && isOverdue(app.next_action_at)
  );

  return (
    <div className="max-w-[1100px]">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-ink">Takip</h1>
        <p className="text-ink-muted mt-1">
          {openLeads.length} açık kayıt
          {overdue.length > 0 ? ` · ${overdue.length} takip tarihi geçti` : ""}
        </p>
      </div>

      <section className="bg-white border border-line rounded-[10px] p-5 mb-6">
        <h2 className="font-medium text-ink mb-4">Yeni kayıt</h2>
        <LeadForm
          compact
          programs={programs.map((p) => ({ id: p.id, name: p.name }))}
        />
      </section>

      {overdue.length > 0 && (
        <div className="mb-4 rounded-[10px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
          {overdue.length} kaydın takip tarihi geçti. Listede turuncu görünür.
        </div>
      )}

      <form className="flex flex-wrap gap-3 mb-4" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="İsim veya telefon"
          className="h-9 px-3 text-sm rounded-[7px] border border-line bg-white focus:outline-none focus:border-violet min-w-[200px]"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-9 px-3 text-sm rounded-[7px] border border-line bg-white focus:outline-none focus:border-violet"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-9 px-4 text-sm font-medium bg-plum text-white rounded-[7px] hover:bg-violet transition-colors"
        >
          Filtrele
        </button>
      </form>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-ink-muted border border-line rounded-[10px] bg-white">
          <p>Henüz kayıt yok. Yukarıdan ekleyin.</p>
        </div>
      ) : (
        <div className="bg-white border border-line rounded-[10px] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-ink-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-3">Kişi</th>
                <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Eğitim</th>
                <th className="text-left font-medium px-4 py-3">Durum</th>
                <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Takip</th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => {
                const overdueRow =
                  !!app.next_action_at &&
                  isOverdue(app.next_action_at) &&
                  app.status !== "CLOSED" &&
                  app.status !== "ENROLLED";
                const waUrl = buildWhatsAppUrl(
                  app.phone,
                  `Merhaba ${app.student_name}, Yağmur Sanat Akademisi'nden yazıyorum.`
                );
                return (
                  <tr key={app.id} className="border-t border-line hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{app.student_name}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {app.phone} · {leadSourceLabel(app.source_channel)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-ink-muted hidden sm:table-cell">
                      {app.program_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <LeadRowActions
                        id={app.id}
                        status={app.status as ApplicationStatus}
                      />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {app.next_action_at ? (
                        <span className={overdueRow ? "text-orange-700 font-medium" : "text-ink-muted"}>
                          {formatDateShort(app.next_action_at)}
                          {overdueRow ? " · geçti" : ""}
                        </span>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`tel:${app.phone}`}
                          className="text-ink-muted hover:text-plum transition-colors"
                          aria-label="Ara"
                        >
                          <Phone size={16} />
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-muted hover:text-plum transition-colors"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>
                        <Link
                          href={`/admin/basvurular/${app.id}`}
                          className="text-ink-muted hover:text-plum transition-colors"
                          aria-label="Not ve detay"
                        >
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
