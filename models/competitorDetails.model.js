import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const CompetitorDetails = sequelize.define(
  "CompetitorDetails",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    market_analysis_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'market_analysis',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    competitor_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of the competitor practice'
    },
    years_in_area: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'How many years the competitor has been in the area'
    },
    approx_price_per_arch: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Approximate price per arch (stored as string to handle ranges like "$20k-25k")'
    },
    strengths: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What are this competitor\'s strengths?'
    },
    weaknesses: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What are this competitor\'s weaknesses?'
    },
    target_patients: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What kind of patients do they attract?'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether this competitor is still actively competing'
    }
  },
  {
    tableName: "competitor_details",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['market_analysis_id']
      },
      {
        fields: ['competitor_name']
      },
      {
        fields: ['is_active']
      }
    ]
  }
);

export default CompetitorDetails;