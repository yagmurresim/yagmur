import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import type { Faq } from "@/types";

export const getPublishedFaqs = unstable_cache(
  async (): Promise<Faq[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("[faqs] Failed to load:", error.message);
        return [];
      }
      return (data ?? []) as Faq[];
    } catch {
      return [];
    }
  },
  ["published-faqs"],
  { revalidate: 300, tags: ["faqs"] }
);

export async function getAllFaqsAdmin(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Faq[];
}

export async function getFaqById(id: string): Promise<Faq | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Faq;
}