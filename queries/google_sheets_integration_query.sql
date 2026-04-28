CREATE TABLE user_sheets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  spreadsheet_id  TEXT NOT NULL UNIQUE,      -- Google Drive file id
  spreadsheet_url TEXT NOT NULL,             -- webViewLink / URL
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_sheets_user_id ON user_sheets(user_id);

CREATE TABLE booked_tracker (
  id                         BIGSERIAL PRIMARY KEY,
  business_id                UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  sheet_row_number           INTEGER NOT NULL,   -- row index in sheet (2,3,4,...)

  date_lead_received         DATE,               -- DATE LEAD RECEIVED
  date_scheduled             DATE,               -- DATE SCHEDULED
  appt_date                  DATE,               -- APPT DATE
  appt_time                  TIME,               -- APPT TIME

  first_name                 TEXT,               -- FIRST NAME
  last_name                  TEXT,               -- LAST NAME
  patient_dob                DATE,               -- PATIENT DOB
  phone                      TEXT,               -- PHONE #
  procedure                  TEXT,               -- PROCEDURE

  woa_notes                  TEXT,               -- WOA NOTES
  location                   TEXT,               -- Location
  show_status                TEXT,               -- SHOW STATUS
  treatment_status           TEXT,               -- TREATMENT STATUS
  clinic_notes_from_consult  TEXT,               -- CLINIC NOTES FROM CONSULT

  created_at                 TIMESTAMPTZ DEFAULT now(),
  updated_at                 TIMESTAMPTZ DEFAULT now(),

  -- one row per business + row number in the sheet
  UNIQUE (business_id, sheet_row_number)
);

CREATE INDEX idx_booked_tracker_business_id
  ON booked_tracker(business_id);

CREATE TABLE lead_tracker (
  id                    BIGSERIAL PRIMARY KEY,
  business_id           UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  sheet_row_number      INTEGER NOT NULL,

  -- Core lead data
  date_lead_received    DATE,
  date_lead_called      DATE,
  first_name            TEXT,
  last_name             TEXT,
  phone                 TEXT,
  procedure             TEXT,
  caller                TEXT,
  locations             TEXT,
  call_status           TEXT,
  booked_status         TEXT,
  dental_va_call_note   TEXT,

  -- Timing fields
  time_lead_received    TIME,
  time_lead_called      TIME,
  timing                TEXT,
  dentalpro_va          TEXT,
  time_difference       TEXT,   -- keep as text; can later normalize to duration
  notes                 TEXT,

  -- Follow-up day notes
  day1_note             TEXT,
  day2_note             TEXT,
  day3_note             TEXT,
  day4_note             TEXT,
  day5_note             TEXT,
  day6_note             TEXT,
  day7_note             TEXT,

  -- Callbacks
  callback_8            TEXT,
  callback_9            TEXT,
  callback_10           TEXT,
  follow_up_note        TEXT,

  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now(),

  -- one row per business + row number in the sheet
  UNIQUE (business_id, sheet_row_number)
);

CREATE INDEX idx_lead_tracker_business_id
  ON lead_tracker(business_id);

CREATE TABLE business_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  business_id UUID NOT NULL REFERENCES businesses(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  spreadsheet_id VARCHAR(255) NOT NULL UNIQUE,
  spreadsheet_url TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index to quickly filter by business
CREATE INDEX idx_business_sheets_business_id
  ON business_sheets (business_id);

-- Optional: enforce ONE sheet per business
CREATE UNIQUE INDEX uq_business_sheets_business_id
  ON business_sheets (business_id);

-- 1) Add status column to business_sheets (with ENUM type)
ALTER TABLE public.business_sheets
ADD COLUMN status VARCHAR(50) DEFAULT 'active' NOT NULL;

-- 2) Drop the unique constraint on business_id
ALTER TABLE public.business_sheets
  DROP CONSTRAINT IF EXISTS uq_business_sheets_business_id;

-- 3) Drop any unique indexes
DROP INDEX IF EXISTS uq_business_sheets_business_id;
DROP INDEX IF EXISTS business_sheets_business_id_key;

-- 4) Ensure non-unique indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_business_sheets_business_id
  ON public.business_sheets (business_id);

CREATE INDEX IF NOT EXISTS idx_business_sheets_status
  ON public.business_sheets (status);

-- 5) Optional: Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_business_sheets_business_status
  ON public.business_sheets (business_id, status DESC);

-- 6) Add sheet_id column to booked_tracker to track which sheet the data belongs to
ALTER TABLE public.booked_tracker
ADD COLUMN sheet_id UUID REFERENCES public.business_sheets(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL;

-- Create index for sheet_id in booked_tracker
CREATE INDEX IF NOT EXISTS idx_booked_tracker_sheet_id
  ON public.booked_tracker (sheet_id);

-- 7) Add sheet_id column to lead_tracker to track which sheet the data belongs to
ALTER TABLE public.lead_tracker
ADD COLUMN sheet_id UUID REFERENCES public.business_sheets(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL;

-- Create index for sheet_id in lead_tracker
CREATE INDEX IF NOT EXISTS idx_lead_tracker_sheet_id
  ON public.lead_tracker (sheet_id);

-- 8) Optional: Create composite indexes for common queries filtering by business and sheet
CREATE INDEX IF NOT EXISTS idx_booked_tracker_business_sheet
  ON public.booked_tracker (business_id, sheet_id);

CREATE INDEX IF NOT EXISTS idx_lead_tracker_business_sheet
  ON public.lead_tracker (business_id, sheet_id);

-- ============================================
-- ROLLBACK QUERIES - Use these to undo the changes above
-- ============================================

-- ROLLBACK: Drop composite indexes for booked_tracker and lead_tracker
DROP INDEX IF EXISTS public.idx_booked_tracker_business_sheet;
DROP INDEX IF EXISTS public.idx_lead_tracker_business_sheet;

-- ROLLBACK: Drop sheet_id indexes
DROP INDEX IF EXISTS public.idx_booked_tracker_sheet_id;
DROP INDEX IF EXISTS public.idx_lead_tracker_sheet_id;

-- ROLLBACK: Remove sheet_id column from booked_tracker
ALTER TABLE public.booked_tracker
DROP COLUMN IF EXISTS sheet_id;

-- ROLLBACK: Remove sheet_id column from lead_tracker
ALTER TABLE public.lead_tracker
DROP COLUMN IF EXISTS sheet_id;

-- ROLLBACK: Drop status-related indexes on business_sheets
DROP INDEX IF EXISTS public.idx_business_sheets_business_status;
DROP INDEX IF EXISTS public.idx_business_sheets_status;

-- ROLLBACK: Remove status column from business_sheets
ALTER TABLE public.business_sheets
DROP COLUMN IF EXISTS status;

-- ROLLBACK: Re-add unique constraint on business_id (if you want only one sheet per business)
-- Note: Only run this if you want to enforce ONE sheet per business again
-- CREATE UNIQUE INDEX uq_business_sheets_business_id
--   ON public.business_sheets (business_id);