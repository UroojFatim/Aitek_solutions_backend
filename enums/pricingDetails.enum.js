/**
 * Pricing Details Enumeration
 * Defines the available values for pricing details fields
 */

export const ARCH_TYPE = {
  FIXED: 'fixed',
  REMOVABLE: 'removable'
};

export const ARCH_TYPE_VALUES = Object.values(ARCH_TYPE);

export const DEFAULT_ARCH_TYPE = ARCH_TYPE.FIXED;

export const PRICE_POSITION = {
  ADVANTAGE: 'advantage',
  DISADVANTAGE: 'disadvantage',
  NEUTRAL: 'neutral',
  DEPENDS_ON_CASE: 'depends_on_case'
};

export const PRICE_POSITION_VALUES = Object.values(PRICE_POSITION);

export const DEFAULT_PRICE_POSITION = PRICE_POSITION.NEUTRAL;

export const COMPETITIVE_DIFFERENTIATORS = {
  FASTER_TREATMENT_TIMELINE: 'faster_treatment_timeline',
  SAME_DAY_TEETH: 'same_day_teeth',
  ONSITE_LAB_DIGITAL_INTEGRATION: 'onsite_lab_digital_integration',
  INHOUSE_SEDATION_GA: 'inhouse_sedation_ga',
  PUBLISHED_CASES_INFLUENCER_CREDIBILITY: 'published_cases_influencer_credibility',
  PREMIUM_IMPLANT_SYSTEM_BIOMATERIALS: 'premium_implant_system_biomaterials',
  LIFETIME_WARRANTY_GUARANTEE: 'lifetime_warranty_guarantee',
  OTHER: 'other'
};

export const COMPETITIVE_DIFFERENTIATORS_VALUES = Object.values(COMPETITIVE_DIFFERENTIATORS);

export const DEFAULT_COMPETITIVE_DIFFERENTIATORS = [];