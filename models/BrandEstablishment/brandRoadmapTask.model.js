// models/brandRoadmapTask.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const BrandRoadmapTask = sequelize.define(
  "BrandRoadmapTask",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    week_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_roadmap_weeks",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    is_mandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sort_order: DataTypes.INTEGER,

    // ---------- NEW FIELDS ----------
    woa_responsibilities: {
      type: DataTypes.TEXT, // long rich text allowed
      allowNull: true,
    },
    client_responsibilities: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    client_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Checklist template – multiple options
    // e.g. [{ key: "upload_photos", label: "Upload 5 brand photos" }, ...]
    checklist_items: {
      type: DataTypes.JSONB, // if you're on Postgres; use JSON if not
      allowNull: true,
    },
    reflective_question: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "brand_roadmap_tasks",
    underscored: true,
  }
);

export default BrandRoadmapTask;
