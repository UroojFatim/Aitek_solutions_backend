// utils/notification.util.js

import { notifyUser, notifyMultipleUsers } from '../services/notification.service.js';

/**
 * Simple notification sender - just userId, title, and message
 * @param {string} userId - User ID to notify
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} extraData - Optional extra data
 */
export async function sendNotification(userId, title, message, extraData = {}) {
  try {
    return await notifyUser(userId, title, message, {
      data: extraData
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification to multiple users with the same message
 * @param {string[]} userIds - Array of user IDs
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} extraData - Optional extra data
 */
export async function sendBulkNotification(userIds, title, message, extraData = {}) {
  try {
    return await notifyMultipleUsers(userIds, title, message, {
      data: extraData
    });
  } catch (error) {
    console.error('Failed to send bulk notification:', error);
    return { success: false, error: error.message };
  }
}
