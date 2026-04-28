import { UserRole } from "../enums/index.js";
import { UserBusiness } from "../models/associations.js";

// Middleware to verify if user has required role
export const verifyRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!userRole) {
        return res.status(401).json({ message: "User role not found" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions.",
          requiredRole: allowedRoles,
          userRole: userRole
        });
      }

      if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN) {
        const userBusiness = await UserBusiness.findOne({
          where: {
            user_id: req.user.id,
          },
        });

        if (!userBusiness) {
          return res.status(403).json({
            message: "Access denied. User is not associated with any business.",
          });
        }

        req.business = { id: userBusiness.business_id };
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Role verification failed" });
    }
  };
};

// Specific middleware for Admin only
export const Allow_Admin_Only = verifyRole([UserRole.ADMIN]);
export const Allow_SuperAdmin_Only = verifyRole([UserRole.SUPER_ADMIN]);
export const Allow_SuperUser_Only = verifyRole([UserRole.SUPER_USER]);
export const Allow_User_Only = verifyRole([UserRole.USER]);

export const Allow_SuperUser_Or_User_Only = verifyRole([
  UserRole.SUPER_USER,
  UserRole.USER,
]);

export const Allow_SuperAdmin_Or_Admin_Only = verifyRole([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
]); 

export const Allow_SuperAdmin_Or_Admin_Or_SuperUser_Only = verifyRole([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.SUPER_USER,
]); 

export const Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY = verifyRole([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.SUPER_USER,
  UserRole.USER,
]); 


export const Allow_Admin_Or_SuperUser_Only = verifyRole([
  UserRole.ADMIN,
  UserRole.SUPER_USER,
]);