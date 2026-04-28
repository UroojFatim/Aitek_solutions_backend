// routes/sheets.routes.js
import express from "express";
import {
  createUserSpreadsheet,
  syncUserSheets,
  getUserSheetForCurrentUser,
  getAllUserSheets,
  deleteUserSheet,
  restoreUserSheet,
  activateUserSheet,
  updateSheetStatus,
  shareSheetAccess,
} from "../controllers/sheets.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import {
  getBookedForUser,
  getLeadsForUser,
} from "../controllers/sheets.controller.js";
import {
  Allow_SuperAdmin_Or_Admin_Only,
  Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY,
} from "../middleware/verifyRole.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  createUserSpreadsheet
);

router.post("/sync", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY, syncUserSheets);

router.get(
  "/me",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY,
  getUserSheetForCurrentUser
);
// Admin: list all business sheets
router.get(
  "/all",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  getAllUserSheets
);

// Admin: delete a sheet mapping by id
router.delete(
  "/:id",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  deleteUserSheet
);

// Admin: restore a deleted sheet
router.patch(
  "/:id/restore",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  restoreUserSheet
);

// Admin: activate a sheet
router.patch(
  "/:id/activate",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  activateUserSheet
);

// Admin: update sheet status (active/inactive)
router.patch(
  "/:id/status",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  updateSheetStatus
);

router.get("/booked", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY, getBookedForUser);

router.get("/leads", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY, getLeadsForUser);

// Admin: share sheet access with an email
router.post(
  "/:id/share",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  shareSheetAccess
);

export default router;
