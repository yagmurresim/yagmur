-- ─── Migration 004: Singleton table enforcement + seed idempotency ────────────
-- Safe to re-run on a fresh DB.
-- On an existing DB: if site_settings or homepage_content has >1 rows from a
-- previous seed replay, this migration will RAISE an exception (fail-loud).
-- Manually delete the duplicate rows before re-running.

BEGIN;

-- ─── 0. Preflight: fail-loud before any constraint is added ───────────────────
DO $$
DECLARE
  dup_questions text;
  invalid_apps integer;
  invalid_contacts integer;
BEGIN
  IF (SELECT count(*) FROM site_settings) > 1 THEN
    RAISE EXCEPTION
      'site_settings has % rows — resolve duplicates before applying singleton constraint.',
      (SELECT count(*) FROM site_settings);
  END IF;

  IF (SELECT count(*) FROM homepage_content) > 1 THEN
    RAISE EXCEPTION
      'homepage_content has % rows — resolve duplicates before applying singleton constraint.',
      (SELECT count(*) FROM homepage_content);
  END IF;

  -- Canonical FAQ questions that 002 may have inserted more than once.
  -- Checked by question text so the message still works if seed_key is NULL
  -- (this transaction would roll back any later backfill on failure).
  SELECT string_agg(question, ', ' ORDER BY question)
    INTO dup_questions
  FROM (
    SELECT question
    FROM faqs
    WHERE question IN (
      'Hangi eğitimler veriliyor?',
      'Hangi yaş gruplarına eğitim veriliyor?',
      'Ücretsiz Tanışma Dersi nedir?',
      'Yağmur Sanat Akademisi nerede?',
      'Akademi MEB onaylı mı?',
      'Ders formatları nelerdir?'
    )
    GROUP BY question
    HAVING count(*) > 1
  ) d;

  IF dup_questions IS NOT NULL THEN
    RAISE EXCEPTION
      'Duplicate FAQ rows for: %. Keep one row per question, delete the extras, then re-run.',
      dup_questions;
  END IF;

  SELECT count(*) INTO invalid_apps
    FROM applications WHERE kvkk_consent IS DISTINCT FROM TRUE;
  SELECT count(*) INTO invalid_contacts
    FROM contact_messages WHERE kvkk_consent IS DISTINCT FROM TRUE;

  IF invalid_apps > 0 OR invalid_contacts > 0 THEN
    RAISE EXCEPTION
      'KVKK preflight failed: % applications and % contact_messages have kvkk_consent <> TRUE. Fix those rows before applying CHECK (kvkk_consent = TRUE).',
      invalid_apps, invalid_contacts;
  END IF;
END $$;

-- ─── 1. site_settings singleton constraint ────────────────────────────────────
-- Add a boolean column that can only be TRUE — enforces exactly one row.
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS singleton BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE site_settings
  DROP CONSTRAINT IF EXISTS site_settings_singleton_key;

ALTER TABLE site_settings
  ADD CONSTRAINT site_settings_singleton_key UNIQUE (singleton);

ALTER TABLE site_settings
  DROP CONSTRAINT IF EXISTS site_settings_singleton_check;

ALTER TABLE site_settings
  ADD CONSTRAINT site_settings_singleton_check CHECK (singleton = TRUE);

-- ─── 2. homepage_content singleton constraint ─────────────────────────────────
ALTER TABLE homepage_content
  ADD COLUMN IF NOT EXISTS singleton BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE homepage_content
  DROP CONSTRAINT IF EXISTS homepage_content_singleton_key;

ALTER TABLE homepage_content
  ADD CONSTRAINT homepage_content_singleton_key UNIQUE (singleton);

ALTER TABLE homepage_content
  DROP CONSTRAINT IF EXISTS homepage_content_singleton_check;

ALTER TABLE homepage_content
  ADD CONSTRAINT homepage_content_singleton_check CHECK (singleton = TRUE);

-- ─── 3. Seed site_settings — idempotent via singleton conflict ────────────────
INSERT INTO site_settings (
  singleton,
  brand_name, legal_name, phone_display, phone_e164, whatsapp_e164,
  instagram_handle, address_line, district, city, meb_display_text,
  default_seo_title, default_seo_description
) VALUES (
  TRUE,
  'Yağmur Sanat Akademisi',
  'Özel Yağmur Sanat Akademisi Kursu',
  '0554 595 95 75',
  '+905545959575',
  '+905545959575',
  '@yagmursanatakademi',
  'İmbatlı Mahallesi, Yeni Girne No:205/B',
  'Karşıyaka',
  'İzmir',
  'MEB Onaylı Kurs',
  'Yağmur Sanat Akademisi | Karşıyaka Resim ve Müzik Kursu',
  'Karşıyaka''da resim, piyano, keman ve gitar eğitimi. MEB onaylı kurs. 4 yaştan yetişkinlere.'
)
ON CONFLICT (singleton) DO NOTHING;

-- ─── 4. Seed homepage_content — idempotent ───────────────────────────────────
INSERT INTO homepage_content (
  singleton,
  hero_eyebrow, hero_title, hero_body, primary_cta_label, secondary_cta_label
) VALUES (
  TRUE,
  'MEB Onaylı Kurs · Karşıyaka, İzmir',
  'Sanatla kendini keşfet.',
  'Resim, piyano, keman ve gitar eğitimleri. 4 yaştan yetişkinlere.',
  'Ücretsiz Tanışma Dersine Başvur',
  'Eğitimleri Keşfet'
)
ON CONFLICT (singleton) DO NOTHING;

-- ─── 5. faqs — add seed_key for idempotent seed ─────────────────────────────
-- Step order matters:
--   a) add column (no constraint yet — backfill must run first)
--   b) backfill existing rows by exact question match
--   c) fail-loud if duplicates remain (from repeated 002 runs)
--   d) THEN add UNIQUE constraint — safe because duplicates are gone
--   e) idempotent INSERT for missing canonical rows

ALTER TABLE faqs
  ADD COLUMN IF NOT EXISTS seed_key TEXT;

-- (a) Backfill before adding unique constraint.
-- Each UPDATE only touches rows where seed_key IS NULL, so re-running is safe.
UPDATE faqs SET seed_key = 'faq-egitimler'
  WHERE seed_key IS NULL AND question = 'Hangi eğitimler veriliyor?';
UPDATE faqs SET seed_key = 'faq-yas'
  WHERE seed_key IS NULL AND question = 'Hangi yaş gruplarına eğitim veriliyor?';
UPDATE faqs SET seed_key = 'faq-tanisma'
  WHERE seed_key IS NULL AND question = 'Ücretsiz Tanışma Dersi nedir?';
UPDATE faqs SET seed_key = 'faq-nerede'
  WHERE seed_key IS NULL AND question = 'Yağmur Sanat Akademisi nerede?';
UPDATE faqs SET seed_key = 'faq-meb'
  WHERE seed_key IS NULL AND question = 'Akademi MEB onaylı mı?';
UPDATE faqs SET seed_key = 'faq-format'
  WHERE seed_key IS NULL AND question = 'Ders formatları nelerdir?';

-- (b) Fail-loud BEFORE adding unique constraint.
-- Canonical-question duplicates are already caught in the opening preflight.
-- This second check covers any remaining seed_key collisions after backfill.
DO $$
DECLARE
  dup_keys text;
BEGIN
  SELECT string_agg(seed_key, ', ' ORDER BY seed_key)
    INTO dup_keys
  FROM (
    SELECT seed_key FROM faqs
    WHERE seed_key IS NOT NULL
    GROUP BY seed_key HAVING count(*) > 1
  ) dupes;

  IF dup_keys IS NOT NULL THEN
    RAISE EXCEPTION
      'Duplicate FAQ seed_key values: %. Keep one row per key, delete the extras, then re-run.',
      dup_keys;
  END IF;
END $$;

-- (c) Now safe to add UNIQUE — no duplicates remain.
ALTER TABLE faqs
  DROP CONSTRAINT IF EXISTS faqs_seed_key_unique;

ALTER TABLE faqs
  ADD CONSTRAINT faqs_seed_key_unique UNIQUE (seed_key);

-- Now insert only missing canonical FAQs idempotently.
INSERT INTO faqs (seed_key, question, answer, status, sort_order) VALUES
('faq-egitimler',
 'Hangi eğitimler veriliyor?',
 'Yağmur Sanat Akademisi''nde resim, piyano, keman ve gitar eğitimleri verilmektedir.',
 'published', 1),
('faq-yas',
 'Hangi yaş gruplarına eğitim veriliyor?',
 'Akademimizde 4 yaşından yetişkinlere kadar her yaş grubuna eğitim verilmektedir. Eğitim içeriği ve formatı yaşa ve seviyeye göre uyarlanmaktadır.',
 'published', 2),
('faq-tanisma',
 'Ücretsiz Tanışma Dersi nedir?',
 'Ücretsiz Tanışma Dersi, siz veya çocuğunuzun akademimizi ve eğitim ortamımızı tanıması için sunduğumuz başlangıç fırsatıdır. Form doldurmanıza gerek yok. WhatsApp veya telefonla yazın; ekibimiz sizinle iletişime geçer ve uygun zamanı birlikte ayarlarız.',
 'published', 3),
('faq-nerede',
 'Yağmur Sanat Akademisi nerede?',
 'Akademimiz İmbatlı Mahallesi, Yeni Girne No:205/B, Karşıyaka / İzmir adresinde bulunmaktadır.',
 'published', 4),
('faq-meb',
 'Akademi MEB onaylı mı?',
 'Evet. Yağmur Sanat Akademisi, Millî Eğitim Bakanlığı onaylı bir kurs olarak faaliyet göstermektedir. Eğitim programları ve sertifikalarımız MEB onaylıdır.',
 'published', 5),
('faq-format',
 'Ders formatları nelerdir?',
 'Resim eğitimi grup formatında verilmektedir. Piyano eğitimi birebir formattadır. Keman ve gitar eğitimleri ise hem birebir hem de grup formatında sunulmaktadır.',
 'published', 6)
ON CONFLICT (seed_key) DO NOTHING;

-- ─── 6. KVKK DB-level constraints ────────────────────────────────────────────
-- Ensure consent is always explicitly TRUE — default FALSE is still useful for
-- the column default, but actual persisted records must have consent.
ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_kvkk_required,
  ADD CONSTRAINT applications_kvkk_required CHECK (kvkk_consent = TRUE);

ALTER TABLE contact_messages
  DROP CONSTRAINT IF EXISTS contact_kvkk_required,
  ADD CONSTRAINT contact_kvkk_required CHECK (kvkk_consent = TRUE);

-- ─── 7. Singleton rows cannot be deleted ─────────────────────────────────────
-- UNIQUE(singleton) + CHECK(singleton = TRUE) only guarantees "at most one
-- row". A trigger is required so the last (only) row cannot be removed.
CREATE OR REPLACE FUNCTION public.prevent_singleton_delete()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  RAISE EXCEPTION '% is a singleton table — the last row cannot be deleted.', TG_TABLE_NAME;
END;
$$;

DROP TRIGGER IF EXISTS site_settings_no_delete ON site_settings;
CREATE TRIGGER site_settings_no_delete
  BEFORE DELETE ON site_settings
  FOR EACH ROW
  EXECUTE PROCEDURE public.prevent_singleton_delete();

DROP TRIGGER IF EXISTS homepage_content_no_delete ON homepage_content;
CREATE TRIGGER homepage_content_no_delete
  BEFORE DELETE ON homepage_content
  FOR EACH ROW
  EXECUTE PROCEDURE public.prevent_singleton_delete();

COMMIT;