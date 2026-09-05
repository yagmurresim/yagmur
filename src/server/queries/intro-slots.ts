import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { monthEndHorizon, occurrencesInCurrentMonth } from "@/lib/intro-slots";
import type { IntroOccurrence, IntroSlot } from "@/types";

function mapSlot(row: Record<string, unknown>): IntroSlot {
  const program = row.program as { name?: string; slug?: string } | null;
  return {
    ...(row as unknown as IntroSlot),
    notes: (row.notes as string | null) ?? null,
    program_name: program?.name,
    program_slug: program?.slug,
  };
}

export async function getIntroSlotsAdmin(): Promise<IntroSlot[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("intro_slots")
    .select(`*, program:programs(name, slug)`)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as Array<Record<string, unknown>>).map(mapSlot);
}

export async function getIntroSlotById(id: string): Promise<IntroSlot | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("intro_slots")
    .select(`*, program:programs(name, slug)`)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapSlot(data as Record<string, unknown>);
}

export async function getOpenIntroOccurrences(): Promise<IntroOccurrence[]> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return [];
  }
  const { data, error } = await supabase
    .from("intro_slots")
    .select(
      `id, program_id, weekday, start_time, duration_minutes, age_min, age_max, capacity, active, created_at, updated_at, program:programs(name, slug)`
    )
    .eq("active", true)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("[intro-slots] load failed:", error.message);
    return [];
  }

  const slots = ((data ?? []) as Array<Record<string, unknown>>).map(mapSlot);
  const horizon = monthEndHorizon();

  const { data: bookings } = await supabase
    .from("applications")
    .select("intro_slot_id, intro_occurrence_at, status")
    .not("intro_slot_id", "is", null)
    .not("intro_occurrence_at", "is", null)
    .gte("intro_occurrence_at", new Date().toISOString())
    .lte("intro_occurrence_at", horizon.toISOString())
    .neq("status", "CLOSED");

  const taken = new Map<string, number>();
  for (const row of bookings ?? []) {
    if (!row.intro_slot_id || !row.intro_occurrence_at) continue;
    const key = `${row.intro_slot_id}|${row.intro_occurrence_at}`;
    taken.set(key, (taken.get(key) ?? 0) + 1);
  }

  const occurrences: IntroOccurrence[] = [];
  for (const slot of slots) {
    for (const starts of occurrencesInCurrentMonth(slot.weekday, slot.start_time)) {
      const iso = starts.toISOString();
      const remaining = slot.capacity - (taken.get(`${slot.id}|${iso}`) ?? 0);
      if (remaining <= 0) continue;
      occurrences.push({ slot, startsAt: iso, remaining });
    }
  }

  return occurrences.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
}
