import express from 'express';
import { rawBodyJson } from '../middleware/rawbody.middleware.js';
import { verifySignatureHeader } from '../middleware/signature.middleware.js';
import { handleGSheetsWebhook } from '../controllers/webhook.controller.js';


const router = express.Router();


// Only for this path: capture rawBody and then verify HMAC header
router.post(
  '/webhook',
  rawBodyJson,
  verifySignatureHeader('X-GSHEETS-SIGNATURE', process.env.WEBHOOK_SECRET),
  handleGSheetsWebhook
);


export default router;