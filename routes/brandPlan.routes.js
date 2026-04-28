// routes/brandPlan.routes.js
import express from "express";
import {
  getBrandPlanForBusiness,
  updateTaskStatus,
  addTaskNote,
  getTaskNotes,
  ensureBrandPlanProgress,
  updateTaskNote,
  updatePlanTask,
  markTaskAsCompleted,
} from "../controllers/brandPlan.controller.js";
import verifyToken from "../middleware/verifyToken.js";
// import uploadMiddleware from "../middleware/upload.middleware.js";

const router = express.Router();
router.post("/ensure", verifyToken, ensureBrandPlanProgress);
router.get("/:businessId", verifyToken, getBrandPlanForBusiness);
router.patch("/tasks/:id/status", verifyToken, updateTaskStatus);
router.post("/tasks/:id/notes",verifyToken, addTaskNote);
router.get("/tasks/:id/notes", verifyToken, getTaskNotes);
router.patch("/notes/:id", verifyToken, updateTaskNote);
router.patch("/tasks/:id/", verifyToken, updatePlanTask);
router.post("/tasks/mark-completed", verifyToken, markTaskAsCompleted);


export default router;
