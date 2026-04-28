import AuditLog from "../models/auditLog.model.js";
import { ApiResponse } from "../utils/response.util.js";
import { Op } from "sequelize";
import sequelize from "../config/database.config.js";
import User from "../models/user.model.js";
import UserBusiness from "../models/userBusiness.model.js";

export const getAuditLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      businessId, 
      userId, 
      userRole,
      operation,
      days = 30 
    } = req.query;

    const where = {};
    
    if (businessId) where.affected_business_id = businessId;
    if (userId) where.user_id = userId;
    if (userRole) where.user_role = userRole;
    if (operation) where.crud_operation = operation;
    
    // Add environment filter
    if (process.env.NODE_ENV) where.environment = process.env.NODE_ENV;
    
    // Last X days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    where.created_at = { [Op.gte]: startDate };

    const { rows: logs, count: total } = await AuditLog.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    return ApiResponse.ok(res, "Audit logs retrieved", {
      logs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

export const getAuditStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get action counts by role
    const roleStats = await AuditLog.findAll({
      attributes: [
        'user_role',
        'crud_operation',
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        created_at: { [Op.gte]: startDate },
        environment: process.env.NODE_ENV
      },
      group: ['user_role', 'crud_operation'],
      order: [[sequelize.literal('count'), 'DESC']]
    });

    // Get most active users
    const userStats = await AuditLog.findAll({
      attributes: [
        'user_name',
        'user_role',
        [sequelize.fn('COUNT', '*'), 'action_count']
      ],
      where: {
        created_at: { [Op.gte]: startDate }
      },
      group: ['user_name', 'user_role'],
      order: [[sequelize.literal('action_count'), 'DESC']],
      limit: 10
    });

    return ApiResponse.ok(res, "Audit statistics retrieved", {
      roleStats,
      userStats,
      period: `${days} days`
    });
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

/**
 * Helper:
 * Get all User IDs (role = 'User') that share at least one business
 * with the given Super User (via UserBusiness table).
 */
const getScopedUserIdsForSuperUser = async (superUserId) => {
  // 1) All businesses for this Super User
  const superUserBusinesses = await UserBusiness.findAll({
    where: { user_id: superUserId },
    attributes: ["business_id"],
    raw: true,
  });

  const businessIds = [
    ...new Set(superUserBusinesses.map((b) => b.business_id)),
  ];

  if (!businessIds.length) return [];

  // 2) All user_ids that belong to those businesses
  const businessUserRows = await UserBusiness.findAll({
    where: {
      business_id: {
        [Op.in]: businessIds,
      },
    },
    attributes: ["user_id"],
    raw: true,
  });

  const businessUserIds = [
    ...new Set(businessUserRows.map((row) => row.user_id)),
  ];

  if (!businessUserIds.length) return [];

  // 3) Filter to only users whose role is "User"
  const users = await User.findAll({
    where: {
      id: {
        [Op.in]: businessUserIds,
      },
      role: "User",
    },
    attributes: ["id"],
    raw: true,
  });

  return users.map((u) => u.id);
};

// SUPER USER: scoped logs – only Users from same businesses
export const getUserAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      operation,
      days = 30,
    } = req.query;

    const superUserId = req.user?.id;

    if (!superUserId) {
      return ApiResponse.forbidden(
        res,
        "Authenticated Super User context is required."
      );
    }

    // get allowed user_ids for this Super User
    const allowedUserIds = await getScopedUserIdsForSuperUser(superUserId);

    if (!allowedUserIds.length) {
      // no users under this Super User's businesses
      return ApiResponse.ok(res, "User-scoped audit logs retrieved", {
        logs: [],
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: 0,
      });
    }

    const where = {
      // only user-role logs
      user_role: "User",
      // only those users that share business with Super User
      user_id: {
        [Op.in]: allowedUserIds,
      },
    };

    if (userId) {
      // if Super User filters to a specific user,
      // only allow if it's in their scope
      if (!allowedUserIds.includes(userId)) {
        return ApiResponse.ok(res, "User-scoped audit logs retrieved", {
          logs: [],
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0,
        });
      }
      where.user_id = userId;
    }

    if (operation) where.crud_operation = operation;

    // environment filter
    if (process.env.NODE_ENV) where.environment = process.env.NODE_ENV;

    // Last X days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    where.created_at = { [Op.gte]: startDate };

    const { rows: logs, count: total } = await AuditLog.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return ApiResponse.ok(res, "User-scoped audit logs retrieved", {
      logs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// SUPER USER: stats – only Users from same businesses
export const getUserAuditStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const superUserId = req.user?.id;

    if (!superUserId) {
      return ApiResponse.forbidden(
        res,
        "Authenticated Super User context is required."
      );
    }

    const allowedUserIds = await getScopedUserIdsForSuperUser(superUserId);

    if (!allowedUserIds.length) {
      return ApiResponse.ok(res, "User-scoped audit statistics retrieved", {
        roleStats: [],
        userStats: [],
        period: `${days} days`,
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const baseWhere = {
      created_at: { [Op.gte]: startDate },
      environment: process.env.NODE_ENV,
      user_role: "User",
      user_id: {
        [Op.in]: allowedUserIds,
      },
    };

    // counts by operation
    const roleStats = await AuditLog.findAll({
      attributes: ["crud_operation", [sequelize.fn("COUNT", "*"), "count"]],
      where: baseWhere,
      group: ["crud_operation"],
      order: [[sequelize.literal("count"), "DESC"]],
    });

    // most active users (still only role "User")
    const userStats = await AuditLog.findAll({
      attributes: [
        "user_name",
        "user_role",
        [sequelize.fn("COUNT", "*"), "action_count"],
      ],
      where: baseWhere,
      group: ["user_name", "user_role"],
      order: [[sequelize.literal("action_count"), "DESC"]],
      limit: 10,
    });

    return ApiResponse.ok(res, "User-scoped audit statistics retrieved", {
      roleStats,
      userStats,
      period: `${days} days`,
    });
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};