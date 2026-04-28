CREATE OR REPLACE FUNCTION generate_uuid_for_onboarding_questions()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id IS NULL THEN
        NEW.id = gen_random_uuid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_uuid_onboarding_questions
    BEFORE INSERT ON onboarding_questions
    FOR EACH ROW
    EXECUTE FUNCTION generate_uuid_for_onboarding_questions();

-- Business Details Questions
INSERT INTO onboarding_questions (step_id, section_id, field_name, label, field_type, placeholder, is_required, display_order, yup_validation, is_active, created_at, updated_at)
VALUES
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'practice_name', 'Practice Name', 'text', 'Enter your practice name', true, 1, '{"type": "string", "required": true, "min": 1, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'primary_office_address', 'Primary Office Address', 'textarea', 'Include suite # if applicable', true, 2, '{"type": "string", "required": true, "min": 5}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'phone_number', 'Phone Number', 'tel', 'Enter your phone number', true, 3, '{"type": "string", "required": true, "min": 10, "max": 20}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'email_address', 'Email Address', 'email', 'Main contact email', true, 4, '{"type": "string", "required": true, "email": true}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'website', 'Website', 'text', 'www.yourpractice.com', true, 5, '{"type": "string", "required": true, "matches": "^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w- ./?%&=]*)?$"}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'social_media_handles', 'Social Media Handles', 'textarea', 'List your social media profiles', true, 6, '{"type": "string", "required": true, "min": 1}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'years_in_operation', 'How long has your practice been in operation?', 'text', 'e.g., 5 years, 18 months', true, 7, '{"type": "string", "required": true, "min": 1}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'accepts_new_patients', 'Do you currently accept new patients?', 'boolean', null, true, 8, '{"type": "boolean", "required": true}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'pms_software', 'What PMS (Practice Management Software) are you using?', 'text', 'e.g., Dentrix, Eaglesoft, etc.', true, 9, '{"type": "string", "required": true, "min": 1}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'b1b2c3d4-e5f6-7890-1234-567890abcdef', 'success_vision', 'What does "success" look like for your practice 12 months from now?', 'textarea', 'Describe your vision of success...', true, 10, '{"type": "string", "required": true, "min": 10}', true, NOW(), NOW());

-- Doctor Details Questions
INSERT INTO onboarding_questions (step_id, section_id, field_name, label, field_type, placeholder, is_required, display_order, yup_validation, is_active, created_at, updated_at)
VALUES
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'full_name', 'Full Name', 'text', 'Enter your full name', true, 1, '{"type": "string", "required": true, "min": 2, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'nickname', 'Nickname or what you prefer to be called?', 'text', 'What should we call you?', true, 2, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'email_address', 'Email Address', 'email', 'Your personal email', true, 3, '{"type": "string", "required": true, "email": true}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'birthday', 'Birthday (optional but fun)', 'date', 'MM/DD/YYYY', false, 4, '{"type": "date"}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'motivation', 'What motivates you most as a provider?', 'textarea', 'Share what drives your passion for healthcare...', true, 5, '{"type": "string", "required": true, "min": 10}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'leadership_style', 'How do you define your leadership style?', 'textarea', 'Describe your approach to leadership...', true, 6, '{"type": "string", "required": true, "min": 10}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'improvement_goal', 'What''s something you''re working on improving this year (professionally or personally)?', 'textarea', 'Share your improvement goals...', true, 7, '{"type": "string", "required": true, "min": 5}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'spouse_partner_name', 'Spouse/Partner''s Name (optional)', 'text', 'Your partner''s name', false, 8, '{"type": "string", "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'children_names_ages', 'Children''s Names and Ages (optional)', 'text', 'e.g., Sarah (12), Mike (8)', false, 9, '{"type": "string", "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'favorite_restaurant', 'Favorite restaurant or lunch spot near the clinic?', 'text', 'Where do you love to eat?', true, 10, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'office_music', 'What music is usually playing in the office?', 'text', 'Your office playlist vibes', true, 11, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'clone_team_member', 'If you could clone one team member, who would it be—and why?', 'text', 'Name and reason', true, 12, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'coffee_order', 'What is your typical coffee order (Starbucks or otherwise)?', 'text', 'Your go-to coffee order', true, 13, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'c1b2c3d4-e5f6-7890-1234-567890abcdef', 'sweet_treat', 'What is your choice sweet treat?', 'text', 'Your favorite dessert or snack', true, 14, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW());

-- Team Details Questions
INSERT INTO onboarding_questions (step_id, section_id, field_name, label, field_type, placeholder, is_required, display_order, yup_validation, is_active, created_at, updated_at)
VALUES
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'd1b2c3d4-e5f6-7890-1234-567890abcdef', 'manages_leads', 'Who manages incoming leads or new patient inquiries?', 'text', 'Team member name or role', true, 1, '{"type": "string", "required": true, "min": 1}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'd1b2c3d4-e5f6-7890-1234-567890abcdef', 'handles_consult_scheduling', 'Who handles consult scheduling?', 'text', 'Team member name or role', true, 2, '{"type": "string", "required": true, "min": 1}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'd1b2c3d4-e5f6-7890-1234-567890abcdef', 'presents_treatment_plans', 'Who presents treatment plans?', 'text', 'Team member name or role', true, 3, '{"type": "string", "required": true, "min": 1}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'd1b2c3d4-e5f6-7890-1234-567890abcdef', 'manages_financing', 'Who manages financing?', 'text', 'Team member name or role', true, 4, '{"type": "string", "required": true, "min": 1}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'd1b2c3d4-e5f6-7890-1234-567890abcdef', 'handles_content_social_media', 'Who takes photos or handles content/social media?', 'text', 'Team member name or role', true, 5, '{"type": "string", "required": true, "min": 1}', true, NOW(), NOW());

INSERT INTO onboarding_questions (step_id, section_id, field_name, label, field_type, placeholder, is_required, display_order, options, yup_validation, is_active, created_at, updated_at)
VALUES
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'd1b2c3d4-e5f6-7890-1234-567890abcdef', 'team_members', 'Team Members Information', 'table', null, true, 1, 
'[
  {"field": "name", "label": "Name", "type": "text", "required": true},
  {"field": "role", "label": "Role", "type": "select", "required": true, "options": [
    {"value":"doctor","label":"Doctor"},
    {"value":"surgical_assistant","label":"Surgical Assistant"},
    {"value":"treatment_coordinator","label":"Treatment Coordinator"},
    {"value":"marketing_lead","label":"Marketing Lead"},
    {"value":"patient_financing_coordinator","label":"Patient Financing Coordinator"},
    {"value":"lab_manager","label":"Lab Manager"},
    {"value":"product_inventory_lead","label":"Product Inventory Lead"},
    {"value":"other","label":"Other"}
  ]},
  {"field": "years_with_practice", "label": "Years with Practice", "type": "text", "required": false},
  {"field": "email", "label": "Email", "type": "email", "required": false},
  {"field": "cell_phone", "label": "Cell (if used for work)", "type": "tel", "required": false},
  {"field": "fun_fact_personality", "label": "Fun Fact or Personality Trait", "type": "text", "required": false}
]', 
'{"type": "array", "required": true, "min": 1}', true, NOW(), NOW());

-- Culture Details Questions
INSERT INTO onboarding_questions (step_id, section_id, field_name, label, field_type, placeholder, is_required, display_order, yup_validation, is_active, created_at, updated_at)
VALUES
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'f1b2c3d4-e5f6-7890-1234-567890abcdef', 'team_biggest_strength', 'What is your team''s biggest strength?', 'textarea', 'Describe your team''s greatest asset...', true, 1, '{"type": "string", "required": true, "min": 10}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'f1b2c3d4-e5f6-7890-1234-567890abcdef', 'workflow_improvement_area', 'What area of your team workflow needs the most improvement?', 'textarea', 'What could work better?', true, 2, '{"type": "string", "required": true, "min": 5}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'f1b2c3d4-e5f6-7890-1234-567890abcdef', 'disorganized_systems', 'What internal systems feel disorganized or chaotic?', 'textarea', 'Areas that need organization...', true, 3, '{"type": "string", "required": true, "min": 5}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'f1b2c3d4-e5f6-7890-1234-567890abcdef', 'celebration_method', 'When your team wins, how do you celebrate?', 'textarea', 'How do you celebrate success?', true, 4, '{"type": "string", "required": true, "min": 5}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'f1b2c3d4-e5f6-7890-1234-567890abcdef', 'favorite_lunch_spot', 'What is your team''s go-to lunch order or favorite delivery spot?', 'text', 'Team''s favorite food place', true, 5, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'f1b2c3d4-e5f6-7890-1234-567890abcdef', 'team_rituals_traditions', 'Is there a ritual or tradition your team looks forward to each week/month/year?', 'textarea', 'Special traditions or rituals...', true, 6, '{"type": "string", "required": true, "min": 5}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'f1b2c3d4-e5f6-7890-1234-567890abcdef', 'team_theme_song', 'If your team had a theme song, what would it be?', 'text', 'Your team''s anthem', true, 7, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'f1b2c3d4-e5f6-7890-1234-567890abcdef', 'social_glue_person', 'Who is your office''s ''social glue''—the one who keeps morale high?', 'text', 'The team''s morale booster', true, 8, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW()),
('6115dc22-7068-4e52-8fd7-1396cbde0064', 'f1b2c3d4-e5f6-7890-1234-567890abcdef', 'office_brand_color', 'What is your office''s "brand color"?', 'text', 'Your signature color', true, 9, '{"type": "string", "required": true, "max": 255}', true, NOW(), NOW());











-- Step 2: Insert Onboarding Sections for Positioning & Clarity
INSERT INTO onboarding_sections (id, step_id, section_name, section_title, section_description, section_order, is_active, created_at, updated_at)
VALUES 
-- Market Analysis Section
(
    'a2b3c4d5-e6f7-8901-2345-678901234567',
    'c0a69ff0-1ba6-4a86-b632-b740dd681a1a',
    'market_analysis',
    'Market Analysis',
    'Understanding your local market landscape and competitive positioning',
    1,
    true,
    NOW(),
    NOW()
),
-- Competitors Section
(
    'b2b3c4d5-e6f7-8901-2345-678901234567',
    'c0a69ff0-1ba6-4a86-b632-b740dd681a1a',
    'competitors',
    'Competitor Analysis',
    'Detailed information about your local competitors',
    2,
    true,
    NOW(),
    NOW()
),
-- Pricing Details Section
(
    'c2b3c4d5-e6f7-8901-2345-678901234567',
    'c0a69ff0-1ba6-4a86-b632-b740dd681a1a',
    'pricing_details',
    'Your Pricing, Positioning & Perception',
    'Understanding your pricing strategy and competitive advantages',
    3,
    true,
    NOW(),
    NOW()
),
-- Market Perception Section
(
    'd2b3c4d5-e6f7-8901-2345-678901234567',
    'c0a69ff0-1ba6-4a86-b632-b740dd681a1a',
    'market_perception',
    'Market Perception & Opportunities',
    'Understanding barriers and previous marketing experiences',
    4,
    true,
    NOW(),
    NOW()
);

-- Market Analysis Questions
INSERT INTO onboarding_questions (step_id, section_id, field_name, label, field_type, placeholder, is_required, display_order, options, yup_validation, is_active, created_at, updated_at)
VALUES
('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'a2b3c4d5-e6f7-8901-2345-678901234567', 'patient_travel_distance', 'How far do most of your full-arch patients travel from?', 'radio', null, true, 1, 
'[
  {"value": "under_5_miles", "label": "<5 miles"},
  {"value": "10_to_60_miles", "label": "10-60 miles"},
  {"value": "100_to_200_miles", "label": "100-200 miles"},
  {"value": "over_200_miles", "label": "200+ miles"}
]', 
'{"type": "string", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'a2b3c4d5-e6f7-8901-2345-678901234567', 'market_saturation_level', 'In your opinion, how saturated is your local market with other practices offering full-arch treatment?', 'radio', null, true, 2, 
'[
  {"value": "very_saturated", "label": "Very Saturated"},
  {"value": "somewhat_saturated", "label": "Somewhat Saturated"},
  {"value": "not_saturated", "label": "Not Saturated"},
  {"value": "unsure", "label": "Unsure"}
]', 
'{"type": "string", "required": true}', true, NOW(), NOW()),
('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'a2b3c4d5-e6f7-8901-2345-678901234567', 'competitors', 'Please list 3–5 of your top local competitors offering full-arch treatments:', 'table', null, true, 3, 
'[
  {"field": "competitor_name", "label": "Competitor Name", "type": "text", "required": true},
  {"field": "years_in_area", "label": "Years in Area", "type": "number", "required": false},
  {"field": "approx_price_per_arch", "label": "Approx. Price per Arch", "type": "text", "required": false},
  {"field": "strengths", "label": "Strengths", "type": "textarea", "required": false},
  {"field": "weaknesses", "label": "Weaknesses", "type": "textarea", "required": false},
  {"field": "patient_types", "label": "What kind of patients do they attract?", "type": "textarea", "required": false}
]', 
'{"type": "array", "required": true, "min": 0, "max": 5}', true, NOW(), NOW()),
('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'a2b3c4d5-e6f7-8901-2345-678901234567', 'competitor_marketing_types', 'What kind of marketing do these competitors typically do? (Check all that apply)', 'checkbox', null, true, 4, 
'[
  {"value": "tv_radio_ads", "label": "TV / Radio Ads"},
  {"value": "google_ads_seo", "label": "Google Ads / SEO"},
  {"value": "social_media", "label": "Social Media"},
  {"value": "direct_mail", "label": "Direct Mail"},
  {"value": "billboards", "label": "Billboards"},
  {"value": "internal_referral_network", "label": "Internal Referral Network (B2B)"},
  {"value": "patient_facing_campaigns", "label": "Patient-Facing Campaigns (B2C)"},
  {"value": "events_ce_courses", "label": "Events / CE Courses"},
  {"value": "other", "label": "Other"}
]', 
'{"type": "array", "required": true}', true, NOW(), NOW()),
('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'a2b3c4d5-e6f7-8901-2345-678901234567', 'competitor_b2b_marketing', 'Do any of them market heavily to referring providers or dental specialists (B2B)? If so, who and how?', 'textarea', 'Describe B2B marketing activities...', true, 5, null, '{"type": "string", "required": true}', true, NOW(), NOW()),
('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'a2b3c4d5-e6f7-8901-2345-678901234567', 'lost_case_to_competitor', 'Have you ever lost a case to a competitor? If yes, who was it—and why do you think the patient chose them?', 'textarea', 'Describe the situation...', true, 6, null, '{"type": "string", "required": true}', true, NOW(), NOW()),
('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'a2b3c4d5-e6f7-8901-2345-678901234567', 'gained_patient_from_competitor', 'Have you gained a patient from a neighboring office? Why did they choose your practice over the other?', 'textarea', 'Describe why they switched...', true, 7, null, '{"type": "string", "required": true}', true, NOW(), NOW());


-- Pricing Details Questions
INSERT INTO onboarding_questions (step_id, section_id, field_name, label, field_type, placeholder, is_required, display_order, options, yup_validation, is_active, created_at, updated_at)
VALUES
('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'c2b3c4d5-e6f7-8901-2345-678901234567', 'arch_type', 'What is your current price per arch (all-in)?', 'radio', null, true, 1, 
'[
  {"value": "fixed", "label": "Fixed"},
  {"value": "removable", "label": "Removable"}
]', 
'{"type": "string", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'c2b3c4d5-e6f7-8901-2345-678901234567', 'price_range', 'Price Range:', 'text', 'Enter your price range', true, 2, null, '{"type": "string", "required": true, "min": 1}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'c2b3c4d5-e6f7-8901-2345-678901234567', 'financing_options', 'Do you offer financing options? If so, which lenders?', 'text', 'List your financing options and lenders', true, 3, null, '{"type": "string", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'c2b3c4d5-e6f7-8901-2345-678901234567', 'price_position', 'Do you believe price is your advantage, disadvantage, or neutral compared to competitors?', 'radio', null, true, 4, 
'[
  {"value": "advantage", "label": "Advantage"},
  {"value": "disadvantage", "label": "Disadvantage"},
  {"value": "neutral", "label": "Neutral"},
  {"value": "depends_on_case", "label": "Depends on case"}
]', 
'{"type": "string", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'c2b3c4d5-e6f7-8901-2345-678901234567', 'offering_advantages', 'What makes your full-arch offering ***better*** than what your competitors provide? (Don''t be modest—we want the real reasons!)', 'textarea', 'Describe your competitive advantages...', true, 5, null, '{"type": "string", "required": true, "min": 10}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'c2b3c4d5-e6f7-8901-2345-678901234567', 'unique_competitive_edge', 'What do you believe is your #1 unique competitive edge?', 'textarea', 'Your top competitive differentiator...', true, 6, null, '{"type": "string", "required": true, "min": 5}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'c2b3c4d5-e6f7-8901-2345-678901234567', 'full_arch_offering', 'Which of the following are true for your full-arch offering?', 'checkbox', null, true, 7, 
'[
  {"value": "faster_treatment_timeline", "label": "Faster treatment timeline"},
  {"value": "same_day_teeth", "label": "Same-day teeth"},
  {"value": "onsite_lab_digital", "label": "On-site lab or digital integration"},
  {"value": "inhouse_sedation", "label": "In-house sedation / GA"},
  {"value": "published_cases", "label": "Published cases / influencer-level credibility"},
  {"value": "premium_implant_system", "label": "Premium implant system / biomaterials"},
  {"value": "lifetime_warranty", "label": "Lifetime warranty / guarantee"},
  {"value": "other", "label": "Other differentiators"}
]', 
'{"type": "array", "required": true}', true, NOW(), NOW());


-- Market Perception Questions
INSERT INTO onboarding_questions (step_id, section_id, field_name, label, field_type, placeholder, is_required, display_order, options, yup_validation, is_active, created_at, updated_at)
VALUES
('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'barriers_to_attracting_cases', 'In your opinion, what are your biggest barriers to attracting more full-arch cases?', 'textarea', 'Describe your main barriers...', true, 1, null, '{"type": "string", "required": true, "min": 10}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'perception_to_fix', 'If we could wave a magic wand and fix one perception patients have about your practice, what would it be?', 'textarea', 'What perception would you change?', true, 2, null, '{"type": "string", "required": true, "min": 5}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'practice_tier', 'Would you consider your practice to be a premium, mid-tier, or value provider in the eyes of patients?', 'radio', null, true, 3, 
'[
  {"value": "premium", "label": "Premium"},
  {"value": "mid_tier", "label": "Mid-tier"},
  {"value": "budget_value", "label": "Budget / Value"}
]', 
'{"type": "string", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'tier_perception_reason', 'Why do you believe patients perceive it that way?', 'textarea', 'Explain the reasoning...', true, 4, null, '{"type": "string", "required": true, "min": 5}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'worked_with_marketing_agency', 'Have you previously worked with a marketing agency or consultant?', 'boolean', null, true, 5, null, '{"type": "boolean", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'previous_marketing_companies', 'If yes, please list the companies you''ve worked with (past or current):', 'textarea', 'List previous marketing companies...', true, 6, null, '{"type": "string", "required": false, "conditional_required": {"field": "worked_with_marketing_agency", "value": true}}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'marketing_services_received', 'What services did they provide?', 'checkbox', null, true, 7, 
'[
  {"value": "website_design", "label": "Website design"},
  {"value": "google_ads_seo", "label": "Google Ads / SEO"},
  {"value": "facebook_instagram_ads", "label": "Facebook / Instagram Ads"},
  {"value": "lead_management_crm", "label": "Lead management / CRM"},
  {"value": "social_media_content", "label": "Social media content"},
  {"value": "branding_logo_identity", "label": "Branding / Logo / Identity"},
  {"value": "other", "label": "Other"}
]', 
'{"type": "array", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'what_worked_well', 'What worked well with those marketing efforts?', 'textarea', 'Describe what was successful...', true, 9, null, '{"type": "string", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'what_didnt_work', 'What didn''t work or fell short of expectations?', 'textarea', 'Describe what didn''t work...', true, 10, null, '{"type": "string", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'what_was_missing', 'What was missing from their approach that you hoped for but didn''t receive?', 'textarea', 'What was missing...', true, 11, null, '{"type": "string", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'why_stopped_working', 'What ultimately made you decide to stop working with them (if applicable)?', 'textarea', 'Why did you stop working with them...', true, 12, null, '{"type": "string", "required": true}', true, NOW(), NOW()),

('c0a69ff0-1ba6-4a86-b632-b740dd681a1a', 'd2b3c4d5-e6f7-8901-2345-678901234567', 'wolf_of_arches_expectations', 'What do you hope will feel different or better about working with Wolf of Arches?', 'textarea', 'Your expectations for working with us...', true, 13, null, '{"type": "string", "required": true, "min": 10}', true, NOW(), NOW());