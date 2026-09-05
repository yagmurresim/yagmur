const WHY_ITEMS = [
  {
    title: "MEB onaylı kurs",
    body: "Eğitim ve sertifika resmî geçerliliğe sahip.",
  },
  {
    title: "Eğitmen kadrosu",
    body: "Alanında çalışan hocalar, her öğrenciye ayrı tempo.",
  },
  {
    title: "Sergi ve konser",
    body: "Dönem sonunda resim sergisi, müzik konseri — dersin parçası.",
  },
  {
    title: "Güzel sanatlar hazırlığı",
    body: "Lise ve fakülte sınavı için portföy ve teknik destek.",
  },
];

export function WhySection() {
  return (
    <section className="bg-paper-alt py-24 lg:py-32" aria-labelledby="why-heading">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-5">
          <h2
            id="why-heading"
            className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95] text-ink"
          >
            Akademi.
            <br />
            Eğitim.
            <br />
            <em className="italic text-plum">Disiplin.</em>
          </h2>
        </div>
        <ul className="flex flex-col lg:col-span-7">
          {WHY_ITEMS.map((item) => (
            <li
              key={item.title}
              className="border-t border-line py-7 last:border-b"
            >
              <h3 className="font-display text-2xl text-ink">{item.title}</h3>
              <p className="mt-2 max-w-[48ch] text-[15px] text-ink-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
