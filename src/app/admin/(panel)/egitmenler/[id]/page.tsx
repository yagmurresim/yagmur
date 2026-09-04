import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getInstructorById } from "@/server/queries/instructors";
import { InstructorForm } from "@/features/admin/InstructorForm";
import { DeleteButton } from "@/features/admin/DeleteButton";
import { deleteInstructor } from "@/server/actions/admin";

export const metadata: Metadata = { title: "Eğitmeni Düzenle" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEgitmenDuzenle({ params }: PageProps) {
  const { id } = await params;
  const instructor = await getInstructorById(id);
  if (!instructor) notFound();

  async function handleDelete() {
    "use server";
    await deleteInstructor(id);
    redirect("/admin/egitmenler");
  }

  return (
    <div className="max-w-[720px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Eğitmeni Düzenle</h1>
          <p className="text-ink-muted mt-1 text-sm">{instructor.name}</p>
        </div>
        <DeleteButton
          confirmMessage="Bu eğitmeni silmek istediğinizden emin misiniz?"
          formAction={handleDelete}
        />
      </div>
      <InstructorForm instructor={instructor} />
    </div>
  );
}