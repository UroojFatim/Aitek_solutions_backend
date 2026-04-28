import express from "express";
import { syncGhlPipelines, getAllPipelines } from "../controllers/ghlPipeline.controller.js";

const router = express.Router();

router.get("/sync/:locationId", syncGhlPipelines);  
router.get("/get_pipeline", getAllPipelines); 

export default router;
