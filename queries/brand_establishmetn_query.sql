                                    -- Brand Roadmap 

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


                                    -- Brand Roadmap Phases

CREATE TABLE IF NOT EXISTS brand_roadmap_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  theme VARCHAR(255),
  phase_order INTEGER,
  start_week INTEGER,
  end_week INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_brand_roadmap_phases_roadmap
    FOREIGN KEY (roadmap_id)
    REFERENCES brand_roadmap (id)
    ON DELETE CASCADE
);


                                    -- Brand Roadmap Weeks

CREATE TABLE IF NOT EXISTS brand_roadmap_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL,
  phase_id UUID NOT NULL,
  week_number INTEGER NOT NULL,
  title VARCHAR(255),
  description TEXT,
  display_label VARCHAR(50), 
  sort_order INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_roadmap_weeks_roadmap
    FOREIGN KEY (roadmap_id)
    REFERENCES brand_roadmap (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_roadmap_weeks_phase
    FOREIGN KEY (phase_id)
    REFERENCES brand_roadmap_phases (id)
    ON DELETE CASCADE
);
                                    -- Brand Roadmap Tasks


CREATE TABLE IF NOT EXISTS brand_roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID NOT NULL,
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_roadmap_tasks_week
    FOREIGN KEY (week_id)
    REFERENCES brand_roadmap_weeks (id)
    ON DELETE CASCADE
);

                                    -- Brand Plan 

CREATE TABLE IF NOT EXISTS brand_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  service_id UUID NOT NULL,
  roadmap_id UUID NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'paused')),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_brand_plans_business
    FOREIGN KEY (business_id)
    REFERENCES businesses (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_brand_plans_service
    FOREIGN KEY (service_id)
    REFERENCES services (id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_brand_plans_roadmap
    FOREIGN KEY (roadmap_id)
    REFERENCES brand_roadmap (id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_brand_plans_created_by
    FOREIGN KEY (created_by)
    REFERENCES users (id)
    ON DELETE RESTRICT,

  CONSTRAINT uq_brand_plans_business_service
    UNIQUE (business_id, service_id)
);


                                  -- Brand Plan Week 

CREATE TABLE IF NOT EXISTS brand_plan_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL,
  week_id UUID NOT NULL,
  week_number INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'locked'
    CHECK (status IN ('locked', 'active', 'completed')),
  enabled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  enabled_reason VARCHAR(30)
    CHECK (enabled_reason IN ('tasks_completed', 'auto_time', 'manual_admin')),
  auto_unlock_after_days INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_brand_plan_weeks_plan
    FOREIGN KEY (plan_id)
    REFERENCES brand_plans (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_brand_plan_weeks_week
    FOREIGN KEY (week_id)
    REFERENCES brand_roadmap_weeks (id)
    ON DELETE RESTRICT,

  CONSTRAINT uq_brand_plan_weeks_plan_week
    UNIQUE (plan_id, week_id)
);


                                    -- Brand Plan Tasks   
                                
CREATE TABLE IF NOT EXISTS brand_plan_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_week_id UUID NOT NULL,
  task_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_by UUID,
  completed_at TIMESTAMPTZ,
  reflection_answer TEXT,
  checklist_state JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_brand_plan_tasks_plan_week
    FOREIGN KEY (plan_week_id)
    REFERENCES brand_plan_weeks (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_brand_plan_tasks_task
    FOREIGN KEY (task_id)
    REFERENCES brand_roadmap_tasks (id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_brand_plan_tasks_completed_by
    FOREIGN KEY (completed_by)
    REFERENCES users (id)
    ON DELETE SET NULL,

  CONSTRAINT uq_brand_plan_tasks_plan_week_task
    UNIQUE (plan_week_id, task_id)
);

                                              -- Brand Task Document 

CREATE TABLE IF NOT EXISTS brand_task_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_task_id UUID NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,          
  mime_type VARCHAR(100) NOT NULL,
  upload_status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (
      upload_status IN (
        'pending',
        'uploading',
        'completed',
        'failed'
      )
    ),
  uploaded_by UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT fk_brand_task_documents_plan_task
    FOREIGN KEY (plan_task_id)
    REFERENCES brand_plan_tasks (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_brand_task_documents_uploaded_by
    FOREIGN KEY (uploaded_by)
    REFERENCES users (id)
    ON DELETE RESTRICT
);

                                        -- Brand Plan Notes 

CREATE TABLE IF NOT EXISTS brand_task_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_task_id UUID NOT NULL,
  author_id UUID NOT NULL,
  author_type VARCHAR(20) NOT NULL
    CHECK (author_type IN ('User', 'Admin', 'SuperAdmin', 'SuperUser')),
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_by UUID,
  edited_at TIMESTAMPTZ,
  
  CONSTRAINT fk_brand_task_notes_plan_task
    FOREIGN KEY (plan_task_id)
    REFERENCES brand_plan_tasks (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_brand_task_notes_author
    FOREIGN KEY (author_id)
    REFERENCES users (id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_brand_task_notes_edited_by
    FOREIGN KEY (edited_by)
    REFERENCES users (id)
    ON DELETE SET NULL
);
