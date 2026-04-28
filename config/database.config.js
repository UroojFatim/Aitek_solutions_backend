import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "./logger.config.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    logging: false,
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Database connected successfully")
  } catch (error) {
    logger.error("❌ Database connection error:", error.message);
  }
};

testConnection();

export default sequelize;
