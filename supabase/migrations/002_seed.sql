-- ─── Seed 002: Programs only ──────────────────────────────────────────────────
-- This file was never applied with the older site_settings / homepage / FAQ
-- seed. Those rows now live in 004_singleton_fix.sql (idempotent).
-- Do not re-run 002 on a database that already has these program slugs.

BEGIN;

INSERT INTO programs (name, slug, short_description, intro, lesson_formats, status, sort_order,
  seo_title, seo_description, minimum_age, learning_outcomes)
VALUES
(
  'Resim', 'resim-kursu',
  'Gözlem, renk ve anlatım. Grup ortamında yaratıcı gelişim.',
  'Resim eğitiminde öğrenciler yalnızca teknik beceri kazanmaz; görmek, hissetmek ve ifade etmek öğrenir. Akademimizde grup eğitimi formatında yürütülen resim dersleri, her seviyeye ve her yaşa uygundur.',
  ARRAY['group'], 'published', 1,
  'Karşıyaka Resim Kursu | Yağmur Sanat Akademisi',
  'Karşıyaka''da resim kursu. MEB onaylı grup eğitimi. 4 yaştan yetişkinlere. Güzel Sanatlar hazırlık desteği.',
  4, ARRAY['Gözlem ve renk algısı', 'Grup ortamında sanat', 'MEB onaylı sertifika', 'Güzel Sanatlar hazırlık desteği', 'Sergi fırsatları']
),
(
  'Piyano', 'piyano-kursu',
  'Birebir eğitimle nota okumadan yoruma. Disiplin ve müzikalite.',
  'Piyano eğitimi birebir formatında yürütülür. Nota okumadan yoruma, teknikten müzikaliteye uzanan yolculukta her öğrenci kendi temposunda ilerler.',
  ARRAY['individual'], 'published', 2,
  'Karşıyaka Piyano Kursu | Yağmur Sanat Akademisi',
  'Karşıyaka''da piyano kursu. MEB onaylı birebir eğitim. 4 yaştan yetişkinlere. Ücretsiz tanışma dersi.',
  4, ARRAY['Nota okuma ve yazma', 'Birebir kişisel ilgi', 'MEB onaylı sertifika', 'Konser fırsatları']
),
(
  'Keman', 'keman-kursu',
  'Yay tekniğinden ifadeye. Birebir veya grup formatında.',
  'Keman eğitiminde her öğrenci için uygun format seçilir. Birebir veya grup ortamında yay tekniğinden müzikal ifadeye uzanan kapsamlı bir eğitim sunulur.',
  ARRAY['individual', 'group'], 'published', 3,
  'Karşıyaka Keman Kursu | Yağmur Sanat Akademisi',
  'Karşıyaka''da keman kursu. Birebir ve grup formatlarında. MEB onaylı. Ücretsiz tanışma dersi.',
  4, ARRAY['Yay tekniği ve postür', 'Nota okuma', 'MEB onaylı sertifika', 'Konser fırsatları']
),
(
  'Gitar', 'gitar-kursu',
  'Akustikten elektriğe. Birebir veya grup ortamında.',
  'Gitar eğitimi birebir veya grup formatında sunulur. Teknik ve müzikaliteyi bir arada geliştiren kapsamlı bir eğitim programı uygulanmaktadır.',
  ARRAY['individual', 'group'], 'published', 4,
  'Karşıyaka Gitar Kursu | Yağmur Sanat Akademisi',
  'Karşıyaka''da gitar kursu. Birebir ve grup formatlarında. MEB onaylı. Ücretsiz tanışma dersi.',
  4, ARRAY['Parmak tekniği ve akor', 'Ritim ve melodi', 'MEB onaylı sertifika', 'Konser fırsatları']
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;