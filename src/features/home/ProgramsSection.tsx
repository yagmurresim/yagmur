import Link from "next/link";
import { programFormatLabel } from "@/lib/utils";
import { toneFor } from "@/lib/program-tones";
import type { Program } from "@/types";

const FALLBACK_PROGRAMS: Pick<Program, "id" | "name" | "slug" | "short_description" | "lesson_formats">[] = [
  {
    id: "1",
    name: "Resim",
    slug: "resim-kursu",
    short_description:
      "Grup dersinde gözlem, renk ve kompozisyon. Güzel sanatlar hazırlığı dersin içinde.",
    lesson_formats: ["group"],
  },
  {
    id: "2",
    name: "Piyano",
    slug: "piyano-kursu",
    short_description: "Birebir ders. Nota, dokunuş, tempo öğrenciye göre. Dönem sonunda konser.",
    lesson_formats: ["individual"],
  },
  {
    id: "3",
    name: "Keman",
    slug: "keman-kursu",
    short_description: "Yay, postür, kulak. Birebir veya grup. Yeni başlayan da gelir.",
    lesson_formats: ["individual", "group"],
  },
  {
    id: "4",
    name: "Gitar",
    slug: "gitar-kursu",
    short_description: "Akor, ritim, parmak. Akustik veya elektro. Birebir ya da grup.",
    lesson_formats: ["individual", "group"],
  },
];

interface ProgramsSectionProps {
  programs: Program[];
}

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  const display = programs.length > 0 ? programs : FALLBACK_PROGRAMS;

  return (
    <section aria-labelledby="programs-heading">
      <div className="bg-paper px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <h2
            id="programs-heading"
            className="font-display max-w-[12ch] text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.95] text-ink"
          >
            Dört eğitim.
          </h2>
        </div>
      </div>

      <div>
        {display.map((program) => {
          const tone = toneFor(program.slug);
          return (
            <Link
              key={program.id}
              href={`/egitimler/${program.slug}`}
              className="group relative flex min-h-[38vh] items-end overflow-hidden px-6 py-12 text-ink lg:min-h-[44vh] lg:px-12 lg:py-16"
              style={{ backgroundColor: tone.wash }}
            >
              <span
                className="pointer-events-none absolute -right-8 -bottom-16 font-display text-[min(42vw,22rem)] leading-none text-ink/[0.05] transition-transform duration-500 group-hover:scale-[1.03]"
                aria-hidden="true"
              >
                {program.name}
              </span>
              <span
                className="pointer-events-none absolute inset-y-0 right-0 w-1/3"
                style={{
                  background: `radial-gradient(ellipse at 80% 50%, ${tone.accent}28, transparent 62%)`,
                }}
                aria-hidden="true"
              />
              <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-3">
                <p className="text-[13px] tracking-wide text-ink-muted">
                  {programFormatLabel(program.lesson_formats)}
                </p>
                <h3 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em]">
                  {program.name}
                </h3>
                {program.short_description && (
                  <p className="max-w-[36ch] text-[16px] text-ink-muted">
                    {program.short_description}
                  </p>
                )}
                <span
                  className="mt-4 inline-flex text-[13px] font-medium tracking-wide"
                  style={{ color: tone.accent }}
                >
                  Eğitime bak
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
