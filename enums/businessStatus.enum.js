/**
 * Business Status Enumeration
 * Defines the available status values for businesses in the system
 */
export const BUSINESS_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ONBOARDING: 'Onboarding'
};

/**
 * Array of all business status values for validation
 */
export const BUSINESS_STATUS_VALUES = Object.values(BUSINESS_STATUS);

/**
 * Default business status for new businesses
 */
export const DEFAULT_BUSINESS_STATUS = BUSINESS_STATUS.ONBOARDING;
