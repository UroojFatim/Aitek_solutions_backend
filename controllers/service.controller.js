// controllers/service.controller.js
import Service from '../models/service.model.js';
import { ApiResponse } from '../utils/response.util.js';

// Get all services (only id and name)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['name', 'ASC']]
    });

    return ApiResponse.ok(res, 'Services retrieved successfully', services);
  } catch (err) {
    
    return ApiResponse.serverError(res, 'Server error', err);
  }
};

// // Create new service
// export const createService = async (req, res) => {
//   const { name, description, price, category } = req.body;

//   try {
//     // Validation
//     if (!name || !price || !category) {
//       return ApiResponse.badRequest(res, 'Missing required fields', {
//         required: ['name', 'price', 'category']
//       });
//     }

//     // Validate price is a positive number
//     if (isNaN(price) || parseFloat(price) < 0) {
//       return ApiResponse.badRequest(res, 'Price must be a valid positive number');
//     }

//     // Check if service with same name already exists
//     const existingService = await Service.findOne({ where: { name } });
//     if (existingService) {
//       return ApiResponse.badRequest(res, 'Service with this name already exists');
//     }

//     // Create service
//     const newService = await Service.create({
//       name,
//       description: description || null,
//       price: parseFloat(price),
//       category
//     });

//     const serviceData = {
//       id: newService.id,
//       name: newService.name,
//       description: newService.description,
//       price: newService.price,
//       category: newService.category,
//       created_at: newService.created_at
//     };

//     return ApiResponse.created(res, 'Service created successfully', serviceData);
//   } catch (err) {
//     
//     return ApiResponse.serverError(res, 'Server error', err);
//   }
// };