import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { academyTelUrl, PHONE_DISPLAY } from "@/lib/contact";

export const metadata: Metadata = buildMetadata({
  title: "Ücretsiz Tanışma Dersi | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi ücretsiz tanışma dersi. Form yok. WhatsApp veya telefonla yazın; ekip sizinle saat ayarlar. Karşıyaka / İzmir.",
  canonical: "/ucretsiz-tanisma-dersi",
});

const STEPS = [
  {
    title: "Yazın",
    body: "Yaş ve hangi eğitim (resim, piyano, keman, gitar). Varsa uygun günleriniz.",
  },
  {
    title: "Ekip döner",
    body: "Akademi sizi arar veya mesaja cevap verir. Bir saat önerilir.",
  },
  {
    title: "Odaya gelirsiniz",
    body: "Hoca, akademi, tempo. Beğenirseniz kayıt konuşulur. Beğenmezseniz kapı aynı şekilde kapanır.",
  },
];

export default function UcretsizTanismaDersiPage() {
  return (
    <>
      <section className="bg-paper pt-32 pb-16 text-ink lg:pt-44 lg:pb-20" aria-labelledby="apply-heading">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h1
            id="apply-heading"
            className="font-display max-w-[14ch] text-[clamp(3rem,8vw,6.8rem)] leading-[0.9] tracking-[-0.03em]"
          >
            Form yok.
            <br />
            <em className="italic text-plum">Bir mesaj yeter.</em>
          </h1>
          <p className="mt-8 max-w-[52ch] text-[18px] leading-relaxed text-ink-muted">
            Ücretsiz tanışma dersi, akademiyi ve hocayı görmeniz içindir.
            Anında rezervasyon, otomatik takvim, kredi kartı yoktur.
            WhatsApp veya telefon — ekip sizinle konuşur, saati birlikte koyar.
          </p>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta size="xl" />
            <Button asChild size="xl" variant="secondary">
              <a href={academyTelUrl()}>{PHONE_DISPLAY}</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-paper-alt py-20 lg:py-28" aria-labelledby="ne-heading">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-12 lg:px-12">
          <h2
            id="ne-heading"
            className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] text-ink lg:col-span-5"
          >
            O derste ne olur
          </h2>
          <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-ink-muted lg:col-span-7">
            <p>
              Oda gösterilir. Hoca tanışır. Siz veya çocuğunuz ne kadar süre
              çalışabileceğinizi, evde enstrüman olup olmadığını konuşursunuz.
              Resimde bir kâğıda bakılır; müzikte enstrüman varsa kısa bir deneme
              yapılabilir. Amaç “kayıt alın” demek değil, uyum var mı bakmaktır.
            </p>
            <p>
              Tanışma dersi ücretli bir deneme paketi değildir. Satın alma
              zorunluluğu yoktur. Gelmek de zorunda değilsiniz — sadece yazmak
              bile soru sormaya yeter.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28" aria-labelledby="adim-heading">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h2
            id="adim-heading"
            className="font-display mb-14 max-w-[16ch] text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] text-ink"
          >
            Üç adım, form yok
          </h2>
          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <p className="mb-4 font-display text-5xl leading-none text-plum/70">{i + 1}</p>
                <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper px-6 pb-24 lg:pb-32">
        <div className="mx-auto max-w-[1400px] border-t border-line pt-16">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-ink">
            Yazın, gerisini konuşuruz.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[17px] text-ink-muted">
            “Merhaba, 8 yaşında resim düşünüyoruz” yeter. Ekip döner.
          </p>
          <div className="mt-8">
            <WhatsAppCta size="xl" />
          </div>
        </div>
      </section>
    </>
  );
}
