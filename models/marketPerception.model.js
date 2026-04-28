import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import {
  PRACTICE_TIER_VALUES,
} from "../enums/index.js";

const MarketPerception = sequelize.define(
  "MarketPerception",
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
    barriers_to_attracting_cases: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What are your biggest barriers to attracting more full-arch cases?'
    },
    perception_to_fix: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'If we could wave a magic wand and fix one perception patients have about your practice, what would it be?'
    },
    practice_tier: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: {
          args: [PRACTICE_TIER_VALUES],
          msg: "Practice tier must be one of: " + PRACTICE_TIER_VALUES.join(", ")
        }
      }
    },
    tier_perception_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Why do you believe patients perceive it that way?'
    },
    worked_with_marketing_agency: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Have you previously worked with a marketing agency or consultant?'
    },
    previous_marketing_companies: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Companies you\'ve worked with (past or current)'
    },
    marketing_services_received: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    what_worked_well: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What worked well with those marketing efforts?'
    },
    what_didnt_work: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What didn\'t work or fell short of expectations?'
    },
    what_was_missing: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What was missing from their approach that you hoped for but didn\'t receive?'
    },
    why_stopped_working: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What ultimately made you decide to stop working with them (if applicable)?'
    },
    wolf_of_arches_expectations: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What do you hope will feel different or better about working with Wolf of Arches?'
    }
  },
  {
    tableName: "market_perception",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['business_id']
      },
      {
        fields: ['practice_tier']
      },
      {
        fields: ['worked_with_marketing_agency']
      }
    ]
  }
);

export default MarketPerception;