import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const BrandAwarenessHistory = sequelize.define(
  "BrandAwarenessHistory",
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

    // Checkbox - multiple investments possible
    brand_marketing_investments: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // One sentence description
    brand_identity_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // How long branding has been in place
    branding_duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['lt_1', '1_3', '3_5', '5_plus', 'never_defined']]
      }
    },

    // Worked with consultant
    worked_with_brand_consultant: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['yes', 'no']]
      }
    },

    // Consultant scope of work (if yes)
    consultant_scope_of_work: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "brand_awareness_history",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["business_id"] }],
  }
);

export default BrandAwarenessHistory;
