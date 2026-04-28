// models/brandRoadmapPhase.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const BrandRoadmapPhase = sequelize.define(
  "BrandRoadmapPhase",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    theme: DataTypes.STRING,
    phase_order: DataTypes.INTEGER,
    start_week: DataTypes.INTEGER,
    end_week: DataTypes.INTEGER,
  },
  {
    tableName: "brand_roadmap_phases",
    underscored: true,
  }
);

export default BrandRoadmapPhase;
