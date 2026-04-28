/**
 * User Role Enumeration
 * Defines the available roles for users in the system
 */
export const UserRole = {
  USER: 'User',
  SUPER_USER: 'SuperUser',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'SuperAdmin',
};

/**
 * Array of all user role values for validation
 */
export const USER_ROLE_VALUES = Object.values(UserRole);

/**
 * Default user role for new registrations
 */
export const DEFAULT_USER_ROLE = UserRole.USER;