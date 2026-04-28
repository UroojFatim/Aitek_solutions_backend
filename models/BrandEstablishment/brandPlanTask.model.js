// models/brandPlanTask.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const BrandPlanTask = sequelize.define(
  "BrandPlanTask",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    plan_week_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_plan_weeks",
        key: "id",
      },
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_roadmap_tasks",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      defaultValue: "pending",
    },
    completed_by: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
    },
    completed_at: DataTypes.DATE,

    // ---------- NEW FIELDS ----------
    // Answer to the reflective question (question text lives on BrandRoadmapTask)
    reflection_answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Checklist state for THIS plan task:
    // e.g. [{ key: "upload_logo", label: "Upload logo", checked: true, checked_at: "..." }]
    checklist_state: {
      type: DataTypes.JSONB, // or DataTypes.JSON
      allowNull: true,
    },
  },
  {
    tableName: "brand_plan_tasks",
    underscored: true,
  }
);

export default BrandPlanTask;
