CREATE OR REPLACE FUNCTION generate_uuid_for_srvconboardingquestions()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id IS NULL THEN
        NEW.id = gen_random_uuid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_uuid_srvconboardingquestions
    BEFORE INSERT ON srvconboardingquestions
    FOR EACH ROW
    EXECUTE FUNCTION generate_uuid_for_srvconboardingquestions();

-- Insert 24/7 SMILE SUPPORT Questions
INSERT INTO srvconboardingquestions ( service_id, section_id, field_name, label, field_type, placeholder, is_required, display_order, options, yup_validation, default_value, is_active, created_at, updated_at)
VALUES
-- PRACTICE PROFILE
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '24d1a5cb-3384-4f43-aac6-1c5b6dc49d16', 'practice_name', 'What is the name of your dental practice?', 'text', 'Enter practice name', true, 1, NULL, '{"type": "string", "required": true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '24d1a5cb-3384-4f43-aac6-1c5b6dc49d16', 'total_locations', 'How many total locations does your practice have?', 'number', 'e.g. 2', true, 2, NULL, '{"type": "number", "required": true, "min": 1}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '24d1a5cb-3384-4f43-aac6-1c5b6dc49d16', 'location_addresses', 'Please list the full addresses of each location.', 'textarea', 'Enter addresses', true, 3, NULL, '{"type": "string", "required": true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '24d1a5cb-3384-4f43-aac6-1c5b6dc49d16', 'main_phone', 'Main phone number for the practice:', 'text', 'e.g. (555) 123-4567', true, 4, NULL, '{"type": "string", "required": true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '24d1a5cb-3384-4f43-aac6-1c5b6dc49d16', 'office_hours', 'What are your general office hours? (Specify by day if needed)', 'textarea', 'Enter office hours', true, 5, NULL, '{"type": "string", "required": true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '24d1a5cb-3384-4f43-aac6-1c5b6dc49d16', 'practice_software', 'What CRM or practice management software are you currently using?', 'select', 'Select software', true, 6,
 '[{"value":"dentrix","label":"Dentrix"},{"value":"opendental","label":"Open Dental"},{"value":"eaglesoft","label":"Eaglesoft"},{"value":"carestack","label":"CareStack"},{"value":"cloud9","label":"Cloud9"},{"value":"shape","label":"Shape"},{"value":"other","label":"Other"}]',
 '{"type": "string", "required": true}', NULL, true, now(), now()),

-- CONSULT SCHEDULING DETAILS
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '13fe3fe5-b659-4aa9-a727-a8d2a125ac38', 'available_hours', 'What are your available hours for scheduling new consults?', 'textarea', 'e.g. Monday–Friday, 9am–4pm', true, 1, NULL, '{"type": "string", "required": true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '13fe3fe5-b659-4aa9-a727-a8d2a125ac38', 'consult_duration', 'What is the preferred duration for a full-arch consult?', 'radio', NULL, true, 2,
 '[{"value":"15","label":"15 minutes"},{"value":"30","label":"30 minutes"},{"value":"45","label":"45 minutes"},{"value":"60","label":"60 minutes"},{"value":"custom","label":"Custom"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '13fe3fe5-b659-4aa9-a727-a8d2a125ac38', 'same_day_appt', 'Would you like us to offer same-day appointments if available?', 'radio', NULL, true, 3,
 '[{"value":"yes","label":"Yes"},{"value":"no","label":"No"},{"value":"if_requested","label":"Only if requested"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '13fe3fe5-b659-4aa9-a727-a8d2a125ac38', 'double_booking', 'Can we double book a consultation?', 'radio', NULL, true, 4,
 '[{"value":"yes","label":"Yes"},{"value":"no","label":"No"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '13fe3fe5-b659-4aa9-a727-a8d2a125ac38', 'phone_coverage', 'What is your preferred timeframe for phone answering coverage?', 'checkbox', NULL, true, 5,
 '[{"value":"weekdays_8_5","label":"Weekdays 8am–5pm"},{"value":"weekdays_5_8","label":"Weekdays 5pm–8pm"},{"value":"saturdays","label":"Saturdays"},{"value":"sundays","label":"Sundays"},{"value":"24_7","label":"24/7 coverage"},{"value":"other","label":"Other"}]',
 '{"type":"array","required":true}', NULL, true, now(), now()),

-- YOUR CONSULT TEAM
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '652fd6e0-0d4c-4ba9-82e4-7060f09aba4b', 'num_doctors', 'How many doctors at your practice currently perform consultations?', 'number', 'e.g. 3', true, 1, NULL, '{"type": "number", "required": true, "min":1}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '652fd6e0-0d4c-4ba9-82e4-7060f09aba4b', 'doctor_names', 'Please list the full names of each doctor who performs consults:', 'textarea', NULL, true, 2, NULL, '{"type": "string","required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '652fd6e0-0d4c-4ba9-82e4-7060f09aba4b', 'doctor_treatments', 'Which treatments does each doctor consult for?', 'textarea', NULL, true, 3, NULL, '{"type":"string","required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '652fd6e0-0d4c-4ba9-82e4-7060f09aba4b', 'num_treatment_coordinators', 'How many treatment coordinators handle consults in your office?', 'number', NULL, true, 4, NULL, '{"type":"number","required":true,"min":0}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '652fd6e0-0d4c-4ba9-82e4-7060f09aba4b', 'coordinator_names', 'Please list the names of each treatment coordinator who performs consults:', 'textarea', NULL, true, 5, NULL, '{"type":"string","required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '652fd6e0-0d4c-4ba9-82e4-7060f09aba4b', 'coordinator_treatments', 'Which treatments does each treatment coordinator consult for?', 'textarea', NULL, true, 6, NULL, '{"type":"string","required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '652fd6e0-0d4c-4ba9-82e4-7060f09aba4b', 'avg_monthly_consults', 'On average, how many consults does your team conduct per month across all locations?', 'number', NULL, true, 7, NULL, '{"type":"number","required":true,"min":0}', NULL, true, now(), now()),

-- COMMUNICATION & FOLLOW-UP
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'e826bacb-9717-4fac-8ad1-f6f7f0e09fec', 'primary_contact', 'Who is the primary point of contact for scheduling and patient coordination? (Name + Title)', 'text', 'e.g. John Smith – Office Manager', true, 1, NULL, '{"type":"string","required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'e826bacb-9717-4fac-8ad1-f6f7f0e09fec', 'primary_email', 'What is the best email address for your main point of contact?', 'email', 'e.g. contact@practice.com', true, 2, NULL, '{"type":"string","email":true,"required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'e826bacb-9717-4fac-8ad1-f6f7f0e09fec', 'primary_phone', 'What is the best direct phone number for this person?', 'text', 'e.g. (555) 987-6543', true, 3, NULL, '{"type":"string","required":true}', NULL, true, now(), now()),

-- ADDITIONAL DETAILS
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '6d44512c-788c-457e-8e95-959ead13d3b1', 'allow_texting', 'Do you allow texting for appointment reminders or reschedules?', 'radio', NULL, true, 1,
 '[{"value":"yes","label":"Yes"},{"value":"no","label":"No"},{"value":"not_sure","label":"Not sure"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '6d44512c-788c-457e-8e95-959ead13d3b1', 'preferred_script', 'Do you have a preferred script or phrases we should use when speaking with patients?', 'textarea', NULL, false, 2, NULL, '{"type":"string"}', NULL, true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', '6d44512c-788c-457e-8e95-959ead13d3b1', 'additional_info', 'Is there anything else we should know to represent your practice accurately?', 'textarea', NULL, false, 3, NULL, '{"type":"string"}', NULL, true, now(), now()),

--  Full Arch / All-on-4 FAQs
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','what_is_all_on_4','What is the All-on-4 procedure?','textarea',NULL,false,1,NULL,'{"type":"string"}',
 'It’s a full-arch dental implant treatment where 4–6 implants support a fixed set of teeth, usually completed in one day.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','how_many_teeth','How many teeth does All-on-4 replace?','textarea',NULL,false,2,NULL,'{"type":"string"}',
 'It replaces a full arch (all upper teeth, all lower teeth, or both).', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','surgery_time','How long does the surgery take?','textarea',NULL,false,3,NULL,'{"type":"string"}',
 'Usually 2–4 hours per arch, depending on complexity.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','same_day_teeth','Do I really get teeth the same day?','textarea',NULL,false,4,NULL,'{"type":"string"}',
 'Yes — you leave with a fixed temporary set of teeth the same day.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','recovery_time','What’s the recovery time for All-on-4?','textarea',NULL,false,5,NULL,'{"type":"string"}',
 'Initial healing is about 1–2 weeks.', true, now(), now()),
( 'ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','longevity','How long do All-on-4 implants last?','textarea',NULL,false,6,NULL,'{"type":"string"}',
 'With proper care, they can last 15–20+ years. The prosthetic teeth may need replacement or maintenance over time.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','cost_compare','Is All-on-4 cheaper than replacing teeth one by one?','textarea',NULL,false,7,NULL,'{"type":"string"}',
 'Yes — replacing all teeth with individual implants would cost far more. All-on-4 is more efficient.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','sedation','Do you offer sedation or general anesthesia?','textarea',NULL,false,8,NULL,'{"type":"string"}',
 'Yes, sedation options are available for comfort during surgery.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','eat_normally','Will I be able to eat normally right after surgery?','textarea',NULL,false,9,NULL,'{"type":"string"}',
 'You’ll start with soft foods for 1–2 weeks. Gradually, you can return to a normal diet once finals are in.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','financing','What are the financing options for full arch procedures?','textarea',NULL,false,10,NULL,'{"type":"string"}',
 'We offer multiple financing plans. Approval depends on credit.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','permanent','Is All-on-4 permanent or removable?','textarea',NULL,false,11,NULL,'{"type":"string"}',
 'It’s permanent and fixed — only your dentist can remove it.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','dentures_ok','What if I’ve worn dentures for years, can I still get this treatment?','textarea',NULL,false,12,NULL,'{"type":"string"}',
 'Yes, most patients can, but sometimes bone grafting may be needed.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','insurance_cover','Does my insurance cover this procedure?','textarea',NULL,false,13,NULL,'{"type":"string"}',
 'Most medical or dental insurances do not cover full-arch implants. Some may cover parts like extractions or diagnostics.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','credit_need','Do I need to have good credit to finance?','textarea',NULL,false,14,NULL,'{"type":"string"}',
 'Good credit helps, but there are lenders with flexible options.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10','cosigner','Can someone finance my treatment for me?','textarea',NULL,false,15,NULL,'{"type":"string"}',
 'Yes — a family member or co-signer can apply on your behalf.', true, now(), now());

-- Appointment & Consultation FAQs
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','f3b6a2b9-8b1b-47cd-8f72-5b8b3b2b7c11','consult_cost','How much does the consultation cost?','textarea',NULL,false,1,NULL,'{"type":"string"}',
 '$179, which typically includes an exam, full mouth X-rays, and CT scan. (For full arch cases, in most cases consultations are complimentary.)', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','f3b6a2b9-8b1b-47cd-8f72-5b8b3b2b7c11','consult_includes','What’s included in the consultation?','textarea',NULL,false,2,NULL,'{"type":"string"}',
 'An exam, CT scan, X-rays, and a personalized treatment plan.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','f3b6a2b9-8b1b-47cd-8f72-5b8b3b2b7c11','consult_length','How long does a consultation appointment usually take?','textarea',NULL,false,3,NULL,'{"type":"string"}',
 'About 30 minutes to 1 hour.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','f3b6a2b9-8b1b-47cd-8f72-5b8b3b2b7c11','virtual_consults','Do you offer virtual consultations?','textarea',NULL,false,4,NULL,'{"type":"string"}',
 'Yes — for initial evaluations and discussions.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','f3b6a2b9-8b1b-47cd-8f72-5b8b3b2b7c11','who_meet','Who will I meet during the consultation?','textarea',NULL,false,5,NULL,'{"type":"string"}',
 'The doctor, a treatment coordinator.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','f3b6a2b9-8b1b-47cd-8f72-5b8b3b2b7c11','bill_insurance','Will my insurance be billed for the consultation?','textarea',NULL,false,6,NULL,'{"type":"string"}',
 'No, consultations are complimentary.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','f3b6a2b9-8b1b-47cd-8f72-5b8b3b2b7c11','bring_to_appt','What do I need to bring to the appointment?','textarea',NULL,false,7,NULL,'{"type":"string"}',
 'ID, insurance card (if applicable), any medical history, and a list of medications.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','f3b6a2b9-8b1b-47cd-8f72-5b8b3b2b7c11','start_timeline','If I decide to move forward, how soon can I start treatment?','textarea',NULL,false,8,NULL,'{"type":"string"}',
 'In many cases, treatment can begin upon availability.', true, now(), now());

-- Single Dental Implant FAQs
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','7a2d2c3f-f2d1-4c1b-a7a1-6e2f3a4b9c12','single_cost','What is the cost of one dental implant?','textarea',NULL,false,1,NULL,'{"type":"string"}',
 'It varies by case, but generally ranges from $3,000–$5,000 per implant, including crown. This varies per clinic.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','7a2d2c3f-f2d1-4c1b-a7a1-6e2f3a4b9c12','single_duration','How long does a single implant procedure take?','textarea',NULL,false,2,NULL,'{"type":"string"}',
 'The surgical placement takes 30–60 minutes. Full treatment (including crown) usually takes 3–6 months.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','7a2d2c3f-f2d1-4c1b-a7a1-6e2f3a4b9c12','bone_graft_need','Do I need a bone graft before I can get an implant?','textarea',NULL,false,3,NULL,'{"type":"string"}',
 'Not always — only if there isn’t enough bone to support the implant.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','7a2d2c3f-f2d1-4c1b-a7a1-6e2f3a4b9c12','same_day_extract_place','Can you extract my tooth and place the implant on the same day?','textarea',NULL,false,4,NULL,'{"type":"string"}',
 'In some cases, yes. It depends on the bone condition and infection risk.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','7a2d2c3f-f2d1-4c1b-a7a1-6e2f3a4b9c12','final_crown_timing','How long does it take to get the final crown on the implant?','textarea',NULL,false,5,NULL,'{"type":"string"}',
 'Usually 3–6 months, after the implant integrates with the bone.', true, now(), now()),
('ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c','7a2d2c3f-f2d1-4c1b-a7a1-6e2f3a4b9c12','front_tooth_ok','Can a single implant replace a front tooth?','textarea',NULL,false,6,NULL,'{"type":"string"}',
 'Yes — implants are ideal for replacing missing front teeth and look very natural.', true, now(), now());







-- Insert BRAND ESTABLISHMENT Questions


-- SECTION 1: Brand Awareness & History
('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '7335bc65-a7fd-4ca2-b78e-7c0313522eb8', 'brand_marketing_investments', 'Have you previously invested in any form of brand marketing or media exposure?', 'checkbox', NULL, false, 1,
 '[{"value":"billboard","label":"Billboard"},{"value":"radio_ad","label":"Radio Ad"},{"value":"tv_spot","label":"Commercial TV Spot"},{"value":"podcast_guest","label":"Podcast Guest Appearance"},{"value":"social_media","label":"Social Media Campaign"},{"value":"local_news","label":"Local News Feature"},{"value":"direct_mailer","label":"Direct Mailer"},{"value":"community_sponsorship","label":"Community Sponsorship"},{"value":"none","label":"None of the above"}]',
 '{"type":"array","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '7335bc65-a7fd-4ca2-b78e-7c0313522eb8', 'brand_identity_description', 'How would you describe your current brand identity in one sentence?', 'text', 'Enter your brand identity', false, 2, NULL, '{"type":"string"}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '7335bc65-a7fd-4ca2-b78e-7c0313522eb8', 'branding_duration', 'How long has your current branding been in place?', 'radio', NULL, false, 3,
 '[{"value":"lt_1","label":"Less than 1 year"},{"value":"1_3","label":"1–3 years"},{"value":"3_5","label":"3–5 years"},{"value":"5_plus","label":"5+ years"},{"value":"never_defined","label":"We’ve never really defined our brand"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '7335bc65-a7fd-4ca2-b78e-7c0313522eb8', 'worked_with_brand_consultant', 'Have you ever worked with a brand strategist, agency, or marketing consultant?', 'radio', NULL, false, 4,
 '[{"value":"yes","label":"Yes"},{"value":"no","label":"No"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '7335bc65-a7fd-4ca2-b78e-7c0313522eb8', 'consultant_scope_of_work', 'If yes, please describe the scope of work:', 'textarea', 'Describe the work', false, 5, NULL, '{"type":"string"}', NULL, true, now(), now()),


-- SECTION 2: Brand Perception & Confidence
('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '8d64ab72-c5fe-428c-a2a0-2da2a85ee8ee', 'brand_like_most', 'What do you like most about your current brand or public presence?', 'textarea', NULL, false, 1, NULL, '{"type":"string","required":true,"min":5}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '8d64ab72-c5fe-428c-a2a0-2da2a85ee8ee', 'brand_dislike_missing', 'What do you dislike or feel is missing from your current brand?', 'textarea', NULL, false, 2, NULL, '{"type":"string","required":true, "min":10}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '8d64ab72-c5fe-428c-a2a0-2da2a85ee8ee', 'brand_personality', 'If your brand had a personality, how would you describe it?', 'radio', NULL, false, 3,
 '[{"value":"clinical","label":"Clinical & Professional"},{"value":"bold","label":"Bold & Confident"},{"value":"friendly","label":"Approachable & Friendly"},{"value":"luxury","label":"Luxury & Elite"},{"value":"not_thought","label":"We’ve never thought about this"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '8d64ab72-c5fe-428c-a2a0-2da2a85ee8ee', 'brand_recognition_rating', 'Rate how recognizable your name or practice is in your local market.', 'radio', NULL, false, 4,
 '[{"value":"1","label":"1"},{"value":"2","label":"2"},{"value":"3","label":"3"},{"value":"4","label":"4"},{"value":"5","label":"5"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '8d64ab72-c5fe-428c-a2a0-2da2a85ee8ee', 'brand_current_audience', 'Who do you think your brand currently attracts most?', 'radio', NULL, false, 5,
 '[{"value":"high_income","label":"High-income patients seeking premium care"},{"value":"budget","label":"Budget-conscious patients looking for deals"},{"value":"mix","label":"A mix of both"},{"value":"not_sure","label":"Not sure"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),


-- SECTION 3: Messaging & Differentiation
('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '0cf837fe-cb40-454a-ae1b-21632d5f3af6', 'brand_differentiator', 'What makes you different from other full-arch providers in your area?', 'textarea', NULL, false, 1, NULL, '{"type":"string","required":true,"min":10}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '0cf837fe-cb40-454a-ae1b-21632d5f3af6', 'signature_approach_defined', 'Have you clearly defined your signature approach or treatment philosophy?', 'radio', NULL, false, 2,
 '[{"value":"yes","label":"Yes"},{"value":"no","label":"No"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '0cf837fe-cb40-454a-ae1b-21632d5f3af6', 'signature_approach_description', 'If yes, what is it?', 'textarea', 'Describe your philosophy', false, 3, NULL, '{"type":"string"}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '0cf837fe-cb40-454a-ae1b-21632d5f3af6', 'brand_emotional_outcome', 'What emotional outcome do you want your patients to feel after interacting with your brand?', 'radio', NULL, false, 4,
 '[{"value":"inspired","label":"Inspired"},{"value":"safe","label":"Safe & reassured"},{"value":"empowered","label":"Empowered"},{"value":"blown_away","label":"Blown away"},{"value":"not_sure","label":"Not sure"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '0cf837fe-cb40-454a-ae1b-21632d5f3af6', 'storytelling_usage', 'Do you currently use storytelling in your patient marketing?', 'radio', NULL, false, 5,
 '[{"value":"often","label":"Yes, often"},{"value":"occasionally","label":"Occasionally"},{"value":"rarely","label":"Rarely"},{"value":"never","label":"Never"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '0cf837fe-cb40-454a-ae1b-21632d5f3af6', 'story_wish_known', 'What story do you wish more people knew about you or your practice?', 'textarea', NULL, false, 6, NULL, '{"type":"string","required":true,"min":5}', NULL, true, now(), now()),


-- SECTION 4: Vision & Aspirations
('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '65d73ed0-7034-444c-8dca-1f4cda4e833c', 'brand_fame_goal', 'If you could wave a magic wand and become famous for one thing in your market, what would it be?', 'text', 'Enter your dream recognition', false, 1, NULL, '{"type":"string","required":true ,"min":5}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '65d73ed0-7034-444c-8dca-1f4cda4e833c', 'admired_gold_standard_brand', 'Who or what do you admire as a gold-standard brand in or outside of dentistry?', 'text', 'Enter brand name', false, 2, NULL, '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '65d73ed0-7034-444c-8dca-1f4cda4e833c', 'brand_face_preference', 'Do you want to become the face of your brand or have the practice brand lead instead?', 'radio', NULL, false, 3,
 '[{"value":"face","label":"I want to be the face"},{"value":"practice","label":"I want the practice brand to lead"},{"value":"both","label":"Both"},{"value":"not_sure","label":"Not sure yet"}]',
 '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '65d73ed0-7034-444c-8dca-1f4cda4e833c', 'rebranding_excitement', 'What excites you about rebranding or rewriting your story?', 'textarea', NULL, false, 4, NULL, '{"type":"string","required":true ,"min":10 , "max":255}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '65d73ed0-7034-444c-8dca-1f4cda4e833c', 'visibility_fears', 'What fears or hesitations do you have about becoming more visible or famous in your space?', 'textarea', NULL, false, 5, NULL, '{"type":"string","required":true,"min":10 , "max":255}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', '65d73ed0-7034-444c-8dca-1f4cda4e833c', 'market_domination_impact', 'What impact would it have on your practice if your brand truly stood out and dominated your market?', 'textarea', NULL, false, 6, NULL, '{"type":"string","required":true ,"min":10 , "max":255}', NULL, true, now(), now()),


-- FINAL THOUGHTS
('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', 'fa5b04e9-9969-41ee-965d-664ee7907da3', 'brand_dream_summary', 'If you had to summarize your brand dream in one sentence, what would it be?', 'text', 'Enter your brand dream', false, 1, NULL, '{"type":"string","required":true}', NULL, true, now(), now()),

('9b21dee6-a416-43ff-bda6-d8d2a13f57b1', 'fa5b04e9-9969-41ee-965d-664ee7907da3', 'additional_notes', 'Anything else you''d like us to know about your brand, your goals, or your vision?', 'textarea', NULL, false, 2, NULL, '{"type":"string"}', NULL, true, now(), now());













-- Service ID: ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c
INSERT INTO srvconboardingquestionssection (id, service_id, section_name, section_title, section_description, section_order, is_active, created_at, updated_at) VALUES
('24d1a5cb-3384-4f43-aac6-1c5b6dc49d16', 'ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'practice_profile', 'PRACTICE PROFILE', 'Details about the practice profile', 1, true, NOW(), NOW()),
('13fe3fe5-b659-4aa9-a727-a8d2a125ac38', 'ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'consult_scheduling_details', 'CONSULT SCHEDULING', 'Details about the consult scheduling', 2, true, NOW(), NOW()),
('652fd6e0-0d4c-4ba9-82e4-7060f09aba4b', 'ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'consult_team', 'CONSULT TEAM', 'Information about the consultation team', 3, true, NOW(), NOW()),
('e826bacb-9717-4fac-8ad1-f6f7f0e09fec', 'ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'communication_followup', 'COMMUNICATION & FOLLOW-UP', 'Guidelines on communication and follow-up', 4, true, NOW(), NOW()),
('6d44512c-788c-457e-8e95-959ead13d3b1', 'ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'additional_details', 'ADDITIONAL DETAILS', 'Any additional information or notes', 5, true, NOW(), NOW());
('9c6e2b3e-6c4d-4d7b-9f1f-9f2bb44f7c10', 'ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'full_arch_implants_faqs', 'All-on-4 / Full Arch Implants FAQs', 'Common questions about same-day full-arch treatment.', 10, true, now(), now()),
('f3b6a2b9-8b1b-47cd-8f72-5b8b3b2b7c11', 'ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'appointment_consultation_faqs', 'Appointment & Consultation FAQs', 'Scheduling, costs and visit logistics (varies by clinic).', 11, true, now(), now()),
('7a2d2c3f-f2d1-4c1b-a7a1-6e2f3a4b9c12', 'ee7c6a34-c03c-44da-b8a5-5b9fd1cdc46c', 'single_implant_faqs', 'Single Dental Implant FAQs', 'Questions about single-tooth implant therapy.', 12, true, now(), now());

-- Service ID: 9b21dee6-a416-43ff-bda6-d8d2a13f57b1
INSERT INTO srvconboardingquestionssection (id, service_id, section_name, section_title, section_description, section_order, is_active, created_at, updated_at) VALUES
('7335bc65-a7fd-4ca2-b78e-7c0313522eb8', '9b21dee6-a416-43ff-bda6-d8d2a13f57b1', 'brand_awareness_history', 'Brand Awareness & History', 'Description of Brand Awareness & History', 1, true, NOW(), NOW()),
('8d64ab72-c5fe-428c-a2a0-2da2a85ee8ee', '9b21dee6-a416-43ff-bda6-d8d2a13f57b1', 'brand_perception_confidence', 'Brand Perception & Confidence', 'Description of Brand Perception & Confidence', 2, true, NOW(), NOW()),
('0cf837fe-cb40-454a-ae1b-21632d5f3af6', '9b21dee6-a416-43ff-bda6-d8d2a13f57b1', 'messaging_differentiation', 'Messaging & Differentiation', 'Description of Messaging & Differentiation', 3, true, NOW(), NOW()),
('65d73ed0-7034-444c-8dca-1f4cda4e833c', '9b21dee6-a416-43ff-bda6-d8d2a13f57b1', 'vision_aspirations', 'Vision & Aspirations', 'Description of Vision & Aspirations', 4, true, NOW(), NOW()),
('fa5b04e9-9969-41ee-965d-664ee7907da3', '9b21dee6-a416-43ff-bda6-d8d2a13f57b1', 'final_thoughts', 'Final Thoughts', 'Description of Final Thoughts', 5, true, NOW(), NOW());
