import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { academyTelUrl, PHONE_DISPLAY } from "@/lib/contact";

export const metadata: Metadata = buildMetadata({
  title: "Ücretsiz Tanışma Dersi | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi ücretsiz tanışma dersi. WhatsApp veya telefonla yazın; akademi ekibi sizinle iletişime geçer.",
  canonical: "/ucretsiz-tanisma-dersi",
});

export default function UcretsizTanismaDersiPage() {
  return (
    <section className="pt-32 pb-24 lg:pt-40 lg:pb-32" aria-labelledby="apply-heading">
      <div className="max-w-[720px] mx-auto px-6 lg:px-12">
        <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
          Tanışma dersi
        </p>
        <h1
          id="apply-heading"
          className="font-display text-[clamp(2.5rem,5vw,4.5rem)] tracking-tight text-ink leading-[1.05] mb-6"
        >
          WhatsApp&apos;tan
          <br />
          yazmanız yeter.
        </h1>
        <p className="text-[17px] text-ink-muted leading-relaxed mb-4">
          Ücretsiz tanışma dersi için form doldurmanıza gerek yok. Bize
          WhatsApp&apos;tan yazın veya arayın; ekibimiz sizinle iletişime geçer
          ve uygun zamanı birlikte ayarlarız.
        </p>
        <p className="text-[15px] text-ink-muted leading-relaxed mb-10">
          Bu bir anında rezervasyon sistemi değildir. Resim, piyano, keman ve
          gitar eğitimleri için geçerlidir.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <WhatsAppCta size="xl" />
          <Button asChild size="xl" variant="secondary">
            <a href={academyTelUrl()}>
              <Phone size={16} aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
