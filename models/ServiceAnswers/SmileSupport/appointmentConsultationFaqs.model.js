import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const AppointmentConsultationFaqs = sequelize.define(
  "AppointmentConsultationFaqs",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "businesses", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    // === Answers (matching field_name) ===
    consult_cost: { type: DataTypes.TEXT, allowNull: true },
    consult_includes: { type: DataTypes.TEXT, allowNull: true },
    consult_length: { type: DataTypes.TEXT, allowNull: true },
    virtual_consults: { type: DataTypes.TEXT, allowNull: true },
    who_meet: { type: DataTypes.TEXT, allowNull: true },
    bill_insurance: { type: DataTypes.TEXT, allowNull: true },
    bring_to_appt: { type: DataTypes.TEXT, allowNull: true },
    start_timeline: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "appointment_consultation_faqs",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["business_id"], unique: true }, // one row per business
    ],
  }
);

export default AppointmentConsultationFaqs;
