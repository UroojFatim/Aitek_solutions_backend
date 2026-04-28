// models/businessSheet.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const BusinessSheet = sequelize.define(
  "BusinessSheet",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // sheet is now tied to a business instead of a user
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "businesses", // name of your businesses table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    spreadsheet_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // one row per Google sheet ID
    },

    spreadsheet_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deleted'),
      defaultValue: 'active',
      allowNull: false,
    },
  },
  {
    tableName: "business_sheets",
    underscored: true,
    indexes: [
      { fields: ["business_id"] },
    ],
  }
);

export default BusinessSheet;
