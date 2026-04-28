import { ApiResponse } from '../utils/response.util.js';
import { Notification, User } from '../models/associations.js';
import { Op } from 'sequelize';

// Get user notifications with pagination
export const getUserNotifications = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20, unread_only = false } = req.query;
  
  try {
    const offset = (page - 1) * limit;
    const whereClause = { user_id: userId };
    
    // Filter for unread notifications only if requested
    if (unread_only === 'true') {
      whereClause.is_read = false;
    }
    
    // Don't include expired notifications
    whereClause[Op.or] = [
      { expires_at: null },
      { expires_at: { [Op.gt]: new Date() } }
    ];
    
    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: [
        'id', 
        'type', 
        'title', 
        'message', 
        'data', 
        'is_read', 
        'read_at', 
        'created_at'
      ]
    });
    
    return ApiResponse.ok(res, 'Notifications retrieved successfully', {
      notifications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
    
  } catch (error) {
    return ApiResponse.serverError(res, 'Failed to retrieve notifications', error);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;
  
  try {
    const notification = await Notification.findOne({
      where: { 
        id: notificationId, 
        user_id: userId 
      }
    });
    
    if (!notification) {
      return ApiResponse.notFound(res, 'Notification not found');
    }
    
    if (!notification.is_read) {
      await notification.update({
        is_read: true,
        read_at: new Date()
      });
    }
    
    return ApiResponse.ok(res, 'Notification marked as read');
    
  } catch (error) {
    return ApiResponse.serverError(res, 'Failed to mark notification as read', error);
  }
};

// Mark all user notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user.id;
  
  try {
    await Notification.update(
      {
        is_read: true,
        read_at: new Date()
      },
      {
        where: {
          user_id: userId,
          is_read: false
        }
      }
    );
    
    return ApiResponse.ok(res, 'All notifications marked as read');
    
  } catch (error) {
    return ApiResponse.serverError(res, 'Failed to mark all notifications as read', error);
  }
};

// Get unread notification count
export const getUnreadNotificationCount = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const count = await Notification.count({
      where: {
        user_id: userId,
        is_read: false,
        [Op.or]: [
          { expires_at: null },
          { expires_at: { [Op.gt]: new Date() } }
        ]
      }
    });
    
    return ApiResponse.ok(res, 'Unread notification count retrieved', { count });
    
  } catch (error) {
    return ApiResponse.serverError(res, 'Failed to get unread notification count', error);
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;
  
  try {
    const notification = await Notification.findOne({
      where: { 
        id: notificationId, 
        user_id: userId 
      }
    });
    
    if (!notification) {
      return ApiResponse.notFound(res, 'Notification not found');
    }
    
    await notification.destroy();
    
    return ApiResponse.ok(res, 'Notification deleted successfully');
    
  } catch (error) {
    return ApiResponse.serverError(res, 'Failed to delete notification', error);
  }
};

// Clear all old/read notifications
export const clearNotifications = async (req, res) => {
  const userId = req.user.id;
  const { older_than_days = 30 } = req.query;
  
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(older_than_days));
    
    const result = await Notification.destroy({
      where: {
        user_id: userId,
        [Op.or]: [
          { is_read: true },
          { created_at: { [Op.lt]: cutoffDate } }
        ]
      }
    });
    
    return ApiResponse.ok(res, `${result} notifications cleared successfully`);
    
  } catch (error) {
    return ApiResponse.serverError(res, 'Failed to clear notifications', error);
  }
};