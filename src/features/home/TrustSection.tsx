const TRUST_ITEMS = [
  {
    label: "MEB Onaylı Kurs",
    description: "Millî Eğitim Bakanlığı onaylı resmî eğitim programları.",
  },
  {
    label: "Resmî Sertifika",
    description: "MEB onaylı resmî sertifikalar ve belge programları.",
  },
  {
    label: "4 Yaştan Yetişkinlere",
    description: "Her yaş grubuna uygun, kişiye özel eğitim yaklaşımı.",
  },
  {
    label: "Deneyimli Eğitmenler",
    description: "Alanında deneyimli ve yetkin eğitmen kadrosu.",
  },
];

export function TrustSection() {
  return (
    <section
      className="bg-paper-alt py-16 border-y border-line"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <h2 id="trust-heading" className="sr-only">
          Neden Yağmur Sanat Akademisi?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <span className="font-display text-[15px] text-ink leading-snug">
                {item.label}
              </span>
              <p className="text-sm text-ink-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}