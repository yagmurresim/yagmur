import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/types";

interface LocationSectionProps {
  settings: SiteSettings;
  mapsUrl: string;
  whatsappUrl: string;
}

export function LocationSection({ settings, mapsUrl }: LocationSectionProps) {
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${settings.address_line}, ${settings.district}, ${settings.city}`
  )}&z=16&output=embed`;

  return (
    <section className="bg-paper" aria-labelledby="location-heading">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-20 lg:px-16 lg:py-28">
          <h2
            id="location-heading"
            className="font-display text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.95] text-ink"
          >
            Karşıyaka,
            <br />
            Girne üstü.
          </h2>
          <address className="mt-8 not-italic">
            <p className="text-[17px] leading-relaxed text-ink">
              {settings.address_line}
              <br />
              {settings.district} / {settings.city}
            </p>
            <p className="mt-4 text-[16px] text-ink-muted">
              Yeni Girne hattı, İmbatlı. Gelmeden yazın — ders saatlerinde akademi dolu olabilir.
            </p>
            <p className="mt-4">
              <a
                href={`tel:${settings.phone_e164}`}
                className="text-[17px] text-ink hover:text-plum"
              >
                {settings.phone_display}
              </a>
            </p>
          </address>
          <div className="mt-10">
            <Button asChild variant="primary" size="lg">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                Yol tarifi
              </a>
            </Button>
          </div>
        </div>
        <div className="min-h-[380px] lg:min-h-full">
          <iframe
            title="Yağmur Sanat Akademisi konumu"
            src={embedSrc}
            className="h-full min-h-[380px] w-full border-0 grayscale contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
