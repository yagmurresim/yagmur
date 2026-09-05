import { Button } from "@/components/ui/Button";
import { introWhatsAppUrl } from "@/lib/contact";

interface WhatsAppCtaProps {
  programName?: string;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "magenta" | "inverse" | "outlineIvory";
  className?: string;
}

export function WhatsAppCta({
  programName,
  label = "WhatsApp'tan yazın",
  size = "lg",
  variant = "primary",
  className,
}: WhatsAppCtaProps) {
  return (
    <Button asChild size={size} variant={variant} className={className}>
      <a
        href={introWhatsAppUrl(programName)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    </Button>
  );
}
