import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

export function ClosingCtaSection() {
  return (
    <section
      className="relative overflow-hidden bg-plum px-6 py-32 text-ivory lg:px-12 lg:py-40"
      aria-labelledby="cta-heading"
    >
      <p
        className="pointer-events-none absolute -bottom-16 left-0 font-display text-[min(28vw,18rem)] leading-none text-ivory/10"
        aria-hidden="true"
      >
        gelin.
      </p>
      <div className="relative mx-auto max-w-[1400px]">
        <h2
          id="cta-heading"
          className="font-display max-w-[12ch] text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em]"
        >
          Kapı açık.
          <br />
          Yazmanız yeter.
        </h2>
        <p className="mt-8 max-w-[42ch] text-[17px] text-ivory/70">
          Ücretsiz tanışma dersi. Yaşınızı ve aklınızdaki eğitimi yazın — akademi ekibi döner.
        </p>
        <div className="mt-10">
          <WhatsAppCta size="xl" variant="inverse" />
        </div>
      </div>
    </section>
  );
}
