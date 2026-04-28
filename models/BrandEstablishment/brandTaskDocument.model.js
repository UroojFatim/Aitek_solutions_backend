// models/brandTaskDocument.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";
import {
  DocumentUploadStatus,
  DOCUMENT_UPLOAD_STATUS_VALUES,
  DEFAULT_DOCUMENT_UPLOAD_STATUS,
} from "../../enums/index.js"; // same place you use for BusinessDocument

const BrandTaskDocument = sequelize.define(
  "BrandTaskDocument",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    plan_task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "brand_plan_tasks",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    original_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "Generated unique file name in storage",
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "File size in bytes",
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    upload_status: {
      type: DataTypes.STRING(50),
      defaultValue: DEFAULT_DOCUMENT_UPLOAD_STATUS,
      allowNull: false,
      validate: {
        isIn: {
          args: [DOCUMENT_UPLOAD_STATUS_VALUES],
        },
      },
    },
    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "brand_task_documents",
    underscored: true,
    timestamps: true,
    paranoid: true, // soft delete
  }
);

export default BrandTaskDocument;
