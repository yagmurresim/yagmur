"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFaq, updateFaq } from "@/server/actions/admin";
import type { Faq } from "@/types";

interface FaqFormProps {
  faq?: Faq;
}

export function FaqForm({ faq }: FaqFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [status, setStatus] = useState<"draft" | "published">(faq?.status ?? "published");
  const [sortOrder, setSortOrder] = useState(faq?.sort_order ?? 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!question.trim()) { setError("Soru metni zorunludur."); return; }
    if (!answer.trim()) { setError("Cevap metni zorunludur."); return; }

    const data = {
      question: question.trim(),
      answer: answer.trim(),
      status,
      sort_order: sortOrder,
    };

    startTransition(async () => {
      try {
        if (faq) {
          await updateFaq(faq.id, data);
          setSuccess(true);
        } else {
          await createFaq(data);
          router.push("/admin/sss");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      }
    });
  }

  const inputClass =
    "w-full px-3 py-2 border border-line rounded-[8px] text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum transition-colors";
  const labelClass = "block text-sm font-medium text-ink mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-[8px] text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-[8px] text-sm text-green-700">
          Değişiklikler kaydedildi.
        </div>
      )}

      <div className="bg-white border border-line rounded-[10px] p-6 space-y-5">
        <div>
          <label className={labelClass} htmlFor="faq-question">Soru *</label>
          <input
            id="faq-question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="faq-answer">Cevap *</label>
          <textarea
            id="faq-answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={inputClass}
            rows={5}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="faq-status">Durum</label>
            <select
              id="faq-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className={inputClass}
            >
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="faq-order">Sıra</label>
            <input
              id="faq-order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={inputClass}
              min={0}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 px-6 bg-plum text-white text-sm font-medium rounded-[8px] hover:bg-violet transition-colors disabled:opacity-60"
        >
          {isPending ? "Kaydediliyor…" : faq ? "Değişiklikleri Kaydet" : "Soru Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/sss")}
          className="h-10 px-4 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}