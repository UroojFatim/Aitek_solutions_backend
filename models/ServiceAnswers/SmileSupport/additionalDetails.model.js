import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const AdditionalDetails = sequelize.define(
  "AdditionalDetails",
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
      comment: "Optional if details are tied to a specific doctor",
    },

    // === Fields from seed ===
    allow_texting: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preferred_script: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    additional_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "additional_details",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["business_id"] },
      { fields: ["doctor_id"] },
    ],
  }
);

export default AdditionalDetails;
