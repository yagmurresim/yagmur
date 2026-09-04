import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Edit3, Globe, EyeOff } from "lucide-react";
import { getAllProgramsAdmin } from "@/server/queries/programs";
import { programFormatLabel } from "@/lib/utils";

export const metadata: Metadata = { title: "Eğitimler" };

export default async function AdminEgitimlerPage() {
  let programs: Awaited<ReturnType<typeof getAllProgramsAdmin>> = [];

  try {
    programs = await getAllProgramsAdmin();
  } catch {
    // DB not configured
  }

  return (
    <div className="max-w-[900px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Eğitimler</h1>
          <p className="text-ink-muted mt-1">{programs.length} eğitim</p>
        </div>
        <Link
          href="/admin/egitimler/yeni"
          className="flex items-center gap-2 h-9 px-4 bg-plum text-white text-sm font-medium rounded-[8px] hover:bg-violet transition-colors"
        >
          <Plus size={16} aria-hidden="true" />
          Yeni Eğitim
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-16 text-ink-muted border border-line rounded-[10px] bg-white">
          <p>Henüz eğitim yok. Yeni eğitim ekleyin.</p>
        </div>
      ) : (
        <div className="bg-white border border-line rounded-[10px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Eğitim</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide hidden sm:table-cell">Format</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Durum</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{program.name}</p>
                    <p className="text-xs text-ink-muted">/{program.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted hidden sm:table-cell">
                    {programFormatLabel(program.lesson_formats)}
                  </td>
                  <td className="px-4 py-3">
                    {program.status === "published" ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <Globe size={12} aria-hidden="true" /> Yayında
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-ink-muted">
                        <EyeOff size={12} aria-hidden="true" /> Taslak
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/egitimler/${program.id}`}
                      className="text-ink-muted hover:text-plum transition-colors"
                      aria-label={`${program.name} düzenle`}
                    >
                      <Edit3 size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}