import BusinessPipeline from "../models/businessPipeline.model.js";
import Business from "../models/business.model.js";
import GhlPipeline from "../models/ghlPipeline.model.js";
import { ApiResponse } from "../utils/response.util.js";

export const assignPipelineToBusiness = async (req, res) => {
  const { business_id, pipeline_id } = req.body;

  try {
    const existing = await BusinessPipeline.findOne({ where: { business_id, pipeline_id } });
    if (existing) {
      return ApiResponse.badRequest(res, 'Pipeline already assigned to this business.');
    }

    const assigned = await BusinessPipeline.create({ business_id, pipeline_id });
    return ApiResponse.created(res, 'Pipeline assigned to business successfully.', assigned);
  } catch (err) {
    return ApiResponse.serverError(res, 'Failed to assign pipeline to business.', err);
  }
};

export const getBusinessAssignedPipelines = async (req, res) => {
  try {
    const { business_id } = req.params;

    const business = await Business.findByPk(business_id, {
      include: {
        model: GhlPipeline,
        as: 'pipelines',
        through: { attributes: [] }
      }
    });

    if (!business) {
      return ApiResponse.notFound(res, 'Business not found');
    }

    return ApiResponse.ok(res, 'Business pipelines fetched successfully.', {
      business_id: business.id,
      name: business.name,
      pipelines: business.pipelines
    });

  } catch (err) {
    return ApiResponse.serverError(res, 'Failed to fetch business pipelines.', err);
  }
};

export const getAllBusinessPipelineAssignments = async (req, res) => {
  try {
    const data = await BusinessPipeline.findAll({
      include: [
        {
          model: Business,
          as: "business", // relation ka alias (agar define kiya ho to use karna zaroori)
          attributes: ["name", "email", "phone"], // jo fields chahiye wo select karo
        },
        {
          model: GhlPipeline,
          as: "pipeline",
          attributes: ["name"],
        },
      ],
    });
    return ApiResponse.ok(res, 'All business-pipeline assignments fetched successfully.', data);
  } catch (err) {
    return ApiResponse.serverError(res, 'Failed to fetch assignments.', err);
  }
};


// Delete a pipline by ID 
export const deletePipeline = async (req, res) => {
  const { id } = req.params;

  try {
    
    const pipeline = await BusinessPipeline.findByPk(id);

    if (!pipeline) {
      return ApiResponse.notFound(res, 'Assign Pipeline not found.');
    }


    await pipeline.destroy();

     return ApiResponse.ok(res, 'Assign Pipeline deleted successfully.');
  } catch (error) {
    return ApiResponse.serverError(res, 'An error occurred while deleting the pipeline.', error);
  }
};
