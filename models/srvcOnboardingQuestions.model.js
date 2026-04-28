import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import { FieldType, FIELD_TYPE_VALUES, DEFAULT_FIELD_TYPE } from "../enums/index.js";

const SrvcOnboardingQuestions = sequelize.define(
  "SrvcOnboardingQuestions",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    service_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    section_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'srvconboardingquestionssection',
        key: 'id'
      }
    },
    field_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Unique field name for form handling - snake_case recommended'
    },
    label: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Field label displayed to user'
    },
    field_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: DEFAULT_FIELD_TYPE,
      validate: {
        isIn: {
          args: [FIELD_TYPE_VALUES],
          msg: "Field type must be one of: " + FIELD_TYPE_VALUES.join(", "),
        },
      }
    },
    placeholder: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Placeholder text for input fields'
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether the field is required for Yup validation'
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Order within the section'
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Options for select, radio, checkbox, etc. Format: [{value: "val", label: "Label"}]'
    },
    yup_validation: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Yup validation rules: {type: "string", min: 1, max: 100, matches: "regex", email: true, url: true, required: true}'
    },
    default_value: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Default value for Formik initial values'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether this question is currently active'
    }
  },
  {
    tableName: "srvconboardingquestions",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['service_id', 'section_id', 'display_order']
      },
      {
        fields: ['service_id', 'display_order']
      },
      {
        fields: ['field_name']
      },
      {
        unique: true,
        fields: ['service_id', 'section_id', 'field_name'],
        name: 'unique_field_per_page'
      }
    ]
  }
);

export default SrvcOnboardingQuestions;