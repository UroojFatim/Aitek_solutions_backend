import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const BrandPerceptionConfidence = sequelize.define(
  "BrandPerceptionConfidence",
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

    // What they like most
    brand_like_most: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // What they dislike or feel missing
    brand_dislike_missing: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Brand personality
    brand_personality: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['clinical', 'bold', 'friendly', 'luxury', 'not_thought']]
      }
    },

    // Recognition rating (1–5)
    brand_recognition_rating: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['1', '2', '3', '4', '5']]
      }
    },
    // Audience type
    brand_current_audience: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['high_income', 'budget', 'mix', 'not_sure']]
      }
    }
  },
  {
    tableName: "brand_perception_confidence",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["business_id"] }],
  }
);

export default BrandPerceptionConfidence;
