// routes/index.js
import express from "express";
import authRoutes from "./auth.route.js";
import businessRoutes from "./business.route.js";
import serviceRoutes from "./service.route.js";
import onboardingStepsRoutes from "./onboardingSteps.route.js";
import documentRoutes from "./document.route.js";
import onboardingSectionRoutes from "./onboardingSection.route.js";
import ghlPipelinesRoutes from "./ghlPipeline.routes.js";
import UserRoutes from "./user.routes.js";
import businessPipelineRoutes from "./businessPipeline.routes.js";
import serviceOnboardingRoutes from "./serviceOnboarding.routes.js";
import notificationRoutes from "./notification.route.js";
import auditRoutes from "./audit.route.js";
// import sheetsRoutes from "./sheets.route.js";
import ghlRoutes from "./ghl.routes.js";
import twilioRoutes from "./twilio.route.js";
import sheetsRoutes from "./sheets.routes.js";
import brandRoad from "./brandRoadmap.routes.js";
import brandPlanRoutes from "./brandPlan.routes.js";
import brandTaskDocumentRoutes from "./brandTaskDocument.route.js";

const router = express.Router();

// ---- your existing routes
router.use("/auth", authRoutes);
router.use("/business", businessRoutes);
router.use("/services", serviceRoutes);
router.use("/onboarding-steps", onboardingStepsRoutes);
router.use("/documents", documentRoutes);
router.use("/onboarding-section", onboardingSectionRoutes);
router.use("/business-pipelines", businessPipelineRoutes);
router.use("/ghl-pipelines", ghlPipelinesRoutes);
router.use("/ghl", ghlRoutes);
router.use("/twilio", twilioRoutes);
router.use("/service-onboarding", serviceOnboardingRoutes);
router.use("/users", UserRoutes);
router.use("/notifications", notificationRoutes);
router.use("/audit", auditRoutes);
// router.use("/sheets", sheetsRoutes);
router.use("/sheets", sheetsRoutes);
router.use("/brand-roadmap",brandRoad);
router.use("/brand-plans", brandPlanRoutes);
router.use("/task-documents", brandTaskDocumentRoutes);

export default router;