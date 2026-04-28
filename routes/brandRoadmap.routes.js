// routes/brandRoadmap.routes.js
import express from "express";
import { createBrandEstablishmentRoadmap } from "../controllers/brandRoadmap.controller.js";
import { Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only } from "../middleware/verifyRole.js";

const router = express.Router();

// Protect this so only you can run it
router.post(
  "/addData",
  createBrandEstablishmentRoadmap
);

export default router;
