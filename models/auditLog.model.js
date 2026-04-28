import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // WHO performed the action
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Assuming you have a users table
        key: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION'
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_role: {
      type: DataTypes.STRING,
      allowNull: false, // User, SuperUser, Admin, SuperAdmin
    },
    // WHAT action was performed
    action: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., "CREATE_BUSINESS", "UPDATE_BUSINESS", "VIEW_DOCUMENT"
    },
    crud_operation: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['CREATE', 'READ', 'UPDATE', 'DELETE']]
      }
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., "/api/business/123"
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false, // GET, POST, PUT, DELETE
    },
    // Other details
    status_code: {
      type: DataTypes.INTEGER,
      allowNull: false, // 200, 201, etc.
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: true,
    },
    request_data: {
      type: DataTypes.JSONB,
      allowNull: true, // Contains body, params, query
    },
    response_data: {
      type: DataTypes.JSONB,
      allowNull: true, // Contains response body (sanitized)
    },
    environment: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: process.env.NODE_ENV || 'development',
    },
  },
  {
    tableName: "audit_logs",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['user_role'] },
      { fields: ['crud_operation'] },
      { fields: ['environment'] },
      { fields: ['created_at'] },
    ],
  }
);

export default AuditLog;
