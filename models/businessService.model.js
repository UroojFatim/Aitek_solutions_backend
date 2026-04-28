import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import {
  BusinessServiceStatus,
  BUSINESS_SERVICE_STATUS_VALUES,
  DEFAULT_BUSINESS_SERVICE_STATUS,
} from "../enums/index.js";

const BusinessService = sequelize.define(
  "BusinessService",
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
    service_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: DEFAULT_BUSINESS_SERVICE_STATUS,
      validate: {
        isIn: {
          args: [BUSINESS_SERVICE_STATUS_VALUES],
          msg:
            "Status must be one of: " +
            BUSINESS_SERVICE_STATUS_VALUES.join(", "),
        },
      },
    },
  },
  {
    tableName: "business_services",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["business_id", "service_id"],
      },
    ],
  }
);

export default BusinessService;
