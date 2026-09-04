import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Yağmur Sanat Akademisi",
    default: "Yağmur Sanat Akademisi | Karşıyaka Resim ve Müzik Kursu",
  },
  description:
    "Karşıyaka'da resim, piyano, keman ve gitar eğitimi. MEB onaylı kurs. 4 yaştan yetişkinlere. Ücretsiz tanışma dersi için başvurun.",
  openGraph: {
    siteName: "Yağmur Sanat Akademisi",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${ibmPlexSans.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          İçeriğe geç
        </a>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}