import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const VisionAspirations = sequelize.define(
  "VisionAspirations",
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

    // If you could be famous for one thing
    brand_fame_goal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Gold-standard brand you admire
    admired_gold_standard_brand: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Do you want to be the face or let brand lead
    brand_face_preference: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['face', 'practice', 'both', 'not_sure']]
      }
    },

    // What excites you about rebranding
    rebranding_excitement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Fears about visibility
    visibility_fears: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Impact if brand stood out
    market_domination_impact: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Final Thoughts - summary dream
    brand_dream_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Final Thoughts - extra notes
    additional_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "vision_aspirations",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["business_id"] }],
  }
);

export default VisionAspirations;
