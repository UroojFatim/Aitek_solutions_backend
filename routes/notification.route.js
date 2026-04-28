import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  deleteNotification,
  clearNotifications
} from '../controllers/notification.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// GET /api/notifications - Get user notifications with pagination
router.get('/', verifyToken, getUserNotifications);

// GET /api/notifications/unread-count - Get count of unread notifications
router.get('/unread-count', verifyToken, getUnreadNotificationCount);

// PUT /api/notifications/:notificationId/read - Mark specific notification as read
router.put('/:notificationId/read', verifyToken, markNotificationAsRead);

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put('/mark-all-read', verifyToken, markAllNotificationsAsRead);

// DELETE /api/notifications/:notificationId - Delete specific notification
router.delete('/:notificationId', verifyToken, deleteNotification);

// DELETE /api/notifications/clear - Clear old/read notifications
router.delete('/clear', verifyToken, clearNotifications);

export default router;