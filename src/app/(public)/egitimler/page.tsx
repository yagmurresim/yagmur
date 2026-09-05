import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPrograms } from "@/server/queries/programs";
import { buildMetadata } from "@/lib/seo";
import { programFormatLabel } from "@/lib/utils";
import { toneFor } from "@/lib/program-tones";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

export const metadata: Metadata = buildMetadata({
  title: "Eğitimler | Yağmur Sanat Akademisi",
  description:
    "Karşıyaka’da resim, piyano, keman ve gitar eğitimleri. MEB onaylı. Grup ve birebir. 4 yaştan yetişkine, ücretsiz tanışma dersi.",
  canonical: "/egitimler",
});

const FALLBACK = [
  {
    id: "1",
    slug: "resim-kursu",
    name: "Resim",
    short_description:
      "Grup dersinde gözlem, renk ve kompozisyon. 4 yaştan yetişkine; güzel sanatlar hazırlığı dersin içinde.",
    lesson_formats: ["group"],
  },
  {
    id: "2",
    slug: "piyano-kursu",
    name: "Piyano",
    short_description:
      "Birebir ders. Nota okumadan dokunuşa, temposu öğrenciye göre. Dönem sonunda konser.",
    lesson_formats: ["individual"],
  },
  {
    id: "3",
    slug: "keman-kursu",
    name: "Keman",
    short_description:
      "Yay, postür, kulak. Birebir veya grup. Yeni başlayan da gelir, devam eden de.",
    lesson_formats: ["individual", "group"],
  },
  {
    id: "4",
    slug: "gitar-kursu",
    name: "Gitar",
    short_description:
      "Akor, ritim, parmak. Akustik veya elektro. Birebir ya da grup — seviyenize göre.",
    lesson_formats: ["individual", "group"],
  },
];

export default async function EgitimlerPage() {
  const programs = await getPublishedPrograms();
  const display = programs.length > 0 ? programs : FALLBACK;

  return (
    <>
      <section className="bg-paper pt-32 pb-16 text-ink lg:pt-44 lg:pb-20" aria-labelledby="egitimler-heading">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h1
            id="egitimler-heading"
            className="font-display max-w-[12ch] text-[clamp(3.2rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em]"
          >
            Dört eğitim.
            <br />
            <em className="italic text-plum">Bir akademi.</em>
          </h1>
          <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
            Resim grup, piyano birebir, keman ve gitar ikisi birden. Hepsi MEB onaylı,
            hepsi 4 yaştan yetişkine. Hangisinin size uyduğunu tanışma dersinde görürsünüz —
            önce akademiye bakın, kayıt sonra.
          </p>
        </div>
      </section>

      <section aria-label="Eğitim listesi">
        {display.map((program) => {
          const tone = toneFor(program.slug);
          return (
            <Link
              key={program.id}
              href={`/egitimler/${program.slug}`}
              className="group relative flex min-h-[36vh] items-end overflow-hidden px-6 py-12 text-ink lg:min-h-[42vh] lg:px-12"
              style={{ backgroundColor: tone.wash }}
            >
              <span
                className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
                style={{
                  background: `radial-gradient(ellipse at 85% 40%, ${tone.accent}28, transparent 60%)`,
                }}
                aria-hidden="true"
              />
              <div className="relative mx-auto w-full max-w-[1400px]">
                <p className="text-[13px] text-ink-muted">
                  {programFormatLabel(program.lesson_formats)}
                </p>
                <h2 className="font-display mt-2 text-[clamp(2.8rem,7vw,6.2rem)] leading-[0.9]">
                  {program.name}
                </h2>
                {program.short_description && (
                  <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-ink-muted">
                    {program.short_description}
                  </p>
                )}
                <p className="mt-5 text-[14px] font-medium text-plum">Eğitime bak →</p>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="bg-paper px-6 py-24">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-ink">
            Kararsızsanız gelin bakın.
          </h2>
          <p className="mt-4 max-w-[48ch] text-[17px] leading-relaxed text-ink-muted">
            WhatsApp’tan yaşınızı ve aklınızdaki eğitimi yazın. Ücretsiz tanışma dersi
            ayarlanır. Beğenmezseniz kayıt olmazsınız — o da bir cevap.
          </p>
          <div className="mt-8">
            <WhatsAppCta size="lg" />
          </div>
        </div>
      </section>
    </>
  );
}
