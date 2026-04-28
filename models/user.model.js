import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import {
  UserRole,
  USER_ROLE_VALUES,
  DEFAULT_USER_ROLE,
  UserStatus,
  USER_STATUS_VALUES,
  DEFAULT_USER_STATUS,
} from "../enums/index.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_changed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: DEFAULT_USER_ROLE,
      validate: {
        isIn: {
          args: [USER_ROLE_VALUES],
          msg: "Role must be one of: " + USER_ROLE_VALUES.join(", "),
        },
      }
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: DEFAULT_USER_STATUS,
      validate: {
        isIn: {
          args: [USER_STATUS_VALUES],
          msg: "Status must be one of: " + USER_STATUS_VALUES.join(", "),
        },
      }
    }
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

export default User;
