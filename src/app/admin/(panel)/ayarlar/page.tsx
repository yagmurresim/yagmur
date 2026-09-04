import type { Metadata } from "next";
import { getSiteSettings, getDefaultSettings } from "@/server/queries/settings";
import { SettingsForm } from "@/features/admin/SettingsForm";

export const metadata: Metadata = { title: "Ayarlar" };

export default async function AdminAyarlarPage() {
  const settings = (await getSiteSettings().catch(() => null)) ?? getDefaultSettings();

  return (
    <div className="max-w-[760px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Site Ayarları</h1>
        <p className="text-ink-muted mt-1">İletişim bilgileri, adres ve genel ayarlar</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}