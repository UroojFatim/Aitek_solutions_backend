// models/brandPlan.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const BrandPlan = sequelize.define(
  "BrandPlan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "businesses",
        key: "id",
      },
    },
    service_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "services",
        key: "id",
      },
    },
    roadmap_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_roadmap",
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "paused"),
      defaultValue: "active",
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "brand_plans",
    underscored: true,
  }
);

export default BrandPlan;
