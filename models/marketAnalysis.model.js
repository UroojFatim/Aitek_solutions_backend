import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import {
  PATIENT_TRAVEL_DISTANCE_VALUES,
  DEFAULT_PATIENT_TRAVEL_DISTANCE,
  MARKET_SATURATION_VALUES,
  DEFAULT_MARKET_SATURATION,
} from "../enums/index.js";

const MarketAnalysis = sequelize.define(
  "MarketAnalysis",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // One-to-one relationship with business
      references: {
        model: 'businesses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    patient_travel_distance: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: DEFAULT_PATIENT_TRAVEL_DISTANCE,
      validate: {
        isIn: {
          args: [PATIENT_TRAVEL_DISTANCE_VALUES],
          msg: "Patient travel distance must be one of: " + PATIENT_TRAVEL_DISTANCE_VALUES.join(", ")
        }
      }
    },
    market_saturation_level: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: DEFAULT_MARKET_SATURATION,
      validate: {
        isIn: {
          args: [MARKET_SATURATION_VALUES],
          msg: "Market saturation level must be one of: " + MARKET_SATURATION_VALUES.join(", ")
        }
      }
    },
    competitor_marketing_types: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    competitor_b2b_marketing: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Do any of them market heavily to referring providers or dental specialists (B2B)? If so, who and how?'
    },
    lost_case_to_competitor: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Have you ever lost a case to a competitor? If yes, who was it—and why do you think the patient chose them?'
    },
    gained_patient_from_competitor: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Have you ever gained a patient who left a competitor? If yes, why did they switch?'
    }
  },
  {
    tableName: "market_analysis",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['business_id']
      },
      {
        fields: ['patient_travel_distance']
      },
      {
        fields: ['market_saturation_level']
      }
    ]
  }
);

export default MarketAnalysis;