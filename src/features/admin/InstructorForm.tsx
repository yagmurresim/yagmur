"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createInstructor, updateInstructor } from "@/server/actions/admin";
import type { Instructor } from "@/types";

interface InstructorFormProps {
  instructor?: Instructor;
}

export function InstructorForm({ instructor }: InstructorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState(instructor?.name ?? "");
  const [slug, setSlug] = useState(instructor?.slug ?? "");
  const [title, setTitle] = useState(instructor?.title ?? "");
  const [shortBio, setShortBio] = useState(instructor?.short_bio ?? "");
  const [bio, setBio] = useState(instructor?.bio ?? "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    instructor?.status ?? "draft"
  );
  const [sortOrder, setSortOrder] = useState(instructor?.sort_order ?? 0);
  const [seoTitle, setSeoTitle] = useState(instructor?.seo_title ?? "");
  const [seoDesc, setSeoDesc] = useState(instructor?.seo_description ?? "");

  function handleSlugify(value: string) {
    return value
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) { setError("Eğitmen adı zorunludur."); return; }
    if (!slug.trim()) { setError("URL slug zorunludur."); return; }

    const data = {
      name: name.trim(),
      slug: slug.trim(),
      title: title.trim() || null,
      short_bio: shortBio.trim() || null,
      bio: bio.trim() || null,
      status,
      sort_order: sortOrder,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDesc.trim() || null,
    };

    startTransition(async () => {
      try {
        if (instructor) {
          await updateInstructor(instructor.id, data);
          setSuccess(true);
        } else {
          await createInstructor(data);
          router.push("/admin/egitmenler");
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
        <h2 className="font-medium text-ink text-base border-b border-line pb-3">Temel Bilgiler</h2>

        <div>
          <label className={labelClass} htmlFor="ins-name">Ad Soyad *</label>
          <input
            id="ins-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!instructor) setSlug(handleSlugify(e.target.value));
            }}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ins-slug">
            URL Slug *
            <span className="ml-1 text-xs text-ink-muted font-normal">(örn: ali-yilmaz)</span>
          </label>
          <input
            id="ins-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ins-title">Unvan</label>
          <input
            id="ins-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Resim Eğitmeni"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ins-shortbio">Kısa Biyografi</label>
          <input
            id="ins-shortbio"
            type="text"
            value={shortBio}
            onChange={(e) => setShortBio(e.target.value)}
            className={inputClass}
            maxLength={200}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ins-bio">Tam Biyografi</label>
          <textarea
            id="ins-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={inputClass}
            rows={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="ins-status">Durum</label>
            <select
              id="ins-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
              className={inputClass}
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="archived">Arşiv</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="ins-order">Sıra</label>
            <input
              id="ins-order"
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
        <h2 className="font-medium text-ink text-base border-b border-line pb-3">SEO</h2>
        <div>
          <label className={labelClass} htmlFor="ins-seo-title">
            SEO Başlığı <span className="text-xs text-ink-muted font-normal">({seoTitle.length}/70)</span>
          </label>
          <input
            id="ins-seo-title"
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className={inputClass}
            maxLength={70}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="ins-seo-desc">
            Meta Açıklama <span className="text-xs text-ink-muted font-normal">({seoDesc.length}/160)</span>
          </label>
          <textarea
            id="ins-seo-desc"
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
          {isPending ? "Kaydediliyor…" : instructor ? "Değişiklikleri Kaydet" : "Eğitmen Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/egitmenler")}
          className="h-10 px-4 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}