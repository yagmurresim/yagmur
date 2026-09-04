import { createClient } from "@/lib/supabase/server";
import type { Application, ApplicationNote } from "@/types";

export async function getApplicationsAdmin(): Promise<Application[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      program:programs(name)
    `)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);

  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    ...row,
    program_name: (row.program as { name: string } | null)?.name ?? null,
    source_channel: row.source_channel ?? "whatsapp",
  })) as Application[];
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      program:programs(name)
    `)
    .eq("id", id)
    .single();

  if (error) return null;
  const row = data as Record<string, unknown>;
  return {
    ...row,
    program_name: (row.program as { name: string } | null)?.name ?? null,
    source_channel: row.source_channel ?? "whatsapp",
  } as Application;
}

export async function getApplicationNotes(applicationId: string): Promise<ApplicationNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("application_notes")
    .select(`
      *,
      author:profiles(display_name)
    `)
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true });

  if (error) return [];
  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    ...row,
    author_name: (row.author as { display_name: string } | null)?.display_name ?? "Admin",
  })) as ApplicationNote[];
}

export async function getApplicationStats(): Promise<{
  NEW: number;
  CONTACTED: number;
  INTRO_PLANNED: number;
  ENROLLED: number;
  CLOSED: number;
  total: number;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("status");

  if (error) throw new Error(error.message);

  const counts = { NEW: 0, CONTACTED: 0, INTRO_PLANNED: 0, ENROLLED: 0, CLOSED: 0, total: 0 };
  for (const row of data ?? []) {
    const s = row.status as keyof typeof counts;
    if (s in counts) counts[s]++;
    counts.total++;
  }
  return counts;
}