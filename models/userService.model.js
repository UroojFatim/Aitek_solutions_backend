// models/userService.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const UserService = sequelize.define(
  "UserService",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    service_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "businesses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "user_services",
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "service_id", "business_id"],
      },
    ],
  }
);

export default UserService;
