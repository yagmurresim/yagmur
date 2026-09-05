import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Akademi Hakkında | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi, Karşıyaka’da MEB onaylı resim, piyano, keman ve gitar eğitimi verir. 4 yaştan yetişkine, ücretsiz tanışma dersi.",
  canonical: "/akademi",
});

const PROGRAMS = [
  {
    name: "Resim",
    slug: "resim-kursu",
    format: "Grup",
    note: "Göz, el ve anlatım. Grup dersinde yan yana çalışan öğrenciler.",
  },
  {
    name: "Piyano",
    slug: "piyano-kursu",
    format: "Birebir",
    note: "Nota, dokunuş ve tempo — tek öğrenci, tek hoca.",
  },
  {
    name: "Keman",
    slug: "keman-kursu",
    format: "Birebir ve grup",
    note: "Yay, postür, kulak. İsteyene birebir, isteyene sınıf.",
  },
  {
    name: "Gitar",
    slug: "gitar-kursu",
    format: "Birebir ve grup",
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
            className="font-display max-w-[14ch] text-[clamp(3.2rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em]"
          >
            Burası bir akademi.
            <br />
            <em className="italic text-plum">Resim ve müzik.</em>
          </h1>
          <p className="mt-8 max-w-[54ch] text-[18px] leading-relaxed text-ink-muted">
            Yağmur Sanat Akademisi, Karşıyaka’da resim ve müzik eğitimi verir.
            4 yaşındaki çocuk da gelir, yetişkin de. Dersler MEB onaylıdır;
            bitince resmî sertifika alınır. Kayıt bir formla değil, bir konuşmayla başlar.
          </p>
        </div>
      </section>

      <section className="bg-paper pb-24 lg:pb-32" aria-labelledby="nedir-heading">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-12">
          <h2
            id="nedir-heading"
            className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] text-ink lg:col-span-5"
          >
            Ne için kuruldu
          </h2>
          <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-ink-muted lg:col-span-7">
            <p>
              Birçok kurs ya teknik öğretir, ifadeyi unutur; ya da “eğlence” der,
              el duruşunu, notayı, rengi geçiştirir. Yağmur Sanat ikisini aynı çatı altında tutmak
              için açıldı. Fırça doğru tutulsun, yay omza otursun — ama öğrenci de
              ne çaldığını, ne çizdiğini bilsin.
            </p>
            <p>
              Akademi İmbatlı Mahallesi’nde, Yeni Girne üzerinde. Küçük bir yer:
              resim dersleri, piyano, keman ve gitar. Kalabalık bir AVM katı değil;
              gelenle konuşulabilen bir akademi.
            </p>
            <p>
              Dönem sonunda resim öğrencileri sergiye çıkar, müzik öğrencileri
              konserde çalar. Bu bir gösteri değil, dersin parçası: işin başkasına
              gösterilmesi, o işi ciddiye almayı öğretir.
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
            Kim gelir
          </h2>
          <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-ink-muted lg:col-span-7">
            <p>
              İlkokul çağında resme başlayan çocuklar. Ortaokulda keman veya piyano
              denemek isteyenler. Güzel sanatlar lisesi veya fakültesine hazırlananlar.
              Yetişkinlikte enstrüman öğrenmeye karar verenler. Hepsi aynı çatı altında;
              gruplar yaşa ve seviyeye göre ayrılır.
            </p>
            <p>
              Resim grup dersidir — yan yana çalışan akranlar, birbirinin işine bakmayı
              da öğrenir. Piyano birebirdir; hoca o günün temposuna göre gider.
              Keman ve gitar hem birebir hem grup olarak açılır.
            </p>
            <p>
              Güzel sanatlar sınavına girecekler için resim dersinin içinde portföy
              ve sınav tekniği desteği vardır. Ayrı bir “hazırlık paketi” satılmaz;
              ihtiyaç olan öğrenciye dersin parçası olarak verilir.
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
            Nasıl başlanır
          </h2>
          <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-ink-muted lg:col-span-7">
            <p>
              Sitede form yok. WhatsApp’tan yazın veya arayın: yaş, hangi eğitim,
              mümkünse uygun günler. Akademi ekibi döner, ücretsiz bir tanışma dersi
              ayarlar. O derste akademi görülür, hoca tanınır, tempo konuşulur.
              Kayıt o konuşmadan sonra isterseniz yapılır.
            </p>
            <p>
              Tanışma dersi bir satış görüşmesi değildir. Gelmek zorunda da değilsiniz —
              bakıp “şimdilik değil” demek yeter.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper-alt" aria-labelledby="programs-overview">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
          <h2 id="programs-overview" className="font-display text-[clamp(2rem,4vw,3.2rem)] text-ink">
            Dört eğitim
          </h2>
          <p className="mt-3 max-w-[46ch] text-[16px] text-ink-muted">
            Hepsi MEB onaylı. Hepsi 4 yaştan yetişkine. Ayrıntı her eğitimin kendi sayfasında.
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
            Kapı açık.
          </h2>
          <p className="mt-4 max-w-[44ch] text-[17px] leading-relaxed text-ink-muted">
            Açık saati seçin veya WhatsApp’tan yazın. Yaşınızı ve hangi eğitimi
            düşündüğünüzü söylemeniz yeter.
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
