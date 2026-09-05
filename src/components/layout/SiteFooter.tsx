import Link from "next/link";
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
    <footer className="bg-plum text-ivory/70" aria-label="Site alt bilgisi">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <Logo variant="white" />
            {settings.legal_name && (
              <p className="mt-5 max-w-[36ch] text-xs leading-relaxed text-ivory/35">
                {settings.legal_name}
              </p>
            )}
            <p className="mt-6 max-w-[32ch] text-[15px] leading-relaxed text-ivory/55">
              {settings.address_line}
              <br />
              {settings.district} / {settings.city}
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ivory/70 hover:text-ivory">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a href={`tel:${settings.phone_e164}`} className="hover:text-ivory">
                  {settings.phone_display}
                </a>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">
                  {settings.instagram_handle}
                </a>
              </li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">
                  Yol tarifi
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-ivory/10 py-6 text-xs text-ivory/30 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.brand_name}
          </p>
          <p>Karşıyaka, İzmir</p>
        </div>
      </div>
    </footer>
  );
}
