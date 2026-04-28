import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const ConsultSchedulingDetails = sequelize.define(
  "ConsultSchedulingDetails",
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
      comment: "Optional link to a specific doctor",
    },

    available_hours: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    consult_duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['15', '30', '45', '60', 'custom']]
      }
    },

    same_day_appt: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['yes', 'no', 'if_requested']]
      }
    },

    double_booking: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['yes', 'no']]
      }
    },

    phone_coverage: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    phone_coverage_other_checked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    phone_coverage_other_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "consult_scheduling_details",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["business_id"] },
      { fields: ["doctor_id"] },
    ],
  }
);

export default ConsultSchedulingDetails;
