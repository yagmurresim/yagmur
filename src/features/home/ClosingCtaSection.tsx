import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ClosingCtaSection() {
  return (
    <section
      className="relative overflow-hidden bg-plum px-6 py-32 text-ivory lg:px-12 lg:py-40"
      aria-labelledby="cta-heading"
    >
      <div className="relative mx-auto max-w-[1400px]">
        <h2
          id="cta-heading"
          className="font-display max-w-[16ch] text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em]"
        >
          Ücretsiz tanışma dersi için saat seçin
        </h2>
        <p className="mt-8 max-w-[42ch] text-[17px] text-ivory/70">
          Resim, piyano, keman veya gitar. Takvimden açık bir saat işaretleyin;
          uymuyorsa WhatsApp’tan yazın.
        </p>
        <div className="mt-10">
          <Button asChild size="xl" variant="inverse">
            <Link href="/ucretsiz-tanisma-dersi">Tanışma dersi</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
