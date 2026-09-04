import { createClient } from "@/lib/supabase/server";
import type { Instructor } from "@/types";
import { unstable_cache } from "next/cache";

export const getPublishedInstructors = unstable_cache(
  async (): Promise<Instructor[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("instructors")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[instructors] Failed to load instructors:", error.message);
      return [];
    }
    return (data ?? []) as Instructor[];
  },
  ["published-instructors"],
  { revalidate: 300, tags: ["instructors"] }
);

export async function getAllInstructorsAdmin(): Promise<Instructor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instructors")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Instructor[];
}

export async function getInstructorById(id: string): Promise<Instructor | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instructors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Instructor;
}

export const getInstructorBySlug = unstable_cache(
  async (slug: string): Promise<Instructor | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("instructors")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("[instructors] Failed to load instructor:", error.message);
      }
      return null;
    }
    return data as Instructor;
  },
  ["instructor-by-slug"],
  { revalidate: 300, tags: ["instructors"] }
);