// models/brandPlanWeek.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const BrandPlanWeek = sequelize.define(
  "BrandPlanWeek",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    plan_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_plans",
        key: "id",
      },
    },
    week_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_roadmap_weeks",
        key: "id",
      },
    },
    week_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("locked", "active", "completed"),
      defaultValue: "locked",
    },
    enabled_at: DataTypes.DATE,
    completed_at: DataTypes.DATE,
    enabled_reason: {
      type: DataTypes.ENUM("tasks_completed", "auto_time", "manual_admin"),
    },
    auto_unlock_after_days: {
      type: DataTypes.INTEGER,
      defaultValue: 7,
    },
  },
  {
    tableName: "brand_plan_weeks",
    underscored: true,
  }
);

export default BrandPlanWeek;
