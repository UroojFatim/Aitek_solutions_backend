import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const BusinessDetails = sequelize.define(
  "BusinessDetails",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // One-to-one relationship
      references: {
        model: 'businesses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    practice_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Name of the practice'
    },
    primary_office_address: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Primary office address including suite number if applicable'
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: {
          msg: 'Phone number must contain only numbers'
        }
      },
      comment: 'Primary phone number for the practice'
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      },
      comment: 'Main contact email address'
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Practice website URL'
    },
    social_media_handles: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Social media handles and profiles'
    },
    years_in_operation: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'How long has the practice been in operation'
    },
    accepts_new_patients: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: 'Whether the practice currently accepts new patients'
    },
    pms_software: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Practice Management Software being used'
    },
    success_vision: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What success looks like for the practice 12 months from now'
    }
  },
  {
    tableName: "business_details",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['business_id']
      }
    ]
  }
);

export default BusinessDetails;