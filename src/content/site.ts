/**
 * Single source of truth for all public copy.
 * Every string here is fixed by the brand brief — do not paraphrase.
 */

export const BRAND = {
  name: "Yağmur Sanat Akademisi",
  legalName: "Özel Yağmur Sanat Akademisi Kursu",
  whatsappE164: "905545959575",
  phoneE164: "+905545959575",
  phoneDisplay: "0554 595 95 75",
  instagramHandle: "@yagmursanatakademi",
  instagramUrl: "https://www.instagram.com/yagmursanatakademi/",
  addressLine: "İmbatlı Mahallesi, Yeni Girne No:205/B",
  district: "Karşıyaka",
  city: "İzmir",
} as const;

export const ADDRESS_FULL = `${BRAND.addressLine}, ${BRAND.district} / ${BRAND.city}`;

export const MAPS_URL = `https://maps.google.com/?q=${encodeURIComponent(
  `${BRAND.legalName}, ${ADDRESS_FULL}`
)}`;

export const CTA_LABEL = "Ücretsiz Tanışma Dersi Oluşturun";
export const CTA_MICROCOPY = "Bu bir anında rezervasyon sistemi değildir.";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Merhaba, ücretsiz tanışma dersi hakkında bilgi almak istiyorum.";

export function whatsappUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${BRAND.whatsappE164}?text=${encodeURIComponent(message)}`;
}

export function programWhatsappUrl(programName: string): string {
  return whatsappUrl(
    `Merhaba, ${programName} eğitimi için ücretsiz tanışma dersi hakkında bilgi almak istiyorum.`
  );
}

export const TEL_URL = `tel:${BRAND.phoneE164}`;

export const NAV_LINKS = [
  { href: "/akademi", label: "Akademi" },
  { href: "/egitimler", label: "Eğitimler" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export interface Program {
  slug: string;
  name: string;
  format: string;
  formatLong: string;
  short: string;
  heading: string;
  body: string;
  checklist: string[];
  image: string;
  imageAlt: string;
}

export const PROGRAMS: Program[] = [
  {
    slug: "resim-kursu",
    name: "Resim",
    format: "Grup",
    formatLong: "Grup Eğitimi",
    short: "Gözlem, renk ve anlatım. Grup ortamında yaratıcı gelişim.",
    heading: "Gözlem, renk ve anlatım.",
    body: "Resim eğitiminde öğrenciler yalnızca teknik beceri kazanmaz; görmek, hissetmek ve ifade etmek öğrenir. Akademimizde grup eğitimi formatında yürütülen resim dersleri, her seviyeye ve her yaşa uygundur.",
    checklist: [
      "Grup eğitimi formatı",
      "4 yaştan yetişkinlere",
      "MEB onaylı eğitim programı",
      "Resmî sertifika",
      "Güzel Sanatlar hazırlık desteği",
      "Sergi fırsatları",
    ],
    image: "/images/resim.png",
    imageAlt: "Krem keten üzerinde fırçalar ve pigment paleti",
  },
  {
    slug: "piyano-kursu",
    name: "Piyano",
    format: "Birebir",
    formatLong: "Birebir Eğitim",
    short: "Birebir eğitimle nota okumadan yoruma.",
    heading: "Bireysel yolculuk, müzikal derinlik.",
    body: "Piyano eğitimi birebir formatında yürütülür. Nota okumadan yoruma, teknikten müzikaliteye uzanan yolculukta her öğrenci kendi temposunda ilerler.",
    checklist: [
      "Birebir eğitim",
      "4 yaştan yetişkinlere",
      "MEB onaylı eğitim programı",
      "Resmî sertifika",
      "Konser fırsatları",
    ],
    image: "/images/piyano.png",
    imageAlt: "Pencere ışığında piyano tuşları",
  },
  {
    slug: "keman-kursu",
    name: "Keman",
    format: "Birebir & Grup",
    formatLong: "Birebir & Grup",
    short: "Yay tekniğinden ifadeye. Birebir veya grup formatında.",
    heading: "Yay ile ses, ifade ile teknik.",
    body: "Keman eğitiminde her öğrenci için uygun format seçilir. Birebir veya grup ortamında yay tekniğinden müzikal ifadeye uzanan kapsamlı bir eğitim sunulur.",
    checklist: [
      "Birebir ve grup formatları",
      "Her seviyeye uygun",
      "MEB onaylı eğitim programı",
      "Resmî sertifika",
      "Konser fırsatları",
    ],
    image: "/images/keman.png",
    imageAlt: "Keten örtü üzerinde keman ve yay",
  },
  {
    slug: "gitar-kursu",
    name: "Gitar",
    format: "Birebir & Grup",
    formatLong: "Birebir & Grup",
    short: "Akustikten elektriğe. Birebir veya grup ortamında.",
    heading: "Telden melodiye, ritimsiz müzik olmaz.",
    body: "Gitar eğitimi birebir veya grup formatında sunulur. Akustik veya elektro gitar tercihine göre şekillenen dersler; teknik ve müzikaliteyi bir arada geliştirir.",
    checklist: [
      "Birebir ve grup formatları",
      "Her seviyeye uygun",
      "MEB onaylı eğitim programı",
      "Resmî sertifika",
      "Konser fırsatları",
    ],
    image: "/images/gitar.png",
    imageAlt: "Krem duvara yaslanmış klasik gitar",
  },
];

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}

export const RESIM_PREP = {
  heading: "Güzel Sanatlar Hazırlığı",
  body: "Güzel Sanatlar Liselerine ve Fakülteleri'ne hazırlanmak isteyen öğrenciler için destekleyici bir hazırlık programı sunulmaktadır. Portföy oluşturma ve sınav tekniği konularında rehberlik edilmektedir.",
};

export const TRUST_ROW = [
  "MEB Onaylı",
  "Resmî Sertifika",
  "4 Yaştan Yetişkinlere",
  "Ücretsiz Tanışma Dersi",
];

export const WHY_ITEMS = [
  {
    title: "MEB Onaylı Kurs",
    body: "Akademimiz Millî Eğitim Bakanlığı tarafından onaylıdır. Aldığınız eğitim ve sertifikalar resmî geçerliliğe sahiptir.",
  },
  {
    title: "Resmî Sertifika Programları",
    body: "Eğitimler MEB onaylı resmî programlar çerçevesinde yürütülmektedir.",
  },
  {
    title: "Deneyimli Eğitmen Kadrosu",
    body: "Alanında uzmanlaşmış eğitmenlerimiz her öğrenciye bireysel ilgi gösterir.",
  },
  {
    title: "Sergi ve Konser Fırsatları",
    body: "Öğrencilerimiz dönem boyunca gerçek sahne ve sergi deneyimi yaşar.",
  },
  {
    title: "Güzel Sanatlar Hazırlığı",
    body: "Güzel Sanatlar Liselerine ve Fakülteleri'ne hazırlanmak isteyen öğrenciler için destekleyici program sunulur.",
  },
];

export const PROCESS_STEPS = [
  {
    title: "Eğitiminizi seçin",
    body: "Resim, piyano, keman veya gitar — siz veya çocuğunuz için doğru alanı belirleyin.",
  },
  {
    title: "WhatsApp'tan yazın",
    body: "Form yok. Bize yazın; hangi eğitim ve yaş için düşündüğünüzü kısaca belirtin.",
  },
  {
    title: "Akademi sizi arasın",
    body: "Ekibimiz en kısa sürede sizinle iletişime geçer ve uygun bir zaman ayarlar.",
  },
];

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    id: "egitimler",
    question: "Hangi eğitimler veriliyor?",
    answer:
      "Yağmur Sanat Akademisi'nde resim, piyano, keman ve gitar eğitimleri verilmektedir.",
  },
  {
    id: "yas",
    question: "Hangi yaş gruplarına eğitim veriliyor?",
    answer:
      "Akademimizde 4 yaşından yetişkinlere kadar her yaş grubuna eğitim verilmektedir. Eğitim içeriği ve formatı yaşa ve seviyeye göre uyarlanmaktadır.",
  },
  {
    id: "tanisma",
    question: "Ücretsiz Tanışma Dersi nedir?",
    answer:
      "Ücretsiz Tanışma Dersi, siz veya çocuğunuzun akademimizi ve eğitim ortamımızı tanıması için sunduğumuz başlangıç fırsatıdır. Form doldurmanıza gerek yok. WhatsApp veya telefonla yazın; ekibimiz sizinle iletişime geçer ve uygun zamanı birlikte ayarlarız.",
  },
  {
    id: "nerede",
    question: "Yağmur Sanat Akademisi nerede?",
    answer:
      "Akademimiz İmbatlı Mahallesi, Yeni Girne No:205/B, Karşıyaka / İzmir adresinde bulunmaktadır.",
  },
  {
    id: "meb",
    question: "Akademi MEB onaylı mı?",
    answer:
      "Evet. Yağmur Sanat Akademisi, Millî Eğitim Bakanlığı onaylı bir kurs olarak faaliyet göstermektedir. Eğitim programları ve sertifikalarımız MEB onaylıdır.",
  },
  {
    id: "format",
    question: "Ders formatları nelerdir?",
    answer:
      "Resim eğitimi grup formatında verilmektedir. Piyano eğitimi birebir (bireysel) formattadır. Keman ve gitar eğitimleri ise hem birebir hem de grup formatında sunulmaktadır.",
  },
];

/** Home page shows a shorter set with abbreviated answers. */
export const FAQ_PREVIEW: Faq[] = [
  {
    id: "p-tanisma",
    question: "Ücretsiz Tanışma Dersi nedir?",
    answer:
      "Siz veya çocuğunuzun akademimizi tanıması için sunduğumuz başlangıç fırsatıdır. Form yok; WhatsApp veya telefonla yazın, ekibimiz sizinle iletişime geçer.",
  },
  {
    id: "p-yas",
    question: "Hangi yaş gruplarına eğitim veriliyor?",
    answer: "4 yaşından yetişkinlere kadar her yaş grubuna eğitim verilmektedir.",
  },
  {
    id: "p-format",
    question: "Ders formatları nelerdir?",
    answer:
      "Resim eğitimi grup formatında, piyano birebir formatında, keman ve gitar ise hem birebir hem grup formatında verilmektedir.",
  },
  {
    id: "p-meb",
    question: "Akademi MEB onaylı mı?",
    answer: "Evet. Millî Eğitim Bakanlığı onaylı kurs olarak faaliyet göstermekteyiz.",
  },
];

export const AKADEMI_TRUST = [
  "MEB Onaylı Kurs",
  "Resmî Sertifika ve Eğitim Programları",
  "Deneyimli Eğitmen Kadrosu",
  "Sergi ve Konser Fırsatları",
  "Güzel Sanatlar Liseleri ve Fakültelerine Hazırlık",
  "4 Yaştan Yetişkinlere",
];

export const AKADEMI_PARAGRAPHS = [
  "Sanat eğitimi yalnızca teknik bir beceri değildir; bireyin kendini ifade etmesinin, düşünmesinin ve büyümesinin bir yoludur. Yağmur Sanat Akademisi bu anlayışla kurulmuştur.",
  "Resim, piyano, keman ve gitar eğitimlerimiz hem teknik doğruluk hem de yaratıcı ifade üzerine inşa edilmiştir. Her öğrenci kendi temposunda, kendi sesiyle gelişir.",
  "MEB onaylı yapımız, öğrencilerimizin aldığı eğitimin resmî olarak belgelenmesini sağlar. Sergi ve konser etkinlikleri ise sahnede var olmanın özgüvenini kazandırır.",
];
