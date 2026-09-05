"use client";

import Link from "next/link";
import { StudioCanvas } from "@/components/brand/StudioCanvas";
import { StudioScene } from "@/components/brand/StudioScene";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/types";

interface HeroSectionProps {
  settings: SiteSettings;
  whatsappUrl?: string;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section
      className="studio-ground relative min-h-svh overflow-hidden text-ink"
      aria-labelledby="hero-heading"
    >
      <StudioCanvas />

      <div className="relative mx-auto grid min-h-svh max-w-[1400px] items-center gap-10 px-6 pt-28 pb-16 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pt-32 lg:pb-20">
        <div className="lg:col-span-6">
          <p className="mb-5 text-[14px] font-medium tracking-wide text-ink-muted lg:text-[15px]">
            {settings.district} / {settings.city}
            <span className="mx-2 text-plum">/</span>
            Resim · piyano · keman · gitar
          </p>

          <h1
            id="hero-heading"
            className="font-display max-w-[9ch] text-[clamp(3.8rem,9vw,8.2rem)] leading-[0.9] tracking-[-0.04em] text-ink"
          >
            Sanatla
            <br />
            kendini
            <br />
            keşfet.
          </h1>

          <p className="mt-8 max-w-[42ch] text-[17px] leading-relaxed text-ink-muted lg:text-[18px]">
            Karşıyaka’da MEB onaylı sanat akademisi. Resim, piyano, keman ve gitar;
            4 yaştan yetişkine. Ücretsiz tanışma dersi — form yok, yazmanız yeter.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <WhatsAppCta size="xl" />
            <Button asChild size="xl" variant="secondary">
              <Link href="/egitimler">Eğitimler</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <StudioScene />
        </div>
      </div>
    </section>
  );
}
