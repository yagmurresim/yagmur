"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { programFormatLabel } from "@/lib/utils";
import type { Program } from "@/types";

const FALLBACK_PROGRAMS: Program[] = [
  { id: "1", name: "Resim", slug: "resim-kursu", short_description: "Gözlem, renk ve anlatım. Grup ortamında yaratıcı gelişim.", lesson_formats: ["group"], status: "published", sort_order: 1, intro: null, audience_description: null, minimum_age: null, maximum_age: null, level_information: null, approach: null, learning_outcomes: null, duration_text: null, preparation_information: null, certificate_information: null, hero_media_id: null, seo_title: null, seo_description: null, og_media_id: null, created_at: "", updated_at: "" },
  { id: "2", name: "Piyano", slug: "piyano-kursu", short_description: "Birebir eğitimle nota okumadan yoruma.", lesson_formats: ["individual"], status: "published", sort_order: 2, intro: null, audience_description: null, minimum_age: null, maximum_age: null, level_information: null, approach: null, learning_outcomes: null, duration_text: null, preparation_information: null, certificate_information: null, hero_media_id: null, seo_title: null, seo_description: null, og_media_id: null, created_at: "", updated_at: "" },
  { id: "3", name: "Keman", slug: "keman-kursu", short_description: "Yay tekniğinden ifadeye. Birebir veya grup formatında.", lesson_formats: ["individual", "group"], status: "published", sort_order: 3, intro: null, audience_description: null, minimum_age: null, maximum_age: null, level_information: null, approach: null, learning_outcomes: null, duration_text: null, preparation_information: null, certificate_information: null, hero_media_id: null, seo_title: null, seo_description: null, og_media_id: null, created_at: "", updated_at: "" },
  { id: "4", name: "Gitar", slug: "gitar-kursu", short_description: "Akustikten elektriğe. Birebir veya grup ortamında.", lesson_formats: ["individual", "group"], status: "published", sort_order: 4, intro: null, audience_description: null, minimum_age: null, maximum_age: null, level_information: null, approach: null, learning_outcomes: null, duration_text: null, preparation_information: null, certificate_information: null, hero_media_id: null, seo_title: null, seo_description: null, og_media_id: null, created_at: "", updated_at: "" },
];

interface ProgramsSectionProps {
  programs: Program[];
}

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const display = programs.length > 0 ? programs : FALLBACK_PROGRAMS;

  return (
    <section className="py-24 lg:py-32" aria-labelledby="programs-heading">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-14 gap-8">
          <div>
            <p className="text-sm font-medium text-violet tracking-widest uppercase mb-3">
              Eğitimler
            </p>
            <h2
              id="programs-heading"
              className="font-display text-[clamp(2.4rem,5vw,5rem)] tracking-tight text-ink"
            >
              Dört disiplin,
              <br />
              sonsuz ifade.
            </h2>
          </div>
          <Link
            href="/egitimler"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-plum transition-colors shrink-0"
          >
            Tümünü gör <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {display.map((program, i) => (
            <motion.div
              key={program.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/egitimler/${program.slug}`}
                className="group flex items-center gap-6 py-8 lg:py-10"
              >
                <span className="font-display text-[clamp(2rem,3vw,3rem)] text-plum/20 group-hover:text-plum/50 transition-colors w-16 shrink-0 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-1">
                    <h3 className="font-display text-[clamp(1.6rem,3.5vw,3.2rem)] text-ink group-hover:text-plum transition-colors leading-none tracking-tight">
                      {program.name}
                    </h3>
                    <span className="text-xs font-medium text-ink-muted border border-line rounded-full px-3 py-1">
                      {programFormatLabel(program.lesson_formats)}
                    </span>
                  </div>
                  {program.short_description && (
                    <p className="text-sm text-ink-muted mt-1.5 max-w-[480px]">
                      {program.short_description}
                    </p>
                  )}
                </div>
                <ArrowRight
                  size={20}
                  className="text-ink-muted group-hover:text-plum group-hover:translate-x-1 transition-all shrink-0"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/egitimler"
            className="text-sm font-medium text-plum flex items-center gap-1.5"
          >
            Tümünü gör <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}