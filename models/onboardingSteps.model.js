import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const OnboardingSteps = sequelize.define(
  "OnboardingSteps",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    step_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    step_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    step_subtitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    step_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    step_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    action_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    action_label: {
      type: DataTypes.STRING(255),
    }
  },
  {
    tableName: "onboarding_steps",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['step_order']
      },
      {
        unique: true,
        fields: ['step_name']
      }
    ]
  }
);

export default OnboardingSteps;