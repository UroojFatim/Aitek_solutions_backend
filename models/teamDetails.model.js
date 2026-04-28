import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const TeamDetails = sequelize.define(
  "TeamDetails",
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
    manages_leads: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Who manages incoming leads or new patient inquiries?'
    },
    handles_consult_scheduling: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Who handles consult scheduling?'
    },
    presents_treatment_plans: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Who presents treatment plans?'
    },
    manages_financing: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Who manages financing?'
    },
    handles_content_social_media: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Who takes photos or handles content/social media?'
    }
  },
  {
    tableName: "team_details",
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

export default TeamDetails;