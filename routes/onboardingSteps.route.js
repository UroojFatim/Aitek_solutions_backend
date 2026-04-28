// routes/onboardingSteps.route.js
import express from "express";
import {
  getAllOnboardingSteps,
  getOnboardingStepDetails,
  updateOnboardingSectionOfBusiness,
  saveBusinessDetails,
  saveCultureDetails,
  saveDoctorDetails,
  saveMarketAnalysis,
  saveMarketPerception,
  savePricingDetails,
  saveTeamDetails,
  getOnboardingStepsOfBusiness
} from "../controllers/onboardingSteps.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import {  Allow_SuperUser_Only, Allow_SuperAdmin_Or_Admin_Only } from "../middleware/verifyRole.js";


const router = express.Router();

// Get all onboarding steps (accessible to all authenticated users)
router.get("/", verifyToken, getAllOnboardingSteps);

// Get onboarding step details with sections and questions
router.get("/:stepId", getOnboardingStepDetails);


router.post("/business_details", verifyToken, Allow_SuperUser_Only, saveBusinessDetails);
router.post("/doctors_details", verifyToken, Allow_SuperUser_Only, saveDoctorDetails);
router.post("/culture_details", verifyToken, Allow_SuperUser_Only, saveCultureDetails);
router.post("/team_details", verifyToken, Allow_SuperUser_Only, saveTeamDetails);
router.post("/pricing_details", verifyToken, Allow_SuperUser_Only, savePricingDetails);
router.post("/market_perception", verifyToken, Allow_SuperUser_Only, saveMarketPerception);
router.post("/market_analysis", verifyToken, Allow_SuperUser_Only, saveMarketAnalysis);
// Get onboarding step information for a specific business (admin only)
router.get("/admin/:stepId/:businessId", verifyToken, Allow_SuperAdmin_Or_Admin_Only, getOnboardingStepsOfBusiness);
router.put("/admin/:sectionName/:businessId", verifyToken, Allow_SuperAdmin_Or_Admin_Only, updateOnboardingSectionOfBusiness);
export default router;