// models/brandRoadmap.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const BrandRoadmap = sequelize.define(
  "BrandRoadmap",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    total_weeks: DataTypes.INTEGER,
    total_months: DataTypes.INTEGER,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "brand_roadmap",
    underscored: true,
  }
);

export default BrandRoadmap;
