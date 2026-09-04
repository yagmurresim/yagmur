import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllProgramsAdmin } from "@/server/queries/programs";
import { LeadForm } from "@/features/admin/LeadForm";

export const metadata: Metadata = { title: "Yeni Kayıt" };

export default async function YeniKayitPage() {
  let programs: Awaited<ReturnType<typeof getAllProgramsAdmin>> = [];
  try {
    programs = await getAllProgramsAdmin();
  } catch {
    // DB not configured
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/basvurular"
          className="text-ink-muted hover:text-ink transition-colors"
          aria-label="Kayıtlara dön"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-3xl text-ink">Yeni kayıt</h1>
          <p className="text-sm text-ink-muted mt-1">
            WhatsApp, telefon veya yüz yüze gelen kişiyi buraya ekleyin.
          </p>
        </div>
      </div>
      <LeadForm programs={programs.map((p) => ({ id: p.id, name: p.name }))} />
    </div>
  );
}
