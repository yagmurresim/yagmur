-- ─── Migration 006: Private storage + leftover CHECKs ─────────────────────────
-- Unpublished uploads must not be world-readable via a public bucket URL.
-- site-media is private; storage.objects RLS gates download:
--   published-linked asset → anon SELECT
--   everything else        → admin only
-- Serving published files from a private bucket uses createSignedUrl (or
-- storage download with a policy that allows the caller). The public URL
-- form /storage/v1/object/public/... will 400 by design.
--
-- Safe to re-run.

BEGIN;

-- ─── 1. Private bucket ───────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  FALSE,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = FALSE,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ─── 2. Helper: is this storage object a published-content asset? ────────────
-- media_assets.storage_path MUST equal storage.objects.name (the key inside
-- the bucket, e.g. 'instructors/ali.jpg' — not 'site-media/instructors/ali.jpg').
CREATE OR REPLACE FUNCTION public.is_published_media_path(object_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.media_assets ma
    WHERE ma.storage_path = object_name
      AND (
        EXISTS (SELECT 1 FROM programs WHERE hero_media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM programs WHERE og_media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM instructors WHERE portrait_media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM gallery_items WHERE media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM events WHERE cover_media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM posts WHERE cover_media_id = ma.id AND status = 'published')
      )
  );
$$;

REVOKE ALL ON FUNCTION public.is_published_media_path(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_published_media_path(text) TO anon, authenticated;

-- ─── 3. storage.objects policies for site-media ──────────────────────────────
DROP POLICY IF EXISTS "site_media_select" ON storage.objects;
DROP POLICY IF EXISTS "site_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "site_media_update" ON storage.objects;
DROP POLICY IF EXISTS "site_media_delete" ON storage.objects;

CREATE POLICY "site_media_select" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'site-media'
    AND (public.is_admin() OR public.is_published_media_path(name))
  );

CREATE POLICY "site_media_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'site-media'
    AND public.is_admin()
  );

CREATE POLICY "site_media_update" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'site-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

CREATE POLICY "site_media_delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'site-media' AND public.is_admin());

-- ─── 4. lesson_formats enum CHECK (forward-safe if 001 already ran) ──────────
ALTER TABLE programs
  DROP CONSTRAINT IF EXISTS programs_lesson_formats_check;

ALTER TABLE programs
  ADD CONSTRAINT programs_lesson_formats_check
  CHECK (lesson_formats <@ ARRAY['individual', 'group']::text[]);

ALTER TABLE programs
  DROP CONSTRAINT IF EXISTS programs_minimum_age_check;
ALTER TABLE programs
  ADD CONSTRAINT programs_minimum_age_check
  CHECK (minimum_age IS NULL OR (minimum_age >= 0 AND minimum_age <= 100));

ALTER TABLE programs
  DROP CONSTRAINT IF EXISTS programs_maximum_age_check;
ALTER TABLE programs
  ADD CONSTRAINT programs_maximum_age_check
  CHECK (maximum_age IS NULL OR (maximum_age >= 0 AND maximum_age <= 100));

ALTER TABLE programs
  DROP CONSTRAINT IF EXISTS programs_age_range_check;
ALTER TABLE programs
  ADD CONSTRAINT programs_age_range_check
  CHECK (
    minimum_age IS NULL
    OR maximum_age IS NULL
    OR minimum_age <= maximum_age
  );

COMMIT;
