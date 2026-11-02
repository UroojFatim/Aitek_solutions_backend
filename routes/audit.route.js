import express from 'express';
import {
  getAuditLogs,
  getAuditStats,
  getUserAuditLogs,
  getUserAuditStats,
} from '../controllers/audit.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import {



  Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only,
  Allow_SuperUser_Only,
} from '../middleware/verifyRole.js';

const router = express.Router();

router.get('/logs', verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, getAuditLogs);
router.get('/stats', verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, getAuditStats);
router.get('/user/logs', verifyToken, Allow_SuperUser_Only, getUserAuditLogs);
router.get('/user/stats', verifyToken, Allow_SuperUser_Only, getUserAuditStats);

export default router;
