import express from 'express';
import { getBusinessOnboardingOverview, getSectionProgress } from '../controllers/onboardingSection.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import { Allow_SuperUser_Only } from '../middleware/verifyRole.js';

const router = express.Router();

// Get section progress for a specific onboarding step
router.get('/progress/:stepId', verifyToken, Allow_SuperUser_Only, getSectionProgress);
router.get('/get', getBusinessOnboardingOverview);

export default router; 