import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  getServiceOnboardingForBusiness,
  getServiceDetails,
  saveAdditionalDetails,
  saveBrandAwarenessHistory,
  saveBrandPerceptionConfidence,
  saveCommunicationFollowUp,
  saveConsultSchedulingDetails,
  saveConsultTeam,
  saveFinalThoughts,
  saveMessagingDifferentiation,
  savePracticeProfile,
  saveVisionAspirations,
  saveFullArchImplantsFaqs,
  saveAppointmentConsultationFaqs,
  saveSingleImplantFaqs,
  updateSectionAnswers,
} from "../controllers/serviceOnboarding.controller.js";
import {
  createServiceSection,
  getServiceProgress,
  getServiceSectionsByServiceId,
} from "../controllers/serviceOnboardingSection.controller.js";
import {
  Allow_SuperAdmin_Or_Admin_Only,
  Allow_SuperUser_Or_User_Only,
} from "../middleware/verifyRole.js";

const router = express.Router();

//get service with sections and questions
router.get("/:serviceId", getServiceDetails);

// saving routes

// 24/7 Smile Support
router.post(
  "/practice_profile",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  savePracticeProfile
);
router.post(
  "/consult_scheduling_details",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveConsultSchedulingDetails
);
router.post(
  "/consult_team",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveConsultTeam
);
router.post(
  "/communication_followup",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveCommunicationFollowUp
);
router.post(
  "/additional_details",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveAdditionalDetails
);
router.post(
  "/full_arch_implants_faqs",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveFullArchImplantsFaqs
);
router.post(
  "/appointment_consultation_faqs",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveAppointmentConsultationFaqs
);
router.post(
  "/single_implant_faqs",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveSingleImplantFaqs
);

// Brand Establishment
router.post(
  "/brand_awareness_history",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveBrandAwarenessHistory
);
router.post(
  "/brand_perception_confidence",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveBrandPerceptionConfidence
);
router.post(
  "/messaging_differentiation",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveMessagingDifferentiation
);
router.post(
  "/vision_aspirations",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveVisionAspirations
);
router.post(
  "/final_thoughts",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  saveFinalThoughts
);

router.put(
  "/admin/:serviceId/:businessId/section/:sectionId",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  updateSectionAnswers
);
router.get(
  "/admin/:serviceId/:businessId",
  verifyToken,
  Allow_SuperAdmin_Or_Admin_Only,
  getServiceOnboardingForBusiness
);

// create sections and get sections by service id
router.post("/", createServiceSection);
router.get("/section/:serviceId", getServiceSectionsByServiceId);
router.get(
  "/progress/:serviceId",
  verifyToken,
  Allow_SuperUser_Or_User_Only,
  getServiceProgress
);

// Add update route

export default router;