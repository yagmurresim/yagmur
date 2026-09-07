import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPublishedPrograms, getProgramBySlug } from "@/server/queries/programs";
import { buildProgramMetadata } from "@/lib/seo";
import { programFormatLabel } from "@/lib/utils";
import { toneFor } from "@/lib/program-tones";
import { Button } from "@/components/ui/Button";

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

type FallbackProgram = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  lesson_formats: string[];
  intro: string | null;
  approach: string | null;
  learning_outcomes: string[] | null;
  preparation_information: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

const FALLBACK_PROGRAMS: Record<string, FallbackProgram> = {
  "resim-kursu": {
    id: "resim-kursu",
    name: "Resim",
    slug: "resim-kursu",
    short_description:
      "Grup dersi. Gözlem, renk, kompozisyon. 4 yaşından yetişkine; güzel sanatlar sınavına hazırlık dersin içinde.",
    lesson_formats: ["group"],
    intro: null,
    approach: null,
    learning_outcomes: null,
    preparation_information: null,
    seo_title: null,
    seo_description: null,
  },
  "piyano-kursu": {
    id: "piyano-kursu",
    name: "Piyano",
    slug: "piyano-kursu",
    short_description:
      "Birebir ders. Nota, dokunuş, tempo öğrenciye göre ayarlanır. Dönem sonunda konser.",
    lesson_formats: ["individual"],
    intro: null,
    approach: null,
    learning_outcomes: null,
    preparation_information: null,
    seo_title: null,
    seo_description: null,
  },
  "keman-kursu": {
    id: "keman-kursu",
    name: "Keman",
    slug: "keman-kursu",
    short_description:
      "Yay, duruş, kulak. Birebir veya grup. Yeni başlayan da devam eden de gelir.",
    lesson_formats: ["individual", "group"],
    intro: null,
    approach: null,
    learning_outcomes: null,
    preparation_information: null,
    seo_title: null,
    seo_description: null,
  },
  "gitar-kursu": {
    id: "gitar-kursu",
    name: "Gitar",
    slug: "gitar-kursu",
    short_description:
      "Akor, ritim, parmak. Akustik veya elektro. Birebir veya grup, seviyeye göre.",
    lesson_formats: ["individual", "group"],
    intro: null,
    approach: null,
    learning_outcomes: null,
    preparation_information: null,
    seo_title: null,
    seo_description: null,
  },
};

const PROGRAM_INTROS: Record<
  string,
  {
    heading: string;
    body: string;
    approach: string;
    who: string;
    more?: string[];
    details: string[];
    prep?: string;
  }
> = {
  "resim-kursu": {
    heading: "Karşıyaka’da grup resim dersi",
    body: "Resim derslerimiz; çocuklardan yetişkinlere kadar her öğrencimizin kendi yaş motor becerilerine ve seviyelerine özel olarak oluşturulmuş gruplar eşliğinde gerçekleştirilmektedir. Eğitimlerimizdeki önceliğimiz yalnızca “güzel bir resim” ortaya çıkarmak değil; öğrencilerimize sağlam bir teknik eğitim sunarak sanatsal bir bakış kazandırmaktır. Her yaş grubunun kendi dinamiğine uygun ortamlarda ders işlediği akademimizde, öğrencilerimizin içlerindeki yaratıcılığı özgürce geliştirmelerine ve hayal güçlerini tuvale doğru teknikle aktarmalarına rehberlik ediyoruz.",
    approach:
      "Bu sanatsal yolculukta öğrencilerimiz; karakalem, suluboya, kuruboya, pastel boya, tuval üzeri akrilik boya ve yağlı boya gibi zengin teknikleri yetenekleriyle harmanlamayı öğrenmektedir. Eğitim dönemi boyunca büyük bir emek ve yaratıcılıkla ortaya konan tüm bu kıymetli eserler ise, dönem sonunda düzenlediğimiz sergimizde sanatseverlerin beğenisine sunulmakta ve öğrencilerimizin başarıları gururla taçlandırılmaktadır.",
    who: "",
    details: [
      "Grup dersi",
      "4 yaşından yetişkine",
      "MEB onaylı program, resmî sertifika",
      "Gözlem, renk, kompozisyon",
      "Güzel sanatlar sınavına hazırlık (ihtiyaç olana)",
      "Dönem sonu sergi",
    ],
    prep: "Güzel sanatlar lise ve fakülte sınavlarına hazırlanan öğrenciler için modelden çizim, leke, kompozisyon ve portföy düzeni dersin parçasıdır. Ayrı bir hazırlık sınıfı yoktur; hoca o öğrencinin hedefine göre masadaki işi yönlendirir.",
  },
  "piyano-kursu": {
    heading: "Karşıyaka’da birebir piyano dersi",
    body: "Piyano eğitiminde her öğrencinin yaşı, gelişim düzeyi, müzikal birikimi ve öğrenme hızı farklıdır. Bu nedenle derslerimiz birebir yapılır ve eğitim süreci öğrencinin ihtiyaçlarına göre planlanır. İlk dersten itibaren doğru oturuş, el ve parmak kullanımı, nota okuma, ritim ve temel müzik bilgisi üzerinde özenle durulur.",
    approach:
      "Başlangıç aşamasında öğrencinin piyanoyla doğru bir ilişki kurması hedeflenir. Zamanla iki elin koordinasyonu, parmak bağımsızlığı, gam ve arpejler, deşifre, pedal kullanımı ve eser çalışmaları programa dâhil edilir. Teknik gelişim, yalnızca notaları doğru çalmak için değil; temiz bir tuşe, doğru ifade ve müzikal duyarlılık kazanmak için ele alınır.",
    who: "Çocuklarda eğitim; yaşa uygun, merak duygusunu canlı tutan ve düzenli çalışma alışkanlığı kazandıran bir yöntemle yürütülür. Genç ve yetişkin öğrencilerde ise program; öğrencinin hedefleri, sevdiği eserler ve mevcut seviyesi doğrultusunda şekillendirilir.",
    more: [
      "Daha önce hiç piyano çalmamış yetişkinler de eğitime sıfırdan başlayabilir.",
      "Amacımız öğrencinin yalnızca bir eseri çalabilmesi değil; notayı okuyabilen, ritmi anlayan, doğru teknik kullanan ve müziği yorumlayabilen bir piyanistlik temeli kazanmasıdır. Öğrencilerimiz, gelişim düzeylerine göre dönem sonu konserlerinde sahne deneyimi kazanma fırsatı bulur.",
    ],
    details: [
      "Birebir ders",
      "Her yaş ve seviyeye uygun eğitim",
      "Nota, ritim ve deşifre çalışmaları",
      "Doğru oturuş, el ve parmak tekniği",
      "Tuşe, pedal ve müzikal yorum",
      "Kişiye özel eser ve repertuvar çalışmaları",
      "Dönem sonu konser deneyimi",
    ],
  },
  "keman-kursu": {
    heading: "Karşıyaka’da birebir veya grup keman dersi",
    body: "Keman eğitimi; doğru duruş, dengeli yay kullanımı, temiz ses üretimi ve iyi bir müzik kulağının birlikte geliştirilmesini gerektirir. Derslerimiz öğrencinin yaşı, seviyesi ve öğrenme hızına göre birebir veya küçük grup şeklinde planlanır.",
    approach:
      "Başlangıç aşamasında kemanın doğru tutulması, omuz ve çene yerleşimi, sol elin doğal konumu ve temel yay tekniği üzerinde titizlikle durulur. Öğrenci, en başından itibaren doğru alışkanlıklar kazanarak ilerler. Nota okuma, ritim, yay yönleri ve parmak çalışmaları teknik eğitimin temelini oluşturur.",
    who: "İlerleyen aşamalarda entonasyon, yay hâkimiyeti, pozisyon geçişleri, müzikal ifade, deşifre ve eser çalışmaları programa dâhil edilir. Uygun seviyeye ulaşıldığında vibrato ve daha ileri teknik çalışmalarla öğrencinin ses kalitesi ve yorum gücü geliştirilir.",
    more: [
      "Çocuklarda eğitim, yaş ve fiziksel gelişime uygun ölçüde bir keman seçilerek yürütülür. Genç ve yetişkin öğrenciler de daha önce müzik eğitimi almamış olsalar dahi başlangıç seviyesinden eğitime başlayabilir. Enstrümanı bulunmayan öğrencilerimize, doğru keman ve ekipman seçimi konusunda eğitim başlamadan önce rehberlik edilir.",
      "Grup derslerinde öğrenciler birlikte çalma, birbirini dinleme, ortak ritmi koruma ve müzikal uyum becerileri kazanırken; birebir derslerde teknik ayrıntılar ve öğrencinin kişisel gelişimi üzerinde daha yoğun çalışılır.",
      "Amacımız yalnızca eser çalabilen değil; doğru teknik kullanan, temiz ses üreten, müziği dinleyen ve yorumlayabilen öğrenciler yetiştirmektir. Öğrencilerimiz, gelişim düzeylerine göre dönem sonu konserlerinde sahne deneyimi kazanma fırsatı bulur.",
    ],
    details: [
      "Birebir veya küçük grup dersleri",
      "Her yaş ve seviyeye uygun eğitim",
      "Doğru keman tutuşu ve duruş",
      "Yay tekniği ve temiz ses çalışmaları",
      "Nota, ritim ve deşifre eğitimi",
      "Entonasyon ve sol el tekniği",
      "Pozisyon, vibrato ve ileri teknik çalışmalar",
      "Eser ve müzikal yorum çalışmaları",
      "Dönem sonu konser deneyimi",
    ],
  },
  "gitar-kursu": {
    heading: "Karşıyaka’da birebir veya grup gitar dersi",
    body: "Gitar eğitimi, doğru teknikle başladığında hem müzikal gelişimi hem de çalma alışkanlığını sağlam bir temele oturtur. Derslerimiz öğrencinin yaşı, seviyesi, müzik zevki ve hedefleri doğrultusunda birebir veya grup olarak planlanır.",
    approach:
      "Başlangıç düzeyinde doğru oturuş ve gitar tutuşu, sağ ve sol el koordinasyonu, temel parmak çalışmaları, ritim, akorlar ve nota bilgisi üzerinde durulur. Öğrencinin ilk günden itibaren gereksiz kasılmadan, temiz ses üreterek ve doğru el pozisyonuyla çalması hedeflenir.",
    who: "İlerleyen aşamalarda akor geçişleri, arpej, gam, ritim kalıpları, pena ve parmak teknikleri, deşifre, eşlik ve eser çalışmaları programa dâhil edilir. Öğrencinin seviyesine ve müzikal ilgisine göre klasik, akustik veya elektro gitar alanında repertuvar çalışmaları yapılabilir.",
    more: [
      "Birebir derslerde öğrencinin teknik ihtiyaçlarına ve kişisel hedeflerine daha ayrıntılı biçimde odaklanılır.",
      "Grup derslerinde ise birlikte çalma, ritim duygusu, müzikal uyum ve birbirini dinleme becerileri geliştirilir.",
      "Çocuk, genç ve yetişkin öğrenciler daha önce herhangi bir müzik eğitimi almamış olsalar da başlangıç seviyesinden eğitime katılabilir. Enstrümanı bulunmayan öğrencilerimize; yaş, fiziksel yapı ve eğitim hedeflerine uygun gitar seçimi konusunda rehberlik edilir.",
      "Amacımız öğrencinin yalnızca sevdiği birkaç parçayı çalması değil; doğru teknik kullanan, ritmi anlayan, müziği dinleyen ve zaman içinde kendi başına çalışabilecek bir müzikal altyapı kazanmasıdır. Öğrencilerimiz gelişim düzeylerine göre dönem sonu konserlerinde sahne deneyimi kazanma fırsatı bulur.",
    ],
    details: [
      "Birebir veya grup dersleri",
      "Her yaş ve seviyeye uygun eğitim",
      "Doğru oturuş ve gitar tutuşu",
      "Sağ ve sol el tekniği",
      "Akor, ritim ve arpej çalışmaları",
      "Nota, deşifre ve temel müzik bilgisi",
      "Pena ve parmak teknikleri",
      "Gam, eşlik ve eser çalışmaları",
      "Kişiye uygun repertuvar çalışmaları",
      "Dönem sonu konser deneyimi",
    ],
  },
};

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = (await getProgramBySlug(slug)) ?? FALLBACK_PROGRAMS[slug];

  if (!program) redirect("/egitimler");

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
            {intro.body || program.short_description}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="xl">
              <Link href="/ucretsiz-tanisma-dersi">Tanışma dersi</Link>
            </Button>
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
            {intro.more?.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-[16px] leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
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
            {program.name} için ücretsiz tanışma dersi
          </h2>
          <p className="mt-4 max-w-[48ch] text-[17px] leading-relaxed text-ink-muted">
            Takvimden açık bir saat seçin veya WhatsApp’tan yazın. Yaşınızı ve{" "}
            {program.name.toLowerCase()} demeniz yeter. İlk ders ücretsizdir;
            kayıt o dersten sonra, isterseniz.
          </p>
          <div className="mt-8">
            <Button asChild size="xl">
              <Link href="/ucretsiz-tanisma-dersi">Tanışma dersi</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
