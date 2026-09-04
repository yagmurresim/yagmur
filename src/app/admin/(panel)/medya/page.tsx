import type { Metadata } from "next";

export const metadata: Metadata = { title: "Medya" };

export default function AdminMedyaPage() {
  return (
    <div className="max-w-[900px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Medya Kütüphanesi</h1>
        <p className="text-ink-muted mt-1">Görseller ve dosyalar</p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-4 text-sm text-amber-800 mb-6">
        Bucket <code className="font-mono">site-media</code> private&apos;tır
        (migration 006). Yükleme arayüzü henüz yok; yayınlanmamış dosyalar
        public URL ile açılamaz.
      </div>
      <div className="text-center py-20 border border-dashed border-line rounded-[12px] bg-white">
        <p className="text-ink-muted">Medya yükleme yakında aktif olacak.</p>
      </div>
    </div>
  );
}