import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import {
  ARCH_TYPE,
  ARCH_TYPE_VALUES,
  DEFAULT_ARCH_TYPE,
  PRICE_POSITION,
  PRICE_POSITION_VALUES,
  DEFAULT_PRICE_POSITION,
  COMPETITIVE_DIFFERENTIATORS,
  COMPETITIVE_DIFFERENTIATORS_VALUES,
  DEFAULT_COMPETITIVE_DIFFERENTIATORS
} from "../enums/index.js";

const PricingDetails = sequelize.define(
  "PricingDetails",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // One-to-one relationship with business
      references: {
        model: 'businesses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    arch_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: DEFAULT_ARCH_TYPE,
      validate: {
        isIn: {
          args: [ARCH_TYPE_VALUES],
          msg: "Arch type must be one of: " + ARCH_TYPE_VALUES.join(", ")
        }
      }
    },
    price_range: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Current price per arch (all-in) - price range'
    },
    financing_options: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Financing options and lenders offered'
    },
    price_position: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: DEFAULT_PRICE_POSITION,
      validate: {
        isIn: {
          args: [PRICE_POSITION_VALUES],
          msg: "Price position must be one of: " + PRICE_POSITION_VALUES.join(", ")
        }
      }
    },
    offering_advantages: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What makes your full-arch offering better than competitors provide'
    },
    unique_competitive_edge: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Your #1 unique competitive edge'
    },
    full_arch_offering: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: "pricing_details",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['business_id']
      },
      {
        fields: ['arch_type']
      },
      {
        fields: ['price_position']
      }
    ]
  }
);

export default PricingDetails;