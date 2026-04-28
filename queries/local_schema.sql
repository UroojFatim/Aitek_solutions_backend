-- Local schema for ATS / WOA backend
-- Run this on a fresh PostgreSQL database before loading seed data.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_changed BOOLEAN NOT NULL DEFAULT FALSE,
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  npi_number VARCHAR(10) UNIQUE,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_name VARCHAR(255) NOT NULL UNIQUE,
  step_title VARCHAR(255),
  step_subtitle VARCHAR(255),
  step_description TEXT,
  step_order INTEGER NOT NULL UNIQUE,
  action_link VARCHAR(255),
  action_label VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID NOT NULL REFERENCES onboarding_steps(id) ON UPDATE CASCADE ON DELETE CASCADE,
  section_name VARCHAR(255) NOT NULL,
  section_title VARCHAR(255),
  section_description TEXT,
  section_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_section_per_step UNIQUE (step_id, section_name)
);

CREATE TABLE IF NOT EXISTS onboarding_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID NOT NULL REFERENCES onboarding_steps(id) ON UPDATE CASCADE ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES onboarding_sections(id) ON UPDATE CASCADE ON DELETE CASCADE,
  field_name VARCHAR(255) NOT NULL,
  label TEXT NOT NULL,
  field_type VARCHAR(50) NOT NULL,
  placeholder VARCHAR(255),
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL,
  options JSONB,
  yup_validation JSONB,
  default_value TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_field_per_step UNIQUE (step_id, section_id, field_name)
);

CREATE TABLE IF NOT EXISTS business_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  onboarding_step_id UUID NOT NULL REFERENCES onboarding_steps(id) ON UPDATE CASCADE ON DELETE CASCADE,
  status INTEGER NOT NULL DEFAULT 1,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_business_step UNIQUE (business_id, onboarding_step_id)
);

CREATE TABLE IF NOT EXISTS business_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  practice_name VARCHAR(255),
  primary_office_address TEXT,
  phone_number VARCHAR(50),
  email_address VARCHAR(255),
  website VARCHAR(255),
  social_media_handles TEXT,
  years_in_operation VARCHAR(255),
  accepts_new_patients BOOLEAN DEFAULT NULL,
  pms_software VARCHAR(255),
  success_vision TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  full_name VARCHAR(255),
  nickname VARCHAR(255),
  email_address VARCHAR(255),
  birthday DATE,
  motivation TEXT,
  leadership_style TEXT,
  improvement_goal TEXT,
  spouse_partner_name VARCHAR(255),
  children_names_ages VARCHAR(255),
  favorite_restaurant VARCHAR(255),
  office_music VARCHAR(255),
  clone_team_member VARCHAR(255),
  coffee_order VARCHAR(255),
  sweet_treat VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  manages_leads VARCHAR(255),
  handles_consult_scheduling VARCHAR(255),
  presents_treatment_plans VARCHAR(255),
  manages_financing VARCHAR(255),
  handles_content_social_media VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_details_id UUID NOT NULL REFERENCES team_details(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  years_with_practice VARCHAR(255),
  email VARCHAR(255),
  cell_phone VARCHAR(255),
  fun_fact_personality TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS culture_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  team_biggest_strength TEXT,
  workflow_improvement_area TEXT,
  disorganized_systems TEXT,
  celebration_method TEXT,
  favorite_lunch_spot VARCHAR(255),
  team_rituals_traditions TEXT,
  team_theme_song VARCHAR(255),
  social_glue_person VARCHAR(255),
  office_brand_color VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  patient_travel_distance VARCHAR(50),
  market_saturation_level VARCHAR(50),
  competitor_marketing_types TEXT[] DEFAULT '{}',
  competitor_b2b_marketing TEXT,
  lost_case_to_competitor TEXT,
  gained_patient_from_competitor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competitor_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_analysis_id UUID NOT NULL REFERENCES market_analysis(id) ON UPDATE CASCADE ON DELETE CASCADE,
  competitor_name VARCHAR(255) NOT NULL,
  years_in_area INTEGER,
  approx_price_per_arch VARCHAR(255),
  strengths TEXT,
  weaknesses TEXT,
  target_patients TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pricing_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  arch_type VARCHAR(50),
  price_range VARCHAR(255),
  financing_options VARCHAR(255),
  price_position VARCHAR(50),
  offering_advantages TEXT,
  unique_competitive_edge TEXT,
  full_arch_offering TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_perception (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  barriers_to_attracting_cases TEXT,
  perception_to_fix TEXT,
  practice_tier VARCHAR(50),
  tier_perception_reason TEXT,
  worked_with_marketing_agency BOOLEAN,
  previous_marketing_companies TEXT,
  marketing_services_received TEXT[] DEFAULT '{}',
  what_worked_well TEXT,
  what_didnt_work TEXT,
  what_was_missing TEXT,
  why_stopped_working TEXT,
  wolf_of_arches_expectations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_documents (
  id BIGSERIAL PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  original_name VARCHAR(500) NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  document_type VARCHAR(100),
  upload_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS business_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  spreadsheet_id VARCHAR(255) NOT NULL UNIQUE,
  spreadsheet_url TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  action VARCHAR(255) NOT NULL,
  crud_operation VARCHAR(50) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(20) NOT NULL,
  status_code INTEGER NOT NULL,
  ip_address INET,
  request_data JSONB,
  response_data JSONB,
  environment VARCHAR(50) NOT NULL DEFAULT 'development',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ghl_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  ghl_pipeline_id VARCHAR(255) NOT NULL UNIQUE,
  location_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  pipeline_id UUID NOT NULL REFERENCES ghl_pipelines(id) ON UPDATE CASCADE ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_business_pipeline UNIQUE (business_id, pipeline_id)
);

CREATE TABLE IF NOT EXISTS user_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_business UNIQUE (user_id, business_id)
);

CREATE TABLE IF NOT EXISTS user_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON UPDATE CASCADE ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_service_business UNIQUE (user_id, service_id, business_id)
);

CREATE TABLE IF NOT EXISTS lead_tracker (
  id BIGSERIAL PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  sheet_id UUID REFERENCES business_sheets(id) ON UPDATE CASCADE ON DELETE SET NULL,
  sheet_row_number INTEGER NOT NULL,
  date_lead_received DATE,
  date_lead_called DATE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  procedure TEXT,
  caller TEXT,
  locations TEXT,
  call_status TEXT,
  booked_status TEXT,
  dental_va_call_note TEXT,
  time_lead_received TIME,
  time_lead_called TIME,
  timing TEXT,
  dentalpro_va TEXT,
  time_difference TEXT,
  notes TEXT,
  day1_note TEXT,
  day2_note TEXT,
  day3_note TEXT,
  day4_note TEXT,
  day5_note TEXT,
  day6_note TEXT,
  day7_note TEXT,
  callback_8 TEXT,
  callback_9 TEXT,
  callback_10 TEXT,
  follow_up_note TEXT,
  CONSTRAINT unique_lead_tracker_row UNIQUE (business_id, sheet_row_number)
);

CREATE TABLE IF NOT EXISTS booked_tracker (
  id BIGSERIAL PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  sheet_id UUID REFERENCES business_sheets(id) ON UPDATE CASCADE ON DELETE SET NULL,
  sheet_row_number INTEGER NOT NULL,
  date_lead_received DATE,
  date_scheduled DATE,
  appt_date DATE,
  appt_time TIME,
  first_name TEXT,
  last_name TEXT,
  patient_dob DATE,
  phone TEXT,
  procedure TEXT,
  woa_notes TEXT,
  location TEXT,
  show_status TEXT,
  treatment_status TEXT,
  clinic_notes_from_consult TEXT,
  CONSTRAINT unique_booked_tracker_row UNIQUE (business_id, sheet_row_number)
);

CREATE TABLE IF NOT EXISTS srvconboardingquestionssection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON UPDATE CASCADE ON DELETE CASCADE,
  section_name VARCHAR(255) NOT NULL,
  section_title VARCHAR(255),
  section_description TEXT,
  section_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_section_per_service UNIQUE (service_id, section_name)
);

CREATE TABLE IF NOT EXISTS srvconboardingquestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON UPDATE CASCADE ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES srvconboardingquestionssection(id) ON UPDATE CASCADE ON DELETE CASCADE,
  field_name VARCHAR(255) NOT NULL,
  label TEXT NOT NULL,
  field_type VARCHAR(50) NOT NULL,
  placeholder VARCHAR(255),
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL,
  options JSONB,
  yup_validation JSONB,
  default_value TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_field_per_page UNIQUE (service_id, section_id, field_name)
);

CREATE TABLE IF NOT EXISTS brand_roadmap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_weeks INTEGER,
  total_months INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_roadmap_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES brand_roadmap(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  theme VARCHAR(255),
  phase_order INTEGER,
  start_week INTEGER,
  end_week INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_roadmap_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES brand_roadmap(id) ON UPDATE CASCADE ON DELETE CASCADE,
  phase_id UUID NOT NULL REFERENCES brand_roadmap_phases(id) ON UPDATE CASCADE ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title VARCHAR(255),
  description TEXT,
  display_label VARCHAR(50),
  sort_order INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID NOT NULL REFERENCES brand_roadmap_weeks(id) ON UPDATE CASCADE ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER,
  woa_responsibilities TEXT,
  client_responsibilities TEXT,
  client_instructions TEXT,
  checklist_items JSONB,
  reflective_question TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE,
  service_id UUID NOT NULL UNIQUE REFERENCES services(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  roadmap_id UUID NOT NULL REFERENCES brand_roadmap(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_by UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_plan_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES brand_plans(id) ON UPDATE CASCADE ON DELETE CASCADE,
  week_id UUID NOT NULL REFERENCES brand_roadmap_weeks(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  week_number INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'locked',
  enabled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  enabled_reason VARCHAR(30),
  auto_unlock_after_days INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_brand_plan_week UNIQUE (plan_id, week_id)
);

CREATE TABLE IF NOT EXISTS brand_plan_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_week_id UUID NOT NULL REFERENCES brand_plan_weeks(id) ON UPDATE CASCADE ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES brand_roadmap_tasks(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  completed_by UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  reflection_answer TEXT,
  checklist_state JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_brand_plan_task UNIQUE (plan_week_id, task_id)
);

CREATE TABLE IF NOT EXISTS brand_task_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_task_id UUID NOT NULL REFERENCES brand_plan_tasks(id) ON UPDATE CASCADE ON DELETE CASCADE,
  original_name VARCHAR(500) NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  upload_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  uploaded_by UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS brand_task_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_task_id UUID NOT NULL REFERENCES brand_plan_tasks(id) ON UPDATE CASCADE ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  author_type VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_by UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  edited_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_onboarding_questions_step_section_order ON onboarding_questions(step_id, section_id, display_order);
CREATE INDEX IF NOT EXISTS idx_onboarding_questions_section_order ON onboarding_questions(section_id, display_order);
CREATE INDEX IF NOT EXISTS idx_srv_onboarding_questions_step_section_order ON srvconboardingquestions(service_id, section_id, display_order);
CREATE INDEX IF NOT EXISTS idx_business_documents_business_id ON business_documents(business_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);