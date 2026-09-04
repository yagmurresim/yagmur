"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateSiteSettings } from "@/server/actions/admin";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/types";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings: s }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState({
    brand_name: s.brand_name ?? "",
    legal_name: s.legal_name ?? "",
    phone_display: s.phone_display ?? "",
    phone_e164: s.phone_e164 ?? "",
    whatsapp_e164: s.whatsapp_e164 ?? "",
    instagram_handle: s.instagram_handle ?? "",
    address_line: s.address_line ?? "",
    district: s.district ?? "",
    city: s.city ?? "",
    maps_url: s.maps_url ?? "",
    meb_display_text: s.meb_display_text ?? "",
    show_instructors: s.show_instructors ?? false,
    show_gallery: s.show_gallery ?? false,
    show_events: s.show_events ?? false,
    show_announcements: s.show_announcements ?? false,
  });

  const set = (key: keyof typeof values, val: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateSiteSettings(values);
        toast.success("Ayarlar kaydedildi.");
      } catch {
        toast.error("Ayarlar kaydedilemedi.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Brand */}
      <section className="bg-white border border-line rounded-[10px] p-6">
        <h2 className="font-medium text-ink mb-5">Marka Bilgileri</h2>
        <div className="flex flex-col gap-4">
          <FormField
            label="Marka Adı"
            value={values.brand_name}
            onChange={(e) => set("brand_name", e.target.value)}
          />
          <FormField
            label="Resmî Kurum Adı"
            value={values.legal_name}
            onChange={(e) => set("legal_name", e.target.value)}
          />
          <FormField
            label="MEB Gösterim Metni"
            value={values.meb_display_text}
            onChange={(e) => set("meb_display_text", e.target.value)}
            hint='Örn: "MEB Onaylı Kurs"'
          />
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white border border-line rounded-[10px] p-6">
        <h2 className="font-medium text-ink mb-5">İletişim Bilgileri</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="Telefon (Görünür)"
            value={values.phone_display}
            onChange={(e) => set("phone_display", e.target.value)}
            placeholder="0554 595 95 75"
          />
          <FormField
            label="Telefon (E.164)"
            value={values.phone_e164}
            onChange={(e) => set("phone_e164", e.target.value)}
            placeholder="+905545959575"
          />
          <FormField
            label="WhatsApp (E.164)"
            value={values.whatsapp_e164}
            onChange={(e) => set("whatsapp_e164", e.target.value)}
            placeholder="+905545959575"
          />
          <FormField
            label="Instagram"
            value={values.instagram_handle}
            onChange={(e) => set("instagram_handle", e.target.value)}
            placeholder="@yagmursanatakademi"
          />
        </div>
      </section>

      {/* Address */}
      <section className="bg-white border border-line rounded-[10px] p-6">
        <h2 className="font-medium text-ink mb-1">Adres</h2>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-[6px] px-3 py-2 mb-5 text-[12px]">
          ⚠️ Production lansmanı öncesinde adres, Google Business Profile ile doğrulanmalıdır.
        </p>
        <div className="flex flex-col gap-4">
          <FormField
            label="Adres Satırı"
            value={values.address_line}
            onChange={(e) => set("address_line", e.target.value)}
            placeholder="İmbatlı Mahallesi, Yeni Girne No:205/B"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="İlçe"
              value={values.district}
              onChange={(e) => set("district", e.target.value)}
              placeholder="Karşıyaka"
            />
            <FormField
              label="Şehir"
              value={values.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="İzmir"
            />
          </div>
          <FormField
            label="Google Maps URL"
            value={values.maps_url}
            onChange={(e) => set("maps_url", e.target.value)}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </section>

      {/* Feature flags */}
      <section className="bg-white border border-line rounded-[10px] p-6">
        <h2 className="font-medium text-ink mb-5">İçerik Modülleri</h2>
        <div className="flex flex-col gap-3">
          {[
            { key: "show_instructors" as const, label: "Eğitmenler bölümünü göster" },
            { key: "show_gallery" as const, label: "Galeri bölümünü göster" },
            { key: "show_events" as const, label: "Etkinlikler bölümünü göster" },
            { key: "show_announcements" as const, label: "Duyurular bölümünü göster" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={values[key] as boolean}
                onChange={(e) => set(key, e.target.checked)}
                className="h-4 w-4 rounded border-line text-violet focus:ring-violet"
              />
              <span className="text-sm text-ink">{label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          variant="primary"
          size="lg"
          loading={isPending}
        >
          Ayarları Kaydet
        </Button>
      </div>
    </div>
  );
}