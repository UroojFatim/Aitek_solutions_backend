import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type of notification (e.g., business:status-updated, onboarding:step-updated)'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Display title for the notification'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Notification message content'
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional data payload for the notification'
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the user has read this notification'
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when notification was read'
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Optional expiration date for the notification'
    }
  },
  {
    tableName: "notifications",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id', 'is_read']
      },
      {
        fields: ['user_id', 'created_at']
      },
      {
        fields: ['type']
      }
    ]
  }
);

export default Notification;