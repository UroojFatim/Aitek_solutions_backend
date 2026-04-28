import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import { OnboardingStatus } from "../enums/onboardingStatus.enum.js";

const BusinessOnboarding = sequelize.define(
  "BusinessOnboarding",
  {
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
    onboarding_step_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'onboarding_steps',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: OnboardingStatus.NOT_STARTED,
      validate: {
        isIn: [[1, 2, 3, 4]]
      }
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "business_onboarding",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['business_id', 'onboarding_step_id']
      }
    ]
  }
);

export default BusinessOnboarding;