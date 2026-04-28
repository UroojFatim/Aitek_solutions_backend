import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const BusinessPipeline = sequelize.define("BusinessPipeline", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  business_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
        model: 'businesses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'    
  },
  pipeline_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
        model: 'ghl_pipelines',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'  
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: "business_pipeline",
  timestamps: false,
  underscored: true,
  indexes: [
      {
        unique: true,
        fields: ["business_id", "pipeline_id"],
      },
    ],
});

export default BusinessPipeline;
