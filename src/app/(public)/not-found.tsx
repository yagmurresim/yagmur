import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-[480px]">
        <p className="font-display text-[120px] leading-none text-plum/10 mb-4" aria-hidden="true">
          404
        </p>
        <h1 className="font-display text-3xl text-ink mb-4">
          Sayfa bulunamadı.
        </h1>
        <p className="text-ink-muted mb-8">
          Aradığınız sayfa mevcut değil ya da taşınmış olabilir.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild variant="primary" size="lg">
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/egitimler">Eğitimleri Gör</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}