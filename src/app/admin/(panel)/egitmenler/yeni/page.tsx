import type { Metadata } from "next";
import { InstructorForm } from "@/features/admin/InstructorForm";

export const metadata: Metadata = { title: "Yeni Eğitmen" };

export default function AdminEgitmenlerYeniPage() {
  return (
    <div className="max-w-[720px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Yeni Eğitmen</h1>
        <p className="text-ink-muted mt-1">Eğitmen kadrosuna yeni bir profil ekleyin.</p>
      </div>
      <InstructorForm />
    </div>
  );
}