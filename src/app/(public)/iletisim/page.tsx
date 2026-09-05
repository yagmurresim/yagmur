import type { Metadata } from "next";
import { getSiteSettings, getDefaultSettings } from "@/server/queries/settings";
import { buildMetadata } from "@/lib/seo";
import { buildInstagramUrl, buildMapsUrl } from "@/lib/utils";
import { academyWhatsAppUrl, academyTelUrl } from "@/lib/contact";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";

export const metadata: Metadata = buildMetadata({
  title: "İletişim | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi iletişim: WhatsApp, telefon, Instagram. İmbatlı Mahallesi, Yeni Girne No: 205/B, Karşıyaka / İzmir.",
  canonical: "/iletisim",
});

export default async function IletisimPage() {
  const settings = (await getSiteSettings()) ?? getDefaultSettings();
  const whatsappUrl = academyWhatsAppUrl();
  const instagramUrl = buildInstagramUrl(settings.instagram_handle);
  const mapsUrl =
    settings.maps_url ??
    buildMapsUrl(`${settings.address_line}, ${settings.district}, ${settings.city}`);
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${settings.address_line}, ${settings.district}, ${settings.city}`
  )}&z=16&output=embed`;

  return (
    <>
      <section className="bg-paper pt-32 pb-16 text-ink lg:pt-44 lg:pb-20" aria-labelledby="iletisim-heading">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h1
            id="iletisim-heading"
            className="font-display max-w-[12ch] text-[clamp(3.2rem,8vw,7rem)] leading-[0.9]"
          >
            WhatsApp, telefon
            <br />
            <em className="italic text-plum">veya adres.</em>
          </h1>
          <p className="mt-8 max-w-[48ch] text-[17px] leading-relaxed text-ink-muted">
            Form yok. WhatsApp en kolayı: yaşınızı ve aklınızdaki eğitimi yazın,
            ekip döner. Telefon da olur. Kapıya uğramadan önce yazmanızı isteriz —
            ders saatlerinde akademi dolu olabilir.
          </p>
          <div className="mt-10">
            <WhatsAppCta size="xl" />
          </div>
        </div>
      </section>

      <section className="bg-paper" aria-label="İletişim bilgileri">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 lg:px-16">
            <ul className="flex max-w-[480px] flex-col">
              <li className="border-t border-line py-6">
                <p className="text-[13px] text-ink-muted">Telefon</p>
                <a href={academyTelUrl()} className="font-display mt-1 block text-3xl text-ink hover:text-plum">
                  {settings.phone_display}
                </a>
              </li>
              <li className="border-t border-line py-6">
                <p className="text-[13px] text-ink-muted">WhatsApp</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display mt-1 block text-3xl text-ink hover:text-plum"
                >
                  Mesaj gönder
                </a>
                <p className="mt-2 text-[14px] text-ink-muted">
                  Yaş ve eğitim yeterli. Form doldurmanız gerekmez.
                </p>
              </li>
              <li className="border-t border-line py-6">
                <p className="text-[13px] text-ink-muted">Instagram</p>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display mt-1 block text-3xl text-ink hover:text-plum"
                >
                  {settings.instagram_handle}
                </a>
                <p className="mt-2 text-[14px] text-ink-muted">
                  Atölye, sergi ve konserden kareler.
                </p>
              </li>
              <li className="border-y border-line py-6">
                <p className="text-[13px] text-ink-muted">Adres</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-[17px] leading-relaxed text-ink hover:text-plum"
                >
                  {settings.address_line}
                  <br />
                  {settings.district} / {settings.city}
                </a>
                <p className="mt-2 text-[14px] text-ink-muted">
                  Yeni Girne hattı, İmbatlı. Gelmeden yazın.
                </p>
              </li>
            </ul>
          </div>
          <div className="min-h-[360px]">
            <iframe
              title="Yağmur Sanat Akademisi konumu"
              src={embedSrc}
              className="h-full min-h-[360px] w-full border-0 grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
