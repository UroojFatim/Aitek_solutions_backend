// models/bookedTracker.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const BookedTracker = sequelize.define(
  "BookedTracker",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    // Changed from user_id → business_id
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

    // Reference to which sheet this tracker data belongs to
    sheet_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "business_sheets",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    sheet_row_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    date_lead_received: DataTypes.DATEONLY,
    date_scheduled: DataTypes.DATEONLY,
    appt_date: DataTypes.DATEONLY,
    appt_time: DataTypes.TIME,

    first_name: DataTypes.TEXT,
    last_name: DataTypes.TEXT,
    patient_dob: DataTypes.DATEONLY,
    phone: DataTypes.TEXT,
    procedure: DataTypes.TEXT,

    woa_notes: DataTypes.TEXT,
    location: DataTypes.TEXT,
    show_status: DataTypes.TEXT,
    treatment_status: DataTypes.TEXT,
    clinic_notes_from_consult: DataTypes.TEXT,
  },
  {
    tableName: "booked_tracker",
    underscored: true,
    indexes: [
      // Updated unique constraint
      { unique: true, fields: ["business_id", "sheet_row_number"] },

      // Updated index
      { fields: ["business_id"] },
    ],
  }
);

export default BookedTracker;
