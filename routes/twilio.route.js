// routes/twilio.routes.js
import express from "express";
import { createCall } from "../services/twilio.service.js";

const router = express.Router();

router.post("/call", async (req, res) => {
  try {
    const { to } = req.body;

    const response = await createCall(to);
    return res.json({ success: true, call: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Call failed" });
  }
});

export default router;
