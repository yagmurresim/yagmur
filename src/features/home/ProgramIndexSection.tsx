"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Program } from "@/types";
import { programFormatLabel } from "@/lib/utils";

interface ProgramIndexSectionProps {
  programs: Program[];
}

const FALLBACK_PROGRAMS = [
  {
    id: "resim",
    slug: "resim-kursu",
    name: "Resim",
    short_description: "Gözlem, renk ve anlatım. Grup ortamında yaratıcı keşif.",
    lesson_formats: ["group"],
    sort_order: 1,
  },
  {
    id: "piyano",
    slug: "piyano-kursu",
    name: "Piyano",
    short_description: "Birebir eğitimle nota okumadan yoruma. Disiplin ve müzikalite.",
    lesson_formats: ["individual"],
    sort_order: 2,
  },
  {
    id: "keman",
    slug: "keman-kursu",
    name: "Keman",
    short_description: "Yay tekniğinden ifadeye. Birebir veya grup formatında.",
    lesson_formats: ["individual", "group"],
    sort_order: 3,
  },
  {
    id: "gitar",
    slug: "gitar-kursu",
    name: "Gitar",
    short_description: "Akustikten elektriğe. Birebir veya grup ortamında.",
    lesson_formats: ["individual", "group"],
    sort_order: 4,
  },
];

export function ProgramIndexSection({ programs }: ProgramIndexSectionProps) {
  const shouldReduce = useReducedMotion();
  const displayPrograms = programs.length > 0 ? programs : FALLBACK_PROGRAMS;

  return (
    <section
      className="py-24 lg:py-32"
      aria-labelledby="programs-heading"
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-20">
          <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
            Eğitimler
          </p>
          <h2
            id="programs-heading"
            className="font-display text-[clamp(2.4rem,4vw,4.5rem)] tracking-tight text-ink"
          >
            Hangi sanatı
            <br />
            keşfetmek istersiniz?
          </h2>
        </div>

        <div className="border-t border-line">
          {displayPrograms.map((program, i) => (
            <ProgramRow key={program.id} program={program} index={i} shouldReduce={shouldReduce ?? false} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramRow({
  program,
  index,
  shouldReduce,
}: {
  program: { id: string; slug: string; name: string; short_description?: string | null; lesson_formats: string[]; sort_order?: number };
  index: number;
  shouldReduce: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/egitimler/${program.slug}`}
      className="group block border-b border-line"
      aria-label={`${program.name} eğitimini incele`}
    >
      <motion.div
        className="flex items-center gap-6 lg:gap-12 py-6 lg:py-8 transition-all duration-200"
        whileHover={shouldReduce ? {} : { x: 4 }}
      >
        {/* Index number */}
        <span className="font-display text-[13px] text-ink-muted/40 w-8 shrink-0 group-hover:text-violet transition-colors duration-200">
          {num}
        </span>

        {/* Name */}
        <h3 className="font-display text-[clamp(1.5rem,3vw,2.8rem)] text-ink tracking-tight group-hover:text-plum transition-colors duration-200 flex-1 min-w-0">
          {program.name}
        </h3>

        {/* Format badge */}
        <span className="hidden sm:inline-flex text-xs font-medium text-ink-muted border border-line rounded-full px-3 py-1 shrink-0">
          {programFormatLabel(program.lesson_formats)}
        </span>

        {/* Description */}
        {program.short_description && (
          <p className="hidden lg:block text-sm text-ink-muted max-w-[280px] leading-relaxed shrink-0">
            {program.short_description}
          </p>
        )}

        {/* Arrow */}
        <motion.div
          className="shrink-0 w-8 h-8 flex items-center justify-center text-ink-muted group-hover:text-plum transition-colors"
          animate={shouldReduce ? {} : undefined}
          whileHover={shouldReduce ? {} : { x: 3 }}
        >
          <ArrowRight size={18} aria-hidden="true" />
        </motion.div>
      </motion.div>
    </Link>
  );
}