-- ─── Migration 005: Policy refinements ───────────────────────────────────────
-- Fixes two issues identified after 003/004:
--
-- 1. profiles UPDATE policy used a recursive self-reference (SELECT FROM profiles
--    inside the policy for profiles). Replaced with column-level GRANT so only
--    display_name can be updated by the authenticated user.
--
-- 2. media_assets public SELECT policy was missing two published-content paths:
--    instructors.portrait_media_id and programs.og_media_id.
--
-- Safe to re-run on an existing DB.

BEGIN;

-- ─── 1. profiles: column-level privilege instead of recursive WITH CHECK ──────
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_display_name_only" ON public.profiles;

-- Allow authenticated users to UPDATE their own profile row (any column).
-- Column-level GRANT below restricts which columns are actually writable.
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Remove all UPDATE privileges from authenticated role on profiles,
-- then grant only display_name. This prevents role self-escalation at
-- the database privilege level without any recursive policy logic.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;

-- updated_at is maintained by the application layer (server actions use
-- service-role client which bypasses RLS and column grants).

-- ─── 2. media_assets: add missing published-content asset paths ───────────────
DROP POLICY IF EXISTS "media_public_read" ON media_assets;

CREATE POLICY "media_public_read" ON media_assets
  FOR SELECT USING (
    -- published program hero image
    EXISTS (
      SELECT 1 FROM programs
      WHERE hero_media_id = media_assets.id
        AND status = 'published'
    )
    -- published program OG image
    OR EXISTS (
      SELECT 1 FROM programs
      WHERE og_media_id = media_assets.id
        AND status = 'published'
    )
    -- published gallery item
    OR EXISTS (
      SELECT 1 FROM gallery_items
      WHERE media_id = media_assets.id
        AND status = 'published'
    )
    -- published event cover
    OR EXISTS (
      SELECT 1 FROM events
      WHERE cover_media_id = media_assets.id
        AND status = 'published'
    )
    -- published post cover
    OR EXISTS (
      SELECT 1 FROM posts
      WHERE cover_media_id = media_assets.id
        AND status = 'published'
    )
    -- published instructor portrait
    OR EXISTS (
      SELECT 1 FROM instructors
      WHERE portrait_media_id = media_assets.id
        AND status = 'published'
    )
    -- admin can always read
    OR public.is_admin()
  );

COMMIT;