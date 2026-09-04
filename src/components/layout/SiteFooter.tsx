import Link from "next/link";
import { Phone, Instagram, MapPin, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { buildWhatsAppUrl, buildInstagramUrl, buildMapsUrl } from "@/lib/utils";
import type { SiteSettings } from "@/types";

interface SiteFooterProps {
  settings: SiteSettings;
}

const NAV_LINKS = [
  { href: "/akademi", label: "Akademi" },
  { href: "/egitimler", label: "Eğitimler" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

export function SiteFooter({ settings }: SiteFooterProps) {
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_e164,
    "Merhaba, Yağmur Sanat Akademisi hakkında bilgi almak istiyorum."
  );
  const instagramUrl = buildInstagramUrl(settings.instagram_handle);
  const mapsUrl =
    settings.maps_url ??
    buildMapsUrl(`${settings.address_line}, ${settings.district}, ${settings.city}`);

  return (
    <footer className="bg-ink text-white/80" aria-label="Site alt bilgisi">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 py-16 lg:py-20">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo variant="white" />

            {settings.legal_name && (
              <p className="mt-4 text-xs text-white/40 leading-relaxed">
                {settings.legal_name}
              </p>
            )}

            <div className="flex flex-col gap-2 mt-6 text-sm">
              <a
                href={`tel:${settings.phone_e164}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
                aria-label={`Telefon: ${settings.phone_display}`}
              >
                <Phone size={14} aria-hidden="true" />
                {settings.phone_display}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={14} aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
                aria-label={`Instagram: ${settings.instagram_handle}`}
              >
                <Instagram size={14} aria-hidden="true" />
                {settings.instagram_handle}
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-white transition-colors mt-1"
                aria-label="Adres ve yol tarifi"
              >
                <MapPin size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {settings.address_line}
                  <br />
                  {settings.district} / {settings.city}
                </span>
              </a>
            </div>
          </div>

          {/* Nav */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h2 className="text-xs font-medium text-white/40 tracking-widest uppercase mb-4">
              Sayfalar
            </h2>
            <nav aria-label="Alt navigasyon">
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Programs */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-medium text-white/40 tracking-widest uppercase mb-4">
              Eğitimler
            </h2>
            <ul className="flex flex-col gap-2">
              {[
                { href: "/egitimler/resim-kursu", label: "Resim" },
                { href: "/egitimler/piyano-kursu", label: "Piyano" },
                { href: "/egitimler/keman-kursu", label: "Keman" },
                { href: "/egitimler/gitar-kursu", label: "Gitar" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-white/30">
          <p>
            © {new Date().getFullYear()} {settings.brand_name}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}