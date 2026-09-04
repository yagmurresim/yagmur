import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types";
import { unstable_cache } from "next/cache";

const DEFAULT_SETTINGS: SiteSettings = {
  id: "default",
  brand_name: "Yağmur Sanat Akademisi",
  legal_name: "Özel Yağmur Sanat Akademisi Kursu",
  phone_display: "0554 595 95 75",
  phone_e164: "+905545959575",
  whatsapp_e164: "+905545959575",
  instagram_handle: "@yagmursanatakademi",
  address_line: "İmbatlı Mahallesi, Yeni Girne No:205/B",
  district: "Karşıyaka",
  city: "İzmir",
  postal_code: null,
  maps_url: null,
  meb_display_text: "MEB Onaylı Kurs",
  default_seo_title: "Yağmur Sanat Akademisi | Karşıyaka Resim ve Müzik Kursu",
  default_seo_description:
    "Karşıyaka'da resim, piyano, keman ve gitar eğitimi. MEB onaylı kurs. 4 yaştan yetişkinlere.",
  show_instructors: false,
  show_gallery: false,
  show_events: false,
  show_announcements: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function getDefaultSettings(): SiteSettings {
  return DEFAULT_SETTINGS;
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        if (error.code !== "PGRST116") {
          console.error("[settings] Failed to load:", error.message);
        }
        return null;
      }
      return data as SiteSettings;
    } catch {
      return null;
    }
  },
  ["site-settings"],
  { revalidate: 300, tags: ["site-settings"] }
);