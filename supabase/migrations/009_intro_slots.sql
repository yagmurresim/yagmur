-- ─── Migration 009: Recurring intro-lesson slots ────────────────────────────────
-- Single academy (not multi-tenant). Weekly template + concrete occurrence
-- timestamp on the booking. Public listing/booking goes through service_role
-- (no anon SELECT on staff notes). Public booking capacity is enforced in
-- book_intro_lesson (canonical timestamptz + slot row lock). Staff CRM
-- status edits are not capacity-gated — that is intentional.
-- Safe to re-run.

BEGIN;

CREATE TABLE IF NOT EXISTS intro_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 1 AND 7),
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45
    CHECK (duration_minutes BETWEEN 15 AND 180),
  age_min INTEGER NOT NULL DEFAULT 4 CHECK (age_min >= 4),
  age_max INTEGER CHECK (age_max IS NULL OR age_max >= age_min),
  capacity INTEGER NOT NULL DEFAULT 1 CHECK (capacity BETWEEN 1 AND 20),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS intro_slots_active_idx
  ON intro_slots (weekday, start_time)
  WHERE active = TRUE;

CREATE OR REPLACE FUNCTION public.intro_slots_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS intro_slots_set_updated_at ON intro_slots;
CREATE TRIGGER intro_slots_set_updated_at
  BEFORE UPDATE ON intro_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.intro_slots_set_updated_at();

ALTER TABLE intro_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "intro_slots_public_read" ON intro_slots;

DROP POLICY IF EXISTS "intro_slots_admin_all" ON intro_slots;
CREATE POLICY "intro_slots_admin_all" ON intro_slots
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

REVOKE ALL ON public.intro_slots FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.intro_slots TO authenticated;
GRANT SELECT ON public.intro_slots TO service_role;

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS intro_slot_id UUID REFERENCES intro_slots(id) ON DELETE SET NULL;

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS intro_occurrence_at TIMESTAMPTZ;

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS booking_request_id UUID;

CREATE UNIQUE INDEX IF NOT EXISTS applications_booking_request_uidx
  ON applications (booking_request_id)
  WHERE booking_request_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS applications_intro_occurrence_idx
  ON applications (intro_slot_id, intro_occurrence_at)
  WHERE intro_slot_id IS NOT NULL AND intro_occurrence_at IS NOT NULL;

DO $$
DECLARE
  bad TEXT;
BEGIN
  SELECT string_agg(DISTINCT source_channel, ', ')
    INTO bad
  FROM applications
  WHERE source_channel IS NOT NULL
    AND source_channel NOT IN ('whatsapp', 'phone', 'instagram', 'walk_in', 'web', 'other');

  IF bad IS NOT NULL THEN
    RAISE EXCEPTION
      '009: applications.source_channel has values outside the new CHECK: %',
      bad;
  END IF;
END $$;

ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_source_channel_check;

ALTER TABLE applications
  ADD CONSTRAINT applications_source_channel_check
  CHECK (source_channel IN ('whatsapp', 'phone', 'instagram', 'walk_in', 'web', 'other'));

DROP FUNCTION IF EXISTS public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ, TEXT
);
DROP FUNCTION IF EXISTS public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ
);
DROP FUNCTION IF EXISTS public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ, BOOLEAN
);
DROP FUNCTION IF EXISTS public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ, BOOLEAN, TEXT, UUID
);

CREATE OR REPLACE FUNCTION public.book_intro_lesson(
  p_student_name TEXT,
  p_student_age INTEGER,
  p_parent_name TEXT,
  p_phone TEXT,
  p_slot_id UUID,
  p_occurrence TIMESTAMPTZ,
  p_kvkk_consent BOOLEAN,
  p_kvkk_version TEXT,
  p_request_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  slot public.intro_slots%ROWTYPE;
  existing public.applications%ROWTYPE;
  taken INTEGER;
  new_id UUID;
  local_ts TIMESTAMP;
  occurrence_date DATE;
  canonical TIMESTAMPTZ;
BEGIN
  IF p_occurrence IS NULL THEN
    RAISE EXCEPTION 'invalid_occurrence';
  END IF;
  IF p_slot_id IS NULL THEN
    RAISE EXCEPTION 'slot_inactive';
  END IF;
  IF p_student_age IS NULL THEN
    RAISE EXCEPTION 'invalid_student_age';
  END IF;
  IF p_student_name IS NULL OR btrim(p_student_name) = '' THEN
    RAISE EXCEPTION 'invalid_student_name';
  END IF;
  IF p_phone IS NULL OR btrim(p_phone) = '' THEN
    RAISE EXCEPTION 'invalid_phone';
  END IF;
  IF p_kvkk_consent IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'kvkk_consent_required';
  END IF;
  IF p_kvkk_version IS NULL OR btrim(p_kvkk_version) = '' THEN
    RAISE EXCEPTION 'invalid_kvkk_version';
  END IF;
  IF p_request_id IS NULL THEN
    RAISE EXCEPTION 'invalid_request_id';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(p_request_id::text, 20260905));

  SELECT * INTO existing
  FROM public.applications
  WHERE booking_request_id = p_request_id;

  IF FOUND THEN
    IF existing.intro_slot_id IS DISTINCT FROM p_slot_id
       OR existing.student_age IS DISTINCT FROM p_student_age
       OR btrim(existing.student_name) IS DISTINCT FROM btrim(p_student_name)
       OR btrim(existing.phone) IS DISTINCT FROM btrim(p_phone)
       OR NULLIF(btrim(existing.parent_name), '')
            IS DISTINCT FROM NULLIF(btrim(p_parent_name), '')
       OR existing.kvkk_version IS DISTINCT FROM btrim(p_kvkk_version)
       OR (existing.intro_occurrence_at AT TIME ZONE 'Europe/Istanbul')::date
            IS DISTINCT FROM (p_occurrence AT TIME ZONE 'Europe/Istanbul')::date
       OR to_char(existing.intro_occurrence_at AT TIME ZONE 'Europe/Istanbul', 'HH24:MI')
            IS DISTINCT FROM to_char(p_occurrence AT TIME ZONE 'Europe/Istanbul', 'HH24:MI')
    THEN
      RAISE EXCEPTION 'idempotency_conflict';
    END IF;
    RETURN existing.id;
  END IF;

  IF p_kvkk_version IS DISTINCT FROM 'web-intro-1.0' THEN
    RAISE EXCEPTION 'invalid_kvkk_version';
  END IF;

  SELECT * INTO slot
  FROM public.intro_slots
  WHERE id = p_slot_id
  FOR UPDATE;

  IF NOT FOUND OR slot.active IS NOT TRUE THEN
    RAISE EXCEPTION 'slot_inactive';
  END IF;

  local_ts := p_occurrence AT TIME ZONE 'Europe/Istanbul';
  occurrence_date := local_ts::date;
  canonical := (occurrence_date + slot.start_time) AT TIME ZONE 'Europe/Istanbul';

  IF EXTRACT(ISODOW FROM (canonical AT TIME ZONE 'Europe/Istanbul'))::INT <> slot.weekday THEN
    RAISE EXCEPTION 'occurrence_mismatch';
  END IF;

  IF to_char(local_ts, 'HH24:MI') <> to_char(slot.start_time, 'HH24:MI') THEN
    RAISE EXCEPTION 'occurrence_mismatch';
  END IF;

  IF canonical <= clock_timestamp() + INTERVAL '1 hour' THEN
    RAISE EXCEPTION 'occurrence_past';
  END IF;

  IF canonical > clock_timestamp() + INTERVAL '16 days' THEN
    RAISE EXCEPTION 'occurrence_too_far';
  END IF;

  IF p_student_age < slot.age_min
     OR (slot.age_max IS NOT NULL AND p_student_age > slot.age_max) THEN
    RAISE EXCEPTION 'age_mismatch';
  END IF;

  SELECT COUNT(*)::INT INTO taken
  FROM public.applications
  WHERE intro_slot_id = slot.id
    AND intro_occurrence_at = canonical
    AND status <> 'CLOSED';

  IF taken >= slot.capacity THEN
    RAISE EXCEPTION 'capacity_full';
  END IF;

  INSERT INTO public.applications (
    student_name,
    student_age,
    parent_name,
    phone,
    program_id,
    intro_slot_id,
    intro_occurrence_at,
    next_action_at,
    status,
    source_channel,
    source_page,
    kvkk_consent,
    kvkk_version,
    consented_at,
    message,
    booking_request_id
  ) VALUES (
    btrim(p_student_name),
    p_student_age,
    NULLIF(btrim(p_parent_name), ''),
    btrim(p_phone),
    slot.program_id,
    slot.id,
    canonical,
    canonical,
    'INTRO_PLANNED',
    'web',
    '/ucretsiz-tanisma-dersi',
    TRUE,
    btrim(p_kvkk_version),
    clock_timestamp(),
    NULL,
    p_request_id
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ, BOOLEAN, TEXT, UUID
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ, BOOLEAN, TEXT, UUID
) TO service_role;

DO $$
BEGIN
  IF NOT has_function_privilege('authenticated', 'public.is_admin()', 'EXECUTE') THEN
    RAISE EXCEPTION 'Migration 009: authenticated cannot execute public.is_admin()';
  END IF;
  IF NOT has_table_privilege('service_role', 'public.intro_slots', 'SELECT') THEN
    RAISE EXCEPTION 'Migration 009: service_role cannot SELECT intro_slots';
  END IF;
  IF has_function_privilege(
       'anon',
       'public.book_intro_lesson(text,integer,text,text,uuid,timestamptz,boolean,text,uuid)',
       'EXECUTE'
     )
     OR has_function_privilege(
       'authenticated',
       'public.book_intro_lesson(text,integer,text,text,uuid,timestamptz,boolean,text,uuid)',
       'EXECUTE'
     )
  THEN
    RAISE EXCEPTION 'Migration 009: book_intro_lesson exposed to anon/authenticated';
  END IF;
  IF NOT has_function_privilege(
    'service_role',
    'public.book_intro_lesson(text,integer,text,text,uuid,timestamptz,boolean,text,uuid)',
    'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'Migration 009: service_role cannot execute book_intro_lesson';
  END IF;
END $$;

COMMIT;
