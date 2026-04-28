import express from "express";
import {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  getBusinessDetails,
  updateBusinessById,
  updateBusinessOnboardingSteps,
  updateBusinessServices,
  getBusinessServiceStatus,
  getBusinessesByUser
} from "../controllers/business.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import { Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only,Allow_SuperAdmin_Or_Admin_Only, Allow_SuperUser_Or_User_Only } from "../middleware/verifyRole.js";

const router = express.Router();

// Get all businesses (only id and business_name)
router.get("/", verifyToken, getAllBusinesses);

// get all business (only id and business_name) without verifying token
router.get("/get", getAllBusinesses);

// Get business details for authenticated Super User (no params needed)
// This MUST come before /:id route to avoid conflicts
router.get("/details", verifyToken, Allow_SuperUser_Or_User_Only, getBusinessDetails);

// Get businesses assigned to a given user (Admin route)
router.get('/by-user/:id', verifyToken, Allow_SuperAdmin_Or_Admin_Only, getBusinessesByUser);

// Get specific service status for authenticated user's business by service ID
router.get("/service-status/:serviceId", verifyToken, Allow_SuperUser_Or_User_Only, getBusinessServiceStatus);

// Get business details by ID
router.get("/:id", verifyToken, getBusinessById);

// Update business details and services by ID (Admin or SuperUser only)
router.put("/:id", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, updateBusinessById);

// Create business (Admin only)
router.post("/create", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, createBusiness);

// Batch update business onboarding steps
router.put("/:businessId/onboarding-steps", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, updateBusinessOnboardingSteps);

// Update business services
router.put("/:businessId/services", verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only, updateBusinessServices);

export default router;