import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag className={cn("eyebrow flex items-center gap-3", className)}>
      <span className="h-px w-6 bg-gold shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </Tag>
  );
}

/**
 * Large serif heading. Pass `lines` to break at fixed positions.
 * Wrap a word in <Ital> to render it italic gold.
 */
export function Display({
  children,
  className,
  as: Tag = "h2",
  id,
  size = "lg",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  size?: "xl" | "lg" | "md" | "sm";
}) {
  const sizes = {
    xl: "text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.025em]",
    lg: "text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.98] tracking-[-0.02em]",
    md: "text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-[-0.015em]",
    sm: "text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.15] tracking-[-0.01em]",
  };
  return (
    <Tag
      id={id}
      className={cn("font-display font-normal text-ink text-balance", sizes[size], className)}
    >
      {children}
    </Tag>
  );
}

export function Ital({ children }: { children: React.ReactNode }) {
  return <em className="italic text-gold font-normal">{children}</em>;
}

export function ArrowLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = cn(
    "group inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-plum transition-colors",
    className
  );
  const inner = (
    <>
      <span className="border-b border-ink/30 group-hover:border-gold pb-0.5 transition-colors">
        {children}
      </span>
      <ArrowRight
        size={15}
        aria-hidden="true"
        className="text-gold transition-transform duration-300 group-hover:translate-x-1"
      />
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function GoldRule({ className }: { className?: string }) {
  return <hr className={cn("border-0 h-px bg-gold", className)} aria-hidden="true" />;
}
