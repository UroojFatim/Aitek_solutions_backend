import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const MessagingDifferentiation = sequelize.define(
  "MessagingDifferentiation",
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

    // What makes you different
    brand_differentiator: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Have you defined your signature approach?
    signature_approach_defined: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['yes', 'no']]
      }
    },

    // If yes, describe it
    signature_approach_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Emotional outcome for patients
    brand_emotional_outcome: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['inspired', 'safe', 'empowered', 'blown_away', 'not_sure']]
      }
    },

    // Storytelling usage
    storytelling_usage: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['often', 'occasionally', 'rarely', 'never']]
      }
    },
    // Story they wish people knew
    story_wish_known: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "messaging_differentiation",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["business_id"] }],
  }
);

export default MessagingDifferentiation;
