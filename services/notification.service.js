// services/notification.service.js
import { Server } from 'socket.io';
import Notification from '../models/notification.model.js';

let ioInstance = null;

export function initRealtime(server, { corsOrigins = [] } = {}) {
  ioInstance = new Server(server, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  });

  ioInstance.on('connection', (socket) => {
    // Client should emit 'register' with their userId after connecting
    socket.on('register', ({ userId }) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });
  });

  return ioInstance;
}

export function getIo() {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized. Call initRealtime(server) first.');
  }
  return ioInstance;
}

/**
 * Send notification to user - Super simplified version
 * Only requires userId, title, and message
 * @param {string} userId - User ID to send notification to
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} options - Optional settings
 * @param {object} options.data - Additional data payload (optional)
 * @param {Date} options.expiresAt - Expiration date (optional)
 * @param {boolean} options.saveToDb - Whether to save to database (default: true)
 * @param {boolean} options.sendRealtime - Whether to send real-time notification (default: true)
 */
export async function notifyUser(userId, title, message, options = {}) {
  const {
    data = null,
    expiresAt = null,
    saveToDb = true,
    sendRealtime = true
  } = options;

  try {
    // Send real-time notification
    if (sendRealtime) {
      const io = getIo();
      const payload = {
        title,
        message,
        data,
        timestamp: new Date().toISOString()
      };
      
      // Single event type for all notifications
      io.to(`user:${userId}`).emit('notification', payload);
    }
    
    // Save notification to database
    if (saveToDb) {
      const notificationData = {
        user_id: userId,
        type: 'notification', // Single static type for all notifications
        title,
        message,
        data,
        expires_at: expiresAt
      };
      
      await Notification.create(notificationData);
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw error;
  }
}

/**
 * Send notification to multiple users
 * @param {string[]} userIds - Array of user IDs
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} options - Optional settings
 */
export async function notifyMultipleUsers(userIds, title, message, options = {}) {
  const results = [];
  
  for (const userId of userIds) {
    try {
      const result = await notifyUser(userId, title, message, options);
      results.push({ userId, success: true, ...result });
    } catch (error) {
      results.push({ userId, success: false, error: error.message });
    }
  }
  
  return results;
}

/**
 * Cleanup expired notifications
 */
export async function cleanupExpiredNotifications() {
  try {
    const { Op } = await import('sequelize');
    const result = await Notification.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date()
        }
      }
    });
    
    console.log(`Cleaned up ${result} expired notifications`);
    return result;
  } catch (error) {
    console.error('Failed to cleanup expired notifications:', error);
    throw error;
  }
}