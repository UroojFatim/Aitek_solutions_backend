import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const SrvconbOardingQuestionsSection = sequelize.define(
  "SrvconbOardingQuestionsSection",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    service_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'services',
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
      comment: 'Order of sections within a page'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether this section is currently active'
    }
  },
  {
    tableName: "srvconboardingquestionssection",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['service_id', 'section_order']
      },
      {
        unique: true,
        fields: ['service_id', 'section_name'],
        name: 'unique_section_per_service'
      }
    ]
  }
);

export default SrvconbOardingQuestionsSection;