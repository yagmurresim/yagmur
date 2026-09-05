import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { IntroBookingForm } from "@/features/intro/IntroBookingForm";
import { getOpenIntroOccurrences } from "@/server/queries/intro-slots";

export const metadata: Metadata = buildMetadata({
  title: "Ücretsiz Tanışma Dersi | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi ücretsiz tanışma dersi. Açık saati seçin veya WhatsApp’tan yazın. Karşıyaka / İzmir.",
  canonical: "/ucretsiz-tanisma-dersi",
});

export default async function UcretsizTanismaDersiPage() {
  const occurrences = await getOpenIntroOccurrences();

  return (
    <>
      <section className="bg-paper pt-32 pb-16 text-ink lg:pt-44 lg:pb-20" aria-labelledby="apply-heading">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h1
            id="apply-heading"
            className="font-display max-w-[14ch] text-[clamp(3rem,8vw,6.8rem)] leading-[0.9] tracking-[-0.03em]"
          >
            Saat seçin.
            <br />
            <em className="italic text-plum">Ya da yazın.</em>
          </h1>
          <p className="mt-8 max-w-[52ch] text-[18px] leading-relaxed text-ink-muted">
            Ücretsiz tanışma dersi, akademiyi ve hocayı görmeniz içindir.
            Aşağıdaki ızgaradan yaşınıza uyan saati seçin. Uyan saat yoksa
            WhatsApp yeter — form doldurmak zorunda değilsiniz.
          </p>
        </div>
      </section>

      <section className="bg-paper pb-24 lg:pb-32" aria-label="Tanışma dersi ayarla">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-7">
            {occurrences.length === 0 ? (
              <div className="rounded-[12px] border border-line bg-white p-8">
                <p className="text-[17px] leading-relaxed text-ink-muted">
                  Şu an açık saat yok. WhatsApp’tan yazın; ekip sizinle bir
                  saat ayarlar. Satın alma yok, otomatik takvim yok.
                </p>
                <div className="mt-6">
                  <WhatsAppCta size="xl" />
                </div>
              </div>
            ) : (
              <IntroBookingForm occurrences={occurrences} />
            )}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="font-display text-2xl text-ink">O derste ne olur</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">
              Hoca tanışır. Siz veya çocuğunuz ne kadar süre çalışabileceğinizi,
              evde enstrüman olup olmadığını konuşursunuz. Amaç kayıt almak
              değil, uyum var mı bakmaktır. Beğenmezseniz kapı aynı şekilde kapanır.
            </p>
            <p className="mt-6 text-[16px] leading-relaxed text-ink-muted">
              İmbatlı Mahallesi, Yeni Girne No:205/B, Karşıyaka. Gelmeden teyit bekleyin.
            </p>
            <p className="mt-6 text-[16px] leading-relaxed text-ink-muted">
              Saat uymadıysa:
            </p>
            <div className="mt-4">
              <WhatsAppCta size="md" variant="secondary" />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
