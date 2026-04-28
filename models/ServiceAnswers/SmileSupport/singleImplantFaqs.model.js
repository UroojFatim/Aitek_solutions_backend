import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config.js";

const SingleImplantFaqs = sequelize.define(
  "SingleImplantFaqs",
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
    single_cost: { type: DataTypes.TEXT, allowNull: true },
    single_duration: { type: DataTypes.TEXT, allowNull: true },
    bone_graft_need: { type: DataTypes.TEXT, allowNull: true },
    same_day_extract_place: { type: DataTypes.TEXT, allowNull: true },
    final_crown_timing: { type: DataTypes.TEXT, allowNull: true },
    front_tooth_ok: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "single_implant_faqs",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["business_id"], unique: true }, // one row per business
    ],
  }
);

export default SingleImplantFaqs;
