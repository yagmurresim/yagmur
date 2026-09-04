-- ─── Migration 008: Staff WhatsApp CRM ───────────────────────────────────────
-- Public web form is gone. applications is the admin lead pipeline.
-- SQL Editor'da bu dosyanın tamamını tek seferde çalıştırın.
-- Safe to re-run.

BEGIN;

ALTER TABLE applications
  ALTER COLUMN student_age DROP NOT NULL;

ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_student_age_check;

ALTER TABLE applications
  ADD CONSTRAINT applications_student_age_check
  CHECK (student_age IS NULL OR student_age >= 4);

-- Staff-entered records are not web-form KVKK consents.
ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_kvkk_required;

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS source_channel TEXT NOT NULL DEFAULT 'whatsapp';

ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_source_channel_check;

ALTER TABLE applications
  ADD CONSTRAINT applications_source_channel_check
  CHECK (source_channel IN ('whatsapp', 'phone', 'instagram', 'walk_in', 'other'));

CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status);
CREATE INDEX IF NOT EXISTS applications_next_action_idx ON applications (next_action_at)
  WHERE next_action_at IS NOT NULL;

COMMIT;
