import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const PracticeGrowth = sequelize.define(
  "PracticeGrowth",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    tableName: "practice_growth",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name']
      }
    ]
  }
);

export default PracticeGrowth; 