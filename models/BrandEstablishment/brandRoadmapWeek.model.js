// models/brandRoadmapWeek.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const BrandRoadmapWeek = sequelize.define(
  "BrandRoadmapWeek",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roadmap_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_roadmap",
        key: "id",
      },
    },
    phase_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_roadmap_phases",
        key: "id",
      },
    },
    week_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    display_label: DataTypes.STRING, // "Week 1"
    sort_order: DataTypes.INTEGER,
  },
  {
    tableName: "brand_roadmap_weeks",
    underscored: true,
  }
);

export default BrandRoadmapWeek;
