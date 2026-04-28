import express from "express";
import {
  getAllServices,
} from "../controllers/service.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get all services (only id and name)
router.get("/", verifyToken, getAllServices);

export default router;