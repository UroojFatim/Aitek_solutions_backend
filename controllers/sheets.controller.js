// controllers/sheetData.controller.js
import { ApiResponse } from "../utils/response.util.js";
import BusinessSheet from "../models/businessSheet.model.js";
import Business from "../models/business.model.js";
import BookedTracker from "../models/bookedTracker.model.js";
import LeadTracker from "../models/leadTracker.model.js";
import { Op } from "sequelize";
import { getMicrosoftGraphClient } from "../utils/microsoftGraphClient.js";
import {
  createNewExcelFile,
  freezeHeaderRow,
  shareExcelFile,
  writeExcelRange,
} from "../utils/microsoftExcelSync.js";
import {
  syncBookedTrackerForUser,
  syncLeadTrackerForUser,
} from "../services/sheetSync.service.js";

const BOOKED_TRACKER_HEADERS = [
  "DATE LEAD RECEIVED", // date_lead_received
  "DATE SCHEDULED", // date_scheduled
  "APPT DATE", // appt_date
  "APPT TIME", // appt_time
  "FIRST NAME", // first_name
  "LAST NAME", // last_name
  "PATIENT DOB", // patient_dob
  "PHONE #", // phone
  "PROCEDURE", // procedure
  "WOA NOTES", // woa_notes
  "LOCATION", // location
  "SHOW STATUS", // show_status
  "TREATMENT STATUS", // treatment_status
  "CLINIC NOTES FROM CONSULT", // clinic_notes_from_consult
  "DENTALPRO VA", // dentalpro_va
  "TIME DIFFERENCE", // time_difference
  "NOTES", // notes
  "DAY 1 NOTE", // day_1_note
  "DAY 2 NOTE", // day_2_note
  "DAY 3 NOTE", // day_3_note
  "DAY 4 NOTE", // day_4_note
  "DAY 5 NOTE", // day_5_note
  "DAY 6 NOTE", // day_6_note
  "DAY 7 NOTE", // day_7_note
  "CALL BACK 8", // call_back_8
  "CALL BACK 9", // call_back_9
  "CALL BACK 10", // call_back_10
  "FOLLOW UP NOTE", // follow_up_note
];

const LEAD_TRACKER_HEADERS = [
  // Core lead data
  "DATE LEAD RECEIVED", // date_lead_received
  "DATE LEAD CALLED", // date_lead_called
  "FIRST NAME", // first_name
  "LAST NAME", // last_name
  "PHONE #", // phone
  "PROCEDURE", // procedure
  "CALLER", // caller
  "LOCATIONS", // locations
  "CALL STATUS", // call_status
  "BOOKED STATUS", // booked_status
  "DENTAL VA CALL NOTE", // dental_va_call_note

  // Timing fields
  "TIME LEAD RECEIVED", // time_lead_received
  "TIME LEAD CALLED", // time_lead_called
  "TIMING", // timing
  "DENTALPRO VA", // dentalpro_va
  "TIME DIFFERENCE", // time_difference
  "NOTES", // notes

  // Follow-up day notes
  "DAY 1 NOTE", // day1_note
  "DAY 2 NOTE", // day2_note
  "DAY 3 NOTE", // day3_note
  "DAY 4 NOTE", // day4_note
  "DAY 5 NOTE", // day5_note
  "DAY 6 NOTE", // day6_note
  "DAY 7 NOTE", // day7_note

  // Callbacks
  "CALL BACK 8", // callback_8
  "CALL BACK 9", // callback_9
  "CALL BACK 10", // callback_10
  "FOLLOW UP NOTE", // follow_up_note
];

function numberToColumnLetter(num) {
  let s = "";
  while (num > 0) {
    const mod = (num - 1) % 26;
    s = String.fromCharCode(65 + mod) + s;
    num = Math.floor((num - 1) / 26);
  }
  return s;
}

async function initializeSheetStructure(spreadsheetId) {
  const client = getMicrosoftGraphClient();

  console.log(`🔧 Initializing Excel structure for: ${spreadsheetId}`);

  // Headers for Booked Tracker sheet (14 columns)
  const bookedHeaders = [BOOKED_TRACKER_HEADERS];
  const bookedLastColumn = numberToColumnLetter(BOOKED_TRACKER_HEADERS.length);

  // Headers for Lead Tracker sheet (31 columns)
  const leadHeaders = [LEAD_TRACKER_HEADERS];
  const leadLastColumn = numberToColumnLetter(LEAD_TRACKER_HEADERS.length);

  try {
    // Write headers to Booked Tracker sheet
    await writeExcelRange(
      spreadsheetId,
      `Booked Tracker!A1:${bookedLastColumn}1`,
      bookedHeaders
    );

    // Write headers to Lead Tracker sheet
    await writeExcelRange(
      spreadsheetId,
      `Lead Tracker!A1:${leadLastColumn}1`,
      leadHeaders
    );

    // Freeze header rows
    await freezeHeaderRow(spreadsheetId, "Booked Tracker");
    await freezeHeaderRow(spreadsheetId, "Lead Tracker");

    console.log(`✅ Excel structure initialized`);
  } catch (err) {
    console.error("Error initializing sheet structure:", err.message);
    throw err;
  }
}

export const createUserSpreadsheet = async (req, res) => {
  try {
    const businessId = req.business?.id || req.body?.business_id;
    const businessEmail = req.business?.email || req.body?.business_email;

    let business = null;

    if (businessEmail) {
      business = await Business.findOne({
        where: { email: businessEmail },
      });
    }

    if (!business && businessId) {
      business = await Business.findByPk(businessId);
    }

    if (!business) {
      throw new Error("Business not found");
    }

    if (!businessId) {
      return ApiResponse.unauthorized(res, "Business not authenticated.");
    }

    // Check if an active sheet already exists
    const activeSheet = await BusinessSheet.findOne({
      where: { 
        business_id: businessId,
        status: 'active'
      },
    });

    if (activeSheet) {
      return ApiResponse.conflict(res, "An active sheet already exists. Please inactivate or delete it before creating a new one.", activeSheet);
    }

    const fileName = `WOA Portal - ${business.name}`;

    console.log(`📝 Creating new Excel file for: ${fileName}`);

    const { fileId: spreadsheetId, fileUrl: spreadsheetUrl } = await createNewExcelFile(fileName);

    console.log(`✅ Created new Excel file: ${spreadsheetId}`);

    await initializeSheetStructure(spreadsheetId);

    const record = await BusinessSheet.create({
      business_id: businessId,
      spreadsheet_id: spreadsheetId,
      spreadsheet_url: spreadsheetUrl,
      status: 'active',
    });

    return ApiResponse.created(
      res,
      "Spreadsheet created successfully.",
      record
    );
  } catch (err) {
    console.error(
      "Error in createUserSpreadsheet:",
      err?.message || err
    );
    return ApiResponse.serverError(
      res,
      "Failed to create spreadsheet.",
      err?.message || "Unknown error"
    );
  }
};

// controllers/sheets.controller.js (add this)
export const getUserSheetForCurrentUser = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return ApiResponse.unauthorized(res, "Business not authenticated.");
    }

    const records = await BusinessSheet.findAll({
      where: { business_id: businessId },
      order: [["createdAt", "DESC"]],
    });

    return ApiResponse.ok(res, "User sheets fetched.", records || []);
  } catch (err) {
    console.error("Error in getUserSheetForCurrentUser:", err);
    return ApiResponse.serverError(
      res,
      "Failed to fetch user sheets.",
      err?.message || err
    );
  }
};

// Admin: list all created business sheets with business info
export const getAllUserSheets = async (req, res) => {
  try {
    const records = await BusinessSheet.findAll({
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "name", "email", "phone", "address"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return ApiResponse.ok(res, "Business sheets retrieved.", records || []);
  } catch (err) {
    console.error("Error in getAllUserSheets:", err);
    return ApiResponse.serverError(
      res,
      "Failed to fetch business sheets.",
      err?.message || err
    );
  }
};

// Admin: soft delete a created business sheet mapping (marks as deleted and cleans up tracker data)
export const deleteUserSheet = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await BusinessSheet.findOne({ where: { id } });
    if (!record) {
      return ApiResponse.notFound(res, "Sheet not found.");
    }

    // Mark as deleted
    await record.update({ status: 'deleted' });

    // Delete tracker data for this business
    await BookedTracker.destroy({
      where: { business_id: record.business_id },
    });
    await LeadTracker.destroy({
      where: { business_id: record.business_id },
    });

    return ApiResponse.ok(res, "Sheet marked as deleted and tracker data removed.");
  } catch (err) {
    console.error("Error in deleteUserSheet:", err);
    return ApiResponse.serverError(
      res,
      "Failed to delete sheet.",
      err?.message || err
    );
  }
};

// Admin: restore a deleted sheet (marks as inactive)
export const restoreUserSheet = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await BusinessSheet.findOne({ where: { id } });
    if (!record) {
      return ApiResponse.notFound(res, "Sheet not found.");
    }

    if (record.status !== 'deleted') {
      return ApiResponse.badRequest(res, "Sheet is not deleted.");
    }

    await record.update({ status: 'inactive' });

    return ApiResponse.ok(res, "Sheet restored as inactive.", record);
  } catch (err) {
    console.error("Error in restoreUserSheet:", err);
    return ApiResponse.serverError(
      res,
      "Failed to restore sheet.",
      err?.message || err
    );
  }
};

// Admin: activate a sheet (marks as active)
export const activateUserSheet = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await BusinessSheet.findOne({ where: { id } });
    if (!record) {
      return ApiResponse.notFound(res, "Sheet not found.");
    }

    // Check if another sheet is already active for the same business
    const activeSheet = await BusinessSheet.findOne({
      where: {
        business_id: record.business_id,
        status: 'active',
        id: { [Op.ne]: id },
      },
    });

    if (activeSheet) {
      return ApiResponse.conflict(
        res,
        "Another sheet is already active for this business. Inactivate it first.",
        { activeSheetId: activeSheet.id }
      );
    }

    await record.update({ status: 'active' });

    return ApiResponse.ok(res, "Sheet activated.", record);
  } catch (err) {
    console.error("Error in activateUserSheet:", err);
    return ApiResponse.serverError(
      res,
      "Failed to activate sheet.",
      err?.message || err
    );
  }
};

// Admin: update sheet status (active/inactive)
export const updateSheetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['active', 'inactive'].includes(status)) {
      return ApiResponse.badRequest(res, "Invalid status. Must be 'active' or 'inactive'.");
    }

    const record = await BusinessSheet.findOne({ where: { id } });
    if (!record) {
      return ApiResponse.notFound(res, "Sheet not found.");
    }

    // If setting to inactive, just update
    if (status === 'inactive') {
      await record.update({ status: 'inactive' });
      return ApiResponse.ok(res, "Sheet marked as inactive.", record);
    }

    // If setting to active, ensure no other sheet is active for the SAME business
    const activeSheet = await BusinessSheet.findOne({
      where: {
        business_id: record.business_id,
        status: 'active',
        id: { [Op.ne]: id },
      },
    });

    if (activeSheet) {
      return ApiResponse.badRequest(
        res,
        "Another sheet is already active for this business.",
        { activeSheetId: activeSheet.id }
      );
    }

    await record.update({ status: 'active' });
    return ApiResponse.ok(res, "Sheet activated.", record);
  } catch (err) {
    console.error("Error in updateSheetStatus:", err);
    return ApiResponse.serverError(
      res,
      "Failed to update sheet status.",
      err?.message || err
    );
  }
};

export const syncUserSheets = async (req, res) => {
  try {
    const businessId = req.business?.id || req.body?.business_id;
    if (!businessId) {
      return ApiResponse.unauthorized(res, "Business not authenticated.");
    }

    await syncBookedTrackerForUser(businessId);
    await syncLeadTrackerForUser(businessId);

    return ApiResponse.ok(res, "Sheets synced to database.");
  } catch (err) {
    console.error("Error in syncUserSheets:", err);
    return ApiResponse.serverError(
      res,
      "Failed to sync sheets.",
      err?.message || err
    );
  }
};

export const getBookedForUser = async (req, res) => {
  try {
    const { businessId, sheetId } = req.query;
    
    const whereClause = { business_id: businessId };
    if (sheetId) {
      whereClause.sheet_id = sheetId;
    }
    
    const rows = await BookedTracker.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });
    return ApiResponse.ok(res, "Booked tracker rows fetched.", rows);
  } catch (err) {
    console.error("getBookedForUser error:", err);
    return ApiResponse.serverError(res, "Failed to fetch booked tracker.", err);
  }
};

export const getLeadsForUser = async (req, res) => {
  try {
    const { businessId, sheetId } = req.query;
    
    const whereClause = { business_id: businessId };
    if (sheetId) {
      whereClause.sheet_id = sheetId;
    }
    
    const rows = await LeadTracker.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });
    return ApiResponse.ok(res, "Lead tracker rows fetched.", rows);
  } catch (err) {
    console.error("getLeadsForUser error:", err);
    return ApiResponse.serverError(res, "Failed to fetch lead tracker.", err);
  }
};

// Admin: Share sheet access with an email address
export const shareSheetAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role = "writer" } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, "Email is required.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ApiResponse.badRequest(res, "Invalid email format.");
    }

    // Validate role
    const validRoles = ["reader", "writer", "commenter"];
    if (!validRoles.includes(role)) {
      return ApiResponse.badRequest(
        res,
        `Invalid role. Must be one of: ${validRoles.join(", ")}`
      );
    }

    const record = await BusinessSheet.findOne({ where: { id } });
    if (!record) {
      return ApiResponse.notFound(res, "Sheet not found.");
    }

    const spreadsheetId = record.spreadsheet_id;
    if (!spreadsheetId) {
      return ApiResponse.badRequest(res, "No spreadsheet ID found for this sheet.");
    }

    // Map Google Sheets roles to Microsoft Graph API roles
    // Google: reader, writer, commenter -> Microsoft: read, write
    const excelRole = role === "reader" ? "read" : "write";

    // Share the Excel file using Microsoft Graph API
    await shareExcelFile(spreadsheetId, email, excelRole);

    return ApiResponse.ok(res, `Sheet access granted to ${email} as ${role}.`, {
      email,
      role,
      spreadsheetId,
    });
  } catch (err) {
    console.error("Error in shareSheetAccess:", err);
    return ApiResponse.serverError(
      res,
      "Failed to share sheet access.",
      err?.message || err
    );
  }
};

