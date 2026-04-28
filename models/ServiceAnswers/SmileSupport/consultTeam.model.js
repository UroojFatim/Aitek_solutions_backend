import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const ConsultTeam = sequelize.define(
  "ConsultTeam",
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
      comment: "Optional if team details are tied to a specific doctor",
    },

    // === Fields from seed ===
    num_doctors: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_names: {
      type: DataTypes.TEXT, // could be JSON if you want structured list
      allowNull: false,
    },
    doctor_treatments: {
      type: DataTypes.TEXT, // freeform / JSON if structured
      allowNull: false,
    },
    num_treatment_coordinators: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coordinator_names: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    coordinator_treatments: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    avg_monthly_consults: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "consult_team",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["business_id"] },
      { fields: ["doctor_id"] },
    ],
  }
);

export default ConsultTeam;
