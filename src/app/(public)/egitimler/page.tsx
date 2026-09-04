import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedPrograms } from "@/server/queries/programs";
import { buildMetadata } from "@/lib/seo";
import { programFormatLabel } from "@/lib/utils";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

export const metadata: Metadata = buildMetadata({
  title: "Eğitimler | Yağmur Sanat Akademisi",
  description:
    "Karşıyaka'da resim, piyano, keman ve gitar eğitimleri. MEB onaylı. Birebir ve grup formatları. Ücretsiz tanışma dersi.",
  canonical: "/egitimler",
});

const FALLBACK = [
  { id: "1", slug: "resim-kursu", name: "Resim", short_description: "Gözlem, renk ve anlatım. Grup ortamında yaratıcı gelişim.", lesson_formats: ["group"], sort_order: 1 },
  { id: "2", slug: "piyano-kursu", name: "Piyano", short_description: "Birebir eğitimle nota okumadan yoruma.", lesson_formats: ["individual"], sort_order: 2 },
  { id: "3", slug: "keman-kursu", name: "Keman", short_description: "Yay tekniğinden ifadeye. Birebir veya grup formatında.", lesson_formats: ["individual", "group"], sort_order: 3 },
  { id: "4", slug: "gitar-kursu", name: "Gitar", short_description: "Akustikten elektriğe. Birebir veya grup ortamında.", lesson_formats: ["individual", "group"], sort_order: 4 },
];

export default async function EgitimlerPage() {
  const programs = await getPublishedPrograms();
  const display = programs.length > 0 ? programs : FALLBACK;

  return (
    <>
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20" aria-labelledby="egitimler-heading">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
            Eğitimler
          </p>
          <h1
            id="egitimler-heading"
            className="font-display text-[clamp(2.8rem,5vw,5rem)] tracking-tight text-ink"
          >
            Resim ve müzik
            <br />
            eğitimleri.
          </h1>
          <p className="mt-6 text-[17px] text-ink-muted max-w-[500px] leading-relaxed">
            4 yaştan yetişkinlere. MEB onaylı. Birebir ve grup formatlarında.
            Her biri için ücretsiz tanışma dersi.
          </p>
        </div>
      </section>

      <section className="pb-24 lg:pb-32" aria-label="Eğitim listesi">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-6">
            {display.map((program, i) => (
              <Link
                key={program.id}
                href={`/egitimler/${program.slug}`}
                className="group relative flex flex-col p-8 lg:p-10 rounded-[12px] border border-line bg-white hover:border-plum hover:shadow-sm transition-all duration-200"
              >
                <span className="font-display text-4xl text-plum/10 mb-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-3xl text-ink group-hover:text-plum transition-colors mb-2">
                  {program.name}
                </h2>
                <span className="inline-flex text-xs font-medium text-ink-muted border border-line rounded-full px-3 py-1 w-fit mb-4">
                  {programFormatLabel(program.lesson_formats)}
                </span>
                {program.short_description && (
                  <p className="text-[15px] text-ink-muted leading-relaxed flex-1">
                    {program.short_description}
                  </p>
                )}
                <span className="mt-6 flex items-center gap-2 text-sm font-medium text-plum group-hover:gap-3 transition-all">
                  Eğitimi İncele <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center text-center gap-4">
            <h2 className="font-display text-2xl text-ink">
              Her eğitim için ücretsiz tanışma dersi.
            </h2>
            <p className="text-ink-muted max-w-[400px]">
              Hangi eğitimi seçeceğinizden emin değil misiniz? Önce tanışalım.
            </p>
            <WhatsAppCta size="lg" className="mt-2" />
          </div>
        </div>
      </section>
    </>
  );
}