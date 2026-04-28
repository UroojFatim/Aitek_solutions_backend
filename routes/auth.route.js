import express from "express";
import {
  signup,
  signin,
  logout,
  getCurrentUser,
  validateToken,
  requestForgotPassword,
  forgotPassword,
  changePassword,
} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/user", verifyToken, getCurrentUser);
router.get("/validate", verifyToken, validateToken);
// Forgot password routes
router.post("/request-forgot-password", requestForgotPassword);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", verifyToken, changePassword);

export default router;
