import { Eyebrow, Display } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

interface PageIntroProps {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  size?: "xl" | "lg";
}

/**
 * Shared editorial page opener: eyebrow, large serif H1, optional body & actions.
 */
export function PageIntro({ eyebrow, title, body, children, className, size = "lg" }: PageIntroProps) {
  return (
    <section
      className={cn("pt-36 lg:pt-44 pb-16 lg:pb-24", className)}
      aria-labelledby="page-heading"
    >
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8">
            <Eyebrow className="mb-8">{eyebrow}</Eyebrow>
            <Display as="h1" id="page-heading" size={size}>
              {title}
            </Display>
          </div>
          {(body || children) && (
            <div className="lg:col-span-4 flex flex-col justify-end gap-8 lg:pb-3">
              {body && (
                <p className="text-[17px] text-ink-muted leading-relaxed text-pretty max-w-[42ch]">
                  {body}
                </p>
              )}
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
