/**
 * Market Analysis Enumeration
 * Defines the available values for market analysis fields
 */

export const PATIENT_TRAVEL_DISTANCE = {
  UNDER_5_MILES: 'under_5_miles',
  TEN_TO_60_MILES: '10_to_60_miles',
  HUNDRED_TO_200_MILES: '100_to_200_miles',
  OVER_200_MILES: 'over_200_miles'
};

export const PATIENT_TRAVEL_DISTANCE_VALUES = Object.values(PATIENT_TRAVEL_DISTANCE);

export const DEFAULT_PATIENT_TRAVEL_DISTANCE = PATIENT_TRAVEL_DISTANCE.UNDER_5_MILES;

export const MARKET_SATURATION = {
  VERY_SATURATED: 'very_saturated',
  SOMEWHAT_SATURATED: 'somewhat_saturated',
  NOT_SATURATED: 'not_saturated',
  UNSURE: 'unsure'
};

export const MARKET_SATURATION_VALUES = Object.values(MARKET_SATURATION);

export const DEFAULT_MARKET_SATURATION = MARKET_SATURATION.UNSURE;

export const MARKETING_TYPES = {
  TV_RADIO_ADS: 'tv_radio_ads',
  GOOGLE_ADS_SEO: 'google_ads_seo',
  SOCIAL_MEDIA: 'social_media',
  DIRECT_MAIL: 'direct_mail',
  BILLBOARDS: 'billboards',
  INTERNAL_REFERRAL_NETWORK: 'internal_referral_network',
  PATIENT_FACING_CAMPAIGNS: 'patient_facing_campaigns',
  EVENTS_CE_COURSES: 'events_ce_courses',
  OTHER: 'other'
};

export const MARKETING_TYPES_VALUES = Object.values(MARKETING_TYPES);

export const DEFAULT_MARKETING_TYPES = [MARKETING_TYPES.GOOGLE_ADS_SEO];