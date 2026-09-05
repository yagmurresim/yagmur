import Link from "next/link";
import { FaqAccordion } from "@/features/faq/FaqAccordion";
import type { Faq } from "@/types";

const SEED_FAQS: Faq[] = [
  {
    id: "1",
    question: "Ücretsiz tanışma dersi nedir?",
    answer:
      "Akademiyi ve hocayı görmeniz için ilk ders. Form yok. WhatsApp yeter; ekip saat ayarlar. Satış görüşmesi değildir — gelip “şimdilik değil” demek de bir cevap.",
    sort_order: 1,
    status: "published",
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    question: "Kaç yaşında başlanır?",
    answer:
      "4 yaşından yetişkine. Gruplar yaşa ve seviyeye göre ayrılır. 4 yaş ile 40 yaş aynı masada oturmaz.",
    sort_order: 2,
    status: "published",
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    question: "Dersler nasıl işler?",
    answer:
      "Resim grup dersi, piyano birebir. Keman ve gitar hem birebir hem grup. Hangisi size uyar, tanışma dersinde konuşulur.",
    sort_order: 3,
    status: "published",
    program_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    question: "MEB onaylı mı? Sertifika var mı?",
    answer:
      "Evet. Millî Eğitim Bakanlığı onaylı bir kurstur. Programı tamamlayanlara resmî sertifika verilir.",
    sort_order: 4,
    status: "published",
    program_id: null,
    created_at: "",
    updated_at: "",
  },
];

interface FaqPreviewSectionProps {
  faqs: Faq[];
}

export function FaqPreviewSection({ faqs }: FaqPreviewSectionProps) {
  const display = faqs.length > 0 ? faqs.slice(0, 4) : SEED_FAQS;

  return (
    <section className="border-y border-line bg-paper py-24 lg:py-32" aria-labelledby="faq-preview-heading">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-4">
          <h2
            id="faq-preview-heading"
            className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.95] text-ink"
          >
            Sormadan
            <br />
            gelmeyin.
          </h2>
          <Link
            href="/sss"
            className="mt-6 inline-block text-[13px] font-medium text-plum hover:text-violet"
          >
            Tüm sorular
          </Link>
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion faqs={display} />
        </div>
      </div>
    </section>
  );
}
