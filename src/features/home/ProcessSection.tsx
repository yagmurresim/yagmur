import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

const STEPS = [
  {
    number: "01",
    title: "Eğitiminizi seçin",
    body: "Resim, piyano, keman veya gitar — siz veya çocuğunuz için doğru alanı belirleyin.",
  },
  {
    number: "02",
    title: "WhatsApp'tan yazın",
    body: "Form yok. Bize yazın; hangi eğitim ve yaş için düşündüğünüzü kısaca belirtin.",
  },
  {
    number: "03",
    title: "Akademi sizi arasın",
    body: "Ekibimiz en kısa sürede sizinle iletişime geçer ve uygun bir zaman ayarlar.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 lg:py-32" aria-labelledby="process-heading">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="mb-14">
          <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
            Nasıl Başlanır?
          </p>
          <h2
            id="process-heading"
            className="font-display text-[clamp(2rem,4vw,4rem)] tracking-tight text-ink"
          >
            Ücretsiz Tanışma Dersi
            <br />
            nasıl işliyor?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-0 relative">
          {/* Connecting line */}
          <div
            className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-line"
            aria-hidden="true"
          />

          {STEPS.map((step, i) => (
            <div key={step.number} className="relative flex flex-col gap-5 p-8 first:pl-0 last:pr-0">
              <div className="flex items-center gap-4">
                <span className="font-display text-[2.5rem] text-plum leading-none">
                  {step.number}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="md:hidden flex-1 h-px bg-line" aria-hidden="true" />
                )}
              </div>
              <div>
                <h3 className="font-display text-xl text-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-[15px] text-ink-muted leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4">
          <WhatsAppCta size="lg" label="WhatsApp'tan Yazın" />
          <p className="text-sm text-ink-muted">
            Bu bir anında rezervasyon sistemi değildir.
          </p>
        </div>
      </div>
    </section>
  );
}