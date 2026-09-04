"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProgram, createProgram } from "@/server/actions/admin";
import type { Program } from "@/types";

interface ProgramFormProps {
  program?: Program;
}

export function ProgramForm({ program }: ProgramFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState(program?.name ?? "");
  const [slug, setSlug] = useState(program?.slug ?? "");
  const [shortDesc, setShortDesc] = useState(program?.short_description ?? "");
  const [intro, setIntro] = useState(program?.intro ?? "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    program?.status ?? "draft"
  );
  const [formats, setFormats] = useState<string>(
    program?.lesson_formats?.join(", ") ?? ""
  );
  const [seoTitle, setSeoTitle] = useState(program?.seo_title ?? "");
  const [seoDesc, setSeoDesc] = useState(program?.seo_description ?? "");
  const [sortOrder, setSortOrder] = useState(program?.sort_order ?? 0);

  function handleSlugify(value: string) {
    return value
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Eğitim adı zorunludur.");
      return;
    }
    if (!slug.trim()) {
      setError("URL (slug) zorunludur.");
      return;
    }

    const lessonFormats = formats
      .split(",")
      .map((f) => f.trim().toLowerCase())
      .filter(Boolean);
    const invalidFormat = lessonFormats.find((f) => f !== "individual" && f !== "group");
    if (invalidFormat) {
      setError('Ders formatları yalnızca "individual" veya "group" olabilir.');
      return;
    }

    const data = {
      name: name.trim(),
      slug: slug.trim(),
      short_description: shortDesc.trim() || null,
      intro: intro.trim() || null,
      lesson_formats: lessonFormats as ("individual" | "group")[],
      status,
      sort_order: sortOrder,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDesc.trim() || null,
    };

    startTransition(async () => {
      try {
        if (program) {
          await updateProgram(program.id, data);
          setSuccess(true);
        } else {
          await createProgram(data);
          router.push("/admin/egitimler");
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
        <h2 className="font-medium text-ink text-base border-b border-line pb-3">
          Temel Bilgiler
        </h2>

        <div>
          <label className={labelClass} htmlFor="prog-name">Eğitim Adı *</label>
          <input
            id="prog-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!program) setSlug(handleSlugify(e.target.value) + "-kursu");
            }}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="prog-slug">
            URL Slug *
            <span className="ml-1 text-xs text-ink-muted font-normal">
              (örn: resim-kursu)
            </span>
          </label>
          <input
            id="prog-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="prog-short">Kısa Açıklama</label>
          <input
            id="prog-short"
            type="text"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className={inputClass}
            maxLength={200}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="prog-intro">Tanıtım Metni</label>
          <textarea
            id="prog-intro"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            className={inputClass}
            rows={4}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="prog-formats">
            Ders Formatları
            <span className="ml-1 text-xs text-ink-muted font-normal">
              (virgülle ayırın: individual, group)
            </span>
          </label>
          <input
            id="prog-formats"
            type="text"
            value={formats}
            onChange={(e) => setFormats(e.target.value)}
            className={inputClass}
            placeholder="individual, group"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="prog-status">Durum</label>
            <select
              id="prog-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "published" | "archived")
              }
              className={inputClass}
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="archived">Arşiv</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="prog-order">Sıra</label>
            <input
              id="prog-order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={inputClass}
              min={0}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-line rounded-[10px] p-6 space-y-5">
        <h2 className="font-medium text-ink text-base border-b border-line pb-3">
          SEO
        </h2>

        <div>
          <label className={labelClass} htmlFor="prog-seo-title">
            SEO Başlığı
            <span className="ml-1 text-xs text-ink-muted font-normal">
              ({seoTitle.length}/70)
            </span>
          </label>
          <input
            id="prog-seo-title"
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className={inputClass}
            maxLength={70}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="prog-seo-desc">
            Meta Açıklama
            <span className="ml-1 text-xs text-ink-muted font-normal">
              ({seoDesc.length}/160)
            </span>
          </label>
          <textarea
            id="prog-seo-desc"
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            className={inputClass}
            rows={3}
            maxLength={160}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 px-6 bg-plum text-white text-sm font-medium rounded-[8px] hover:bg-violet transition-colors disabled:opacity-60"
        >
          {isPending ? "Kaydediliyor…" : program ? "Değişiklikleri Kaydet" : "Eğitim Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/egitimler")}
          className="h-10 px-4 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}