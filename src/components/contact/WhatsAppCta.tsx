import { Button } from "@/components/ui/Button";
import { CTA_LABEL, programWhatsappUrl, whatsappUrl } from "@/content/site";

interface WhatsAppCtaProps {
  programName?: string;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "gold" | "outlineLight";
  className?: string;
}

export function WhatsAppCta({
  programName,
  label = CTA_LABEL,
  size = "lg",
  variant = "primary",
  className,
}: WhatsAppCtaProps) {
  const href = programName ? programWhatsappUrl(programName) : whatsappUrl();
  return (
    <Button asChild size={size} variant={variant} className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    </Button>
  );
}
