import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import { BUSINESS_STATUS_VALUES, DEFAULT_BUSINESS_STATUS } from "../enums/index.js";

const Business = sequelize.define(
  "Business",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    npi_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
      validate: {
        npiNumberFormat(value) {
          if (value !== null) {
            if (!/^\d{10}$/.test(value)) {
              throw new Error('NPI number must be exactly 10 digits');
            }
          }
        }
      }
    },

    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: DEFAULT_BUSINESS_STATUS,
      validate: {
        isIn: {
          args: [BUSINESS_STATUS_VALUES],
          msg: "Status must be one of: " + BUSINESS_STATUS_VALUES.join(", ")
        }
      }
    }
  },
  {
    tableName: "businesses",
    timestamps: true,
    underscored: true,
  }
);

export default Business;