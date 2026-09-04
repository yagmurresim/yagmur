-- ─── Migration 007: Explicit Data API GRANT matrix ───────────────────────────
-- RLS decides WHICH rows; GRANT decides WHETHER the role can attempt the
-- command at all. Fresh Supabase projects (from 2026-05-30) no longer auto-open
-- public tables to the Data API. This file makes access independent of project
-- creation defaults.
--
-- Public forms insert via service_role (src/server/actions/apply.ts), so anon
-- does NOT get INSERT on applications / contact_messages.
--
-- Safe to re-run.

BEGIN;

-- ─── 1. Authorization primitive ──────────────────────────────────────────────
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ─── 2. Schema ───────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ─── 3. Public-readable content (anon SELECT; RLS still filters) ─────────────
GRANT SELECT ON
  public.site_settings,
  public.homepage_content,
  public.programs,
  public.instructors,
  public.program_instructors,
  public.faqs,
  public.media_assets,
  public.gallery_items,
  public.events,
  public.posts,
  public.legal_pages
TO anon;

-- ─── 4. Authenticated CRUD on admin-managed tables ───────────────────────────
-- RLS policies require public.is_admin() for writes and for private reads.
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.site_settings,
  public.homepage_content,
  public.programs,
  public.instructors,
  public.program_instructors,
  public.faqs,
  public.applications,
  public.application_notes,
  public.contact_messages,
  public.media_assets,
  public.gallery_items,
  public.events,
  public.posts,
  public.legal_pages
TO authenticated;

-- ─── 5. profiles: read own row; write only display_name ──────────────────────
GRANT SELECT ON public.profiles TO authenticated;
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;
REVOKE INSERT, DELETE ON public.profiles FROM authenticated, anon;
REVOKE ALL ON public.profiles FROM anon;

-- ─── 6. service_role (server actions that must bypass RLS, e.g. apply.ts) ────
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- authenticated does not get sequence grants: current tables use uuid_generate_v4().
-- If a future table uses a sequence, grant that sequence in the same migration.

-- 007 covers tables that exist at apply time only. New Data API tables MUST
-- ship GRANT + RLS in the same forward migration. Do not rely on ALTER DEFAULT
-- PRIVILEGES.

COMMIT;
