import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFaqById } from "@/server/queries/faqs";
import { FaqForm } from "@/features/admin/FaqForm";
import { DeleteButton } from "@/features/admin/DeleteButton";
import { deleteFaq } from "@/server/actions/admin";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Soruyu Düzenle" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSssDuzenle({ params }: PageProps) {
  const { id } = await params;
  const faq = await getFaqById(id);
  if (!faq) notFound();

  async function handleDelete() {
    "use server";
    await deleteFaq(id);
    redirect("/admin/sss");
  }

  return (
    <div className="max-w-[720px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Soruyu Düzenle</h1>
          <p className="text-ink-muted mt-1 text-sm line-clamp-2">{faq.question}</p>
        </div>
        <DeleteButton
          confirmMessage="Bu soruyu silmek istediğinizden emin misiniz?"
          formAction={handleDelete}
        />
      </div>
      <FaqForm faq={faq} />
    </div>
  );
}
