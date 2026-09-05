import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center bg-paper px-6 text-ink">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-display text-[clamp(5rem,18vw,12rem)] leading-none text-plum/25" aria-hidden="true">
          404
        </p>
        <h1 className="font-display mt-4 text-4xl">Bu sayfa yok.</h1>
        <p className="mt-3 max-w-[36ch] text-ink-muted">
          Aradığınız sayfa yok ya da taşındı.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/">Ana sayfa</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/egitimler">Eğitimler</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
