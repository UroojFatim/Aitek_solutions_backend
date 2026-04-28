/**
 * Document Upload Status Enumeration
 * Defines the available status values for document uploads in the system
 */
export const DOCUMENT_UPLOAD_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

/**
 * Array of all document upload status values for validation
 */
export const DOCUMENT_UPLOAD_STATUS_VALUES = Object.values(DOCUMENT_UPLOAD_STATUS);

/**
 * Default document upload status for new uploads
 */
export const DEFAULT_DOCUMENT_UPLOAD_STATUS = DOCUMENT_UPLOAD_STATUS.PENDING; 