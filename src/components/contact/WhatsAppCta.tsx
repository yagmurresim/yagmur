import { Button } from "@/components/ui/Button";
import { introWhatsAppUrl } from "@/lib/contact";

interface WhatsAppCtaProps {
  programName?: string;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "magenta";
  className?: string;
}

export function WhatsAppCta({
  programName,
  label = "Ücretsiz Tanışma Dersi Oluşturun",
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
