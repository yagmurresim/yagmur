import { buildWhatsAppUrl } from "@/lib/utils";

export const WHATSAPP_E164 = "+905545959575";
export const PHONE_E164 = "+905545959575";
export const PHONE_DISPLAY = "0554 595 95 75";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Merhaba, Yağmur Sanat Akademisi hakkında bilgi almak istiyorum.";

export function academyWhatsAppUrl(message = WHATSAPP_DEFAULT_MESSAGE): string {
  return buildWhatsAppUrl(WHATSAPP_E164, message);
}

export function academyTelUrl(): string {
  return `tel:${PHONE_E164}`;
}

export function introWhatsAppUrl(programName?: string): string {
  const message = programName
    ? `Merhaba, ${programName} eğitimi için ücretsiz tanışma dersi hakkında bilgi almak istiyorum.`
    : "Merhaba, ücretsiz tanışma dersi hakkında bilgi almak istiyorum.";
  return academyWhatsAppUrl(message);
}
