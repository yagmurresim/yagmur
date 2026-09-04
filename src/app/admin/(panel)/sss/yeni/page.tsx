import type { Metadata } from "next";
import { FaqForm } from "@/features/admin/FaqForm";

export const metadata: Metadata = { title: "Yeni Soru" };

export default function AdminSssYeniPage() {
  return (
    <div className="max-w-[720px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Yeni Soru</h1>
        <p className="text-ink-muted mt-1">Sık sorulan sorulara yeni bir madde ekleyin.</p>
      </div>
      <FaqForm />
    </div>
  );
}
