// utils/adminNotification.util.js
import Business from "../models/business.model.js";
import User from "../models/user.model.js";
import { UserRole } from "../enums/index.js";
import { getAdminNotificationEmail } from "../helpers/emailTemplates.js";
import { sendEmail } from "../services/email.service.js";
import { sendBulkNotification } from "./notification.util.js";

/**
 * Send notification to all admins about onboarding step completion
 * @param {string} businessId - Business ID
 * @param {string} stepTitle - Title of the completed step
 * @param {string} submittedByName - Name of the user who submitted (optional)
 * @returns {Promise<object>} Result object with success status and details
 */
export async function notifyAdminsStepCompleted(businessId, stepTitle, submittedByName = null) {
  try {
    // Get business details
    const business = await Business.findByPk(businessId, {
      attributes: ["name"],
    });

    if (!business) {
      throw new Error(`Business with ID ${businessId} not found`);
    }

    // Get all admin users
    const admins = await User.findAll({
      where: {
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
      },
      attributes: ["id", "email"],
    });

    if (!admins || admins.length === 0) {
      console.warn("No admin users found to notify");
      return {
        success: true,
        message: "No admin users found to notify"
      };
    }

    const businessName = business.name || "Unknown Business";

    // Generate message
    const message = submittedByName
      ? `Business "${businessName}" completed onboarding step "${stepTitle}" by ${submittedByName}.`
      : `Business "${businessName}" completed onboarding step "${stepTitle}".`;

    // Send email notifications
    try {
      const { subject, html, text } = getAdminNotificationEmail({
        subject: `Step Completed: ${stepTitle}`,
        message: message,
      });

      const adminEmails = admins.map((admin) => admin.email);
      await sendEmail({
        to: adminEmails,
        subject,
        html,
        text
      });
    } catch (emailError) {
      console.error("Failed to send email notifications to admins:", emailError);
    }

    // Send real-time notifications
    try {
      const adminIds = admins.map(admin => admin.id);
      await sendBulkNotification(
        adminIds,
        "Onboarding Step Completed",
        message
      );
    } catch (notificationError) {
      console.error("Failed to send real-time notifications to admins:", notificationError);
    }

    return {
      success: true,
      message: "Admin notifications sent successfully"
    };

  } catch (error) {
    console.error("Failed to notify admins about step completion:", error);
    throw error;
  }
}

/**
 * Send notification to all admins about service completion
 * @param {string} businessId - Business ID
 * @param {string} serviceName - Name of the completed service
 * @param {string} submittedByName - Name of the user who submitted (optional)
 * @returns {Promise<object>} Result object with success status and details
 */
export async function notifyAdminsServiceCompleted(businessId, serviceName, submittedByName = null) {
  try {
    // Get business details
    const business = await Business.findByPk(businessId, {
      attributes: ["name"],
    });

    if (!business) {
      throw new Error(`Business with ID ${businessId} not found`);
    }

    // Get all admin users
    const admins = await User.findAll({
      where: {
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
      },
      attributes: ["id", "email"],
    });

    if (!admins || admins.length === 0) {
      console.warn("No admin users found to notify");
      return {
        success: true,
        message: "No admin users found to notify"
      };
    }

    const businessName = business.name || "Unknown Business";

    // Generate message for service completion
    const message = submittedByName
      ? `Business "${businessName}" has successfully completed the "${serviceName}" service onboarding by ${submittedByName}.`
      : `Business "${businessName}" has successfully completed the "${serviceName}" service onboarding.`;

    // Send email notifications
    try {
      const { subject, html, text } = getAdminNotificationEmail({
        subject: `Service Completed: ${serviceName}`,
        message: message,
      });

      const adminEmails = admins.map((admin) => admin.email);
      await sendEmail({
        to: adminEmails,
        subject,
        html,
        text
      });
    } catch (emailError) {
      console.error("Failed to send email notifications to admins:", emailError);
    }

    // Send real-time notifications
    try {
      const adminIds = admins.map(admin => admin.id);
      await sendBulkNotification(
        adminIds,
        "Service Onboarding Completed",
        message
      );
    } catch (notificationError) {
      console.error("Failed to send real-time notifications to admins:", notificationError);
    }

    return {
      success: true,
      message: "Admin notifications sent successfully"
    };

  } catch (error) {
    console.error("Failed to notify admins about service completion:", error);
    throw error;
  }
}

/**
 * Send notification to all admins about task completion
 * @param {string} businessName - Name of the business
 * @param {string} taskTitle - Title of the completed task
 * @param {string} userName - Name of the user who completed the task
 * @param {string} taskId - ID of the completed task (optional)
 * @returns {Promise<object>} Result object with success status and details
 */
export async function notifyAdminsTaskCompleted(businessName, taskTitle, userName, taskId = null) {
  try {
    // Get all admin users
    const admins = await User.findAll({
      where: {
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
      },
      attributes: ["id", "email"],
    });

    if (!admins || admins.length === 0) {
      console.warn("No admin users found to notify");
      return {
        success: true,
        message: "No admin users found to notify"
      };
    }

    // Generate message
    const message = `User "${userName}" has marked task "${taskTitle}" as completed in ${businessName}.`;

    // Send email notifications
    try {
      const { subject, html, text } = getAdminNotificationEmail({
        subject: `Task Completed: ${taskTitle}`,
        message: message,
      });

      const adminEmails = admins.map((admin) => admin.email);
      await sendEmail({
        to: adminEmails,
        subject,
        html,
        text
      });
    } catch (emailError) {
      console.error("Failed to send email notifications to admins:", emailError);
    }

    // Send real-time notifications
    try {
      const adminIds = admins.map(admin => admin.id);
      await sendBulkNotification(
        adminIds,
        "Task Completion Notification",
        message
      );
    } catch (notificationError) {
      console.error("Failed to send real-time notifications to admins:", notificationError);
    }

    return {
      success: true,
      message: "Admin notifications sent successfully"
    };

  } catch (error) {
    console.error("Failed to notify admins about task completion:", error);
    throw error;
  }
}