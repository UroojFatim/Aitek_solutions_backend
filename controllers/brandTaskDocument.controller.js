// controllers/taskDocument.controller.js
import BrandTaskDocument from "../models/BrandEstablishment/brandTaskDocument.model.js";
import BrandPlanTask from "../models/BrandEstablishment/brandPlanTask.model.js";
import {
  generateUploadUrl,
  getFileUrl,
  generateDownloadUrl,
  deleteFile,
  fileExists,
} from "../services/azureStorage.service.js";
import { ApiResponse } from "../utils/response.util.js";
import { DOCUMENT_UPLOAD_STATUS } from "../enums/documentUploadStatus.enum.js";
import User from "../models/user.model.js";

// Reuse the same constraints as BusinessDocument
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/gif",
  "text/plain",
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];

/**
 * POST /api/task-documents/upload-url
 * body: { taskId, fileName, mimeType, fileSize }
 */
export const getTaskUploadUrl = async (req, res) => {
  try {
    const { taskId, fileName, mimeType, fileSize } = req.body;
    const userId = req.user.id;

    if (!taskId) {
      return ApiResponse.badRequest(res, "taskId is required.");
    }

    // Validate task exists
    const planTask = await BrandPlanTask.findByPk(taskId);
    if (!planTask) {
      return ApiResponse.notFound(res, "Plan task not found.");
    }

    // Validate required fields
    if (!fileName || !mimeType || !fileSize) {
      return ApiResponse.badRequest(
        res,
        "fileName, mimeType, and fileSize are required."
      );
    }

    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      return ApiResponse.badRequest(res, "File size exceeds 50MB limit");
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return ApiResponse.badRequest(res, "File type not allowed");
    }

    // Generate upload URL with Azure storage
    const uploadData = generateUploadUrl(fileName, mimeType);

    // Create task document record (pending)
    const document = await BrandTaskDocument.create({
      plan_task_id: planTask.id,
      uploaded_by: userId,
      original_name: fileName,
      file_name: uploadData.fileName,
      file_url: getFileUrl(uploadData.fileName),
      file_size: fileSize,
      mime_type: mimeType,
      upload_status: DOCUMENT_UPLOAD_STATUS.PENDING,
      is_active: true,
    });

    return ApiResponse.created(res, "Upload URL generated successfully", {
      uploadUrl: uploadData.uploadUrl,
      fileName: uploadData.fileName,
      documentId: document.id,
      expiresAt: uploadData.expiresAt,
    });
  } catch (error) {
    console.error(error);
    return ApiResponse.serverError(
      res,
      "Failed to generate task upload URL",
      error
    );
  }
};

/**
 * POST /api/task-documents/:documentId/confirm
 */
export const confirmTaskUpload = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await BrandTaskDocument.findOne({
      where: {
        id: documentId,
        uploaded_by: userId,
        is_active: true,
      },
    });

    if (!document) {
      return ApiResponse.notFound(
        res,
        "Task document not found or unauthorized"
      );
    }

    const exists = await fileExists(document.file_name);
    if (!exists) {
      await document.update({ upload_status: DOCUMENT_UPLOAD_STATUS.FAILED });
      return ApiResponse.badRequest(
        res,
        "File upload failed or file not found in storage"
      );
    }

    await document.update({ upload_status: DOCUMENT_UPLOAD_STATUS.COMPLETED });

    return ApiResponse.ok(res, "Task upload confirmed successfully", {
      id: document.id,
      fileName: document.original_name,
      fileUrl: document.file_url,
      uploadStatus: document.upload_status,
      plan_task_id: document.plan_task_id,
    });
  } catch (error) {
    console.error(error);
    return ApiResponse.serverError(
      res,
      "Failed to confirm task upload",
      error
    );
  }
};

/**
 * GET /api/task-documents/task/:taskId
 */
export const getTaskDocuments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const planTask = await BrandPlanTask.findByPk(taskId);
    if (!planTask) {
      return ApiResponse.notFound(res, "Plan task not found.");
    }

    const docs = await BrandTaskDocument.findAll({
      where: {
        plan_task_id: taskId,
        is_active: true,
        upload_status: DOCUMENT_UPLOAD_STATUS.COMPLETED,
      },
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "full_name", "email", "role"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return ApiResponse.ok(res, "Task documents fetched.", docs);
  } catch (error) {
    console.error(error);
    return ApiResponse.serverError(res, "Failed to fetch task documents.", error);
  }
};

/**
 * GET /api/task-documents/:documentId/download
 */
export const getTaskDownloadUrl = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await BrandTaskDocument.findOne({
      where: {
        id: documentId,
        is_active: true,
        upload_status: DOCUMENT_UPLOAD_STATUS.COMPLETED,
      },
    });

    if (!document) {
      return ApiResponse.notFound(
        res,
        "Task document not found or unauthorized"
      );
    }

    const downloadUrl = generateDownloadUrl(document.file_name);

    return ApiResponse.ok(res, "Download URL generated successfully", {
      downloadUrl,
      fileName: document.original_name,
    });
  } catch (error) {
    console.error(error);
    return ApiResponse.serverError(
      res,
      "Failed to generate task download URL",
      error
    );
  }
};

/**
 * DELETE /api/task-documents/delete/:documentId
 */
export const deleteTaskDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await BrandTaskDocument.findOne({
      where: {
        id: documentId,
        is_active: true,
      },
    });

    if (!document) {
      return ApiResponse.notFound(
        res,
        "Task document not found or unauthorized"
      );
    }

    if (document.upload_status === DOCUMENT_UPLOAD_STATUS.COMPLETED) {
      await deleteFile(document.file_name);
    }

    await document.update({ is_active: false });

    return ApiResponse.ok(res, "Task document deleted successfully");
  } catch (error) {
    console.error(error);
    return ApiResponse.serverError(
      res,
      "Failed to delete task document",
      error
    );
  }
};
