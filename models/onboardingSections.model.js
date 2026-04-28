import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const OnboardingSections = sequelize.define(
  "OnboardingSections",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    step_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'onboarding_steps',
        key: 'id'
      }
    },
    section_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Table name where to store section data'
    },
    section_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Display title for the section'
    },
    section_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description text for the section'
    },
    section_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Order of sections within a step'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether this section is currently active'
    }
  },
  {
    tableName: "onboarding_sections",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['step_id', 'section_order']
      },
      {
        unique: true,
        fields: ['step_id', 'section_name'],
        name: 'unique_section_per_step'
      }
    ]
  }
);

export default OnboardingSections;