import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getIntroSlotById } from "@/server/queries/intro-slots";
import { getAllProgramsAdmin } from "@/server/queries/programs";
import { IntroSlotForm } from "@/features/admin/IntroSlotForm";
import { DeleteButton } from "@/features/admin/DeleteButton";
import { deleteIntroSlot } from "@/server/actions/admin";

export const metadata: Metadata = { title: "Saati düzenle" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSaatDuzenlePage({ params }: PageProps) {
  const { id } = await params;
  const [slot, programs] = await Promise.all([
    getIntroSlotById(id),
    getAllProgramsAdmin().catch(() => []),
  ]);
  if (!slot) notFound();

  async function handleDelete() {
    "use server";
    await deleteIntroSlot(id);
    redirect("/admin/saatler");
  }

  return (
    <div className="max-w-[640px]">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Saati düzenle</h1>
          <p className="mt-1 text-sm text-ink-muted">{slot.program_name}</p>
        </div>
        <DeleteButton
          label="Kapat"
          confirmMessage="Bu saati siteden kaldırmak istediğinizden emin misiniz? Geçmiş kayıtlar durur."
          formAction={handleDelete}
        />
      </div>
      <IntroSlotForm programs={programs} slot={slot} />
    </div>
  );
}
