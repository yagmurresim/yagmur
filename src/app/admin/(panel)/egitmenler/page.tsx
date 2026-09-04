import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Edit3, Globe, EyeOff } from "lucide-react";
import { getAllInstructorsAdmin } from "@/server/queries/instructors";

export const metadata: Metadata = { title: "Eğitmenler" };

export default async function AdminEgitmenlerPage() {
  let instructors: Awaited<ReturnType<typeof getAllInstructorsAdmin>> = [];

  try {
    instructors = await getAllInstructorsAdmin();
  } catch {
    // DB not configured
  }

  return (
    <div className="max-w-[860px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Eğitmenler</h1>
          <p className="text-ink-muted mt-1">{instructors.length} eğitmen</p>
        </div>
        <Link
          href="/admin/egitmenler/yeni"
          className="flex items-center gap-2 h-9 px-4 bg-plum text-white text-sm font-medium rounded-[8px] hover:bg-violet transition-colors"
        >
          <Plus size={16} aria-hidden="true" />
          Yeni Eğitmen
        </Link>
      </div>

      {instructors.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-line rounded-[12px] bg-white">
          <p className="text-xl font-display text-ink/40 mb-2">Henüz eğitmen profili yok</p>
          <p className="text-sm text-ink-muted max-w-[360px] mx-auto">
            Eğitmen profilleri eklendiğinde burada görünür. Eğitmenler yalnızca
            yayınlandığında public sitede ve navigasyonda görünür.
          </p>
          <Link
            href="/admin/egitmenler/yeni"
            className="inline-flex mt-6 text-sm font-medium text-plum hover:text-violet underline underline-offset-4"
          >
            İlk eğitmeni ekle →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="flex items-center justify-between gap-4 p-4 bg-white border border-line rounded-[8px]"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink text-sm">{instructor.name}</p>
                {instructor.title && (
                  <p className="text-xs text-ink-muted mt-0.5">{instructor.title}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-ink-muted">
                  Sıra: {instructor.sort_order}
                </span>
                {instructor.status === "published" ? (
                  <Globe size={14} className="text-green-600" aria-label="Yayında" />
                ) : instructor.status === "archived" ? (
                  <EyeOff size={14} className="text-orange-400" aria-label="Arşiv" />
                ) : (
                  <EyeOff size={14} className="text-ink-muted" aria-label="Taslak" />
                )}
                <Link
                  href={`/admin/egitmenler/${instructor.id}`}
                  className="text-ink-muted hover:text-plum transition-colors"
                  aria-label="Düzenle"
                >
                  <Edit3 size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}