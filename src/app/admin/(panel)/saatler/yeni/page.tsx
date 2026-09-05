import type { Metadata } from "next";
import { getAllProgramsAdmin } from "@/server/queries/programs";
import { IntroSlotForm } from "@/features/admin/IntroSlotForm";

export const metadata: Metadata = { title: "Saat ekle" };

export default async function AdminSaatYeniPage() {
  let programs: Awaited<ReturnType<typeof getAllProgramsAdmin>> = [];
  try {
    programs = await getAllProgramsAdmin();
  } catch {
    // DB not configured
  }

  return (
    <div className="max-w-[640px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Saat ekle</h1>
        <p className="mt-1 text-ink-muted">
          Haftanın bir günü, bir saat, bir yaş aralığı. Sitede iki hafta görünür.
        </p>
      </div>
      {programs.length === 0 ? (
        <p className="text-ink-muted">Önce bir eğitim ekleyin.</p>
      ) : (
        <IntroSlotForm programs={programs} />
      )}
    </div>
  );
}
