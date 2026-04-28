import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import { DocumentUploadStatus, DOCUMENT_UPLOAD_STATUS_VALUES, DEFAULT_DOCUMENT_UPLOAD_STATUS } from '../enums/index.js';

const BusinessDocument = sequelize.define('BusinessDocument', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  business_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'businesses',
      key: 'id'
    }
  },
  uploaded_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  original_name: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  file_name: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Generated unique file name in storage'
  },
  file_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'File size in bytes'
  },
  mime_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  document_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Category or type of document'
  },
  upload_status: {
    type: DataTypes.STRING(50),
    defaultValue: DEFAULT_DOCUMENT_UPLOAD_STATUS,
    allowNull: false,
    validate: {
      isIn: {
        args: [DOCUMENT_UPLOAD_STATUS_VALUES]
      }
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'business_documents',
  timestamps: true,
  underscored: true,
  paranoid: true // This enables soft deletes
});

export default BusinessDocument;