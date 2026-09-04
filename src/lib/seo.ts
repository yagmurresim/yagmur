import type { Metadata } from "next";
import type { Program } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface BuildMetadataOptions {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
  ogImage?: string;
}

export function buildMetadata({
  title,
  description,
  canonical,
  noindex = false,
  ogImage,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}${canonical}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: "Yağmur Sanat Akademisi",
      locale: "tr_TR",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildProgramMetadata(program: Program): Metadata {
  const SLUG_TITLES: Record<string, string> = {
    "resim-kursu": "Karşıyaka Resim Kursu | Yağmur Sanat Akademisi",
    "piyano-kursu": "Karşıyaka Piyano Kursu | Yağmur Sanat Akademisi",
    "keman-kursu": "Karşıyaka Keman Kursu | Yağmur Sanat Akademisi",
    "gitar-kursu": "Karşıyaka Gitar Kursu | Yağmur Sanat Akademisi",
  };

  const title =
    program.seo_title ??
    SLUG_TITLES[program.slug] ??
    `${program.name} Kursu | Yağmur Sanat Akademisi`;

  const description =
    program.seo_description ??
    program.short_description ??
    `Karşıyaka'da ${program.name.toLowerCase()} eğitimi. MEB onaylı. Ücretsiz tanışma dersi.`;

  return buildMetadata({
    title,
    description,
    canonical: `/egitimler/${program.slug}`,
  });
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Yağmur Sanat Akademisi",
  legalName: "Özel Yağmur Sanat Akademisi Kursu",
  url: SITE_URL,
  telephone: "+905545959575",
  address: {
    "@type": "PostalAddress",
    streetAddress: "İmbatlı Mahallesi, Yeni Girne No:205/B",
    addressLocality: "Karşıyaka",
    addressRegion: "İzmir",
    addressCountry: "TR",
  },
  sameAs: ["https://www.instagram.com/yagmursanatakademi/"],
  areaServed: ["Karşıyaka", "İzmir"],
};