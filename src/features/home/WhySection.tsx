import { CheckCircle } from "lucide-react";

const WHY_ITEMS = [
  {
    title: "MEB Onaylı Kurs",
    body: "Akademimiz Millî Eğitim Bakanlığı tarafından onaylıdır. Aldığınız eğitim ve sertifikalar resmî geçerliliğe sahiptir.",
  },
  {
    title: "Resmî Sertifika Programları",
    body: "Eğitimler MEB onaylı resmî programlar çerçevesinde yürütülmektedir.",
  },
  {
    title: "Deneyimli Eğitmen Kadrosu",
    body: "Alanında uzmanlaşmış eğitmenlerimiz her öğrenciye bireysel ilgi gösterir.",
  },
  {
    title: "Sergi ve Konser Fırsatları",
    body: "Öğrencilerimiz dönem boyunca gerçek sahne ve sergi deneyimi yaşar.",
  },
  {
    title: "Güzel Sanatlar Hazırlığı",
    body: "Güzel Sanatlar Liselerine ve Fakülteleri'ne hazırlanmak isteyen öğrenciler için destekleyici program sunulur.",
  },
];

export function WhySection() {
  return (
    <section className="py-24 lg:py-32 bg-paper-alt border-y border-line" aria-labelledby="why-heading">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
              Neden Yağmur Sanat?
            </p>
            <h2
              id="why-heading"
              className="font-display text-[clamp(2rem,4vw,4rem)] tracking-tight text-ink"
            >
              Sanat ve
              disiplinin
              birlikte
              olduğu yer.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="flex flex-col divide-y divide-line">
              {WHY_ITEMS.map((item) => (
                <div key={item.title} className="flex gap-5 py-7 first:pt-0 last:pb-0">
                  <CheckCircle
                    size={20}
                    className="text-violet shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-xl text-ink mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-ink-muted leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}