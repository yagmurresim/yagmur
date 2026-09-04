import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
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
    "Karşıyaka'da resim, piyano, keman ve gitar eğitimi. MEB onaylı kurs. 4 yaştan yetişkinlere. Ücretsiz tanışma dersi için WhatsApp'tan yazın.",
  openGraph: {
    siteName: "Yağmur Sanat Akademisi",
    locale: "tr_TR",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF9F7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${ibmPlexSans.variable} bg-paper`}
    >
      <body className="bg-paper text-ink">
        <a href="#main-content" className="skip-link">
          İçeriğe geç
        </a>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
