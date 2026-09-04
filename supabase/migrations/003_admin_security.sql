-- ─── Migration 003: Real admin role enforcement ───────────────────────────────
-- Idempotent hardening. Fresh installs already get is_admin() policies from 001;
-- this file still re-asserts them so existing DBs that ran an older 001 catch up.
-- Safe to re-run: uses CREATE OR REPLACE + DROP IF EXISTS.

BEGIN;

-- ─── 1. is_admin() helper ─────────────────────────────────────────────────────
-- SECURITY DEFINER so it can read profiles even when RLS is on.
-- search_path is pinned to prevent search_path injection.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ─── 2. Drop old weak policies ────────────────────────────────────────────────
-- site_settings
DROP POLICY IF EXISTS "settings_admin_write" ON site_settings;
-- homepage_content
DROP POLICY IF EXISTS "homepage_admin_write" ON homepage_content;
-- programs
DROP POLICY IF EXISTS "programs_admin_all" ON programs;
-- instructors
DROP POLICY IF EXISTS "instructors_admin_all" ON instructors;
-- program_instructors
DROP POLICY IF EXISTS "pi_admin_all" ON program_instructors;
-- faqs
DROP POLICY IF EXISTS "faqs_admin_all" ON faqs;
-- applications
DROP POLICY IF EXISTS "applications_admin_all" ON applications;
-- application_notes
DROP POLICY IF EXISTS "notes_admin_all" ON application_notes;
-- contact_messages
DROP POLICY IF EXISTS "contact_admin_all" ON contact_messages;
-- media_assets
DROP POLICY IF EXISTS "media_admin_write" ON media_assets;
DROP POLICY IF EXISTS "media_public_read" ON media_assets;
-- gallery_items
DROP POLICY IF EXISTS "gallery_admin_all" ON gallery_items;
-- events
DROP POLICY IF EXISTS "events_admin_all" ON events;
-- posts
DROP POLICY IF EXISTS "posts_admin_all" ON posts;
-- legal_pages
DROP POLICY IF EXISTS "legal_admin_all" ON legal_pages;
-- profiles
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- ─── 3. Re-create admin policies using is_admin() ─────────────────────────────

-- site_settings: public reads fine, writes need real admin
CREATE POLICY "settings_admin_write" ON site_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- homepage_content
CREATE POLICY "homepage_admin_write" ON homepage_content
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- programs
CREATE POLICY "programs_admin_all" ON programs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- instructors
CREATE POLICY "instructors_admin_all" ON instructors
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- program_instructors: public can read published links; admin can write
DROP POLICY IF EXISTS "pi_public_read" ON program_instructors;
CREATE POLICY "pi_public_read" ON program_instructors
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM programs p WHERE p.id = program_id AND p.status = 'published')
    AND
    EXISTS (SELECT 1 FROM instructors i WHERE i.id = instructor_id AND i.status = 'published')
  );
CREATE POLICY "pi_admin_all" ON program_instructors
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- faqs
CREATE POLICY "faqs_admin_all" ON faqs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- applications: PRIVATE — only real admins
CREATE POLICY "applications_admin_all" ON applications
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- application_notes: PRIVATE
CREATE POLICY "notes_admin_all" ON application_notes
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- contact_messages: PRIVATE
CREATE POLICY "contact_admin_all" ON contact_messages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- media_assets: published-only public read; admin full access
-- Covers all foreign key references to media_assets across the schema.
CREATE POLICY "media_public_read" ON media_assets
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM programs WHERE hero_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM programs WHERE og_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM instructors WHERE portrait_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM gallery_items WHERE media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM events WHERE cover_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM posts WHERE cover_media_id = media_assets.id AND status = 'published')
    OR public.is_admin()
  );
CREATE POLICY "media_admin_write" ON media_assets
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- gallery_items
CREATE POLICY "gallery_admin_all" ON gallery_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- events
CREATE POLICY "events_admin_all" ON events
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- posts
CREATE POLICY "posts_admin_all" ON posts
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- legal_pages
CREATE POLICY "legal_admin_all" ON legal_pages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── 4. profiles: prevent role self-escalation ────────────────────────────────
-- Strategy: allow row-level UPDATE for own row, but revoke column-level UPDATE
-- on everything except display_name. This avoids recursive policy self-reference.
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Revoke all UPDATE on profiles from authenticated users, then re-grant only
-- display_name. This is the correct way to enforce column-level immutability
-- without a self-referencing RLS subquery.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;

-- ─── 5. Enforce role constraints ──────────────────────────────────────────────
-- Only 'admin' is valid — no other roles exist yet.
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin'));

-- Remove dangerous DEFAULT 'admin' — role must be set explicitly on insert.
-- Existing rows are unaffected; future inserts via service_role require role arg.
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

COMMIT;