import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const CommunicationFollowUp = sequelize.define(
  "CommunicationFollowUp",
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
      comment: "Optional if communication is tied to a specific doctor",
    },

    // === Fields from seed ===
    primary_contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    primary_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    primary_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "communication_followup",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["business_id"] },
      { fields: ["doctor_id"] },
    ],
  }
);

export default CommunicationFollowUp;
