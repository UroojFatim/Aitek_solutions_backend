// models/brandTaskNote.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const BrandTaskNote = sequelize.define(
  "BrandTaskNote",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    plan_task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_plan_tasks",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    author_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    author_type: {
      type: DataTypes.ENUM("User", "Admin", "SuperAdmin", "SuperUser"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_internal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    edited_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    tableName: "brand_task_notes",
    underscored: true,
    updatedAt: false,
    createdAt: "created_at",
  }
);

export default BrandTaskNote;
