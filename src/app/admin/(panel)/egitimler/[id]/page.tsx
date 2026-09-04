import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramById } from "@/server/queries/programs";
import { ProgramForm } from "@/features/admin/ProgramForm";

export const metadata: Metadata = { title: "Eğitim Düzenle" };

export default async function AdminEgitimEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let program = null;
  try {
    program = await getProgramById(id);
  } catch {
    // DB not configured or not found
  }

  if (!program) notFound();

  return (
    <div className="max-w-[720px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Eğitim Düzenle</h1>
        <p className="text-ink-muted mt-1">{program.name}</p>
      </div>
      <ProgramForm program={program} />
    </div>
  );
}