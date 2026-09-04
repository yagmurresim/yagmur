import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import type { Program } from "@/types";

export const getPublishedPrograms = unstable_cache(
  async (): Promise<Program[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("[programs] Failed to load:", error.message);
        return [];
      }
      return (data ?? []) as Program[];
    } catch {
      return [];
    }
  },
  ["published-programs"],
  { revalidate: 300, tags: ["programs"] }
);

export const getProgramBySlug = unstable_cache(
  async (slug: string): Promise<Program | null> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) return null;
      return data as Program;
    } catch {
      return null;
    }
  },
  ["program-by-slug"],
  { revalidate: 300, tags: ["programs"] }
);

export async function getAllProgramsAdmin(): Promise<Program[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Program[];
}

export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Program;
}