import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getIntroSlotsAdmin } from "@/server/queries/intro-slots";
import { ageBandLabel, formatTime, weekdayLabel } from "@/lib/intro-slots";

export const metadata: Metadata = { title: "Tanışma saatleri" };

export default async function AdminSaatlerPage() {
  let slots: Awaited<ReturnType<typeof getIntroSlotsAdmin>> = [];
  try {
    slots = await getIntroSlotsAdmin();
  } catch {
    // DB / migration not applied
  }

  return (
    <div className="max-w-[960px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Tanışma saatleri</h1>
          <p className="mt-1 text-ink-muted">
            Haftalık ızgara: grup 10–12 / 13–15 / 15–17 / 18–20, birebir müzik 10–20. Sitede bu ay görünür.
          </p>
        </div>
        <Link
          href="/admin/saatler/yeni"
          className="flex h-9 items-center gap-2 rounded-[8px] bg-plum px-4 text-sm font-medium text-white hover:bg-violet"
        >
          <Plus size={16} aria-hidden="true" />
          Saat ekle
        </Link>
      </div>

      {slots.length === 0 ? (
        <div className="rounded-[10px] border border-line bg-white py-16 text-center text-ink-muted">
          <p>Henüz saat yok. Önce 009 migration’ını uygulayın, sonra saat ekleyin.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-ink-muted uppercase">
                  Gün / saat
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-ink-muted uppercase">
                  Eğitim
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium tracking-wide text-ink-muted uppercase sm:table-cell">
                  Yaş
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-ink-muted uppercase">
                  Durum
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {slots.map((slot) => (
                <tr key={slot.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-ink">
                    {weekdayLabel(slot.weekday)} {formatTime(slot.start_time)}
                    <span className="ml-2 text-xs font-normal text-ink-muted">
                      {slot.lesson_format === "group" ? "Grup" : "Birebir"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{slot.program_name ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-ink-muted sm:table-cell">
                    {ageBandLabel(slot.age_min, slot.age_max)}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {slot.active ? (
                      <span className="text-green-600">Açık</span>
                    ) : (
                      <span className="text-ink-muted">Kapalı</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/saatler/${slot.id}`}
                      className="text-ink-muted hover:text-plum"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
