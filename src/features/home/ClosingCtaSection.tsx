import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

export function ClosingCtaSection() {
  return (
    <section
      className="py-24 lg:py-32"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-plum to-violet px-8 py-16 lg:px-16 lg:py-20 text-center">
          {/* Decorative */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-white/5 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[35%] h-[50%] bg-magenta/20 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
          </div>

          <div className="relative">
            <h2
              id="cta-heading"
              className="font-display text-[clamp(2rem,4vw,4rem)] tracking-tight text-white mb-4"
            >
              İlk adımı atmak
              <br />
              çok kolay.
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-[420px] mx-auto leading-relaxed">
              Ücretsiz tanışma dersi için WhatsApp&apos;tan yazın. Akademi
              ekibi sizinle iletişime geçsin.
            </p>
            <WhatsAppCta size="xl" variant="magenta" label="WhatsApp'tan Yazın" />
          </div>
        </div>
      </div>
    </section>
  );
}