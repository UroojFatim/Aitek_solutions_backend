import {
    BlobServiceClient,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";
import crypto from "crypto";

/**
 * Azure Storage Configuration
 * @returns {Object} Azure storage configuration object
 * @throws {Error} If required environment variables are missing
 */
const getAzureConfig = () => {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    if (!accountName || !accountKey || !containerName) {
        throw new Error("Azure storage configuration missing");
    }

    return { accountName, accountKey, containerName };
};

/**
 * Initialize Azure Storage Clients
 * @returns {Object} Azure storage client objects and configuration
 * @throws {Error} If initialization fails
 */
const initializeAzureStorage = () => {
    try {
        const { accountName, accountKey, containerName } = getAzureConfig();

        const sharedKeyCredential = new StorageSharedKeyCredential(
            accountName,
            accountKey
        );
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );
        const containerClient = blobServiceClient.getContainerClient(containerName);

        return {
            sharedKeyCredential,
            blobServiceClient,
            containerClient,
            accountName,
            containerName,
        };
    } catch (error) {
        throw new Error(`Failed to initialize Azure storage: ${error.message}`);
    }
};

/**
 * Generate a unique filename with timestamp and random string
 * @param {string} originalFileName - Original file name
 * @returns {string} Unique filename with original extension
 */
const generateUniqueFileName = (originalFileName) => {
    try {
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(8).toString("hex");
        const extension = originalFileName.split(".").pop();
        return `${timestamp}_${randomString}.${extension}`;
    } catch (error) {
        throw new Error(`Failed to generate unique filename: ${error.message}`);
    }
};

/**
 * Generate pre-signed URL for file upload
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {number} [fileSizeLimit=10485760] - File size limit in bytes (default 10MB)
 * @returns {Object} Upload URL and related information
 * @throws {Error} If URL generation fails
 */
const generateUploadUrl = (
    fileName,
    mimeType,
    fileSizeLimit = 10 * 1024 * 1024
) => {
    try {
        const { sharedKeyCredential, accountName, containerName } =
            initializeAzureStorage();
        const uniqueFileName = generateUniqueFileName(fileName);

        const permissions = BlobSASPermissions.parse("w");
        const expiresOn = new Date();
        expiresOn.setMinutes(expiresOn.getMinutes() + 30);

        const sasToken = generateBlobSASQueryParameters(
            {
                containerName,
                blobName: uniqueFileName,
                permissions,
                expiresOn,
            },
            sharedKeyCredential
        ).toString();

        // FIX: Construct the URL properly
        const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${uniqueFileName}?${sasToken}`;

        return {
            uploadUrl,
            fileName: uniqueFileName,
            expiresAt: expiresOn.toISOString(),
        };
    } catch (error) {
        throw new Error(`Failed to generate upload URL: ${error.message}`);
    }
};

/**
 * Get public URL for a file
 * @param {string} fileName - File name
 * @returns {string} Public URL for the file
 * @throws {Error} If URL generation fails
 */
const getFileUrl = (fileName) => {
    try {
        const { accountName, containerName } = getAzureConfig();
        return `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`;
    } catch (error) {
        throw new Error(`Failed to get file URL: ${error.message}`);
    }
};

/**
 * Generate pre-signed URL for file download
 * @param {string} fileName - File name
 * @param {number} [expirationMinutes=60] - URL expiration time in minutes
 * @returns {string} Pre-signed download URL
 * @throws {Error} If URL generation fails
 */
const generateDownloadUrl = (fileName, expirationMinutes = 60) => {
    try {
        const { sharedKeyCredential, accountName, containerName } =
            initializeAzureStorage();
        const permissions = BlobSASPermissions.parse("r");

        const expiresOn = new Date();
        expiresOn.setMinutes(expiresOn.getMinutes() + expirationMinutes);

        const sasToken = generateBlobSASQueryParameters(
            {
                containerName,
                blobName: fileName,
                permissions,
                expiresOn,
            },
            sharedKeyCredential
        ).toString();

        return `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
    } catch (error) {
        throw new Error(`Failed to generate download URL: ${error.message}`);
    }
};

/**
 * Delete a file from storage
 * @param {string} fileName - File name to delete
 * @returns {Promise<boolean>} True if deletion was successful
 * @throws {Error} If deletion fails
 */
const deleteFile = async (fileName) => {
    try {
        const { containerClient } = initializeAzureStorage();
        const blobClient = containerClient.getBlobClient(fileName);
        await blobClient.delete();
        return true;
    } catch (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
    }
};

/**
 * Check if a file exists in storage
 * @param {string} fileName - File name to check
 * @returns {Promise<boolean>} True if file exists
 */
const fileExists = async (fileName) => {
    try {
        const { containerClient } = initializeAzureStorage();
        const blobClient = containerClient.getBlobClient(fileName);
        return await blobClient.exists();
    } catch (error) {
        return false;
    }
};

export {
    generateUniqueFileName,
    generateUploadUrl,
    getFileUrl,
    generateDownloadUrl,
    deleteFile,
    fileExists,
};