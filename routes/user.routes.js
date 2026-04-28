import express from "express";
import { addAdmin, getAllUsers,getUsersBySuperUser, deleteAdmin, updateUserServices, addUser, getBusinessUsers, getBusinessServices, deleteUser, updateUserPassword, restoreUser, restoreAdmin } from "../controllers/user.controller.js";
import {Allow_SuperAdmin_Or_Admin_Only, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only,Allow_SuperUser_Or_User_Only, Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY } from "../middleware/verifyRole.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/get", getAllUsers);
router.post("/add", addAdmin);
router.delete("/delete/:id", verifyToken, Allow_SuperAdmin_Or_Admin_Only, deleteAdmin);
router.get(
    "/business-users",
    verifyToken,
    Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only,
    getBusinessUsers
);

// Get users across ALL businesses owned by a Super User (Admin allowed)
router.get(
  "/by-superuser/:id",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  getUsersBySuperUser
);
router.put("/:id/services", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, updateUserServices);
router.post("/addUser", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, addUser);
router.get("/services", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY, getBusinessServices);
router.put("/:id/password", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY, updateUserPassword);
router.delete("/deleteUser/:id", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, deleteUser);

// Restore routes (soft delete restoration)
router.put("/:id/restore", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, restoreUser);
router.put("/admin/:id/restore", verifyToken, Allow_SuperAdmin_Or_Admin_Only, restoreAdmin);

export default router;
