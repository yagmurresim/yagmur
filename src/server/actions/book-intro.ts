"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkApplicationRateLimit, getClientIP } from "@/lib/security/rate-limit";
import { notifyAcademy } from "@/lib/notify";
import { formatSlotWhen, ageBandLabel, nextOccurrences } from "@/lib/intro-slots";
import { INTRO_KVKK_VERSION } from "@/lib/kvkk";

const BookingSchema = z.object({
  student_name: z.string().trim().min(2).max(120),
  student_age: z.coerce.number().int().min(4).max(80),
  parent_name: z.string().trim().max(120).optional(),
  phone: z.string().trim().min(10).max(30),
  slot_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  kvkk: z.literal(true),
  request_id: z.string().uuid(),
});
// kvkk_version is never taken from the client — INTRO_KVKK_VERSION only.

export type BookIntroResult =
  | { ok: true }
  | { ok: false; error: string };

const RPC_ERRORS: Record<string, string> = {
  occurrence_past: "Bu saat geçti. Başka bir saat seçin.",
  slot_inactive: "Bu saat artık açık değil.",
  occurrence_mismatch: "Seçilen saat ızgarayla uyuşmuyor. Sayfayı yenileyin.",
  age_mismatch: "Bu saat seçilen yaş için değil.",
  capacity_full: "Bu saat doldu. Başka bir saat seçin.",
  invalid_occurrence: "Seçilen saat geçersiz.",
  invalid_student_age: "Yaş gerekli.",
  invalid_student_name: "Ad soyad gerekli.",
  invalid_phone: "Telefon gerekli.",
  kvkk_consent_required: "KVKK onayı gerekli.",
  occurrence_too_far: "Bu saat henüz açık değil.",
  invalid_kvkk_version: "KVKK sürümü geçersiz.",
  invalid_request_id: "İstek geçersiz.",
  idempotency_conflict: "Bu istek başka bir kayıtla çakıştı. Sayfayı yenileyin.",
};

export async function bookIntroLesson(input: unknown): Promise<BookIntroResult> {
  const parsed = BookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formu kontrol edin." };
  }

  const hdrs = await headers();
  const ip = getClientIP({ headers: { get: (k) => hdrs.get(k) } }) ?? "unknown";
  const limit = await checkApplicationRateLimit(ip);
  if (!limit.success) {
    return { ok: false, error: "Çok fazla deneme. Biraz sonra tekrar deneyin veya WhatsApp’tan yazın." };
  }

  const startsAt = new Date(parsed.data.starts_at);
  if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() <= Date.now()) {
    return { ok: false, error: "Bu saat geçti. Başka bir saat seçin." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return { ok: false, error: "Şu an kayıt alınamıyor. WhatsApp’tan yazın." };
  }

  const { data: slot, error: slotError } = await supabase
    .from("intro_slots")
    .select(`id, weekday, start_time, age_min, age_max, program:programs(name)`)
    .eq("id", parsed.data.slot_id)
    .eq("active", true)
    .maybeSingle();

  if (slotError || !slot) {
    return { ok: false, error: "Bu saat artık açık değil." };
  }

  const allowed = nextOccurrences(slot.weekday, slot.start_time, 2).some(
    (d) => d.toISOString() === startsAt.toISOString()
  );
  if (!allowed) {
    return { ok: false, error: "Seçilen saat ızgarayla uyuşmuyor. Sayfayı yenileyin." };
  }

  const { data: bookingId, error: rpcError } = await supabase.rpc("book_intro_lesson", {
    p_student_name: parsed.data.student_name,
    p_student_age: parsed.data.student_age,
    p_parent_name: parsed.data.parent_name ?? "",
    p_phone: parsed.data.phone,
    p_slot_id: parsed.data.slot_id,
    p_occurrence: startsAt.toISOString(),
    p_kvkk_consent: true,
    p_kvkk_version: INTRO_KVKK_VERSION,
    p_request_id: parsed.data.request_id,
  });

  if (rpcError) {
    const code = Object.keys(RPC_ERRORS).find((k) => rpcError.message.includes(k));
    if (code) return { ok: false, error: RPC_ERRORS[code] };
    console.error("[book-intro] rpc failed:", rpcError.message);
    return { ok: false, error: "Kayıt alınamadı. WhatsApp’tan yazın." };
  }

  const programName =
    (slot.program as { name?: string } | null)?.name ?? "eğitim";
  const when = formatSlotWhen(startsAt.toISOString());
  const note = `Tanışma: ${programName} · ${when} · ${parsed.data.student_age} yaş`;

  if (typeof bookingId === "string") {
    await supabase.from("applications").update({ message: note }).eq("id", bookingId);
  }

  await notifyAcademy(
    `Yeni tanışma: ${programName} · ${when}`,
    [
      `${parsed.data.student_name}, ${parsed.data.student_age} yaş`,
      parsed.data.parent_name ? `Veli: ${parsed.data.parent_name}` : null,
      `Telefon: ${parsed.data.phone}`,
      `Eğitim: ${programName}`,
      `Saat: ${when}`,
      `Yaş aralığı: ${ageBandLabel(slot.age_min, slot.age_max)}`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return { ok: true };
}
