// routes/taskDocument.routes.js
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  Allow_SuperUser_Or_User_Only,
  Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY,
} from "../middleware/verifyRole.js";
import {
  getTaskUploadUrl,
  confirmTaskUpload,
  getTaskDocuments,
  getTaskDownloadUrl,
  deleteTaskDocument,
} from "../controllers/brandTaskDocument.controller.js";

const router = express.Router();

// User uploads to their tasks
router.post(
  "/upload-url",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY,
  getTaskUploadUrl
);

// Confirm upload
router.post(
  "/:documentId/confirm",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY,
  confirmTaskUpload
);

// List docs for a task
router.get(
  "/task/:taskId",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY,
  getTaskDocuments
);

// Download + delete
router.get("/:documentId/download", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY,getTaskDownloadUrl);
router.delete(
  "/delete/:documentId",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY,
  deleteTaskDocument
);

export default router;
