import express from "express";
import {
  assignPipelineToBusiness,
  getBusinessAssignedPipelines,
  getAllBusinessPipelineAssignments,
  deletePipeline
} from "../controllers/businessPipeline.controller.js";

const router = express.Router();

router.post("/assign_pipeline", assignPipelineToBusiness);
router.get("/get_business_pipeline/:business_id", getBusinessAssignedPipelines);
router.get("/get_assign_pipelines", getAllBusinessPipelineAssignments);
router.delete("/delete/:id", deletePipeline);

export default router;
