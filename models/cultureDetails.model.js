import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const CultureDetails = sequelize.define(
  "CultureDetails",
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
    team_biggest_strength: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What is your team\'s biggest strength?'
    },
    workflow_improvement_area: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What area of your team workflow needs the most improvement?'
    },
    disorganized_systems: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What internal systems feel disorganized or chaotic?'
    },
    celebration_method: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'When your team wins, how do you celebrate?'
    },
    favorite_lunch_spot: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'What is your team\'s go-to lunch order or favorite delivery spot?'
    },
    team_rituals_traditions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Is there a ritual or tradition your team looks forward to each week/month/year?'
    },
    team_theme_song: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'If your team had a theme song, what would it be?'
    },
    social_glue_person: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Who is your office\'s \'social glue\'—the one who keeps morale high?'
    },
    office_brand_color: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'What is your office\'s "brand color"?'
    }
  },
  {
    tableName: "culture_details",
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

export default CultureDetails;