// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { UserRole, UserStatus } from "../enums/index.js";
import { ApiResponse } from "../utils/response.util.js";
import { getPasswordResetEmail } from "../helpers/emailTemplates.js";
import { sendEmail } from "../services/email.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// Sign Up Controller
export const signup = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return ApiResponse.badRequest(res, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role: role, // If role is not provided, the model default will be used
    });

    return ApiResponse.created(res, "User created successfully", {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Sign In Controller with cookie-based JWT
export const signin = async (req, res) => {
  let { email, password } = req.body;
  email = email?.trim().toLowerCase();

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return ApiResponse.badRequest(
        res,
        "Invalid credentials, Email or password is incorrect"
      );
    }

    // Check if user is deleted
    if (user.status === UserStatus.DELETED) {
      return ApiResponse.badRequest(
        res,
        "This account has been deleted and cannot be accessed."
      );
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return ApiResponse.badRequest(
        res,
        "Invalid credentials, Email or password is incorrect"
      );
    }

    // Generate JWT with user ID (UUID), role, full_name, and email included
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return ApiResponse.ok(res, "Sign in successful", {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      password_changed: user.password_changed,
    });
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Logout Controller
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return ApiResponse.ok(res, "Logged out successfully");
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "full_name", "email", "role", "password_changed", "status"],
    });

    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Check if user is deleted
    if (user.status === UserStatus.DELETED) {
      return ApiResponse.badRequest(
        res,
        "This account has been deleted and cannot be accessed."
      );
    }

    return ApiResponse.ok(res, "User retrieved successfully", user);
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Validate Token and Get User
export const validateToken = async (req, res) => {
  try {
    // The token verification is already done by the auth middleware
    // If we reach here, it means the token is valid
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "full_name", "email", "role", "password_changed", "status"],
    });

    if (!user) {
      return ApiResponse.badRequest(res, "User not found");
    }

    // Check if user is deleted
    if (user.status === UserStatus.DELETED) {
      return ApiResponse.badRequest(
        res,
        "This account has been deleted and cannot be accessed."
      );
    }

    return ApiResponse.ok(res, "Token is valid", user);
  } catch (err) {
    return ApiResponse.serverError(res, "Invalid token", err);
  }
};

// Forgot Password - send reset link
export const requestForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return ApiResponse.ok(
        res,
        "If the email exists, a reset link has been sent"
      );
    }

    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password?token=${resetToken}`;

    const { subject, html, text } = getPasswordResetEmail({
      username: user.full_name,
      resetLink,
    });
    await sendEmail({ to: user.email, subject, html, text });
    return ApiResponse.ok(
      res,
      "If the email exists, a reset link has been sent"
    );
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Reset Password
export const forgotPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    if (!token || !newPassword) {
      return ApiResponse.badRequest(res, "Token and new password are required");
    }
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return ApiResponse.badRequest(res, "Invalid or expired token");
    }
    const user = await User.findByPk(payload.id);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password_hash
    );
    if (isSamePassword) {
      return ApiResponse.badRequest(
        res,
        "New password cannot be the same as your old password"
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    await user.save();
    return ApiResponse.ok(res, "Password has been reset successfully");
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Change Password - requires old password validation
export const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.id; // From auth middleware

  try {
    if (!current_password || !new_password) {
      return ApiResponse.badRequest(res, "Old password and new password are required");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Validate old password
    const isOldPasswordValid = await bcrypt.compare(
      current_password,
      user.password_hash
    );
    if (!isOldPasswordValid) {
      return ApiResponse.badRequest(res, "Old password is incorrect");
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(
      new_password,
      user.password_hash
    );
    if (isSamePassword) {
      return ApiResponse.badRequest(
        res,
        "New password cannot be the same as your old password"
      );
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password_hash = hashedPassword;
    user.password_changed = true; // Mark that user has changed their password
    await user.save();

    return ApiResponse.ok(res, "Password changed successfully");
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};
