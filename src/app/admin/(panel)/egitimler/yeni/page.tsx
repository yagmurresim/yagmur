import type { Metadata } from "next";
import { ProgramForm } from "@/features/admin/ProgramForm";

export const metadata: Metadata = { title: "Yeni Eğitim" };

export default function AdminEgitimYeniPage() {
  return (
    <div className="max-w-[720px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Yeni Eğitim</h1>
        <p className="text-ink-muted mt-1">Yeni bir eğitim programı oluşturun.</p>
      </div>
      <ProgramForm />
    </div>
  );
}