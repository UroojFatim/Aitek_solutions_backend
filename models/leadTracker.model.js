// models/leadTracker.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const LeadTracker = sequelize.define(
  "LeadTracker",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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
    date_lead_called: DataTypes.DATEONLY,
    first_name: DataTypes.TEXT,
    last_name: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    procedure: DataTypes.TEXT,
    caller: DataTypes.TEXT,
    locations: DataTypes.TEXT,
    call_status: DataTypes.TEXT,
    booked_status: DataTypes.TEXT,
    dental_va_call_note: DataTypes.TEXT,

    time_lead_received: DataTypes.TIME,
    time_lead_called: DataTypes.TIME,
    timing: DataTypes.TEXT,
    dentalpro_va: DataTypes.TEXT,
    time_difference: DataTypes.TEXT,
    notes: DataTypes.TEXT,

    day1_note: DataTypes.TEXT,
    day2_note: DataTypes.TEXT,
    day3_note: DataTypes.TEXT,
    day4_note: DataTypes.TEXT,
    day5_note: DataTypes.TEXT,
    day6_note: DataTypes.TEXT,
    day7_note: DataTypes.TEXT,

    callback_8: DataTypes.TEXT,
    callback_9: DataTypes.TEXT,
    callback_10: DataTypes.TEXT,
    follow_up_note: DataTypes.TEXT,
  },
  {
    tableName: "lead_tracker",
    underscored: true,
    indexes: [
      // Updated unique constraint
      { unique: true, fields: ["business_id", "sheet_row_number"] },

      // Updated index
      { fields: ["business_id"] },
    ],
  }
);

export default LeadTracker;
