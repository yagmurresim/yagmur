import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import {
  BRAND,
  NAV_LINKS,
  PROGRAMS,
  MAPS_URL,
  TEL_URL,
  whatsappUrl,
  CTA_LABEL,
} from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative bg-ink text-white/70" aria-label="Site alt bilgisi">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 pt-20 pb-16 lg:pt-28 lg:pb-20">
          {/* Brand */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <Logo variant="white" />
            <p className="font-display text-[1.75rem] leading-[1.15] text-white max-w-[20ch] text-balance">
              Sanatla kendini <em className="italic text-gold">keşfet.</em>
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-white transition-colors w-fit"
            >
              <span className="border-b border-gold/50 pb-0.5">{CTA_LABEL}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Nav */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h2 className="eyebrow mb-6">Sayfalar</h2>
            <nav aria-label="Alt navigasyon">
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[15px] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Programs */}
          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-6">Eğitimler</h2>
            <ul className="flex flex-col gap-3">
              {PROGRAMS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/egitimler/${p.slug}`}
                    className="text-[15px] hover:text-white transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-6">İletişim</h2>
            <ul className="flex flex-col gap-3 text-[15px]">
              <li>
                <a href={TEL_URL} className="hover:text-white transition-colors">
                  {BRAND.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {BRAND.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors leading-relaxed"
                >
                  {BRAND.addressLine}
                  <br />
                  {BRAND.district} / {BRAND.city}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <p>{BRAND.legalName}</p>
          <p>© {new Date().getFullYear()} · Karşıyaka, İzmir</p>
        </div>
      </div>
    </footer>
  );
}
