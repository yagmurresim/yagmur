"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/server/auth";
import type { ApplicationStatus, SiteSettings } from "@/types";

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const uuidSchema = z.string().uuid();
const applicationStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "INTRO_PLANNED",
  "ENROLLED",
  "CLOSED",
]);
const noteSchema = z.string().trim().min(1).max(2000);
const sourceChannelSchema = z.enum([
  "whatsapp",
  "phone",
  "instagram",
  "walk_in",
  "web",
  "other",
]);

function toIsoDateTime(v: unknown): string | null {
  if (typeof v !== "string" || v.trim() === "") return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

const optionalUrl = z.preprocess(
  emptyToNull,
  z.string().url().nullable().optional()
);
const optionalNullableString = (max: number) =>
  z.preprocess(emptyToNull, z.string().max(max).nullable().optional());

const LeadWriteSchema = z.object({
  student_name: z.string().trim().min(2).max(120),
  student_age: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  }, z.number().int().min(4).max(100).nullable().optional()),
  parent_name: optionalNullableString(120),
  phone: z.string().trim().min(10).max(30),
  email: optionalNullableString(120),
  program_id: z.preprocess(emptyToNull, z.string().uuid().nullable().optional()),
  message: optionalNullableString(2000),
  source_channel: sourceChannelSchema.default("whatsapp"),
  next_action_at: z.preprocess(toIsoDateTime, z.string().nullable().optional()),
});

const SiteSettingsSchema = z.object({
  brand_name: z.string().min(1).max(120).optional(),
  legal_name: optionalNullableString(200),
  phone_display: z.string().max(30).optional(),
  phone_e164: z.string().regex(/^\+\d{7,15}$/).optional(),
  whatsapp_e164: z.string().regex(/^\+\d{7,15}$/).optional(),
  instagram_handle: z.string().max(60).optional(),
  address_line: z.string().max(200).optional(),
  district: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  postal_code: optionalNullableString(20),
  maps_url: optionalUrl,
  meb_display_text: z.string().max(200).optional(),
  default_seo_title: optionalNullableString(70),
  default_seo_description: optionalNullableString(160),
  show_instructors: z.boolean().optional(),
  show_gallery: z.boolean().optional(),
  show_events: z.boolean().optional(),
  show_announcements: z.boolean().optional(),
});

const ProgramWriteSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  short_description: z.string().max(300).nullable().optional(),
  intro: z.string().max(2000).nullable().optional(),
  audience_description: z.string().max(500).nullable().optional(),
  minimum_age: z.number().int().min(0).max(100).nullable().optional(),
  maximum_age: z.number().int().min(0).max(100).nullable().optional(),
  lesson_formats: z.array(z.enum(["individual", "group"])).optional(),
  level_information: z.string().max(500).nullable().optional(),
  approach: z.string().max(1000).nullable().optional(),
  learning_outcomes: z.array(z.string()).nullable().optional(),
  duration_text: z.string().max(200).nullable().optional(),
  preparation_information: z.string().max(1000).nullable().optional(),
  certificate_information: z.string().max(500).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  sort_order: z.number().int().min(0).optional(),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(160).nullable().optional(),
}).refine(
  (d) =>
    d.minimum_age == null ||
    d.maximum_age == null ||
    d.minimum_age <= d.maximum_age,
  { message: "minimum_age cannot be greater than maximum_age", path: ["maximum_age"] }
);

const FaqWriteSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(3000),
  status: z.enum(["draft", "published"]),
  sort_order: z.number().int().min(0),
});

const InstructorWriteSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().max(200).nullable().optional(),
  short_bio: z.string().max(500).nullable().optional(),
  bio: z.string().max(5000).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]),
  sort_order: z.number().int().min(0),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(160).nullable().optional(),
});

function requireRow<T>(
  data: T | null,
  error: { message: string } | null,
  action: string
): T {
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`${action}: no matching row`);
  return data;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  await requireAdmin();
  const id = uuidSchema.parse(applicationId);
  const parsedStatus = applicationStatusSchema.parse(status);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .update({ status: parsedStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  requireRow(data, error, "updateApplicationStatus");

  if (parsedStatus === "CONTACTED") {
    await supabase
      .from("applications")
      .update({ last_contacted_at: new Date().toISOString() })
      .eq("id", id);
  }

  revalidatePath("/admin/basvurular");
  revalidatePath(`/admin/basvurular/${id}`);
  revalidatePath("/admin");
}

export async function addApplicationNote(
  applicationId: string,
  note: string
): Promise<void> {
  const user = await requireAdmin();
  const id = uuidSchema.parse(applicationId);
  const parsedNote = noteSchema.parse(note);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("application_notes")
    .insert({
      application_id: id,
      author_id: user.id,
      note: parsedNote,
    })
    .select("id")
    .maybeSingle();

  requireRow(data, error, "addApplicationNote");
  revalidatePath(`/admin/basvurular/${id}`);
}

export async function createLead(
  data: z.infer<typeof LeadWriteSchema>
): Promise<string> {
  await requireAdmin();
  const parsed = LeadWriteSchema.parse(data);
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: created, error } = await supabase
    .from("applications")
    .insert({
      student_name: parsed.student_name,
      student_age: parsed.student_age ?? null,
      parent_name: parsed.parent_name ?? null,
      phone: parsed.phone,
      email: parsed.email ?? null,
      program_id: parsed.program_id ?? null,
      message: parsed.message ?? null,
      source_channel: parsed.source_channel,
      source_page: "admin",
      status: "NEW",
      kvkk_consent: true,
      kvkk_version: "staff-1.0",
      consented_at: now,
      next_action_at: parsed.next_action_at ?? null,
    })
    .select("id")
    .maybeSingle();

  const row = requireRow(created, error, "createLead") as { id: string };
  revalidatePath("/admin/basvurular");
  revalidatePath("/admin");
  return row.id;
}

export async function updateLeadFollowUp(
  applicationId: string,
  nextActionAt: string | null
): Promise<void> {
  await requireAdmin();
  const id = uuidSchema.parse(applicationId);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .update({
      next_action_at: nextActionAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  requireRow(data, error, "updateLeadFollowUp");
  revalidatePath("/admin/basvurular");
  revalidatePath(`/admin/basvurular/${id}`);
}

export async function markLeadContacted(applicationId: string): Promise<void> {
  await requireAdmin();
  const id = uuidSchema.parse(applicationId);
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("applications")
    .update({
      status: "CONTACTED",
      last_contacted_at: now,
      updated_at: now,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  requireRow(data, error, "markLeadContacted");
  revalidatePath("/admin/basvurular");
  revalidatePath(`/admin/basvurular/${id}`);
  revalidatePath("/admin");
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<void> {
  await requireAdmin();
  const parsed = SiteSettingsSchema.parse(settings);
  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (readError) throw new Error(readError.message);
  if (!existing) throw new Error("site_settings singleton is missing");

  const { data, error } = await supabase
    .from("site_settings")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", existing.id)
    .select("id")
    .maybeSingle();
  requireRow(data, error, "updateSiteSettings");

  revalidatePath("/", "layout");
}

export async function updateProgram(
  id: string,
  data: z.infer<typeof ProgramWriteSchema>
): Promise<void> {
  await requireAdmin();
  const programId = uuidSchema.parse(id);
  const parsed = ProgramWriteSchema.parse(data);
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("programs")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", programId)
    .select("id")
    .maybeSingle();

  requireRow(row, error, "updateProgram");
  revalidatePath("/egitimler", "layout");
}

export async function createProgram(
  data: z.infer<typeof ProgramWriteSchema>
): Promise<string> {
  await requireAdmin();
  const parsed = ProgramWriteSchema.parse(data);
  const supabase = await createClient();

  const { data: created, error } = await supabase
    .from("programs")
    .insert(parsed)
    .select("id")
    .maybeSingle();

  const row = requireRow(created, error, "createProgram") as { id: string };
  revalidatePath("/egitimler", "layout");
  return row.id;
}

export async function upsertFaq(
  data: z.infer<typeof FaqWriteSchema>,
  id?: string
): Promise<void> {
  await requireAdmin();
  const parsed = FaqWriteSchema.parse(data);
  const faqId = id ? uuidSchema.parse(id) : undefined;
  const supabase = await createClient();

  if (faqId) {
    const { data: row, error } = await supabase
      .from("faqs")
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq("id", faqId)
      .select("id")
      .maybeSingle();
    requireRow(row, error, "upsertFaq");
  } else {
    const { data: row, error } = await supabase
      .from("faqs")
      .insert(parsed)
      .select("id")
      .maybeSingle();
    requireRow(row, error, "upsertFaq");
  }

  revalidatePath("/sss", "layout");
}

export async function deleteFaq(id: string): Promise<void> {
  await requireAdmin();
  const faqId = uuidSchema.parse(id);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", faqId)
    .select("id")
    .maybeSingle();
  requireRow(data, error, "deleteFaq");
  revalidatePath("/sss", "layout");
}

export async function createFaq(
  data: z.infer<typeof FaqWriteSchema>
): Promise<void> {
  await requireAdmin();
  const parsed = FaqWriteSchema.parse(data);
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("faqs")
    .insert(parsed)
    .select("id")
    .maybeSingle();
  requireRow(row, error, "createFaq");
  revalidatePath("/sss", "layout");
}

export async function updateFaq(
  id: string,
  data: z.infer<typeof FaqWriteSchema>
): Promise<void> {
  await requireAdmin();
  const faqId = uuidSchema.parse(id);
  const parsed = FaqWriteSchema.parse(data);
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("faqs")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", faqId)
    .select("id")
    .maybeSingle();
  requireRow(row, error, "updateFaq");
  revalidatePath("/sss", "layout");
}

export async function createInstructor(
  data: z.infer<typeof InstructorWriteSchema>
): Promise<void> {
  await requireAdmin();
  const parsed = InstructorWriteSchema.parse(data);
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("instructors")
    .insert(parsed)
    .select("id")
    .maybeSingle();
  requireRow(row, error, "createInstructor");
  revalidatePath("/egitmenler", "layout");
}

export async function updateInstructor(
  id: string,
  data: z.infer<typeof InstructorWriteSchema>
): Promise<void> {
  await requireAdmin();
  const instructorId = uuidSchema.parse(id);
  const parsed = InstructorWriteSchema.parse(data);
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("instructors")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", instructorId)
    .select("id")
    .maybeSingle();
  requireRow(row, error, "updateInstructor");
  revalidatePath("/egitmenler", "layout");
}

export async function deleteInstructor(id: string): Promise<void> {
  await requireAdmin();
  const instructorId = uuidSchema.parse(id);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instructors")
    .delete()
    .eq("id", instructorId)
    .select("id")
    .maybeSingle();
  requireRow(data, error, "deleteInstructor");
  revalidatePath("/egitmenler", "layout");
}

const IntroSlotWriteSchema = z.object({
  program_id: z.string().uuid(),
  weekday: z.coerce.number().int().min(1).max(7),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  duration_minutes: z.coerce.number().int().min(15).max(180).default(45),
  age_min: z.coerce.number().int().min(4).max(80),
  age_max: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  }, z.number().int().min(4).max(80).nullable()),
  capacity: z.coerce.number().int().min(1).max(20).default(1),
  active: z.boolean().default(true),
  notes: optionalNullableString(300),
}).refine(
  (d) => d.age_max == null || d.age_min <= d.age_max,
  { message: "Yaş aralığı ters.", path: ["age_max"] }
);

export async function createIntroSlot(
  data: z.infer<typeof IntroSlotWriteSchema>
): Promise<string> {
  await requireAdmin();
  const parsed = IntroSlotWriteSchema.parse(data);
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("intro_slots")
    .insert({
      program_id: parsed.program_id,
      weekday: parsed.weekday,
      start_time: parsed.start_time,
      duration_minutes: parsed.duration_minutes,
      age_min: parsed.age_min,
      age_max: parsed.age_max,
      capacity: parsed.capacity,
      active: parsed.active,
      notes: parsed.notes ?? null,
    })
    .select("id")
    .maybeSingle();
  const created = requireRow(row, error, "createIntroSlot") as { id: string };
  revalidatePath("/admin/saatler");
  revalidatePath("/ucretsiz-tanisma-dersi");
  return created.id;
}

export async function updateIntroSlot(
  id: string,
  data: z.infer<typeof IntroSlotWriteSchema>
): Promise<void> {
  await requireAdmin();
  const slotId = uuidSchema.parse(id);
  const parsed = IntroSlotWriteSchema.parse(data);
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("intro_slots")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", slotId)
    .select("id")
    .maybeSingle();
  requireRow(row, error, "updateIntroSlot");
  revalidatePath("/admin/saatler");
  revalidatePath("/ucretsiz-tanisma-dersi");
}

export async function deleteIntroSlot(id: string): Promise<void> {
  await requireAdmin();
  const slotId = uuidSchema.parse(id);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("intro_slots")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", slotId)
    .select("id")
    .maybeSingle();
  requireRow(data, error, "deleteIntroSlot");
  revalidatePath("/admin/saatler");
  revalidatePath("/ucretsiz-tanisma-dersi");
}