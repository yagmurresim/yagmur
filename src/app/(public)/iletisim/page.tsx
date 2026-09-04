import type { Metadata } from "next";
import { Phone, MapPin, Instagram, MessageCircle } from "lucide-react";
import { getSiteSettings, getDefaultSettings } from "@/server/queries/settings";
import { buildMetadata } from "@/lib/seo";
import { buildInstagramUrl, buildMapsUrl } from "@/lib/utils";
import { academyWhatsAppUrl, academyTelUrl } from "@/lib/contact";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

export const metadata: Metadata = buildMetadata({
  title: "İletişim | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi ile iletişime geçin. Telefon, WhatsApp, Instagram. Karşıyaka / İzmir.",
  canonical: "/iletisim",
});

export default async function IletisimPage() {
  const settings = (await getSiteSettings()) ?? getDefaultSettings();
  const whatsappUrl = academyWhatsAppUrl();
  const instagramUrl = buildInstagramUrl(settings.instagram_handle);
  const mapsUrl =
    settings.maps_url ??
    buildMapsUrl(
      `${settings.address_line}, ${settings.district}, ${settings.city}`
    );

  return (
    <>
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20" aria-labelledby="iletisim-heading">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <p className="text-sm font-medium text-violet tracking-widest uppercase mb-4">
            İletişim
          </p>
          <h1
            id="iletisim-heading"
            className="font-display text-[clamp(2.8rem,5vw,5rem)] tracking-tight text-ink"
          >
            Hemen ulaşın.
          </h1>
        </div>
      </section>

      <section className="pb-24 lg:pb-32" aria-label="İletişim bilgileri">
        <div className="max-w-[720px] mx-auto px-6 lg:px-12">
          <p className="text-[17px] text-ink-muted leading-relaxed mb-10">
            Form yok. WhatsApp&apos;tan yazın veya arayın; ekibimiz size döner.
          </p>

          <div className="flex flex-col gap-6 mb-10">
            <a
              href={academyTelUrl()}
              className="group flex items-center gap-4 p-5 rounded-[10px] border border-line bg-white hover:border-plum transition-colors"
              aria-label={`Telefon: ${settings.phone_display}`}
            >
              <div className="w-10 h-10 rounded-[8px] bg-plum/8 flex items-center justify-center text-plum shrink-0">
                <Phone size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-ink-muted mb-0.5">Telefon</p>
                <p className="text-[15px] font-medium text-ink group-hover:text-plum transition-colors">
                  {settings.phone_display}
                </p>
              </div>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 rounded-[10px] border border-line bg-white hover:border-plum transition-colors"
              aria-label="WhatsApp ile yaz"
            >
              <div className="w-10 h-10 rounded-[8px] bg-plum/8 flex items-center justify-center text-plum shrink-0">
                <MessageCircle size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-ink-muted mb-0.5">WhatsApp</p>
                <p className="text-[15px] font-medium text-ink group-hover:text-plum transition-colors">
                  {settings.phone_display}
                </p>
              </div>
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 rounded-[10px] border border-line bg-white hover:border-plum transition-colors"
              aria-label={`Instagram: ${settings.instagram_handle}`}
            >
              <div className="w-10 h-10 rounded-[8px] bg-plum/8 flex items-center justify-center text-plum shrink-0">
                <Instagram size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-ink-muted mb-0.5">Instagram</p>
                <p className="text-[15px] font-medium text-ink group-hover:text-plum transition-colors">
                  {settings.instagram_handle}
                </p>
              </div>
            </a>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-5 rounded-[10px] border border-line bg-white hover:border-plum transition-colors"
              aria-label="Adres ve yol tarifi"
            >
              <div className="w-10 h-10 rounded-[8px] bg-plum/8 flex items-center justify-center text-plum shrink-0 mt-0.5">
                <MapPin size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-ink-muted mb-0.5">Adres</p>
                <p className="text-[15px] font-medium text-ink group-hover:text-plum transition-colors">
                  {settings.address_line}
                </p>
                <p className="text-sm text-ink-muted">
                  {settings.district} / {settings.city}
                </p>
              </div>
            </a>
          </div>

          <WhatsAppCta size="xl" label="WhatsApp'tan Yazın" />
        </div>
      </section>
    </>
  );
}
