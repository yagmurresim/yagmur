import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedPrograms, getProgramBySlug } from "@/server/queries/programs";
import { buildProgramMetadata } from "@/lib/seo";
import { programFormatLabel } from "@/lib/utils";
import { toneFor } from "@/lib/program-tones";
import { Button } from "@/components/ui/Button";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const programs = await getPublishedPrograms();
  const slugs = new Set([
    ...programs.map((p) => p.slug),
    ...Object.keys(FALLBACK_PROGRAMS),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = (await getProgramBySlug(slug)) ?? FALLBACK_PROGRAMS[slug];
  if (!program) return {};
  return buildProgramMetadata(program);
}

const LOCAL_KEYWORDS: Record<string, string> = {
  "resim-kursu": "Karşıyaka resim kursu",
  "piyano-kursu": "Karşıyaka piyano kursu",
  "keman-kursu": "Karşıyaka keman kursu",
  "gitar-kursu": "Karşıyaka gitar kursu",
};

const FALLBACK_PROGRAMS: Record<
  string,
  {
    id: string;
    name: string;
    slug: string;
    short_description: string;
    lesson_formats: string[];
    intro: string | null;
    approach: string | null;
    learning_outcomes: string[] | null;
    preparation_information: string | null;
  }
> = {
  "resim-kursu": {
    id: "resim-kursu",
    name: "Resim",
    slug: "resim-kursu",
    short_description:
      "Grup dersinde gözlem, renk ve kompozisyon. 4 yaştan yetişkine; güzel sanatlar hazırlığı dersin içinde.",
    lesson_formats: ["group"],
    intro: null,
    approach: null,
    learning_outcomes: null,
    preparation_information: null,
  },
  "piyano-kursu": {
    id: "piyano-kursu",
    name: "Piyano",
    slug: "piyano-kursu",
    short_description:
      "Birebir ders. Nota okumadan dokunuşa, temposu öğrenciye göre. Dönem sonunda konser.",
    lesson_formats: ["individual"],
    intro: null,
    approach: null,
    learning_outcomes: null,
    preparation_information: null,
  },
  "keman-kursu": {
    id: "keman-kursu",
    name: "Keman",
    slug: "keman-kursu",
    short_description:
      "Yay, postür, kulak. Birebir veya grup. Yeni başlayan da gelir, devam eden de.",
    lesson_formats: ["individual", "group"],
    intro: null,
    approach: null,
    learning_outcomes: null,
    preparation_information: null,
  },
  "gitar-kursu": {
    id: "gitar-kursu",
    name: "Gitar",
    slug: "gitar-kursu",
    short_description:
      "Akor, ritim, parmak. Akustik veya elektro. Birebir ya da grup — seviyenize göre.",
    lesson_formats: ["individual", "group"],
    intro: null,
    approach: null,
    learning_outcomes: null,
    preparation_information: null,
  },
};

const PROGRAM_INTROS: Record<
  string,
  {
    heading: string;
    body: string;
    approach: string;
    who: string;
    details: string[];
    prep?: string;
  }
> = {
  "resim-kursu": {
    heading: "Görmek, sonra çizmek.",
    body: "Resim dersi grup halinde yapılır. Çocuk da gelir, yetişkin de; masalar yaşa ve seviyeye göre ayrılır. İlk iş “güzel resim” üretmek değildir — görmeyi öğrenmek, sonra onu kâğıda veya tuvale geçirmektir.",
    approach:
      "Derslerde kurşun kalem, kömür, suluboya ve akrilik dönüşümlü kullanılır. Kompozisyon, oran, ışık ve doku yavaş yavaş eklenir. Hoca her masada durur; grubun temposu ortak, her elinki ayrıdır. Dönem sonunda seçilen işler sergiye çıkar.",
    who: "Hiç tutmamış olan 4 yaşındaki çocuk da gelir, lise portföyü hazırlayan da, iş çıkışı resim yapmak isteyen yetişkin de. Güzel sanatlar lisesi veya fakültesine girecekler için sınav tekniği ve portföy, dersin içinde desteklenir — ayrı bir paket satılmaz.",
    details: [
      "Grup dersi",
      "4 yaştan yetişkine",
      "MEB onaylı program, resmî sertifika",
      "Gözlem, renk, kompozisyon",
      "Güzel sanatlar hazırlığı (ihtiyaç olana)",
      "Dönem sonu sergi",
    ],
    prep: "Güzel sanatlar lise ve fakülte sınavlarına hazırlanan öğrenciler için modelden çizim, leke, kompozisyon ve portföy düzeni dersin parçasıdır. Ayrı bir “hazırlık sınıfı” yoktur; hoca o öğrencinin hedefine göre masadaki işi yönlendirir.",
  },
  "piyano-kursu": {
    heading: "Tek öğrenci, tek klavye.",
    body: "Piyano dersi birebir yapılır. Hoca o günün temposuna, elin büyüklüğüne ve kulağın durumuna göre gider. Yeni başlayanlar nota ve duruştan; devam edenler repertuvar, pedallar ve yorumdan ilerler.",
    approach:
      "İlk aylar el duruşu, ritim ve basit ezgilerdir. Sonra iki elin bağımsızlığı, gam, arpej ve kısa parçalar gelir. “Hızlı çalmak” hedef değildir; temiz basmak, dinlemek ve parçayı bitirmek hedeftir. Dönem sonunda isteyen konserde çalar.",
    who: "4–6 yaş arası oyunla tanışan çocuklar, okul çağında düzenli çalışanlar ve yetişkinlikte sıfırdan başlayanlar. Yetişkin öğrencide tempo daha yavaş, parça seçimi daha kişisel olur — utanç yok, tempo sizin.",
    details: [
      "Birebir ders",
      "4 yaştan yetişkine",
      "MEB onaylı program, resmî sertifika",
      "Nota, teknik, yorum",
      "Dönem sonu konser",
    ],
  },
  "keman-kursu": {
    heading: "Yay omza oturunca.",
    body: "Keman, duruş ve kulak işidir. Ders birebir veya küçük grup olarak açılır. Yeni başlayan yay tutuşu, çene ve sol elle tanışır; devam edenler pozisyon, titreme ve ifade üzerine çalışır.",
    approach:
      "İlk iş enstrümanı vücuda yerleştirmektir — omuz, çene, sol el, yay. Ses temizlenmeden parça şişirilmez. Grup dersinde birlikte çalmak, birebirde ise ayrıntı öne çıkar. Hangisinin size uyduğu tanışma dersinde konuşulur.",
    who: "Çocuklar genelde 5–6 yaş civarında başlar; yetişkin de gelir. Enstrümanı olmayanlar için ilk dönemde ne alınacağı akademide konuşulur — hemen mağazaya koşulmaz.",
    details: [
      "Birebir ve grup",
      "Her seviye",
      "MEB onaylı program, resmî sertifika",
      "Yay, postür, kulak",
      "Dönem sonu konser",
    ],
  },
  "gitar-kursu": {
    heading: "Akor, sonra şarkı.",
    body: "Gitar dersi birebir veya grup olarak yapılır. Akustik veya elektro — hangisini istediğiniz tanışma dersinde netleşir. Yeni başlayan akor ve ritme; devam edenler parmak stili, solo ve repertuvara gider.",
    approach:
      "İlk iş sol elin basması, sağ elin ritmi tutmasıdır. Nota okuma isteyene öğretilir; herkesin yolu nota üzerinden geçmek zorunda değildir. Grupta birlikte çalmak, birebirde ise sizin parçanız. Dönem sonunda isteyen sahnede çalar.",
    who: "Çocuk, genç, yetişkin. Kendi şarkısını çalmak isteyen de gelir, düzenli teknik isteyen de. Enstrümanı olmayanlara ilk gitarı seçerken yardımcı olunur.",
    details: [
      "Birebir ve grup",
      "Her seviye",
      "MEB onaylı program, resmî sertifika",
      "Akor, ritim, parmak",
      "Akustik veya elektro",
      "Dönem sonu konser",
    ],
  },
};

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = (await getProgramBySlug(slug)) ?? FALLBACK_PROGRAMS[slug];

  if (!program) notFound();

  const localKeyword = LOCAL_KEYWORDS[slug] ?? `${program.name} kursu`;
  const intro = PROGRAM_INTROS[slug] ?? {
    heading: `${program.name} eğitimi`,
    body: program.intro ?? program.short_description ?? "",
    approach: program.approach ?? "",
    who: "",
    details: [],
  };
  const tone = toneFor(slug);

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

      <section
        className="relative overflow-hidden pt-32 pb-24 text-ink lg:pt-44 lg:pb-32"
        style={{ backgroundColor: tone.wash }}
        aria-labelledby="program-heading"
      >
        <span
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
          style={{
            background: `radial-gradient(ellipse at 80% 40%, ${tone.accent}28, transparent 62%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-10 text-[13px] text-ink-muted">
            <ol className="flex flex-wrap items-center gap-2" role="list">
              <li>
                <Link href="/" className="hover:text-ink">
                  Ana sayfa
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/egitimler" className="hover:text-ink">
                  Eğitimler
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink" aria-current="page">
                {program.name}
              </li>
            </ol>
          </nav>

          <p className="text-[13px] tracking-wide text-ink-muted">
            {programFormatLabel(program.lesson_formats)}
            <span className="mx-2">·</span>
            4 yaştan yetişkine
            <span className="mx-2">·</span>
            Karşıyaka
          </p>
          <h1
            id="program-heading"
            className="font-display mt-4 max-w-[10ch] text-[clamp(3.4rem,9vw,8rem)] leading-[0.88] tracking-[-0.03em]"
          >
            {program.name}
          </h1>
          <p className="mt-8 max-w-[48ch] text-[18px] leading-relaxed text-ink-muted">
            {program.short_description ?? intro.body}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <WhatsAppCta size="xl" programName={program.name} />
            <Button asChild size="xl" variant="secondary">
              <Link href="/egitimler">Diğer eğitimler</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28" aria-label="Eğitim kapsamı">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-6">
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] text-ink">
              {intro.heading}
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-ink-muted">
              {intro.body || program.intro}
            </p>
            {intro.approach && (
              <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">
                {intro.approach}
              </p>
            )}
            {intro.who && (
              <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">{intro.who}</p>
            )}
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="mb-3 text-[13px] font-medium text-ink-muted">Bu eğitimde</p>
            <ul className="flex flex-col border-t border-line">
              {(program.learning_outcomes ?? intro.details).map((item) => (
                <li key={item} className="border-b border-line py-4 text-[16px] text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {(intro.prep || program.preparation_information) && (
        <section className="bg-paper-alt px-6 py-20 text-ink lg:px-12 lg:py-24" aria-labelledby="prep-heading">
          <div className="mx-auto max-w-[1400px]">
            <h2 id="prep-heading" className="font-display text-[clamp(2rem,4vw,3.2rem)]">
              Güzel sanatlar hazırlığı
            </h2>
            <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-ink-muted">
              {program.preparation_information ?? intro.prep}
            </p>
          </div>
        </section>
      )}

      <section className="bg-paper px-6 py-24">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] text-ink">
            {program.name} eğitimine bakın.
          </h2>
          <p className="mt-4 max-w-[48ch] text-[17px] leading-relaxed text-ink-muted">
            WhatsApp’tan yazın. Yaş ve {program.name.toLowerCase()} demeniz yeter.
            İlk ders ücretsiz tanışmadır — kayıt o dersten sonra, isterseniz.
          </p>
          <div className="mt-8">
            <WhatsAppCta size="xl" programName={program.name} />
          </div>
        </div>
      </section>
    </>
  );
}
