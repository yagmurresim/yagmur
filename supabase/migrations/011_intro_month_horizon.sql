-- ─── Migration 011: Bookings limited to current Istanbul month ─────────────────
-- Replaces the 16-day horizon. Past dates stay rejected. Safe to re-run.

BEGIN;

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
  month_end DATE;
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

  IF p_student_age < 4 OR p_student_age > 80 THEN
    RAISE EXCEPTION 'invalid_student_age';
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
  month_end := (date_trunc('month', clock_timestamp() AT TIME ZONE 'Europe/Istanbul')
    + INTERVAL '1 month' - INTERVAL '1 day')::date;

  IF EXTRACT(ISODOW FROM (canonical AT TIME ZONE 'Europe/Istanbul'))::INT <> slot.weekday THEN
    RAISE EXCEPTION 'occurrence_mismatch';
  END IF;

  IF to_char(local_ts, 'HH24:MI') <> to_char(slot.start_time, 'HH24:MI') THEN
    RAISE EXCEPTION 'occurrence_mismatch';
  END IF;

  IF canonical <= clock_timestamp() + INTERVAL '1 hour' THEN
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
    RAISE EXCEPTION '011: book_intro_lesson exposed to anon/authenticated';
  END IF;
  IF NOT has_function_privilege(
    'service_role',
    'public.book_intro_lesson(text,integer,text,text,uuid,timestamptz,boolean,text,uuid)',
    'EXECUTE'
  ) THEN
    RAISE EXCEPTION '011: service_role cannot execute book_intro_lesson';
  END IF;
END $$;

COMMIT;
