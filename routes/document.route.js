import express from 'express';
import {
    getUploadUrl,
    confirmUpload,
    getBusinessDocuments,
    getDownloadUrl,
    deleteDocument,
    getMyDocuments
} from '../controllers/document.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import {Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY, Allow_SuperUser_Or_User_Only } from '../middleware/verifyRole.js';

const router = express.Router();

// Business document management routes
router.post('/upload-url', verifyToken, getUploadUrl);
router.post('/:documentId/confirm', verifyToken, confirmUpload);
router.get('/my-documents', verifyToken, Allow_SuperUser_Or_User_Only, getMyDocuments);
router.get('/:businessId', verifyToken, Allow_SuperAdmin_Or_Admin_Or_SuperUser_OR_USER_ONLY, getBusinessDocuments);
router.get('/:documentId/download', verifyToken, getDownloadUrl);
router.delete('/delete/:documentId', verifyToken, deleteDocument);

export default router; 