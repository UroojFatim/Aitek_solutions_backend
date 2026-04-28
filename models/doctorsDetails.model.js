import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const DoctorsDetails = sequelize.define(
  "DoctorsDetails",
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
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Full name of the doctor'
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nickname or preferred name'
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      },
      comment: 'Doctor\'s email address'
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Must be a valid date'
        }
      },
      comment: 'Doctor\'s birthday (optional but fun)'
    },
    motivation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What motivates you most as a provider?'
    },
    leadership_style: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'How do you define your leadership style?'
    },
    improvement_goal: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What\'s something you\'re working on improving this year (professionally or personally)?'
    },
    spouse_partner_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Spouse/Partner\'s name (optional)'
    },
    children_names_ages: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Children\'s names and ages (optional)'
    },
    favorite_restaurant: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Favorite restaurant or lunch spot near the clinic'
    },
    office_music: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'What music is usually playing in the office?'
    },
    clone_team_member: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'If you could clone one team member, who would it be—and why?'
    },
    coffee_order: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'What is your typical coffee order (Starbucks or otherwise)?'
    },
    sweet_treat: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'What is your choice sweet treat?'
    }
  },
  {
    tableName: "doctors_details",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['business_id']
      },
      {
        fields: ['email_address']
      }
    ]
  }
);

export default DoctorsDetails;