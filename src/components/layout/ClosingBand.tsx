import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

interface ClosingBandProps {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  programName?: string;
  microcopy?: string;
}

/**
 * Dark plum full-bleed closing band with a thin gold rule on top.
 */
export function ClosingBand({ eyebrow, title, body, programName, microcopy }: ClosingBandProps) {
  return (
    <section className="relative bg-plum text-white" aria-labelledby="closing-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gold" aria-hidden="true" />
      <div className="container-x py-24 lg:py-36">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            {eyebrow && (
              <p className="eyebrow mb-8 flex items-center gap-3">
                <span className="h-px w-6 bg-gold" aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            <h2
              id="closing-heading"
              className="font-display text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.98] tracking-[-0.02em] text-white text-balance"
            >
              {title}
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-8 lg:pb-2">
            {body && (
              <p className="text-[17px] text-white/70 leading-relaxed max-w-[40ch] text-pretty">
                {body}
              </p>
            )}
            <div className="flex flex-col items-start gap-3">
              <WhatsAppCta variant="gold" size="xl" programName={programName} />
              {microcopy && <p className="text-xs text-white/45">{microcopy}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
