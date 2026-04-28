/**
 * Base response structure
 * @private
 */
const createResponse = (success, message, data = null, error = null) => ({
  success,
  message,
  ...(data && { data }),
  ...(Array.isArray(data) && { count: data.length }),
  ...(error && { details: error.message || error.errors || error })
});

/**
 * Response utility class
 */
export class ApiResponse {
  /**
   * Send OK response (200)
   * @param {object} res - Express response object
   * @param {string} message - Success message
   * @param {object|array} [data] - Response data
   */
  static ok(res, message, data = null) {
    return res.status(200).json(createResponse(true, message, data));
  }

  /**
   * Send Created response (201)
   * @param {object} res - Express response object
   * @param {string} message - Success message
   * @param {object|array} [data] - Response data
   */
  static created(res, message, data = null) {
    return res.status(201).json(createResponse(true, message, data));
  }

  /**
   * Send Bad Request error (400)
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {Error} [error] - Error object
   */
  static badRequest(res, message, error = null) {
    return res.status(400).json(createResponse(false, message, null, error));
  }

  /**
   * Send Not Found error (404)
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {Error} [error] - Error object
   */
  static notFound(res, message, error = null) {
    return res.status(404).json(createResponse(false, message, null, error));
  }

  /**
   * Send Server Error (500)
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {Error} [error] - Error object
   */
  static serverError(res, message, error = null) {
    return res.status(500).json(createResponse(false, message, null, error));
  }
} 