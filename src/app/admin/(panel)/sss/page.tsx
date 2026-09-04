import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Edit3, Globe, EyeOff } from "lucide-react";
import { getAllFaqsAdmin } from "@/server/queries/faqs";

export const metadata: Metadata = { title: "SSS" };

export default async function AdminSssPage() {
  let faqs: Awaited<ReturnType<typeof getAllFaqsAdmin>> = [];

  try {
    faqs = await getAllFaqsAdmin();
  } catch {
    // DB not configured
  }

  return (
    <div className="max-w-[860px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Sık Sorulanlar</h1>
          <p className="text-ink-muted mt-1">{faqs.length} soru</p>
        </div>
        <Link
          href="/admin/sss/yeni"
          className="flex items-center gap-2 h-9 px-4 bg-plum text-white text-sm font-medium rounded-[8px] hover:bg-violet transition-colors"
        >
          <Plus size={16} aria-hidden="true" />
          Yeni Soru
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-16 text-ink-muted border border-line rounded-[10px] bg-white">
          <p>Henüz soru yok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="flex items-start justify-between gap-4 p-4 bg-white border border-line rounded-[8px]"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink text-sm">{faq.question}</p>
                <p className="text-xs text-ink-muted mt-1 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {faq.status === "published" ? (
                  <Globe size={14} className="text-green-600" aria-label="Yayında" />
                ) : (
                  <EyeOff size={14} className="text-ink-muted" aria-label="Taslak" />
                )}
                <Link
                  href={`/admin/sss/${faq.id}`}
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