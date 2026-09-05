import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    title: "Eğitimi seçin",
    body: "Resim, piyano, keman veya gitar — kendiniz ya da çocuğunuz için.",
  },
  {
    title: "Saati seçin",
    body: "Açık ızgaradan yaşınıza uyan saati seçin. Uymuyorsa WhatsApp’tan yazın.",
  },
  {
    title: "Akademi teyit eder",
    body: "Başvurunuz bize düşer. İlk ders ücretsizdir; kayıt o dersten sonra, isterseniz.",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-paper py-24 lg:py-32" aria-labelledby="process-heading">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <h2
          id="process-heading"
          className="font-display mb-16 max-w-[14ch] text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95] text-ink"
        >
          Ücretsiz tanışma
          <br />
          dersi nasıl olur.
        </h2>

        <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <p className="mb-4 font-display text-5xl leading-none text-plum/70">
                {i + 1}
              </p>
              <h3 className="font-display text-2xl text-ink">{step.title}</h3>
              <p className="mt-2 max-w-[32ch] text-[15px] text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14">
          <Button asChild size="lg">
            <Link href="/ucretsiz-tanisma-dersi">Tanışma dersi</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
