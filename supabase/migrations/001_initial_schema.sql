-- ─── 001_initial_schema ───────────────────────────────────────────────────────
-- Apply ONCE on a fresh database. Do not re-run on an existing project:
-- CREATE POLICY statements will collide.
--
-- Fresh install: apply 001 → 002 → 003 → 004 → 005 → 006 → 007 in one sitting
-- before enabling signup or deploying the app. Write policies here already
-- require public.is_admin(); 003–005 are idempotent hardenings.
--
-- Existing DB that already ran an older 001: skip this file, apply only
-- the missing forward migrations (003+).

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Admin',
  role TEXT NOT NULL CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;

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

-- ─── Site settings (singleton) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT NOT NULL DEFAULT 'Yağmur Sanat Akademisi',
  legal_name TEXT DEFAULT 'Özel Yağmur Sanat Akademisi Kursu',
  phone_display TEXT NOT NULL DEFAULT '0554 595 95 75',
  phone_e164 TEXT NOT NULL DEFAULT '+905545959575',
  whatsapp_e164 TEXT NOT NULL DEFAULT '+905545959575',
  instagram_handle TEXT NOT NULL DEFAULT '@yagmursanatakademi',
  address_line TEXT NOT NULL DEFAULT 'İmbatlı Mahallesi, Yeni Girne No:205/B',
  district TEXT NOT NULL DEFAULT 'Karşıyaka',
  city TEXT NOT NULL DEFAULT 'İzmir',
  postal_code TEXT,
  maps_url TEXT,
  meb_display_text TEXT NOT NULL DEFAULT 'MEB Onaylı Kurs',
  default_seo_title TEXT DEFAULT 'Yağmur Sanat Akademisi | Karşıyaka Resim ve Müzik Kursu',
  default_seo_description TEXT DEFAULT 'Karşıyaka''da resim, piyano, keman ve gitar eğitimi. MEB onaylı kurs. 4 yaştan yetişkinlere.',
  show_instructors BOOLEAN NOT NULL DEFAULT FALSE,
  show_gallery BOOLEAN NOT NULL DEFAULT FALSE,
  show_events BOOLEAN NOT NULL DEFAULT FALSE,
  show_announcements BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "settings_admin_write" ON site_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Homepage content (singleton) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_eyebrow TEXT DEFAULT 'MEB Onaylı Kurs · Karşıyaka, İzmir',
  hero_title TEXT DEFAULT 'Sanatla kendini keşfet.',
  hero_body TEXT DEFAULT 'Resim, piyano, keman ve gitar eğitimleri. 4 yaştan yetişkinlere.',
  primary_cta_label TEXT DEFAULT 'Ücretsiz Tanışma Dersine Başvur',
  secondary_cta_label TEXT DEFAULT 'Eğitimleri Keşfet',
  academy_heading TEXT DEFAULT 'Sanat ve disiplin bir arada.',
  academy_body TEXT DEFAULT '',
  trust_heading TEXT DEFAULT 'Neden Yağmur Sanat?',
  closing_cta_heading TEXT DEFAULT 'İlk adımı atmak çok kolay.',
  closing_cta_body TEXT DEFAULT 'Ücretsiz tanışma dersi için kısa bir form doldurun.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "homepage_public_read" ON homepage_content
  FOR SELECT USING (TRUE);

CREATE POLICY "homepage_admin_write" ON homepage_content
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Programs ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  intro TEXT,
  audience_description TEXT,
  minimum_age INTEGER CHECK (minimum_age IS NULL OR (minimum_age >= 0 AND minimum_age <= 100)),
  maximum_age INTEGER CHECK (maximum_age IS NULL OR (maximum_age >= 0 AND maximum_age <= 100)),
  lesson_formats TEXT[] NOT NULL DEFAULT '{}'
    CHECK (lesson_formats <@ ARRAY['individual', 'group']::text[]),
  CONSTRAINT programs_age_range_check CHECK (
    minimum_age IS NULL OR maximum_age IS NULL OR minimum_age <= maximum_age
  ),
  level_information TEXT,
  approach TEXT,
  learning_outcomes TEXT[],
  duration_text TEXT,
  preparation_information TEXT,
  certificate_information TEXT,
  hero_media_id UUID,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  og_media_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "programs_public_read" ON programs
  FOR SELECT USING (status = 'published');

CREATE POLICY "programs_admin_all" ON programs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Instructors ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  short_bio TEXT,
  bio TEXT,
  portrait_media_id UUID,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "instructors_public_read" ON instructors
  FOR SELECT USING (status = 'published');

CREATE POLICY "instructors_admin_all" ON instructors
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Program instructors ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS program_instructors (
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  PRIMARY KEY (program_id, instructor_id)
);

ALTER TABLE program_instructors ENABLE ROW LEVEL SECURITY;

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

-- ─── FAQs ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faqs_public_read" ON faqs
  FOR SELECT USING (status = 'published');

CREATE POLICY "faqs_admin_all" ON faqs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Applications (PRIVATE) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  student_age INTEGER NOT NULL CHECK (student_age >= 4),
  parent_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  current_level TEXT,
  preferred_contact_channel TEXT CHECK (preferred_contact_channel IN ('whatsapp', 'phone')),
  preferred_contact_time TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'INTRO_PLANNED', 'ENROLLED', 'CLOSED')),
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  kvkk_consent BOOLEAN NOT NULL DEFAULT FALSE,
  kvkk_version TEXT NOT NULL DEFAULT '1.0',
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_to UUID REFERENCES auth.users(id),
  last_contacted_at TIMESTAMPTZ,
  next_action_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- NO public read access — only real admins
CREATE POLICY "applications_admin_all" ON applications
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Application notes (PRIVATE) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS application_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_admin_all" ON application_notes
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Contact messages (PRIVATE) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  kvkk_consent BOOLEAN NOT NULL DEFAULT FALSE,
  kvkk_version TEXT NOT NULL DEFAULT '1.0',
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- NO public read access
CREATE POLICY "contact_admin_all" ON contact_messages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Media assets ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  focal_x REAL,
  focal_y REAL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Public-read policy is created at the end of this file, after gallery/events/posts exist.
CREATE POLICY "media_admin_write" ON media_assets
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Gallery items ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
  title TEXT,
  caption TEXT,
  category TEXT NOT NULL DEFAULT 'academy' CHECK (category IN ('academy', 'classroom', 'student_work', 'event')),
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_read" ON gallery_items FOR SELECT USING (status = 'published');
CREATE POLICY "gallery_admin_all" ON gallery_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Events ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  location_text TEXT,
  cover_media_id UUID REFERENCES media_assets(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "events_admin_all" ON events
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Posts (announcements/blog) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_media_id UUID REFERENCES media_assets(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "posts_admin_all" ON posts
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Legal pages ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "legal_public_read" ON legal_pages FOR SELECT USING (status = 'published');
CREATE POLICY "legal_admin_all" ON legal_pages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- media_assets public read — after all referencing tables exist
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

COMMIT;