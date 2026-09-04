import { Phone, MapPin, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildInstagramUrl } from "@/lib/utils";
import type { SiteSettings } from "@/types";

interface LocationSectionProps {
  settings: SiteSettings;
  mapsUrl: string;
  whatsappUrl: string;
}

export function LocationSection({ settings, mapsUrl, whatsappUrl }: LocationSectionProps) {
  const instagramUrl = buildInstagramUrl(settings.instagram_handle);

  return (
    <section
      className="py-24 lg:py-32 bg-paper-alt"
      aria-labelledby="location-heading"
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
              Neredeyiz?
            </p>
            <h2
              id="location-heading"
              className="font-display text-[clamp(2rem,3.5vw,3.5rem)] tracking-tight text-ink mb-6"
            >
              Karşıyaka,
              <br />
              İzmir.
            </h2>

            <address className="not-italic flex flex-col gap-3 mb-8">
              <div className="flex items-start gap-3 text-ink-muted">
                <MapPin size={18} className="shrink-0 mt-0.5 text-plum" aria-hidden="true" />
                <span className="text-[15px]">
                  {settings.address_line},<br />
                  {settings.district} / {settings.city}
                </span>
              </div>
              <div className="flex items-center gap-3 text-ink-muted">
                <Phone size={18} className="shrink-0 text-plum" aria-hidden="true" />
                <a
                  href={`tel:${settings.phone_e164}`}
                  className="text-[15px] hover:text-plum transition-colors"
                >
                  {settings.phone_display}
                </a>
              </div>
            </address>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="primary" size="md">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin size={16} aria-hidden="true" />
                  Yol Tarifi Al
                </a>
              </Button>
              <Button asChild variant="secondary" size="md">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} aria-hidden="true" />
                  Ücretsiz Tanışma Dersi Oluşturun
                </a>
              </Button>
              <Button asChild variant="ghost" size="md">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                  <Instagram size={16} aria-hidden="true" />
                  {settings.instagram_handle}
                </a>
              </Button>
            </div>
          </div>

          {/* Map placeholder */}
          <div
            className="lg:col-span-7 rounded-[12px] overflow-hidden border border-line"
            aria-label="Akademi konumu haritası"
          >
            <div className="aspect-[4/3] bg-lavender/10 flex flex-col items-center justify-center gap-4 p-8">
              <MapPin size={40} className="text-plum/30" aria-hidden="true" />
              <div className="text-center">
                <p className="font-display text-lg text-ink/70">
                  {settings.brand_name}
                </p>
                <p className="text-sm text-ink-muted mt-1">
                  {settings.address_line}, {settings.district} / {settings.city}
                </p>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-plum hover:text-violet transition-colors underline underline-offset-4"
              >
                Google Maps&apos;te aç →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}