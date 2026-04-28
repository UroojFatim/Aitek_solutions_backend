import BusinessDocument from "../models/businessDocument.model.js";
import Business from "../models/business.model.js";
import {
  generateUploadUrl,
  getFileUrl,
  generateDownloadUrl,
  deleteFile,
  fileExists,
} from "../services/azureStorage.service.js";
import { BUSINESS_STATUS } from "../enums/businessStatus.enum.js";
import UserBusiness from "../models/userBusiness.model.js";
import { ApiResponse } from "../utils/response.util.js";
import { DOCUMENT_UPLOAD_STATUS } from "../enums/documentUploadStatus.enum.js";

// File size and type constraints
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

export const getUploadUrl = async (req, res) => {
  try {
    const { fileName, mimeType, fileSize, documentType } = req.body;
    const userId = req.user.id;

    const userBusiness = await UserBusiness.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Business,
          as: "business",
          required: true,
        },
      ],
    });

    if (!userBusiness) {
      return ApiResponse.badRequest(res, "No business found for this user");
    }

    // Validate required fields
    if (!fileName || !mimeType || !fileSize) {
      return ApiResponse.badRequest(
        res,
        "fileName, mimeType, and fileSize are required"
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

    // Create business document record
    const document = await BusinessDocument.create({
      business_id: userBusiness.business_id,
      uploaded_by: userId,
      original_name: fileName,
      file_name: uploadData.fileName,
      file_url: getFileUrl(uploadData.fileName),
      file_size: fileSize,
      mime_type: mimeType,
      document_type: documentType || null,
      upload_status: "pending",
      is_active: true,
    });

    return ApiResponse.created(res, "Upload URL generated successfully", {
      uploadUrl: uploadData.uploadUrl,
      fileName: uploadData.fileName,
      documentId: document.id,
      expiresAt: uploadData.expiresAt,
    });
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to generate upload URL", error);
  }
};

export const confirmUpload = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await BusinessDocument.findOne({
      where: {
        id: documentId,
        uploaded_by: userId,
        is_active: true,
      },
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!document) {
      return ApiResponse.badRequest(res, "Document not found or unauthorized");
    }

    // Verify file exists in Azure
    const fileExistsInAzure = await fileExists(document.file_name);

    if (!fileExistsInAzure) {
      await document.update({ upload_status: "failed" });
      return ApiResponse.badRequest(
        res,
        "File upload failed or file not found"
      );
    }

    // Update status to completed
    await document.update({ upload_status: "completed" });

    return ApiResponse.ok(res, "Upload confirmed successfully", {
      id: document.id,
      fileName: document.original_name,
      fileUrl: document.file_url,
      uploadStatus: document.upload_status,
      business: document.business,
      documentType: document.document_type,
    });
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to confirm upload", error);
  }
};

export const getBusinessDocuments = async (req, res) => {
  try {
    const { businessId } = req.params;
    const {
      page = 1,
      limit = 10,
      status = "completed",
      documentType,
    } = req.query;
    const userId = req.user.id;

    // Validate business access
    const business = await Business.findOne({
      where: {
        id: businessId,
        status: BUSINESS_STATUS.ACTIVE,
      },
    });

    if (!business) {
      return ApiResponse.badRequest(res, "Business not found or inactive");
    }

    const offset = (page - 1) * limit;
    const whereClause = {
      business_id: businessId,
      upload_status: status,
      is_active: true,
    };

    if (documentType) {
      whereClause.document_type = documentType;
    }

    const { count, rows: documents } = await BusinessDocument.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "name"],
        },
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [["created_at", "DESC"]],
    });

    return ApiResponse.ok(
      res,
      "Documents retrieved successfully",
      // {
      //   documents,
      //   pagination: {
      //     total: count,
      //     page: parseInt(page),
      //     limit: parseInt(limit),
      //     totalPages: Math.ceil(count / limit),
      //   },
      // }
      documents
    );
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to fetch documents", error);
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await BusinessDocument.findAll({
      where: {
        business_id: req.business.id,
        is_active: true,
        upload_status: DOCUMENT_UPLOAD_STATUS.COMPLETED,
      },
    });

    return ApiResponse.ok(res, "Documents retrieved successfully", documents);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to fetch documents", error);
  }
};

export const getDownloadUrl = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await BusinessDocument.findOne({
      where: {
        id: documentId,
        upload_status: "completed",
        is_active: true,
      },
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!document) {
      return ApiResponse.badRequest(res, "Document not found or unauthorized");
    }

    const downloadUrl = generateDownloadUrl(document.file_name);

    return ApiResponse.ok(res, "Download URL generated successfully", {
      downloadUrl,
      fileName: document.original_name,
      business: document.business,
    });
  } catch (error) {
    return ApiResponse.serverError(
      res,
      "Failed to generate download URL",
      error
    );
  }
};

/**
 * Delete a document and its associated file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await BusinessDocument.findOne({
      where: {
        id: documentId,
        is_active: true,
      },
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!document) {
      return ApiResponse.badRequest(res, "Document not found or unauthorized");
    }

    // Delete from Azure Storage if completed
    if (document.upload_status === "completed") {
      await deleteFile(document.file_name);
    }

    // Soft delete the document
    await document.update({ is_active: false });

    return ApiResponse.ok(res, "Document deleted successfully");
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to delete document", error);
  }
};
