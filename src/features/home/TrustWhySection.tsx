import { CheckCircle } from "lucide-react";

const WHY_ITEMS = [
  {
    title: "MEB Onaylı Yapı",
    body: "Resmî kurs statüsü ve MEB onaylı eğitim programları ile öğrencilerinize hukuken geçerli bir sertifika yolu sunuyoruz.",
  },
  {
    title: "Deneyimli Eğitmen Kadrosu",
    body: "Her disiplinde alanında uzman, öğrenci gelişimini merkeze alan eğitmenlerle çalışıyoruz.",
  },
  {
    title: "Resmî Sertifika Programları",
    body: "Tamamlanan eğitimler MEB onaylı resmî sertifikalarla belgeleniyor.",
  },
  {
    title: "Sergi ve Konser Fırsatları",
    body: "Öğrenciler düzenli sergi ve konser etkinlikleriyle sahne deneyimi kazanıyor.",
  },
  {
    title: "Güzel Sanatlar Hazırlık",
    body: "Güzel Sanatlar Liseleri ve Fakülteleri'ne hazırlık desteği sunuyoruz.",
  },
];

export function TrustWhySection() {
  return (
    <section
      className="py-24 lg:py-32 bg-paper-alt"
      aria-labelledby="why-heading"
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left */}
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
              Neden Yağmur Sanat?
            </p>
            <h2
              id="why-heading"
              className="font-display text-[clamp(2rem,3.5vw,3.8rem)] tracking-tight text-ink leading-tight"
            >
              Sanat eğitiminde
              <br />
              güven ve kalite.
            </h2>
            <p className="mt-6 text-[17px] text-ink-muted leading-relaxed max-w-[360px]">
              Yağmur Sanat Akademisi, resmî bir kurs yapısıyla sanat eğitiminin
              kalitesini birleştiren bir akademidir.
            </p>
          </div>

          {/* Right */}
          <div className="lg:col-span-7">
            <ul className="flex flex-col divide-y divide-line">
              {WHY_ITEMS.map((item) => (
                <li key={item.title} className="flex gap-4 py-6">
                  <CheckCircle
                    size={20}
                    className="text-violet shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-[17px] text-ink mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}