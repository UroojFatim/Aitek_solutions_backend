import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const EmployeeDetails = sequelize.define(
  "EmployeeDetails",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    team_details_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'team_details',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Employee full name'
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Employee role/position in the practice'
    },
    years_with_practice: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'How many years the employee has been with the practice'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      },
      comment: 'Employee email address'
    },
    cell_phone: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Cell phone number if used for work'
    },
    fun_fact_personality: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Fun fact or personality trait about the employee'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the employee is currently active'
    }
  },
  {
    tableName: "employee_details",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['team_details_id']
      },
      {
        fields: ['email']
      },
      {
        fields: ['is_active']
      }
    ]
  }
);

export default EmployeeDetails;