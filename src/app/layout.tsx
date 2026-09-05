import type { Metadata } from "next";
import { Instrument_Serif, Figtree } from "next/font/google";
import { Toaster } from "sonner";
import "@/styles/globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  other: {
    "theme-color": "#f7f3ea",
  },
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
    <html
      lang="tr"
      className={`${instrument.variable} ${figtree.variable}`}
      style={{ backgroundColor: "#f7f3ea" }}
    >
      <body className="studio-ground" style={{ backgroundColor: "#f7f3ea" }}>
        <a href="#main-content" className="skip-link">
          İçeriğe geç
        </a>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
