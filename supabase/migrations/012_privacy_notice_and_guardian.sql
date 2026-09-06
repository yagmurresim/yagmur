-- ─── Migration 012: Privacy notice + guardian declaration ─────────────────────
-- Adds 8-arg book_intro_lesson. Leaves 011 9-arg body untouched.
-- Old rows are NOT rewritten. Deploy: this file FIRST, then 8-arg app, then
-- drain old instances, then 013 drops 9-arg.
-- Safe to re-run. Apply AFTER 011.

BEGIN;

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS privacy_notice_version TEXT,
  ADD COLUMN IF NOT EXISTS privacy_notice_presented_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS guardian_declaration BOOLEAN,
  ADD COLUMN IF NOT EXISTS guardian_declared_at TIMESTAMPTZ;

-- kvkk_consent stays BOOLEAN NOT NULL DEFAULT FALSE. New web rows write FALSE.
-- consented_at / kvkk_version stay nullable so a FALSE consent has no timestamp.
ALTER TABLE public.applications
  ALTER COLUMN kvkk_version DROP NOT NULL,
  ALTER COLUMN consented_at DROP NOT NULL;

ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_kvkk_required;

-- Intro-web rows: legacy consent OR canonical notice. Other sources
-- (admin / whatsapp / phone / …) are exempt — no legal evidence in this
-- table. Old 9-arg INSERTs still pass (legacy consent shape).
ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_legal_evidence;

ALTER TABLE public.applications
  ADD CONSTRAINT applications_legal_evidence CHECK (
    NOT (
      source_channel = 'web'
      AND source_page = '/ucretsiz-tanisma-dersi'
    )
    OR (
      kvkk_consent IS TRUE
      AND kvkk_version IS NOT NULL
      AND consented_at IS NOT NULL
      AND privacy_notice_version IS NULL
      AND privacy_notice_presented_at IS NULL
    )
    OR (
      kvkk_consent IS FALSE
      AND kvkk_version IS NULL
      AND consented_at IS NULL
      AND privacy_notice_version IS NOT NULL
      AND privacy_notice_presented_at IS NOT NULL
    )
  );

-- Canonical intro-web notice rows require age + matching guardian pair.
-- Legacy consent-model rows (no notice) are untouched. Other sources
-- that later reuse privacy_notice_* are not forced into this model.
ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_guardian_on_notice;

ALTER TABLE public.applications
  ADD CONSTRAINT applications_guardian_on_notice CHECK (
    NOT (
      source_channel = 'web'
      AND source_page = '/ucretsiz-tanisma-dersi'
      AND privacy_notice_version IS NOT NULL
    )
    OR (
      student_age IS NOT NULL
      AND (
        (
          student_age < 18
          AND guardian_declaration IS TRUE
          AND guardian_declared_at IS NOT NULL
        )
        OR (
          student_age >= 18
          AND guardian_declaration IS NULL
          AND guardian_declared_at IS NULL
        )
      )
    )
  );

ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_notice_pair;

ALTER TABLE public.applications
  ADD CONSTRAINT applications_notice_pair CHECK (
    (privacy_notice_version IS NULL AND privacy_notice_presented_at IS NULL)
    OR (privacy_notice_version IS NOT NULL AND privacy_notice_presented_at IS NOT NULL)
  );

ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_guardian_pair;

ALTER TABLE public.applications
  ADD CONSTRAINT applications_guardian_pair CHECK (
    (guardian_declaration IS NULL AND guardian_declared_at IS NULL)
    OR (guardian_declaration IS TRUE AND guardian_declared_at IS NOT NULL)
  );

-- 8-arg overload only. 011 9-arg body is not replaced (see end of file).
CREATE OR REPLACE FUNCTION public.book_intro_lesson(
  p_student_name TEXT,
  p_student_age INTEGER,
  p_parent_name TEXT,
  p_phone TEXT,
  p_slot_id UUID,
  p_occurrence TIMESTAMPTZ,
  p_guardian_declaration BOOLEAN,
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
  month_end DATE;
  v_now TIMESTAMPTZ;
  guardian_ok BOOLEAN;
  parent_stored TEXT;
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
       OR (
            p_student_age < 18
            AND COALESCE(NULLIF(btrim(existing.parent_name), ''), '')
                  IS DISTINCT FROM COALESCE(NULLIF(btrim(p_parent_name), ''), '')
          )
       OR (
            existing.guardian_declared_at IS NOT NULL
            AND p_guardian_declaration IS DISTINCT FROM TRUE
          )
       OR (existing.intro_occurrence_at AT TIME ZONE 'Europe/Istanbul')::date
            IS DISTINCT FROM (p_occurrence AT TIME ZONE 'Europe/Istanbul')::date
       OR to_char(existing.intro_occurrence_at AT TIME ZONE 'Europe/Istanbul', 'HH24:MI')
            IS DISTINCT FROM to_char(p_occurrence AT TIME ZONE 'Europe/Istanbul', 'HH24:MI')
    THEN
      RAISE EXCEPTION 'idempotency_conflict';
    END IF;
    RETURN existing.id;
  END IF;

  IF p_student_age < 4 OR p_student_age > 80 THEN
    RAISE EXCEPTION 'invalid_student_age';
  END IF;

  IF p_student_age < 18 THEN
    IF p_parent_name IS NULL OR btrim(p_parent_name) = '' THEN
      RAISE EXCEPTION 'guardian_required';
    END IF;
    IF p_guardian_declaration IS DISTINCT FROM TRUE THEN
      RAISE EXCEPTION 'guardian_declaration_required';
    END IF;
    guardian_ok := TRUE;
    parent_stored := btrim(p_parent_name);
  ELSE
    guardian_ok := NULL;
    parent_stored := NULL;
  END IF;

  SELECT * INTO slot
  FROM public.intro_slots
  WHERE id = p_slot_id
  FOR UPDATE;

  IF NOT FOUND OR slot.active IS NOT TRUE THEN
    RAISE EXCEPTION 'slot_inactive';
  END IF;

  v_now := clock_timestamp();
  local_ts := p_occurrence AT TIME ZONE 'Europe/Istanbul';
  occurrence_date := local_ts::date;
  canonical := (occurrence_date + slot.start_time) AT TIME ZONE 'Europe/Istanbul';
  month_end := (date_trunc('month', v_now AT TIME ZONE 'Europe/Istanbul')
    + INTERVAL '1 month' - INTERVAL '1 day')::date;

  IF EXTRACT(ISODOW FROM (canonical AT TIME ZONE 'Europe/Istanbul'))::INT <> slot.weekday THEN
    RAISE EXCEPTION 'occurrence_mismatch';
  END IF;

  IF to_char(local_ts, 'HH24:MI') <> to_char(slot.start_time, 'HH24:MI') THEN
    RAISE EXCEPTION 'occurrence_mismatch';
  END IF;

  IF canonical <= v_now + INTERVAL '1 hour' THEN
    RAISE EXCEPTION 'occurrence_past';
  END IF;

  IF occurrence_date > month_end THEN
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
    privacy_notice_version,
    privacy_notice_presented_at,
    guardian_declaration,
    guardian_declared_at,
    message,
    booking_request_id
  ) VALUES (
    btrim(p_student_name),
    p_student_age,
    parent_stored,
    btrim(p_phone),
    slot.program_id,
    slot.id,
    canonical,
    canonical,
    'INTRO_PLANNED',
    'web',
    '/ucretsiz-tanisma-dersi',
    FALSE,
    NULL,
    NULL,
    'web-intro-1.0',
    v_now,
    guardian_ok,
    CASE WHEN guardian_ok IS TRUE THEN v_now ELSE NULL END,
    NULL,
    p_request_id
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- 011 9-arg body is not replaced. Rolling deploy:
--   1. apply this file (8-arg + CHECK accepts both intro-web shapes)
--   2. deploy 8-arg app
--   3. drain old instances
--   4. 013 drops 9-arg
-- Do not wrap 9-arg into 8-arg.
--
-- Pre-012 preflight (expect 0). New notice columns do not exist yet.
-- SELECT count(*) FROM public.applications
-- WHERE source_channel = 'web'
--   AND source_page = '/ucretsiz-tanisma-dersi'
--   AND NOT (
--     kvkk_consent IS TRUE
--     AND kvkk_version IS NOT NULL
--     AND consented_at IS NOT NULL
--   );
--
-- privacy_notice_presented_at = server submission clock for the canonical
-- notice version in force at booking. Not proof the notice rendered in the
-- browser. kvkk_consent is a leftover column; new 8-arg rows write FALSE
-- and must not be read as a consent event.
--
-- After 012, before 013, both overloads must work (staging, service_role):
--   9-arg adult  → success, kvkk_consent TRUE, privacy_notice_* NULL
--   9-arg minor  → success, same legacy shape (no guardian columns)
--   8-arg adult  → success, kvkk_consent FALSE, privacy_notice_* set, guardian NULL
--   8-arg minor declaration=false → guardian_declaration_required
--   8-arg minor declaration=true  → success, guardian TRUE + timestamp
-- Capacity: both bodies lock intro_slots FOR UPDATE. Two concurrent
-- bookings on capacity=1 (one 9-arg, one 8-arg) → one success, one capacity_full.

REVOKE ALL ON FUNCTION public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ, BOOLEAN, UUID
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ, BOOLEAN, UUID
) TO service_role;

REVOKE ALL ON FUNCTION public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ, BOOLEAN, TEXT, UUID
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.book_intro_lesson(
  TEXT, INTEGER, TEXT, TEXT, UUID, TIMESTAMPTZ, BOOLEAN, TEXT, UUID
) TO service_role;

DO $$
BEGIN
  IF has_function_privilege(
       'anon',
       'public.book_intro_lesson(text,integer,text,text,uuid,timestamptz,boolean,uuid)',
       'EXECUTE'
     )
     OR has_function_privilege(
       'authenticated',
       'public.book_intro_lesson(text,integer,text,text,uuid,timestamptz,boolean,uuid)',
       'EXECUTE'
     )
     OR has_function_privilege(
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
    RAISE EXCEPTION '012: book_intro_lesson exposed to anon/authenticated';
  END IF;
  IF NOT has_function_privilege(
    'service_role',
    'public.book_intro_lesson(text,integer,text,text,uuid,timestamptz,boolean,uuid)',
    'EXECUTE'
  ) THEN
    RAISE EXCEPTION '012: service_role cannot execute 8-arg book_intro_lesson';
  END IF;
END $$;

COMMIT;
