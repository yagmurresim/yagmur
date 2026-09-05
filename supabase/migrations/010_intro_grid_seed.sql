-- ─── Migration 010: Default weekly intro grid ──────────────────────────────────
-- Every day of the week (Mon–Sun, weekday 1–7).
-- Inserts missing rows only; does not overwrite staff edits
-- (ON CONFLICT DO NOTHING on program + format + weekday + start_time).
--
-- Resim:          group 120m  10–12 / 13–15 / 15–17 / 18–20
-- Piyano:         individual 60m  10–11 … 19–20
-- Keman / gitar:  both of the above
--
-- Requires 009. Fail-closed if expected programs are missing, or if existing
-- intro_slots rows have unclassified lesson_format (no duration heuristic).

BEGIN;

DO $$
DECLARE
  missing TEXT;
BEGIN
  SELECT string_agg(expected.slug, ', ')
    INTO missing
  FROM unnest(ARRAY[
    'resim-kursu',
    'piyano-kursu',
    'keman-kursu',
    'gitar-kursu'
  ]) AS expected(slug)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.programs p WHERE p.slug = expected.slug
  );

  IF missing IS NOT NULL THEN
    RAISE EXCEPTION
      '010: expected programs missing: %. Apply 002 first.',
      missing;
  END IF;
END $$;

ALTER TABLE intro_slots
  ADD COLUMN IF NOT EXISTS lesson_format TEXT;

DO $$
DECLARE
  unclassified INTEGER;
BEGIN
  SELECT COUNT(*) INTO unclassified
  FROM intro_slots
  WHERE lesson_format IS NULL;

  IF unclassified > 0 THEN
    RAISE EXCEPTION
      '010: % existing intro_slots require explicit lesson_format before this seed',
      unclassified;
  END IF;
END $$;

ALTER TABLE intro_slots
  ALTER COLUMN lesson_format SET NOT NULL;

ALTER TABLE intro_slots
  DROP CONSTRAINT IF EXISTS intro_slots_lesson_format_check;

ALTER TABLE intro_slots
  ADD CONSTRAINT intro_slots_lesson_format_check
  CHECK (lesson_format IN ('group', 'individual'));

ALTER TABLE intro_slots
  ALTER COLUMN lesson_format DROP DEFAULT;

DROP INDEX IF EXISTS intro_slots_grid_uidx;

CREATE UNIQUE INDEX IF NOT EXISTS intro_slots_grid_uidx
  ON intro_slots (program_id, lesson_format, weekday, start_time);

INSERT INTO intro_slots (
  program_id, lesson_format, weekday, start_time, duration_minutes,
  age_min, age_max, capacity, active
)
SELECT
  p.id,
  'group',
  d.weekday,
  t.start_time,
  120,
  4,
  NULL,
  6,
  TRUE
FROM programs p
CROSS JOIN generate_series(1, 7) AS d(weekday)
CROSS JOIN (
  VALUES
    ('10:00'::time),
    ('13:00'::time),
    ('15:00'::time),
    ('18:00'::time)
) AS t(start_time)
WHERE p.slug IN ('resim-kursu', 'keman-kursu', 'gitar-kursu')
ON CONFLICT (program_id, lesson_format, weekday, start_time) DO NOTHING;

INSERT INTO intro_slots (
  program_id, lesson_format, weekday, start_time, duration_minutes,
  age_min, age_max, capacity, active
)
SELECT
  p.id,
  'individual',
  d.weekday,
  t.start_time,
  60,
  4,
  NULL,
  1,
  TRUE
FROM programs p
CROSS JOIN generate_series(1, 7) AS d(weekday)
CROSS JOIN (
  VALUES
    ('10:00'::time),
    ('11:00'::time),
    ('12:00'::time),
    ('13:00'::time),
    ('14:00'::time),
    ('15:00'::time),
    ('16:00'::time),
    ('17:00'::time),
    ('18:00'::time),
    ('19:00'::time)
) AS t(start_time)
WHERE p.slug IN ('piyano-kursu', 'keman-kursu', 'gitar-kursu')
ON CONFLICT (program_id, lesson_format, weekday, start_time) DO NOTHING;

COMMIT;
