import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Akademi Hakkında | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi, Karşıyaka İmbatlı’da MEB onaylı resim, piyano, keman ve gitar kursu. 4 yaşından yetişkine, ücretsiz tanışma dersi.",
  canonical: "/akademi",
});

const PROGRAMS = [
  {
    name: "Resim",
    slug: "resim-kursu",
    format: "Grup dersi",
    note: "Gözlem, renk ve kompozisyon. Çocuk ve yetişkin grupları ayrıdır.",
  },
  {
    name: "Piyano",
    slug: "piyano-kursu",
    format: "Birebir ders",
    note: "Tek öğrenci, tek hoca. Tempo ve parça öğrenciye göre ayarlanır.",
  },
  {
    name: "Keman",
    slug: "keman-kursu",
    format: "Birebir veya grup",
    note: "Yay, duruş ve kulak. Hangisinin size uyduğu tanışma dersinde konuşulur.",
  },
  {
    name: "Gitar",
    slug: "gitar-kursu",
    format: "Birebir veya grup",
    note: "Akor, ritim, parmak. Akustik veya elektro.",
  },
];

export default function AkademiPage() {
  return (
    <>
      <section className="bg-paper pt-32 pb-20 text-ink lg:pt-44 lg:pb-28" aria-labelledby="akademi-heading">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <p className="mb-6 text-[14px] font-medium tracking-wide text-ink-muted">
            Karşıyaka / İzmir
            <span className="mx-2 text-plum">/</span>
            MEB onaylı kurs
          </p>
          <h1
            id="akademi-heading"
            className="font-display max-w-[16ch] text-[clamp(3.2rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em]"
          >
            Karşıyaka’da resim
            <br />
            <em className="italic text-plum">ve müzik kursu.</em>
          </h1>
          <p className="mt-8 max-w-[54ch] text-[18px] leading-relaxed text-ink-muted">
            Yağmur Sanat Akademisi, Karşıyaka İmbatlı’da resim, piyano, keman ve
            gitar dersi verir. Millî Eğitim Bakanlığı onaylı bir kurstur; programı
            bitirene resmî sertifika düzenlenir. 4 yaşındaki çocuk da yetişkin de
            gelir. İlk adım ücretsiz tanışma dersidir — kayıt o dersten sonra,
            isterseniz.
          </p>
        </div>
      </section>

      <section className="bg-paper pb-24 lg:pb-32" aria-labelledby="nedir-heading">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-12">
          <h2
            id="nedir-heading"
            className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] text-ink lg:col-span-5"
          >
            Ders hem tekniği hem de ne yaptığınızı öğretir
          </h2>
          <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-ink-muted lg:col-span-7">
            <p>
              Bazı kurslar yalnız el duruşunu, notayı, rengi öğretir; öğrenci ne
              çizdiğini veya ne çaldığını konuşmaz. Bazıları da “eğlence” der,
              temeli geçiştirir. Burada ikisi aynı derstedir: fırça doğru tutulsun,
              yay omza otursun — ve öğrenci de o işin ne anlattığını bilsin.
            </p>
            <p>
              Akademi İmbatlı Mahallesi’nde, Yeni Girne Caddesi üzerinde. Büyük
              bir AVM katı değil; resim masaları, piyano, keman ve gitar için
              derslikler. Gelenle konuşulabilen bir yer.
            </p>
            <p>
              Dönem sonunda resim öğrencilerinin işi sergiye çıkar, müzik
              öğrencileri konserde çalar. Sahne bir gösteri paketi değildir;
              işi başkasına göstermek, o işi ciddiye almayı öğretir. Çıkmak
              teşvik edilir; sahne korkusu olan zorlanmaz.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper-alt py-24 lg:py-32" aria-labelledby="kim-heading">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-12 lg:px-12">
          <h2
            id="kim-heading"
            className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] text-ink lg:col-span-5"
          >
            4 yaşındaki çocuk da gelir, yetişkin de
          </h2>
          <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-ink-muted lg:col-span-7">
            <p>
              İlkokulda resme başlayanlar, ortaokulda piyano veya keman denemek
              isteyenler, güzel sanatlar lisesi ya da fakültesine hazırlananlar,
              yetişkinlikte enstrüman öğrenmeye karar verenler — hepsi aynı
              çatı altındadır. Gruplar yaşa ve seviyeye göre ayrılır: 4 yaş ile
              40 yaş aynı masada oturmaz.
            </p>
            <p>
              Resim her zaman grup dersidir. Piyano her zaman birebirdir; hoca
              o günün temposuna göre gider. Keman ve gitar hem birebir hem grup
              olarak açılır — hangisinin size uyduğu tanışma dersinde konuşulur.
            </p>
            <p>
              Güzel sanatlar sınavına girecek resim öğrencisine modelden çizim,
              leke, kompozisyon ve portföy, dersin içinde verilir. Ayrı bir
              “hazırlık paketi” satılmaz.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 lg:py-28" aria-labelledby="nasil-heading">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-12 lg:px-12">
          <h2
            id="nasil-heading"
            className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] text-ink lg:col-span-5"
          >
            Önce ücretsiz tanışma dersi, kayıt sonra
          </h2>
          <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-ink-muted lg:col-span-7">
            <p>
              Siteden bu ayın açık saatlerinden birini seçin veya WhatsApp’tan
              yazın. Yaş ve hangi eğitim (resim, piyano, keman, gitar) yeterli.
              Akademi sizi arar veya yazar, saati teyit eder.
            </p>
            <p>
              O derste akademiyi ve hocayı görürsünüz. Uymadığını düşünürseniz
              kayıt olmazsınız. Sitede ücretli kayıt veya otomatik ödeme yoktur.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper-alt" aria-labelledby="programs-overview">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
          <h2 id="programs-overview" className="font-display text-[clamp(2rem,4vw,3.2rem)] text-ink">
            Resim, piyano, keman ve gitar
          </h2>
          <p className="mt-3 max-w-[46ch] text-[16px] text-ink-muted">
            Dört eğitim de MEB onaylıdır. Ayrıntı her eğitimin kendi sayfasında.
          </p>
        </div>
        <div className="grid sm:grid-cols-2">
          {PROGRAMS.map((prog) => (
            <Link
              key={prog.slug}
              href={`/egitimler/${prog.slug}`}
              className="group border-t border-line px-6 py-12 lg:px-12"
            >
              <p className="text-[13px] text-ink-muted">{prog.format}</p>
              <h3 className="font-display mt-2 text-4xl text-ink group-hover:text-plum">
                {prog.name}
              </h3>
              <p className="mt-3 max-w-[36ch] text-[15px] text-ink-muted">{prog.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-paper px-6 py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] text-ink">
            Ücretsiz tanışma dersi için saat seçin
          </h2>
          <p className="mt-4 max-w-[44ch] text-[17px] leading-relaxed text-ink-muted">
            Takvimden açık bir saat seçin. Uymuyorsa WhatsApp’tan yazın; ekip
            sizinle başka bir saat ayarlar.
          </p>
          <div className="mt-8">
            <Button asChild size="xl">
              <Link href="/ucretsiz-tanisma-dersi">Tanışma dersi</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
