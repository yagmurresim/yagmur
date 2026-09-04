"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BrandLine } from "@/components/brand/BrandLine";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import type { SiteSettings } from "@/types";

interface HeroSectionProps {
  settings: SiteSettings;
  whatsappUrl?: string;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      className="relative min-h-svh flex items-center pt-20 pb-16 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background surface */}
      <div className="absolute inset-0 bg-paper" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[45%] h-full bg-paper-alt" />
      </div>

      {/* Brand animated line — desktop */}
      <div
        className="absolute right-0 top-0 h-full w-[45%] flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <BrandLine />
      </div>

      <div className="relative max-w-[1320px] mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-0">
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 text-xs font-medium text-violet tracking-widest uppercase">
                <span className="w-6 h-px bg-violet" aria-hidden="true" />
                {settings.meb_display_text} · Karşıyaka, İzmir
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-[clamp(3.4rem,7.5vw,7.5rem)] text-ink tracking-tight leading-[1.0] mb-6"
            >
              Sanatla
              <br />
              kendini
              <br />
              <span className="text-plum">keşfet.</span>
            </motion.h1>

            {/* Sub copy */}
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-[17px] lg:text-[19px] text-ink-muted leading-relaxed max-w-[440px] mb-10"
            >
              Resim, piyano, keman ve gitar eğitimleri. 4 yaştan yetişkinlere.
              MEB onaylı, Karşıyaka / İzmir.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              <WhatsAppCta size="xl" />
              <Button asChild size="xl" variant="secondary">
                <Link href="/egitimler">
                  Eğitimleri Keşfet
                </Link>
              </Button>
            </motion.div>

            {/* Trust micro row */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex flex-wrap gap-x-6 gap-y-1 mt-10 text-xs text-ink-muted"
            >
              {["MEB Onaylı", "Resmî Sertifika", "4 Yaştan Yetişkinlere", "Ücretsiz Tanışma Dersi"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-violet" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-transparent via-ink-muted to-transparent mx-auto"
        />
      </div>
    </section>
  );
}