/**
 * Market Perception Enumeration
 * Defines the available values for market perception fields
 */

export const PRACTICE_TIER = {
  PREMIUM: 'premium',
  MID_TIER: 'mid_tier',
  BUDGET_VALUE: 'budget_value'
};

export const PRACTICE_TIER_VALUES = Object.values(PRACTICE_TIER);

export const DEFAULT_PRACTICE_TIER = PRACTICE_TIER.MID_TIER;

export const MARKETING_SERVICES = {
  WEBSITE_DESIGN: 'website_design',
  GOOGLE_ADS_SEO: 'google_ads_seo',
  FACEBOOK_INSTAGRAM_ADS: 'facebook_instagram_ads',
  LEAD_MANAGEMENT_CRM: 'lead_management_crm',
  SOCIAL_MEDIA_CONTENT: 'social_media_content',
  BRANDING_LOGO_IDENTITY: 'branding_logo_identity',
  OTHER: 'other'
};

export const MARKETING_SERVICES_VALUES = Object.values(MARKETING_SERVICES);

export const DEFAULT_MARKETING_SERVICES = [];