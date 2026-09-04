import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Users, User, ArrowLeft } from "lucide-react";
import { getPublishedPrograms, getProgramBySlug } from "@/server/queries/programs";
import { buildProgramMetadata } from "@/lib/seo";
import { programFormatLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const programs = await getPublishedPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return {};
  return buildProgramMetadata(program);
}

const LOCAL_KEYWORDS: Record<string, string> = {
  "resim-kursu": "Karşıyaka resim kursu",
  "piyano-kursu": "Karşıyaka piyano kursu",
  "keman-kursu": "Karşıyaka keman kursu",
  "gitar-kursu": "Karşıyaka gitar kursu",
};

const PROGRAM_INTROS: Record<string, { heading: string; body: string; details: string[] }> = {
  "resim-kursu": {
    heading: "Gözlem, renk ve anlatım.",
    body: "Resim eğitiminde öğrenciler yalnızca teknik beceri kazanmaz; görmek, hissetmek ve ifade etmek öğrenir. Akademimizde grup eğitimi formatında yürütülen resim dersleri, her seviyeye ve her yaşa uygundur.",
    details: [
      "Grup eğitimi formatı",
      "4 yaştan yetişkinlere",
      "MEB onaylı eğitim programı",
      "Resmî sertifika",
      "Güzel Sanatlar hazırlık desteği",
      "Sergi fırsatları",
    ],
  },
  "piyano-kursu": {
    heading: "Bireysel yolculuk, müzikal derinlik.",
    body: "Piyano eğitimi birebir formatında yürütülür. Nota okumadan yoruma, teknikten müzikaliteye uzanan yolculukta her öğrenci kendi temposunda ilerler.",
    details: [
      "Birebir eğitim",
      "4 yaştan yetişkinlere",
      "MEB onaylı eğitim programı",
      "Resmî sertifika",
      "Konser fırsatları",
    ],
  },
  "keman-kursu": {
    heading: "Yay ile ses, ifade ile teknik.",
    body: "Keman eğitiminde her öğrenci için uygun format seçilir. Birebir veya grup ortamında yay tekniğinden müzikal ifadeye uzanan kapsamlı bir eğitim sunulur.",
    details: [
      "Birebir ve grup formatları",
      "Her seviyeye uygun",
      "MEB onaylı eğitim programı",
      "Resmî sertifika",
      "Konser fırsatları",
    ],
  },
  "gitar-kursu": {
    heading: "Telden melodiye, ritimsiz müzik olmaz.",
    body: "Gitar eğitimi birebir veya grup formatında sunulur. Akustik veya elektro gitar tercihine göre şekillenen dersler; teknik ve müzikaliteyi bir arada geliştirir.",
    details: [
      "Birebir ve grup formatları",
      "Her seviyeye uygun",
      "MEB onaylı eğitim programı",
      "Resmî sertifika",
      "Konser fırsatları",
    ],
  },
};

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) notFound();

  const localKeyword = LOCAL_KEYWORDS[slug] ?? `${program.name} kursu`;
  const intro = PROGRAM_INTROS[slug] ?? {
    heading: `${program.name} Eğitimi`,
    body: program.intro ?? program.short_description ?? "",
    details: [],
  };
  const hasIndividual = program.lesson_formats.includes("individual");
  const hasGroup = program.lesson_formats.includes("group");

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${program.name} Kursu`,
    description: program.short_description ?? `${localKeyword} — Yağmur Sanat Akademisi`,
    provider: {
      "@type": "EducationalOrganization",
      name: "Yağmur Sanat Akademisi",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Karşıyaka",
        addressRegion: "İzmir",
        addressCountry: "TR",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="pt-24 lg:pt-28 pb-0"
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <ol className="flex items-center gap-2 text-sm text-ink-muted" role="list">
            <li><Link href="/" className="hover:text-plum transition-colors">Ana Sayfa</Link></li>
            <li aria-hidden="true" className="text-line">/</li>
            <li><Link href="/egitimler" className="hover:text-plum transition-colors">Eğitimler</Link></li>
            <li aria-hidden="true" className="text-line">/</li>
            <li className="text-ink font-medium" aria-current="page">{program.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-10 pb-20 lg:pb-28" aria-labelledby="program-heading">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex text-xs font-medium text-violet bg-violet/10 px-3 py-1 rounded-full">
                  {programFormatLabel(program.lesson_formats)}
                </span>
                <span className="inline-flex text-xs font-medium text-plum bg-plum/8 px-3 py-1 rounded-full">
                  MEB Onaylı
                </span>
              </div>

              <h1
                id="program-heading"
                className="font-display text-[clamp(2.5rem,5vw,5rem)] tracking-tight text-ink leading-[1.05] mb-6"
              >
                {program.name}
                <br />
                <span className="text-plum">Eğitimi</span>
              </h1>

              <p className="text-[18px] text-ink-muted leading-relaxed max-w-[500px] mb-8">
                {program.short_description ?? intro.body}
              </p>

              <div className="flex flex-wrap gap-3">
                <WhatsAppCta size="xl" programName={program.name} label="WhatsApp'tan Yazın" />
                <Button asChild size="xl" variant="secondary">
                  <Link href="/egitimler">
                    <ArrowLeft size={16} aria-hidden="true" />
                    Diğer Eğitimler
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[12px] border border-line bg-paper-alt p-8">
                <h2 className="font-display text-xl text-ink mb-6">
                  Eğitim Detayları
                </h2>
                <dl className="flex flex-col gap-4">
                  <div>
                    <dt className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1">
                      Format
                    </dt>
                    <dd className="flex items-center gap-2 text-[15px] text-ink">
                      {hasIndividual && (
                        <span className="flex items-center gap-1.5">
                          <User size={14} aria-hidden="true" /> Birebir
                        </span>
                      )}
                      {hasGroup && (
                        <span className="flex items-center gap-1.5">
                          <Users size={14} aria-hidden="true" /> Grup
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1">
                      Yaş Grubu
                    </dt>
                    <dd className="text-[15px] text-ink">4 yaştan yetişkinlere</dd>
                  </div>
                  {program.duration_text && (
                    <div>
                      <dt className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1">
                        Ders Süresi
                      </dt>
                      <dd className="text-[15px] text-ink">{program.duration_text}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body content */}
      <section className="py-16 bg-paper-alt border-y border-line" aria-label="Eğitim kapsamı">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6">
              <h2 className="font-display text-2xl text-ink mb-6">
                {intro.heading}
              </h2>
              <p className="text-[16px] text-ink-muted leading-relaxed">
                {program.intro ?? intro.body}
              </p>
              {program.approach && (
                <p className="mt-4 text-[16px] text-ink-muted leading-relaxed">
                  {program.approach}
                </p>
              )}
            </div>
            <div className="lg:col-span-6">
              <h3 className="font-display text-xl text-ink mb-5">
                Bu eğitimle neler kazanırsınız?
              </h3>
              <ul className="flex flex-col gap-3">
                {(program.learning_outcomes ?? intro.details).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle
                      size={17}
                      className="text-violet shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-[15px] text-ink-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation (only for resim) */}
      {(slug === "resim-kursu" || program.preparation_information) && (
        <section className="py-16" aria-labelledby="prep-heading">
          <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <h2 id="prep-heading" className="font-display text-2xl text-ink mb-4">
                  Güzel Sanatlar Hazırlığı
                </h2>
                <p className="text-[16px] text-ink-muted leading-relaxed">
                  {program.preparation_information ??
                    "Güzel Sanatlar Liselerine ve Fakülteleri'ne hazırlanmak isteyen öğrenciler için destekleyici bir hazırlık programı sunulmaktadır. Portföy oluşturma ve sınav tekniği konularında rehberlik edilmektedir."}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="max-w-[560px] mx-auto px-6">
          <h2 className="font-display text-3xl text-ink mb-4">
            {program.name} eğitimini denemeye hazır mısınız?
          </h2>
          <p className="text-ink-muted mb-8">
            WhatsApp&apos;tan yazın. Akademi ekibi sizinle iletişime geçsin.
          </p>
          <WhatsAppCta size="xl" programName={program.name} label="WhatsApp'tan Yazın" />
        </div>
      </section>
    </>
  );
}