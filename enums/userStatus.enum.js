/**
 * User Status Enumeration
 * Defines the available statuses for users in the system
 */
export const UserStatus = {
  ACTIVATED: 'activated',
  DELETED: 'deleted',
};

/**
 * Array of all user status values for validation
 */
export const USER_STATUS_VALUES = Object.values(UserStatus);

/**
 * Default user status for new registrations
 */
export const DEFAULT_USER_STATUS = UserStatus.ACTIVATED;
