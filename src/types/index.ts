export type ApplicationStatus =
  | "NEW"
  | "CONTACTED"
  | "INTRO_PLANNED"
  | "ENROLLED"
  | "CLOSED";

export interface SiteSettings {
  id: string;
  brand_name: string;
  legal_name: string | null;
  phone_display: string;
  phone_e164: string;
  whatsapp_e164: string;
  instagram_handle: string;
  address_line: string;
  district: string;
  city: string;
  postal_code: string | null;
  maps_url: string | null;
  meb_display_text: string;
  default_seo_title: string | null;
  default_seo_description: string | null;
  show_instructors: boolean;
  show_gallery: boolean;
  show_events: boolean;
  show_announcements: boolean;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  intro: string | null;
  audience_description: string | null;
  minimum_age: number | null;
  maximum_age: number | null;
  lesson_formats: string[];
  level_information: string | null;
  approach: string | null;
  learning_outcomes: string[] | null;
  duration_text: string | null;
  preparation_information: string | null;
  certificate_information: string | null;
  hero_media_id: string | null;
  status: "draft" | "published" | "archived";
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_media_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Instructor {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  short_bio: string | null;
  bio: string | null;
  portrait_media_id: string | null;
  status: "draft" | "published" | "archived";
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: string;
  program_id: string | null;
  question: string;
  answer: string;
  status: "draft" | "published";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type LeadSourceChannel =
  | "whatsapp"
  | "phone"
  | "instagram"
  | "walk_in"
  | "web"
  | "other";

export interface Application {
  id: string;
  student_name: string;
  student_age: number | null;
  parent_name: string | null;
  phone: string;
  email: string | null;
  program_id: string | null;
  current_level: string | null;
  preferred_contact_channel: string | null;
  preferred_contact_time: string | null;
  message: string | null;
  status: ApplicationStatus;
  source_page: string | null;
  source_channel: LeadSourceChannel;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  kvkk_consent: boolean;
  kvkk_version: string;
  consented_at: string;
  assigned_to: string | null;
  last_contacted_at: string | null;
  next_action_at: string | null;
  intro_slot_id: string | null;
  intro_occurrence_at: string | null;
  created_at: string;
  updated_at: string;
  program_name?: string;
}

export interface IntroSlot {
  id: string;
  program_id: string;
  weekday: number;
  start_time: string;
  duration_minutes: number;
  lesson_format: "group" | "individual";
  age_min: number;
  age_max: number | null;
  capacity: number;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  program_name?: string;
  program_slug?: string;
}

export interface IntroOccurrence {
  slot: IntroSlot;
  startsAt: string;
  remaining: number;
}

export interface ApplicationNote {
  id: string;
  application_id: string;
  author_id: string;
  note: string;
  created_at: string;
  author_name?: string;
}

export interface MediaAsset {
  id: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  focal_x: number | null;
  focal_y: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  status: "unread" | "read" | "archived";
  kvkk_consent: boolean;
  kvkk_version: string;
  consented_at: string;
  created_at: string;
  updated_at: string;
}