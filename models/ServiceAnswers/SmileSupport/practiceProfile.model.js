import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const PracticeProfile = sequelize.define(
  "PracticeProfile",
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
        model: "businesses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "doctors_details",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "Optional link if profile is doctor-specific",
    },

    // === Fields from SQL seed ===
    practice_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_locations: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location_addresses: {
      type: DataTypes.TEXT, // could also be JSON if you want structured addresses
      allowNull: false,
    },
    main_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    office_hours: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    practice_software: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['dentrix', 'opendental', 'eaglesoft', 'carestack', 'cloud9', 'shape', 'other']]
      }
    },
    practice_software_other_text: {
      type: DataTypes.STRING, // in case "other" is selected
      allowNull: true,
    },
  },
  {
    tableName: "practice_profile",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["business_id"] },
      { fields: ["doctor_id"] },
    ],
  }
);

export default PracticeProfile;
