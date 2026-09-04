import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Faq } from "@/types";

const SEED_FAQS: Faq[] = [
  { id: "1", question: "Ücretsiz Tanışma Dersi nedir?", answer: "Siz veya çocuğunuzun akademimizi tanıması için sunduğumuz başlangıç fırsatıdır. Form yok; WhatsApp veya telefonla yazın, ekibimiz sizinle iletişime geçer.", sort_order: 1, status: "published", program_id: null, created_at: "", updated_at: "" },
  { id: "2", question: "Hangi yaş gruplarına eğitim veriliyor?", answer: "4 yaşından yetişkinlere kadar her yaş grubuna eğitim verilmektedir.", sort_order: 2, status: "published", program_id: null, created_at: "", updated_at: "" },
  { id: "3", question: "Ders formatları nelerdir?", answer: "Resim eğitimi grup formatında, piyano birebir formatında, keman ve gitar ise hem birebir hem grup formatında verilmektedir.", sort_order: 3, status: "published", program_id: null, created_at: "", updated_at: "" },
  { id: "4", question: "Akademi MEB onaylı mı?", answer: "Evet. Millî Eğitim Bakanlığı onaylı kurs olarak faaliyet göstermekteyiz.", sort_order: 4, status: "published", program_id: null, created_at: "", updated_at: "" },
];

interface FaqPreviewSectionProps {
  faqs: Faq[];
}

export function FaqPreviewSection({ faqs }: FaqPreviewSectionProps) {
  const display = faqs.length > 0 ? faqs.slice(0, 4) : SEED_FAQS;

  return (
    <section className="py-24 lg:py-32 bg-paper-alt border-y border-line" aria-labelledby="faq-preview-heading">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
              SSS
            </p>
            <h2
              id="faq-preview-heading"
              className="font-display text-[clamp(2rem,4vw,4rem)] tracking-tight text-ink mb-6"
            >
              Sık sorulan
              sorular.
            </h2>
            <Link
              href="/sss"
              className="inline-flex items-center gap-2 text-sm font-medium text-plum hover:text-violet transition-colors"
            >
              Tümünü gör <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <div className="flex flex-col divide-y divide-line">
              {display.map((faq) => (
                <div key={faq.id} className="py-6 first:pt-0">
                  <h3 className="font-display text-lg text-ink mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-[15px] text-ink-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}