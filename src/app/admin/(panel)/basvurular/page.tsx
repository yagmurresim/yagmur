import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MessageCircle, ChevronRight } from "lucide-react";
import { getApplicationsAdmin } from "@/server/queries/applications";
import { buildWhatsAppUrl, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const metadata: Metadata = { title: "Başvurular" };

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "NEW", label: "Yeni" },
  { value: "CONTACTED", label: "İletişime Geçildi" },
  { value: "INTRO_PLANNED", label: "Tanışma Dersi" },
  { value: "ENROLLED", label: "Kayıt Oldu" },
  { value: "CLOSED", label: "Kapandı" },
];

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function BasvurularPage({ searchParams }: Props) {
  const { status, q } = await searchParams;

  let applications: Awaited<ReturnType<typeof getApplicationsAdmin>> = [];
  let fetchError = false;

  try {
    applications = await getApplicationsAdmin();
  } catch {
    fetchError = true;
  }

  const filtered = applications
    .filter((a) => !status || a.status === status)
    .filter(
      (a) =>
        !q ||
        a.student_name.toLowerCase().includes(q.toLowerCase()) ||
        a.phone.includes(q) ||
        (a.email?.toLowerCase().includes(q.toLowerCase()) ?? false)
    );

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Başvurular</h1>
          <p className="text-ink-muted mt-1">{applications.length} toplam başvuru</p>
        </div>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3 mb-6" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="İsim veya telefon ara..."
          className="h-9 px-3 text-sm rounded-[7px] border border-line bg-white focus:outline-none focus:border-violet min-w-[200px]"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-9 px-3 text-sm rounded-[7px] border border-line bg-white focus:outline-none focus:border-violet"
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("status", e.target.value);
            window.location.href = url.toString();
          }}
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
          Ara
        </button>
      </form>

      {fetchError && (
        <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-4 text-sm text-amber-800 mb-6">
          Veritabanı bağlantısı kurulamadı. Supabase yapılandırmanızı kontrol edin.
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          <p className="text-lg">Başvuru bulunamadı.</p>
        </div>
      ) : (
        <div className="bg-white border border-line rounded-[10px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Öğrenci</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Eğitim</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Durum</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide hidden md:table-cell">Tarih</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">İletişim</th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{app.student_name}</p>
                      <p className="text-xs text-ink-muted">{app.student_age} yaş{app.parent_name ? ` · ${app.parent_name}` : ""}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {app.program_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-muted hidden md:table-cell">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${app.phone}`}
                          className="text-ink-muted hover:text-plum transition-colors"
                          aria-label="Telefon"
                        >
                          <Phone size={15} />
                        </a>
                        <a
                          href={buildWhatsAppUrl(app.phone, `Merhaba ${app.student_name} için başvurunuzla ilgili görüşmek istiyoruz.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-muted hover:text-plum transition-colors"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle size={15} />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/basvurular/${app.id}`}
                        className="text-ink-muted hover:text-plum transition-colors"
                        aria-label="Detay"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}