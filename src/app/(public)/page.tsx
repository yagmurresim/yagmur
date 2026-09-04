import { getSiteSettings, getDefaultSettings } from "@/server/queries/settings";
import { getPublishedPrograms } from "@/server/queries/programs";
import { getPublishedFaqs } from "@/server/queries/faqs";
import { buildWhatsAppUrl, buildMapsUrl } from "@/lib/utils";
import { organizationSchema } from "@/lib/seo";
import { HeroSection } from "@/features/home/HeroSection";
import { ProgramsSection } from "@/features/home/ProgramsSection";
import { WhySection } from "@/features/home/WhySection";
import { ProcessSection } from "@/features/home/ProcessSection";
import { FaqPreviewSection } from "@/features/home/FaqPreviewSection";
import { LocationSection } from "@/features/home/LocationSection";
import { ClosingCtaSection } from "@/features/home/ClosingCtaSection";

export const metadata = {
  title: "Yağmur Sanat Akademisi | Karşıyaka Resim ve Müzik Kursu",
  description:
    "Karşıyaka'da resim, piyano, keman ve gitar eğitimi. MEB onaylı kurs. 4 yaştan yetişkinlere. Sanatla kendini keşfet.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Yağmur Sanat Akademisi | Karşıyaka Resim ve Müzik Kursu",
    description:
      "Karşıyaka'da resim, piyano, keman ve gitar eğitimi. MEB onaylı kurs. 4 yaştan yetişkinlere.",
    locale: "tr_TR",
    type: "website",
  },
};

export default async function HomePage() {
  const [settings, programs, faqs] = await Promise.all([
    getSiteSettings().then((s) => s ?? getDefaultSettings()),
    getPublishedPrograms(),
    getPublishedFaqs(),
  ]);

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_e164,
    "Merhaba, Yağmur Sanat Akademisi hakkında bilgi almak istiyorum."
  );
  const mapsUrl =
    settings.maps_url ??
    buildMapsUrl(`${settings.address_line}, ${settings.district}, ${settings.city}`);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: process.env.NEXT_PUBLIC_SITE_URL ?? "/" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <HeroSection settings={settings} whatsappUrl={whatsappUrl} />
      <ProgramsSection programs={programs} />
      <WhySection />
      <ProcessSection />
      <FaqPreviewSection faqs={faqs} />
      <LocationSection settings={settings} mapsUrl={mapsUrl} whatsappUrl={whatsappUrl} />
      <ClosingCtaSection />
    </>
  );
}