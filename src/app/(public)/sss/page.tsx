import type { Metadata } from "next";
import { getPublishedFaqs } from "@/server/queries/faqs";
import { buildMetadata } from "@/lib/seo";
import { FaqAccordion } from "@/features/faq/FaqAccordion";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

export const metadata: Metadata = buildMetadata({
  title: "Sık Sorulan Sorular | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi SSS: eğitimler, yaş, MEB onayı, ücret, tanışma dersi, enstrüman ve Karşıyaka adresi.",
  canonical: "/sss",
});

const SEED_FAQS = [
  {
    id: "s1",
    question: "Hangi eğitimler var?",
    answer:
      "Dört eğitim: resim, piyano, keman ve gitar. Resim grup dersidir. Piyano birebir. Keman ve gitar hem birebir hem grup olarak açılır. Hangisinin size uyduğu tanışma dersinde konuşulur.",
    sort_order: 1,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s2",
    question: "Kaç yaşında başlanır?",
    answer:
      "4 yaşından yetişkine. Küçük çocuklarda ders süresi ve tempo yaşa göre kısalır; yetişkinlerde parça seçimi daha kişisel olur. Gruplar yaşa ve seviyeye göre ayrılır — 4 yaş ile 40 yaş aynı masada oturmaz.",
    sort_order: 2,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s3",
    question: "Ücretsiz tanışma dersi nedir?",
    answer:
      "Akademiyi ve hocayı görmeniz için ilk ders. Siteden açık saati seçebilir veya WhatsApp’tan yazabilirsiniz. Satış görüşmesi değildir. Gelip “şimdilik değil” demek de bir cevap.",
    sort_order: 3,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s4",
    question: "Kayıt nasıl yapılır?",
    answer:
      "Sitede online kayıt yok. Tanışma dersinden sonra isterseniz akademi ekibi kayıt adımlarını anlatır. Anında rezervasyon, otomatik ödeme veya form yoktur — insan konuşması vardır.",
    sort_order: 4,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s5",
    question: "Akademi MEB onaylı mı? Sertifika var mı?",
    answer:
      "Evet. Yağmur Sanat Akademisi Millî Eğitim Bakanlığı onaylı bir kurstur. Programı tamamlayanlara resmî sertifika verilir. Sitede “MEB onaylı” ifadesi bu kayda dayanır.",
    sort_order: 5,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s6",
    question: "Ücretler nedir?",
    answer:
      "Ücret eğitim, format (birebir / grup) ve yoğunluğa göre değişir. Sitede fiyat listesi yoktur; güncel rakamı tanışma dersinde veya WhatsApp’ta konuşuruz. Önce akademiye bakın, rakam sonra.",
    sort_order: 6,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s7",
    question: "Enstrüman veya malzeme gerekir mi?",
    answer:
      "Resimde temel malzeme akademide bulunur; evde devam etmek isteyenlere ne alınacağı söylenir. Piyano, keman ve gitarda enstrümanı olmayanlar için ilk dönemde ne alınacağı birlikte konuşulur — tanışma dersinden önce mağazaya koşulmaz.",
    sort_order: 7,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s8",
    question: "Güzel sanatlar sınavına hazırlık var mı?",
    answer:
      "Resim dersinin içinde. Modelden çizim, leke, kompozisyon ve portföy, sınava girecek öğrenciye göre yönlendirilir. Ayrı bir hazırlık paketi satılmaz.",
    sort_order: 8,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s9",
    question: "Sergi ve konser zorunlu mu?",
    answer:
      "Dönem sonunda resim için sergi, müzik için konser açılır. Çıkmak teşvik edilir; sahne korkusu olanlar zorlanmaz. İşi başkasına göstermek dersin parçasıdır ama ilk günden sahne beklenmez.",
    sort_order: 9,
    status: "published" as const,
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "s10",
    question: "Nerede, nasıl gelinir?",
    answer:
      "İmbatlı Mahallesi, Yeni Girne No: 205/B, Karşıyaka / İzmir. Girne hattı üzerinde. Yol tarifi için iletişim sayfasındaki haritayı veya WhatsApp’ı kullanın.",
    sort_order: 10,
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

      <section className="bg-paper pt-32 pb-16 text-ink lg:pt-44 lg:pb-20" aria-labelledby="sss-heading">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h1
            id="sss-heading"
            className="font-display max-w-[12ch] text-[clamp(3rem,7vw,6.2rem)] leading-[0.9]"
          >
            Sormadan
            <br />
            gelmeyin.
          </h1>
          <p className="mt-8 max-w-[48ch] text-[17px] leading-relaxed text-ink-muted">
            Yaş, ücret, enstrüman, MEB, kayıt. Aklınızdaki burada yoksa WhatsApp yeter —
            ekip kısa cevaplar.
          </p>
        </div>
      </section>

      <section className="bg-paper pb-16 lg:pb-20" aria-label="Sık sorulan sorular">
        <div className="mx-auto max-w-[820px] px-6 pt-8 lg:px-12">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      <section className="bg-paper px-6 pb-24 lg:pb-32">
        <div className="mx-auto max-w-[820px]">
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] text-ink">
            Cevap yetmediyse yazın.
          </h2>
          <p className="mt-3 max-w-[44ch] text-[16px] text-ink-muted">
            Form yok. Yaş ve hangi eğitim — gerisini konuşuruz.
          </p>
          <div className="mt-8">
            <WhatsAppCta size="lg" />
          </div>
        </div>
      </section>
    </>
  );
}
