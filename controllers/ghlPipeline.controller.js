import GhlPipeline from "../models/ghlPipeline.model.js";
import { ApiResponse } from "../utils/response.util.js";
import ghl from "../services/ghl.service.js";

export const syncGhlPipelines = async (req, res) => {
  const { locationId } = req.params;

  try {
    // 1. Fetch pipelines from GoHighLevel using SDK
    const response = await ghl.opportunities.getPipelines({
      locationId: locationId,
    });

    const pipelines = response?.pipelines || [];

    // 2. Save / update pipelines inside the database
    for (const pipeline of pipelines) {
      await GhlPipeline.upsert({
        ghl_pipeline_id: pipeline.id,
        name: pipeline.name,
        location_id: locationId,
      });
    }

    return ApiResponse.ok(res, "Pipelines synced successfully.", {
      count: pipelines.length,
      pipelines,
    });

  } catch (error) {
    return ApiResponse.serverError(res, "Failed to sync pipelines.", error);
  }
};

export const getAllPipelines = async (req, res) => {
  try {
    const pipelines = await GhlPipeline.findAll({
      order: [["createdAt", "DESC"]],
    });

    return ApiResponse.ok(res, "Pipelines fetched successfully.", pipelines);
  } catch (err) {
    return ApiResponse.serverError(res, "Failed to fetch pipelines.", err);
  }
};
