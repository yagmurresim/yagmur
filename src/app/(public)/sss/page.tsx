import type { Metadata } from "next";
import { getPublishedFaqs } from "@/server/queries/faqs";
import { buildMetadata } from "@/lib/seo";
import { FaqAccordion } from "@/features/faq/FaqAccordion";

export const metadata: Metadata = buildMetadata({
  title: "Sık Sorulan Sorular | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi hakkında sık sorulan sorular. Eğitimler, yaş grupları, MEB onayı, ücretsiz tanışma dersi.",
  canonical: "/sss",
});

const SEED_FAQS = [
  {
    id: "s1",
    question: "Hangi eğitimler veriliyor?",
    answer:
      "Yağmur Sanat Akademisi'nde resim, piyano, keman ve gitar eğitimleri verilmektedir.",
    sort_order: 1,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s2",
    question: "Hangi yaş gruplarına eğitim veriliyor?",
    answer:
      "Akademimizde 4 yaşından yetişkinlere kadar her yaş grubuna eğitim verilmektedir. Eğitim içeriği ve formatı yaşa ve seviyeye göre uyarlanmaktadır.",
    sort_order: 2,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s3",
    question: "Ücretsiz Tanışma Dersi nedir?",
    answer:
      "Ücretsiz Tanışma Dersi, siz veya çocuğunuzun akademimizi ve eğitim ortamımızı tanıması için sunduğumuz başlangıç fırsatıdır. Form doldurmanıza gerek yok. WhatsApp veya telefonla yazın; ekibimiz sizinle iletişime geçer ve uygun zamanı birlikte ayarlarız.",
    sort_order: 3,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s4",
    question: "Yağmur Sanat Akademisi nerede?",
    answer:
      "Akademimiz İmbatlı Mahallesi, Yeni Girne No:205/B, Karşıyaka / İzmir adresinde bulunmaktadır.",
    sort_order: 4,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s5",
    question: "Akademi MEB onaylı mı?",
    answer:
      "Evet. Yağmur Sanat Akademisi, Millî Eğitim Bakanlığı onaylı bir kurs olarak faaliyet göstermektedir. Eğitim programları ve sertifikalarımız MEB onaylıdır.",
    sort_order: 5,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s6",
    question: "Ders formatları nelerdir?",
    answer:
      "Resim eğitimi grup formatında verilmektedir. Piyano eğitimi birebir (bireysel) formattadır. Keman ve gitar eğitimleri ise hem birebir hem de grup formatında sunulmaktadır.",
    sort_order: 6,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
];

export default async function SssPage() {
  const dbFaqs = await getPublishedFaqs();
  const faqs = dbFaqs.length > 0 ? dbFaqs : SEED_FAQS;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20" aria-labelledby="sss-heading">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
            Sık Sorulanlar
          </p>
          <h1
            id="sss-heading"
            className="font-display text-[clamp(2.5rem,5vw,5rem)] tracking-tight text-ink"
          >
            Aklınızdaki
            <br />
            sorular.
          </h1>
        </div>
      </section>

      <section className="pb-24 lg:pb-32" aria-label="Sık sorulan sorular">
        <div className="max-w-[860px] mx-auto px-6 lg:px-12">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
    </>
  );
}