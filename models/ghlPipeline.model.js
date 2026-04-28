import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const GhlPipeline = sequelize.define("GhlPipeline", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ghl_pipeline_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  location_id: {
  type: DataTypes.STRING,
  allowNull: false,
}
}, {
  tableName: "ghl_pipelines",
  timestamps: true,
  underscored: true,
});

export default GhlPipeline;
