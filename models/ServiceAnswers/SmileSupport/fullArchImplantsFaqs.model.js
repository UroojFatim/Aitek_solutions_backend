import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const FullArchImplantsFaqs = sequelize.define(
  "FullArchImplantsFaqs",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "businesses", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    // === Answers (matching field_name) ===
    what_is_all_on_4: { type: DataTypes.TEXT, allowNull: true },
    how_many_teeth: { type: DataTypes.TEXT, allowNull: true },
    surgery_time: { type: DataTypes.TEXT, allowNull: true },
    same_day_teeth: { type: DataTypes.TEXT, allowNull: true },
    recovery_time: { type: DataTypes.TEXT, allowNull: true },
    longevity: { type: DataTypes.TEXT, allowNull: true },
    cost_compare: { type: DataTypes.TEXT, allowNull: true },
    sedation: { type: DataTypes.TEXT, allowNull: true },
    eat_normally: { type: DataTypes.TEXT, allowNull: true },
    financing: { type: DataTypes.TEXT, allowNull: true },
    permanent: { type: DataTypes.TEXT, allowNull: true },
    dentures_ok: { type: DataTypes.TEXT, allowNull: true },
    insurance_cover: { type: DataTypes.TEXT, allowNull: true },
    credit_need: { type: DataTypes.TEXT, allowNull: true },
    cosigner: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "full_arch_implants_faqs",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["business_id"], unique: true }, // one row per business
    ],
  }
);

export default FullArchImplantsFaqs;
