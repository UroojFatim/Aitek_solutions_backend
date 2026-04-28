// controllers/business.controller.js
import Business from "../models/business.model.js";
import BusinessService from "../models/businessService.model.js";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";
import UserBusiness from "../models/userBusiness.model.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import sequelize from "../config/database.config.js";
import { ApiResponse } from "../utils/response.util.js";
import { BUSINESS_STATUS_VALUES, UserRole } from "../enums/index.js";
import { BusinessServiceStatus, BusinessServiceStatusLabels } from "../enums/serviceStatus.enum.js";
import OnboardingSteps from "../models/onboardingSteps.model.js";
import BusinessOnboarding from "../models/businessOnboarding.model.js";
import {
  OnboardingStatus,
  OnboardingStatusLabels,
} from "../enums/onboardingStatus.enum.js";
// Replace the existing import for email templates with this:
import { getClientStatusNotificationEmail } from "../helpers/emailTemplates.js";
import { sendEmail } from "../services/email.service.js";
import { sendNotification } from "../utils/notification.util.js";
import UserService from "../models/userService.model.js";

// Get all businesses (only business_name and id)
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    return ApiResponse.ok(res, "Businesses retrieved successfully", businesses);
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Get businesses assigned to a given user (Admin route)
export const getBusinessesByUser = async (req, res) => {
  try {
    const { id: userId } = req.params;

    if (!userId) return ApiResponse.badRequest(res, "user id is required");

    const rows = await UserBusiness.findAll({ where: { user_id: userId } });
    const businessIds = rows.map((r) => r.business_id);

    if (!businessIds.length) return ApiResponse.ok(res, "No businesses for user.", []);

    const businesses = await Business.findAll({
      where: { id: businessIds },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    return ApiResponse.ok(res, "Businesses fetched successfully.", businesses);
  } catch (err) {
    console.error("getBusinessesByUser error:", err);
    return ApiResponse.serverError(res, "Failed to fetch businesses for user.", err);
  }
};

// Get business details by ID with service IDs only
export const getBusinessById = async (req, res) => {
  const { id } = req.params;

  try {
    const business = await Business.findByPk(id);

    if (!business) {
      return ApiResponse.notFound(res, "Business not found");
    }

    // Get business services
    const businessServices = await BusinessService.findAll({
      where: {
        business_id: id,
      },
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "description", "price", "category"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    // Get business users
    const businessUsers = await UserBusiness.findAll({
      where: { business_id: id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email", "role", "status"],
        },
      ],
    });

    const onboardingSteps = await BusinessOnboarding.findAll({
      where: { business_id: id },
      include: [
        {
          model: OnboardingSteps,
          as: "onboardingStep",
          attributes: [
            "id",
            "step_name",
            "step_title",
            "step_subtitle",
            "step_description",
            "step_order",
          ],
        },
      ],
      attributes: ["status", "completed_at"],
      order: [
        [{ model: OnboardingSteps, as: "onboardingStep" }, "step_order", "ASC"],
      ],
    });

    const businessData = {
      id: business.id,
      name: business.name,
      email: business.email,
      phone: business.phone,
      address: business.address,
      status: business.status,
      npi_number: business.npi_number,
      created_at: business.created_at,
      users: businessUsers.map((ub) => ({
        id: ub.user.id,
        name: ub.user.full_name,
        email: ub.user.email,
        role: ub.user.role,
        status: ub.user.status,
      })),
      services: businessServices.map((service) => ({
        id: service.service.id,
        name: service.service.name,
        description: service.service.description,
        price: service.service.price,
        category: service.service.category,
        status: service.status,
        created_at: service.created_at,
      })),
      onboardingSteps: onboardingSteps.map((step) => ({
        id: step.onboardingStep.id,
        step_name: step.onboardingStep.step_name,
        step_title: step.onboardingStep.step_title,
        step_subtitle: step.onboardingStep.step_subtitle,
        step_order: step.onboardingStep.step_order,
        status: step.status,
        step_description: step.onboardingStep.step_description,
        completed_at: step.completed_at,
      })),
    };

    return ApiResponse.ok(
      res,
      "Business details retrieved successfully",
      businessData
    );
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Get business details for authenticated Super User
export const getBusinessDetails = async (req, res) => {
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  try {
    // Find the user-business relationship
    const userBusiness = await UserBusiness.findOne({
      where: { user_id: currentUserId },
      include: [
        {
          model: Business,
          as: "business",
          required: true,
        },
      ],
    });

    if (!userBusiness) {
      return ApiResponse.notFound(res, "No business found for this user");
    }

    const businessId = userBusiness.business_id;

    // Get business details
    const business = await Business.findByPk(businessId);

    if (!business) {
      return ApiResponse.notFound(res, "Business not found");
    }

    // Get business users
    const businessUsers = await UserBusiness.findAll({
      where: { business_id: businessId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email", "role", "status"],
        },
      ],
    });

    // === ROLE-BASED SERVICES ===
    let servicesRows = [];

    if (currentUserRole === UserRole.USER) {
      // 1) Get allowed service_ids for this user from UserService
      const userServices = await UserService.findAll({
        where: {
          business_id: businessId,
          user_id: currentUserId,
        },
        attributes: ["service_id"],
      });

      const userServiceIds = userServices.map((us) => us.service_id);

      if (userServiceIds.length > 0) {
        // 2) Fetch only those BusinessService rows for this business
        servicesRows = await BusinessService.findAll({
          where: {
            business_id: businessId,
            service_id: userServiceIds, // <-- filter by IDs from UserService
            status: [
              BusinessServiceStatus.INITIAL,
              BusinessServiceStatus.ONBOARDING,
              BusinessServiceStatus.ACTIVATED,
            ],
          },
          include: [
            {
              model: Service,
              as: "service",
              attributes: ["id", "name", "description", "price", "category"],
            },
          ],
          order: [["created_at", "ASC"]],
        });
      } else {
        servicesRows = []; // user has no assigned services
      }
    } else {
      // SUPER_USER / ADMIN / SUPER_ADMIN → full BusinessService list
      servicesRows = await BusinessService.findAll({
        where: {
          business_id: businessId,
          status: [
            BusinessServiceStatus.INITIAL,
            BusinessServiceStatus.ONBOARDING,
            BusinessServiceStatus.ACTIVATED,
          ],
        },
        include: [
          {
            model: Service,
            as: "service",
            attributes: ["id", "name", "description", "price", "category"],
          },
        ],
        order: [["created_at", "ASC"]],
      });
    }

    // Get onboarding steps with completion details
    const onboardingSteps = await BusinessOnboarding.findAll({
      where: { business_id: businessId },
      include: [
        {
          model: OnboardingSteps,
          as: "onboardingStep",
          attributes: [
            "id",
            "step_name",
            "step_order",
            "step_description",
            "action_link",
            "action_label",
            "step_title",
            "step_subtitle",
          ],
        },
      ],
      attributes: ["status", "completed_at"],
      order: [
        [{ model: OnboardingSteps, as: "onboardingStep" }, "step_order", "ASC"],
      ],
    });

    const businessData = {
      id: business.id,
      name: business.name,
      email: business.email,
      phone: business.phone,
      address: business.address,
      status: business.status,
      npi_number: business.npi_number,
      created_at: business.created_at,

      users: businessUsers.map((ub) => ({
        id: ub.user.id,
        name: ub.user.full_name,
        email: ub.user.email,
        role: ub.user.role,
        status: ub.user.status,
      })),

      // unified shape for services (now always from BusinessService)
      services: servicesRows.map((row) => ({
        id: row.service.id,
        name: row.service.name,
        description: row.service.description,
        price: row.service.price,
        category: row.service.category,
        status: row.status ?? null,
        created_at: row.created_at,
      })),

      onboardingSteps: onboardingSteps.map((step) => ({
        id: step.onboardingStep.id,
        step_name: step.onboardingStep.step_name,
        step_title: step.onboardingStep.step_title,
        step_subtitle: step.onboardingStep.step_subtitle,
        step_order: step.onboardingStep.step_order,
        status: step.status,
        step_description: step.onboardingStep.step_description,
        action_link: step.onboardingStep.action_link,
        action_label: step.onboardingStep.action_label,
        completed_at: step.completed_at,
      })),
    };

    return ApiResponse.ok(
      res,
      "Business details retrieved successfully",
      businessData
    );
  } catch (err) {
    console.error("getBusinessDetails error:", err);
    return ApiResponse.serverError(res, "Server error", err);
  }
};


// Update business details by ID (services removed - use separate endpoint)
export const updateBusinessById = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, status, npi_number } = req.body;

  let transaction;

  try {
    // Check if business exists
    const business = await Business.findByPk(id);
    if (!business) {
      return ApiResponse.notFound(res, "Business not found");
    }

    // Store old status for email notification
    const oldStatus = business.status;

    // Check if email is being updated and if it's unique
    if (email && email !== business.email) {
      const existingBusiness = await Business.findOne({
        where: {
          email: email,
          id: { [Op.ne]: id },
        },
      });
      if (existingBusiness) {
        return ApiResponse.badRequest(res, "Business email already exists");
      }
    }

    // Check if NPI is being updated and if it's unique
    if (npi_number && npi_number !== business.npi_number) {
      const existingNPI = await Business.findOne({
        where: {
          npi_number,
          id: { [Op.ne]: id },
        },
      });
      if (existingNPI) {
        return ApiResponse.badRequest(
          res,
          "Business with this NPI number already exists"
        );
      }
    }

    // Validate status if provided
    if (status && !BUSINESS_STATUS_VALUES.includes(status)) {
      return ApiResponse.badRequest(
        res,
        `Invalid status. Must be one of: ${BUSINESS_STATUS_VALUES.join(", ")}`
      );
    }

    // Start transaction
    transaction = await sequelize.transaction();

    // Update business details
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (status) updateData.status = status;
    if (npi_number) updateData.npi_number = npi_number;

    await business.update(updateData, { transaction });

    // Commit transaction
    await transaction.commit();

    // Send email and notification if status changed
    if (status && status !== oldStatus) {
      try {
        // Get the SuperUser (business owner) to send notifications
        const businessUser = await UserBusiness.findOne({
          where: { business_id: id },
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "full_name", "email", "role"],
              where: { role: UserRole.SUPER_USER },
            },
          ],
        });

        if (businessUser) {
          // Send email notification
          const { subject, html, text } = getClientStatusNotificationEmail({
            username: businessUser.user.full_name,
            subject: "Business Status Updated",
            message: `Your business ${business.name} status has been changed from ${oldStatus} to ${status}.`,
          });

          await sendEmail({
            to: businessUser.user.email,
            subject,
            html,
            text,
          });

          try {
            await sendNotification(
              businessUser.user.id,
              "Business Status Updated",
              `Your business ${business.name} status has been changed from ${oldStatus} to ${status}.`
            );
          } catch (notifyErr) {
            console.error(
              "Failed to send business status change notification:",
              notifyErr
            );
          }
        }
      } catch (emailError) {
        console.error(
          "Failed to send business status change email:",
          emailError
        );
      }
    }

    return ApiResponse.ok(res, "Business updated successfully", {
      id: business.id,
      name: business.name,
      email: business.email,
      phone: business.phone,
      address: business.address,
      status: business.status,
      npi_number: business.npi_number,
    });
  } catch (err) {
    // Only attempt to rollback if transaction exists and hasn't been committed
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Create new business with user and services
export const createBusiness = async (req, res) => {
  let {
    // User details
    full_name,
    email,
    password,
    // Business details
    business_name,
    business_email,
    business_phone,
    business_address,
    npi_number,
    service_ids = [],
  } = req.body;

  try {
    email = email?.trim().toLowerCase();
    business_email = business_email?.trim().toLowerCase();
    // Check if user email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return ApiResponse.badRequest(res, "User with this email already exists");
    }

    // Check if business email already exists
    const existingBusiness = await Business.findOne({
      where: { email: business_email },
    });
    if (existingBusiness) {
      return ApiResponse.badRequest(
        res,
        "Business with this email already exists"
      );
    }

    // Check if NPI number already exists
    const existingNPI = await Business.findOne({
      where: { npi_number },
    });
    if (existingNPI) {
      return ApiResponse.badRequest(
        res,
        "Business with this NPI number already exists"
      );
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user first (business owner will be SuperUser)
      const newUser = await User.create(
        {
          full_name,
          email,
          password_hash: hashedPassword,
          role: UserRole.SUPER_USER,
          password_changed: false, // New users need to change their initial password
        },
        { transaction }
      );

      // Create business
      const newBusiness = await Business.create(
        {
          name: business_name,
          email: business_email,
          phone: business_phone,
          address: business_address,
          npi_number,
          status: BUSINESS_STATUS_VALUES.ACTIVE,
        },
        { transaction }
      );

      // Create user-business relationship (this establishes ownership)
      await UserBusiness.create(
        {
          user_id: newUser.id,
          business_id: newBusiness.id,
        },
        { transaction }
      );

      // Create business services for ALL available services (similar to onboarding steps)
      const allServices = await Service.findAll();

      if (allServices.length > 0) {
        const businessServicesToCreate = allServices.map((service) => ({
          business_id: newBusiness.id,
          service_id: service.id,
          status: service_ids.includes(service.id)
            ? BusinessServiceStatus.INITIAL
            : BusinessServiceStatus.UNASSIGNED,
        }));

        await BusinessService.bulkCreate(businessServicesToCreate, {
          transaction,
        });
      }

      // Create business onboarding steps
      const onboardingSteps = await OnboardingSteps.findAll();

      if (onboardingSteps.length > 0) {
        const businessOnboardingToCreate = onboardingSteps.map((step) => ({
          business_id: newBusiness.id,
          onboarding_step_id: step.id,
          status:
            step.step_order === 1
              ? OnboardingStatus.IN_PROGRESS
              : OnboardingStatus.NOT_STARTED,
        }));

        await BusinessOnboarding.bulkCreate(businessOnboardingToCreate, {
          transaction,
        });
      }

      // Get service details for response
      const serviceDetails =
        allServices.length > 0
          ? allServices.map((service) => ({
            id: service.id,
            name: service.name,
            price: service.price,
            category: service.category,
          }))
          : [];

      // Commit transaction
      await transaction.commit();

      return ApiResponse.created(
        res,
        "Business, user, and services created successfully"
      );
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

export const updateBusinessOnboardingSteps = async (req, res) => {
  const { businessId } = req.params;
  const { steps } = req.body; // Array of { stepId, status }

  try {
    // Validate parameters
    if (!businessId || !steps || !Array.isArray(steps)) {
      return ApiResponse.badRequest(
        res,
        "Business ID and steps array are required"
      );
    }

    // Check if business exists
    const business = await Business.findByPk(businessId);
    if (!business) {
      return ApiResponse.notFound(res, "Business not found");
    }

    // Get the SuperUser (business owner) to send emails
    const businessUser = await UserBusiness.findOne({
      where: { business_id: businessId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email", "role"],
          where: { role: UserRole.SUPER_USER },
        },
      ],
    });

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Track status changes for email notifications
      const statusChanges = [];

      // Update each step
      for (const { stepId, status } of steps) {
        // Check if step exists
        const step = await OnboardingSteps.findByPk(stepId);
        if (!step) {
          throw new Error(`Onboarding step ${stepId} not found`);
        }

        // Get current status before update
        const currentOnboarding = await BusinessOnboarding.findOne({
          where: {
            business_id: businessId,
            onboarding_step_id: stepId,
          },
        });

        const oldStatus = currentOnboarding
          ? currentOnboarding.status
          : OnboardingStatus.NOT_STARTED;

        // Update the step
        await BusinessOnboarding.update(
          {
            status: status,
            completed_at:
              status === OnboardingStatus.COMPLETED ? new Date() : null,
          },
          {
            where: {
              business_id: businessId,
              onboarding_step_id: stepId,
            },
            transaction,
          }
        );

        // Track status change if it actually changed
        if (oldStatus !== status) {
          statusChanges.push({
            stepId,
            stepName: step.step_name,
            stepTitle: step.step_title,
            oldStatus: OnboardingStatusLabels[oldStatus] || "Unknown",
            newStatus: OnboardingStatusLabels[status] || "Unknown",
          });
        }
      }

      // Commit transaction
      await transaction.commit();

      // Send notifications for status changes - super simplified!
      if (statusChanges.length > 0 && businessUser) {
        for (const change of statusChanges) {
          try {
            // Send email notification
            const { subject, html, text } = getClientStatusNotificationEmail({
              username: businessUser.user.full_name,
              subject: "Onboarding Step Updated",
              message: `Your onboarding step "${change.stepTitle}" of business ${business.name} status changed from ${change.oldStatus} to ${change.newStatus}.`,
            });

            await sendEmail({
              to: businessUser.user.email,
              subject,
              html,
              text,
            });

            // Send super simple notification - just userId, title, and message!
            await sendNotification(
              businessUser.user.id,
              "Onboarding Step Updated",
              `Your onboarding step "${change.stepTitle}" of business ${business.name} status changed from ${change.oldStatus} to ${change.newStatus}.`
            );
          } catch (error) {
            console.error(
              "Failed to send onboarding status notification:",
              error
            );
          }
        }
      }

      return ApiResponse.ok(
        res,
        `Business onboarding steps updated successfully`,
        {
          business_id: businessId,
          updated_steps: steps,
          emails_sent: statusChanges.length > 0,
        }
      );
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

export const updateBusinessServices = async (req, res) => {
  const { businessId } = req.params;
  const { businessServices } = req.body; // Array of { serviceId, status }

  try {
    // Validate parameters
    if (!businessId || !businessServices || !Array.isArray(businessServices)) {
      return ApiResponse.badRequest(
        res,
        "Business ID and services array are required"
      );
    }

    // Check if business exists
    const business = await Business.findByPk(businessId);
    if (!business) {
      return ApiResponse.notFound(res, "Business not found");
    }

    // Get the SuperUser (business owner) to send notifications
    const businessUser = await UserBusiness.findOne({
      where: { business_id: businessId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email", "role"],
          where: { role: UserRole.SUPER_USER },
        },
      ],
    });

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Track status changes for notifications
      const statusChanges = [];

      // Update each service
      for (const { serviceId, status } of businessServices) {
        // Check if service exists
        const service = await Service.findByPk(serviceId);
        if (!service) {
          throw new Error(`Service ${serviceId} not found`);
        }

        // Get current status before update
        const currentBusinessService = await BusinessService.findOne({
          where: {
            business_id: businessId,
            service_id: serviceId,
          },
        });

        const oldStatus = currentBusinessService
          ? currentBusinessService.status
          : BusinessServiceStatus.UNASSIGNED;

        // Update the service
        await BusinessService.update(
          {
            status: status,
          },
          {
            where: {
              business_id: businessId,
              service_id: serviceId,
            },
            transaction,
          }
        );

        // Track status change if it actually changed
        if (oldStatus !== status) {
          statusChanges.push({
            serviceId,
            serviceName: service.name,
            oldStatus: BusinessServiceStatusLabels[oldStatus] || "Unknown",
            newStatus: BusinessServiceStatusLabels[status] || "Unknown",
          });
        }
      }

      // Commit transaction
      await transaction.commit();

      // Send notifications for status changes
      if (statusChanges.length > 0 && businessUser) {
        for (const change of statusChanges) {
          try {
            // Send email notification
            const { subject, html, text } = getClientStatusNotificationEmail({
              username: businessUser.user.full_name,
              subject: "Service Status Updated",
              message: `Your service "${change.serviceName}" for business ${business.name} status has been changed from ${change.oldStatus} to ${change.newStatus}.`,
            });

            await sendEmail({
              to: businessUser.user.email,
              subject,
              html,
              text,
            });

            // Send real-time notification
            await sendNotification(
              businessUser.user.id,
              "Service Status Updated",
              `Your service "${change.serviceName}" for business ${business.name} status has been changed from ${change.oldStatus} to ${change.newStatus}.`
            );
          } catch (error) {
            console.error(
              "Failed to send service status notification:",
              error
            );
          }
        }
      }

      return ApiResponse.ok(res, "Business services updated successfully", {
        business_id: businessId,
        updated_services: businessServices,
        notifications_sent: statusChanges.length > 0,
      });
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Get specific service status for authenticated user's business by service ID
export const getBusinessServiceStatus = async (req, res) => {
  const currentUserId = req.user.id;
  const { serviceId } = req.params;

  try {
    // Find the user-business relationship
    const userBusiness = await UserBusiness.findOne({
      where: { user_id: currentUserId },
      include: [
        {
          model: Business,
          as: "business",
          required: true,
        },
      ],
    });

    if (!userBusiness) {
      return ApiResponse.notFound(res, "No business found for this user");
    }

    const businessId = userBusiness.business_id;

    // Find the service by ID
    const service = await Service.findByPk(serviceId);

    if (!service) {
      return ApiResponse.notFound(res, "Service not found");
    }

    // Get the business service with status
    const businessService = await BusinessService.findOne({
      where: {
        business_id: businessId,
        service_id: serviceId,
      },
    });

    if (!businessService) {
      return ApiResponse.notFound(res, "Business service relationship not found");
    }

    return ApiResponse.ok(
      res,
      "Service status retrieved successfully",
      {
        status: businessService.status,
      }
    );
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};
