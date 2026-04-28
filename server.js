// import "newrelic";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import logger from "./config/logger.config.js";
import { requestLogger, errorLogger } from "./middleware/logging.middleware.js";
import routes from "./routes/index.js";
import "./models/user.model.js";
import "./models/notification.model.js";
import "./models/associations.js";
import http from "http";
import { initRealtime } from "./services/notification.service.js";

dotenv.config();
const app = express();
app.use(express.json());

logger.info("Application starting up", {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
});

const corsOrigins = ['http://localhost:5173', 'http://localhost:3000', "https://gray-moss-02882af10.6.azurestaticapps.net", "https://devportal.wolfofarches.com", "https://uatportal.wolfofarches.com", "https://portal.wolfofarches.com"];

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Add request logging middleware EARLY in the stack

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

// Mount all routes under /api
app.use("/api", routes);

app.use((req, res) => {
  logger.warn("Route not found", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

// Add error logging middleware
app.use(errorLogger);

const PORT = process.env.PORT || 5000;

// Create HTTP server and initialize realtime notifications
const server = http.createServer(app);
const io = initRealtime(server, { corsOrigins });
app.set("io", io);
// Log socket connections
io.on("connection", (socket) => {
  logger.info("Socket connected", {
    socketId: socket.id,
    address: socket.handshake?.address,
  });
});

// Sync database and start server
// sequelize.sync({
//   alter: process.env.NODE_ENV !== 'production',
//   force: false
// }).then(() => {
server.listen(PORT, "0.0.0.0", () => {
  logger.info("Server started successfully", {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});
// }).catch(err => {
//   logger.error('Database sync error', {
//     error: err.message,
//     stack: err.stack
//   });
//   process.exit(1);
// });
