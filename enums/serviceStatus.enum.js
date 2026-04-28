
export const BusinessServiceStatus = {
  UNASSIGNED: 1,
  INITIAL: 2,
  ONBOARDING: 3,
  ACTIVATED: 4,
  DEACTIVATED: 5,
  FINISHED: 6
};

export const BusinessServiceStatusLabels = {
  1: 'Unassigned',
  2: 'Initial',
  3: 'Onboarding',
  4: 'Activated',
  5: 'Deactivated',
  6: 'Finished'
};

export const BUSINESS_SERVICE_STATUS_VALUES = Object.values(BusinessServiceStatus);
export const DEFAULT_BUSINESS_SERVICE_STATUS = BusinessServiceStatus.UNASSIGNED;