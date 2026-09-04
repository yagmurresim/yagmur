import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Akademi Hakkında | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi hakkında. Karşıyaka'da MEB onaylı resim ve müzik eğitimi. Resmî sertifika programları.",
  canonical: "/akademi",
});

const TRUST_ITEMS = [
  "MEB Onaylı Kurs",
  "Resmî Sertifika ve Eğitim Programları",
  "Deneyimli Eğitmen Kadrosu",
  "Sergi ve Konser Fırsatları",
  "Güzel Sanatlar Liseleri ve Fakültelerine Hazırlık",
  "4 Yaştan Yetişkinlere",
];

const PROGRAMS = [
  { name: "Resim", slug: "resim-kursu", format: "Grup Eğitimi" },
  { name: "Piyano", slug: "piyano-kursu", format: "Birebir Eğitim" },
  { name: "Keman", slug: "keman-kursu", format: "Birebir & Grup" },
  { name: "Gitar", slug: "gitar-kursu", format: "Birebir & Grup" },
];

export default function AkademiPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28" aria-labelledby="akademi-heading">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <p className="text-sm font-medium text-violet tracking-widest uppercase mb-5">
                Akademi
              </p>
              <h1
                id="akademi-heading"
                className="font-display text-[clamp(2.8rem,5vw,5.5rem)] tracking-tight text-ink leading-[1.05] mb-6"
              >
                Sanatla
                <br />
                büyümek için
                <br />
                <span className="text-plum">doğru yer.</span>
              </h1>
              <p className="text-[18px] text-ink-muted leading-relaxed max-w-[520px]">
                Yağmur Sanat Akademisi, Karşıyaka&apos;da resim ve müzik eğitimi
                sunan MEB onaylı bir sanat kurusudur. Siz veya çocuğunuz
                için kişiye özel, resmî ve destekleyici bir eğitim ortamı
                sunuyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 bg-paper-alt border-y border-line" aria-label="Güven sinyalleri">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle
                  size={18}
                  className="text-violet shrink-0"
                  aria-hidden="true"
                />
                <span className="text-[15px] text-ink font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="py-24 lg:py-32" aria-labelledby="misyon-heading">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5">
              <h2
                id="misyon-heading"
                className="font-display text-[clamp(2rem,3vw,3.2rem)] tracking-tight text-ink"
              >
                Sanat ve disiplin
                bir arada.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <div className="flex flex-col gap-6 text-[16px] text-ink-muted leading-relaxed">
                <p>
                  Sanat eğitimi yalnızca teknik bir beceri değildir; bireyin
                  kendini ifade etmesinin, düşünmesinin ve büyümesinin bir
                  yoludur. Yağmur Sanat Akademisi bu anlayışla kurulmuştur.
                </p>
                <p>
                  Resim, piyano, keman ve gitar eğitimlerimiz hem teknik
                  doğruluk hem de yaratıcı ifade üzerine inşa edilmiştir.
                  Her öğrenci kendi temposunda, kendi sesiyle gelişir.
                </p>
                <p>
                  MEB onaylı yapımız, öğrencilerimizin aldığı eğitimin
                  resmî olarak belgelenmesini sağlar. Sergi ve konser
                  etkinlikleri ise sahnede var olmanın özgüvenini kazandırır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs overview */}
      <section className="py-16 bg-paper-alt border-y border-line" aria-labelledby="programs-overview">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <h2
            id="programs-overview"
            className="font-display text-2xl text-ink mb-10"
          >
            Eğitim Programları
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROGRAMS.map((prog) => (
              <Link
                key={prog.slug}
                href={`/egitimler/${prog.slug}`}
                className="group flex flex-col p-6 rounded-[10px] border border-line bg-white hover:border-plum transition-colors"
              >
                <h3 className="font-display text-xl text-ink group-hover:text-plum transition-colors mb-1">
                  {prog.name}
                </h3>
                <span className="text-xs text-ink-muted mb-4">{prog.format}</span>
                <span className="mt-auto text-sm font-medium text-plum flex items-center gap-1.5">
                  İncele <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-28 text-center">
        <div className="max-w-[560px] mx-auto px-6">
          <h2 className="font-display text-3xl text-ink mb-4">
            Başlamak için ilk adım.
          </h2>
          <p className="text-ink-muted mb-8">
            WhatsApp&apos;tan yazın. Akademi ekibi sizinle iletişime geçsin.
          </p>
          <WhatsAppCta size="xl" />
        </div>
      </section>
    </>
  );
}