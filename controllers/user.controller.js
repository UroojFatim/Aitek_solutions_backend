import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../utils/response.util.js";
import Service from "../models/service.model.js";
import UserService from "../models/userService.model.js";
import sequelize from "../config/database.config.js";
import { BusinessServiceStatus, UserRole, UserStatus } from "../enums/index.js";
import UserBusiness from "../models/userBusiness.model.js";
import BusinessService from "../models/businessService.model.js";
import AuditLog from "../models/auditLog.model.js";

// Update user password (SuperAdmin / Admin only)
export const updateUserPassword = async (req, res) => {
  const { id: userId } = req.params;
  const { password } = req.body;

  try {
    const currentUser = req.user;

    if (!currentUser) {
      return ApiResponse.badRequest(res, "Authenticated user is required.");
    }

    if (!password) {
      return ApiResponse.badRequest(res, "Password is required.");
    }

    if (password.length < 8) {
      return ApiResponse.badRequest(
        res,
        "Password must be at least 8 characters."
      );
    }

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found.");
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password_hash: hashedPassword });

    return ApiResponse.ok(res, "Password updated successfully.");
  } catch (error) {
    console.error("updateUserPassword error:", error);
    return ApiResponse.serverError(
      res,
      "An error occurred while updating password.",
      error
    );
  }
};

// Delete a normal user (soft delete - mark as deleted status)
export const deleteUser = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const currentUser = req.user; // set by auth middleware

    if (!currentUser) {
      return ApiResponse.badRequest(
        res,
        "Authenticated user is required to delete a user."
      );
    }

    // 1. Make sure user exists
    const user = await User.findByPk(userId);

    if (!user) {
      return ApiResponse.notFound(res, "User not found.");
    }

    // Optional: prevent deleting Admin/SuperAdmin here
    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      return ApiResponse.badRequest(
        res,
        "Admin/SuperAdmin users cannot be deleted with this endpoint. Use deleteAdmin instead."
      );
    }

    // Soft delete: Update user status to 'deleted' instead of destroying record
    await user.update({ status: UserStatus.DELETED });

    // Log the deletion action in audit logs
    try {
      await AuditLog.create({
        user_id: currentUser.id,
        user_name: currentUser.full_name,
        user_email: currentUser.email,
        user_role: currentUser.role,
        action: `USER_DELETED`,
        crud_operation: "DELETE",
        endpoint: `/api/users/${userId}`,
        method: "DELETE",
        status_code: 200,
        request_data: { deleted_user_id: userId, deleted_user_email: user.email },
        response_data: { message: "User deleted successfully" },
      });
    } catch (auditErr) {
      console.error("Audit logging error (non-blocking):", auditErr);
      // Continue even if audit logging fails
    }

    // IMPORTANT: Deleted user will be immediately logged out on their next API request
    // The verifyToken middleware checks status on every request and rejects deleted users
    // Frontend should also clear the user's token/session
    return ApiResponse.ok(
      res,
      "User deleted successfully. User record retained for audit purposes. The user will be logged out immediately."
    );
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return ApiResponse.serverError(
      res,
      "An error occurred while deleting the user.",
      error
    );
  }
};

// Get all services for a specific business
export const getBusinessServices = async (req, res) => {
  try {
    // Try multiple places to get business ID
    const businessId =
      req.business?.id || req.query.business_id || req.body.business_id;

    if (!businessId) {
      return ApiResponse.badRequest(
        res,
        "Business ID is required to fetch business services."
      );
    }

    // Fetch services that belong to this business from BusinessService table
    const businessServices = await BusinessService.findAll({
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

    // If no services exist
    if (!businessServices.length) {
      return ApiResponse.ok(res, "No services found for this business.", []);
    }

    // Prepare unified response
    const formatted = businessServices.map((bs) => ({
      id: bs.service.id,
      name: bs.service.name,
      description: bs.service.description,
      price: bs.service.price,
      category: bs.service.category,
      status: bs.status,
      created_at: bs.created_at,
    }));

    return ApiResponse.ok(
      res,
      "Business services fetched successfully.",
      formatted
    );
  } catch (error) {
    console.error("getBusinessServices error:", error);
    return ApiResponse.serverError(
      res,
      "An error occurred while fetching business services.",
      error
    );
  }
};

// Get only User for a specific business along with their services
export const getBusinessUsers = async (req, res) => {
  try {
    const currentUser = req.user; // set by verifyToken

    if (!currentUser) {
      return ApiResponse.badRequest(
        res,
        "Authenticated user is required to fetch users."
      );
    }

    // Business ID different jagahon se try karo (jitna tum ne setup kia ho)
    const businessId =
      req.business?.id || // agar tumhari koi middleware req.business set karti hai
      req.query.business_id || // agar frontend se query param aya ho
      req.body.business_id; // ya body me

    if (!businessId) {
      return ApiResponse.badRequest(
        res,
        "Business ID is missing for the current user."
      );
    }

    const users = await User.findAll({
      where: {
        role: UserRole.USER, // ✅ sirf normal "User" role
      },
      include: [
        {
          model: Service,
          as: "services",
          attributes: ["id", "name", "description", "price", "category"],
          through: {
            model: UserService,
            attributes: [],
            where: { business_id: businessId }, // ✅ sirf is business ki mappings
          },
          required: true, // ✅ inner join: bina mapping ke user nahi aayega
        },
      ],
      distinct: true,
    });

    if (!users.length) {
      return ApiResponse.ok(res, "No users found for this business.", []);
    }

    return ApiResponse.ok(res, "Business users fetched successfully.", users);
  } catch (error) {
    console.error("getBusinessUsers error:", error);
    return ApiResponse.serverError(
      res,
      "An error occurred while fetching business users.",
      error
    );
  }
};

// Get users for ALL businesses owned by a given Super User (or Admin)
export const getUsersBySuperUser = async (req, res) => {
  try {
    const { id: superUserId } = req.params;

    if (!superUserId) {
      return ApiResponse.badRequest(res, "superUser id is required.");
    }

    // 1) find all businesses that belong to this super user
    const userBusinesses = await UserBusiness.findAll({
      where: { user_id: superUserId },
    });

    const businessIds = userBusinesses.map((b) => b.business_id);

    if (!businessIds.length) {
      return ApiResponse.ok(res, "No businesses found for this user.", []);
    }

    // 2) Fetch users that have mappings to any of those businesses
    const users = await User.findAll({
      where: { role: UserRole.USER },
      include: [
        {
          model: Service,
          as: "services",
          attributes: ["id", "name", "description", "price", "category"],
          through: {
            model: UserService,
            attributes: [],
            where: { business_id: businessIds }, // IN clause
          },
          required: true,
        },
      ],
      distinct: true,
    });

    return ApiResponse.ok(
      res,
      "Users for super user fetched successfully.",
      users
    );
  } catch (error) {
    console.error("getUsersBySuperUser error:", error);
    return ApiResponse.serverError(
      res,
      "Failed to fetch users for super user.",
      error
    );
  }
};

// Creates a normal user for a given business (SuperUser only)
export const addUser = async (req, res) => {
  try {
    const creator = req.user; // set by auth middleware

    if (!creator) {
      return ApiResponse.badRequest(
        res,
        "Authenticated user is required to create a new user."
      );
    }

    // Take business_id from body (coming from frontend businessDetails.id)
    let {
      full_name,
      email,
      password,
      service_ids = [],
      business_id,
    } = req.body;

    if (!full_name || !email || !password) {
      return ApiResponse.badRequest(
        res,
        "full_name, email and password are required."
      );
    }

    if (!business_id) {
      return ApiResponse.badRequest(
        res,
        "business_id is required in request body."
      );
    }

    if (!Array.isArray(service_ids)) {
      return ApiResponse.badRequest(
        res,
        "service_ids must be an array of service IDs."
      );
    }

    email = email.trim().toLowerCase();

    // 1. Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return ApiResponse.badRequest(
        res,
        "User with this email already exists."
      );
    }

    // 2. Validate all service_ids exist
    let services = [];
    if (service_ids.length > 0) {
      services = await Service.findAll({
        where: { id: service_ids },
      });

      if (services.length !== service_ids.length) {
        const foundIds = services.map((s) => s.id);
        const invalidIds = service_ids.filter((id) => !foundIds.includes(id));

        return ApiResponse.badRequest(
          res,
          `Some services were not found: ${invalidIds.join(", ")}`
        );
      }
    }

    // 3. Transaction: create user + assign services + create user_business
    const transaction = await sequelize.transaction();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3a. Create user (role will be default from model)
      const newUser = await User.create(
        {
          full_name,
          email,
          password_hash: hashedPassword,
          // role: DEFAULT_USER_ROLE  // not needed if default is set in model
        },
        { transaction }
      );

      // 3b. Create user_business mapping (user_id + business_id)
      await UserBusiness.create(
        {
          user_id: newUser.id,
          business_id: business_id,
        },
        { transaction }
      );

      // 3c. Create user_services mappings
      if (service_ids.length > 0) {
        const mappings = service_ids.map((serviceId) => ({
          user_id: newUser.id,
          service_id: serviceId,
          business_id, // <-- use the one from body
        }));

        await UserService.bulkCreate(mappings, { transaction });
      }

      await transaction.commit();

      // Fetch with services for response
      const createdUser = await User.findByPk(newUser.id, {
        attributes: { exclude: ["password_hash"] },
        include: [
          {
            model: Service,
            as: "services",
            attributes: ["id", "name", "description", "price", "category"],
            through: { attributes: [] },
          },
        ],
      });

      return ApiResponse.created(
        res,
        "User created successfully.",
        createdUser
      );
    } catch (err) {
      await transaction.rollback();
      console.error("USER CREATE ERROR:", err);
      throw err;
    }
  } catch (error) {
    console.error("OUTER ERROR:", error);
    return ApiResponse.serverError(
      res,
      "An error occurred while creating the user.",
      error
    );
  }
};

// Update services for a user (assign / replace services for the current business)
export const updateUserServices = async (req, res) => {
  const { id: userId } = req.params;
  const { service_ids = [] } = req.body;

  try {
    const currentUser = req.user;

    if (!currentUser) {
      return ApiResponse.badRequest(
        res,
        "Authenticated user is required to update user services."
      );
    }

    const businessId = req.business?.id || req.body.business_id;

    if (!businessId) {
      return ApiResponse.badRequest(
        res,
        "Business ID is missing for the current user."
      );
    }

    // 1. Validate payload
    if (!Array.isArray(service_ids)) {
      return ApiResponse.badRequest(
        res,
        "service_ids must be an array of service IDs"
      );
    }

    // 2. Make sure user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // 3. Validate that all service IDs exist
    const services = await Service.findAll({
      where: { id: service_ids },
    });

    if (services.length !== service_ids.length) {
      const foundIds = services.map((s) => s.id);
      const invalidIds = service_ids.filter((id) => !foundIds.includes(id));

      return ApiResponse.badRequest(
        res,
        `Some services were not found: ${invalidIds.join(", ")}`
      );
    }

    // 4. Start transaction
    const transaction = await sequelize.transaction();

    try {
      // 4a. Remove existing mappings for this user & this business
      await UserService.destroy({
        where: { user_id: userId, business_id: businessId },
        transaction,
      });

      // 4b. Create new mappings
      if (service_ids.length > 0) {
        const recordsToCreate = service_ids.map((serviceId) => ({
          user_id: userId,
          service_id: serviceId,
          business_id: businessId,
        }));

        await UserService.bulkCreate(recordsToCreate, { transaction });
      }

      // 4c. Commit
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    // 5. Get updated user with services for response
    const updatedUser = await User.findByPk(userId, {
      attributes: ["id", "full_name", "email", "role"],
      include: [
        {
          model: Service,
          as: "services",
          attributes: ["id", "name", "description", "price", "category"],
          through: { attributes: [] }, // hide join table fields
        },
      ],
    });

    return ApiResponse.ok(
      res,
      "User services updated successfully",
      updatedUser
    );
  } catch (error) {
    return ApiResponse.serverError(
      res,
      "An error occurred while updating user services.",
      error
    );
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password_hash"] },
    });
    res.status(200).json(users);
    return ApiResponse.ok("Users fetched successfully.", users);
  } catch (error) {
    return ApiResponse.serverError(
      res,
      "An error occurred while fetching users.",
      error
    );
  }
};

// Add a new user
export const addAdmin = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!full_name || !email || !password || !role) {
    return ApiResponse.badRequest(
      res,
      "All fields are required: full_name, email, password, role"
    );
  }

  try {
    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role,
    });

    const safeUser = {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
    };

    return ApiResponse.created(res, "User created successfully.", safeUser);
  } catch (error) {
    return ApiResponse.serverError(
      res,
      "An error occurred while creating the user.",
      error.errors?.[0]?.message || error
    );
  }
};

// Delete an admin user by ID (soft delete - mark as deleted status)
export const deleteAdmin = async (req, res) => {  
  const { id: userId } = req.params;

  try {
    const currentUser = req.user; // set by auth middleware

    if (!currentUser) {
      return ApiResponse.badRequest(
        res,
        "Authenticated user is required to delete an admin."
      );
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return ApiResponse.notFound(res, "User not found.");
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return ApiResponse.badRequest(
        res,
        "Super Admin cannot be deleted with this endpoint."
      );
    }

    if (user.role !== UserRole.ADMIN) {
      return ApiResponse.badRequest(
        res,
        "Only admin users can be deleted with this endpoint."
      );
    }

    // Soft delete: Update admin status to 'deleted' instead of destroying record
    await user.update({ status: UserStatus.DELETED });

    // Log the deletion action in audit logs
    try {
      await AuditLog.create({
        user_id: currentUser.id,
        user_name: currentUser.full_name,
        user_email: currentUser.email,
        user_role: currentUser.role,
        action: `ADMIN_DELETED`,
        crud_operation: "DELETE",
        endpoint: `/api/admins/${userId}`,
        method: "DELETE",
        status_code: 200,
        request_data: { deleted_admin_id: userId, deleted_admin_email: user.email },
        response_data: { message: "Admin deleted successfully" },
      });
    } catch (auditErr) {
      console.error("Audit logging error (non-blocking):", auditErr);
      // Continue even if audit logging fails
    }

    // IMPORTANT: Deleted admin will be immediately logged out on their next API request
    // The verifyToken middleware checks status on every request and rejects deleted users
    // Frontend should also clear the admin's token/session
    return ApiResponse.ok(
      res,
      "Admin user deleted successfully. Admin record retained for audit purposes. The admin will be logged out immediately."
    );
  } catch (error) {
    console.error("DELETE ADMIN ERROR:", error);
    return ApiResponse.serverError(
      res,
      "An error occurred while deleting the admin user.",
      error
    );
  }
};

// Restore a deleted user (SuperUser/Admin only)
export const restoreUser = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const currentUser = req.user; // set by auth middleware

    if (!currentUser) {
      return ApiResponse.badRequest(
        res,
        "Authenticated user is required to restore a user."
      );
    }

    // 1. Make sure user exists
    const user = await User.findByPk(userId);

    if (!user) {
      return ApiResponse.notFound(res, "User not found.");
    }

    // Check if user is actually deleted
    if (user.status !== UserStatus.DELETED) {
      return ApiResponse.badRequest(
        res,
        "User is not in deleted status. Cannot restore."
      );
    }

    // Prevent restoring Admin/SuperAdmin here
    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      return ApiResponse.badRequest(
        res,
        "Admin/SuperAdmin users cannot be restored with this endpoint. Use restoreAdmin instead."
      );
    }

    // Restore: Update user status back to 'activated'
    await user.update({ status: UserStatus.ACTIVATED });

    // Log the restoration action in audit logs
    try {
      await AuditLog.create({
        user_id: currentUser.id,
        user_name: currentUser.full_name,
        user_email: currentUser.email,
        user_role: currentUser.role,
        action: `USER_RESTORED`,
        crud_operation: "UPDATE",
        endpoint: `/api/users/${userId}/restore`,
        method: "PUT",
        status_code: 200,
        request_data: { restored_user_id: userId },
        response_data: { message: "User restored successfully" },
      });
    } catch (auditErr) {
      console.error("Audit logging error (non-blocking):", auditErr);
      // Continue even if audit logging fails
    }

    return ApiResponse.ok(
      res,
      "User restored successfully and can now login."
    );
  } catch (error) {
    console.error("RESTORE USER ERROR:", error);
    return ApiResponse.serverError(
      res,
      "An error occurred while restoring the user.",
      error
    );
  }
};

// Restore a deleted admin (SuperAdmin only)
export const restoreAdmin = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const currentUser = req.user; // set by auth middleware

    if (!currentUser) {
      return ApiResponse.badRequest(
        res,
        "Authenticated user is required to restore an admin."
      );
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return ApiResponse.notFound(res, "User not found.");
    }

    // Check if user is actually deleted
    if (user.status !== UserStatus.DELETED) {
      return ApiResponse.badRequest(
        res,
        "Admin is not in deleted status. Cannot restore."
      );
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return ApiResponse.badRequest(
        res,
        "Super Admin cannot be restored with this endpoint."
      );
    }

    if (user.role !== UserRole.ADMIN) {
      return ApiResponse.badRequest(
        res,
        "Only admin users can be restored with this endpoint."
      );
    }

    // Restore: Update admin status back to 'activated'
    await user.update({ status: UserStatus.ACTIVATED });

    // Log the restoration action in audit logs
    try {
      await AuditLog.create({
        user_id: currentUser.id,
        user_name: currentUser.full_name,
        user_email: currentUser.email,
        user_role: currentUser.role,
        action: `ADMIN_RESTORED`,
        crud_operation: "UPDATE",
        endpoint: `/api/admins/${userId}/restore`,
        method: "PUT",
        status_code: 200,
        request_data: { restored_admin_id: userId },
        response_data: { message: "Admin restored successfully" },
      });
    } catch (auditErr) {
      console.error("Audit logging error (non-blocking):", auditErr);
      // Continue even if audit logging fails
    }

    return ApiResponse.ok(
      res,
      "Admin user restored successfully and can now login."
    );
  } catch (error) {
    console.error("RESTORE ADMIN ERROR:", error);
    return ApiResponse.serverError(
      res,
      "An error occurred while restoring the admin user.",
      error
    );
  }
};
