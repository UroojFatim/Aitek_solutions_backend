// services/sheetSync.service.js
import BookedTracker from "../models/bookedTracker.model.js";
import LeadTracker from "../models/leadTracker.model.js";
import {
  fetchExcelRows,
  parseDateOrNull,
  parseTimeOrNull,
} from "../utils/microsoftExcelSync.js";
import BusinessSheet from "../models/businessSheet.model.js";

export async function syncBookedTrackerForUser(businessId) {
  // Get the ACTIVE sheet for this business
  const businessSheet = await BusinessSheet.findOne({
    where: { business_id: businessId, status: 'active' },
  });
  if (!businessSheet) {
    throw new Error("No active spreadsheet found for this business.");
  }

  const spreadsheetId = businessSheet.spreadsheet_id;
  const sheetId = businessSheet.id;

  const { headers, rows } = await fetchExcelRows(
    spreadsheetId,
    "Booked Tracker"
  );

  if (!headers.length) return;

  for (let i = 0; i < rows.length; i++) {
    const rowIdx = i + 2; // sheet row number
    const values = rows[i];

    const rowData = {};
    headers.forEach((h, idx) => {
      rowData[h] = values[idx] ?? null;
    });

    const hasAnyValue = Object.values(rowData).some(
      (v) => v !== "" && v !== null
    );
    if (!hasAnyValue) continue;

    const payload = {
      date_lead_received: parseDateOrNull(rowData["DATE LEAD RECEIVED"]),
      date_scheduled: parseDateOrNull(rowData["DATE SCHEDULED"]),
      appt_date: parseDateOrNull(rowData["APPT DATE"]),
      appt_time: parseTimeOrNull(rowData["APPT TIME"]),

      first_name: rowData["FIRST NAME"] || null,
      last_name: rowData["LAST NAME"] || null,
      patient_dob: parseDateOrNull(rowData["PATIENT DOB"]),
      phone: rowData["PHONE #"] || null,
      procedure: rowData["PROCEDURE"] || null,

      woa_notes: rowData["WOA NOTES"] || null,
      location: rowData["LOCATION"] || null,
      show_status: rowData["SHOW STATUS"] || null,
      treatment_status: rowData["TREATMENT STATUS"] || null,
      clinic_notes_from_consult: rowData["CLINIC NOTES FROM CONSULT"] || null,
    };

    const [record, created] = await BookedTracker.findOrCreate({
      where: { business_id: businessId, sheet_id: sheetId, sheet_row_number: rowIdx },
      defaults: {
        ...payload,
        business_id: businessId,
        sheet_id: sheetId,
        sheet_row_number: rowIdx,
      },
    });

    if (!created) {
      await record.update(payload);
    }
  }
}

export async function syncLeadTrackerForUser(businessId) {
  // Get the ACTIVE sheet for this business
  const businessSheet = await BusinessSheet.findOne({
    where: { business_id: businessId, status: 'active' },
  });
  if (!businessSheet) {
    throw new Error("No active spreadsheet found for this business.");
  }

  const spreadsheetId = businessSheet.spreadsheet_id;
  const sheetId = businessSheet.id;

  const { headers, rows } = await fetchExcelRows(spreadsheetId, "Lead Tracker");

  if (!headers.length) return;

  for (let i = 0; i < rows.length; i++) {
    const rowIdx = i + 2;
    const values = rows[i];

    const rowData = {};
    headers.forEach((h, idx) => {
      rowData[h] = values[idx] ?? null;
    });

    const hasAnyValue = Object.values(rowData).some(
      (v) => v !== "" && v !== null
    );
    if (!hasAnyValue) continue;

    const payload = {
      date_lead_received: parseDateOrNull(rowData["DATE LEAD RECEIVED"]),
      date_lead_called: parseDateOrNull(rowData["DATE LEAD CALLED"]),
      first_name: rowData["FIRST NAME"] || null,
      last_name: rowData["LAST NAME"] || null,
      phone: rowData["PHONE #"] || null,
      procedure: rowData["PROCEDURE"] || null,
      caller: rowData["CALLER"] || null,
      locations: rowData["LOCATIONS"] || null,
      call_status: rowData["CALL STATUS"] || null,
      booked_status: rowData["BOOKED STATUS"] || null,
      dental_va_call_note: rowData["DENTAL VA CALL NOTE"] || null,

      time_lead_received: parseTimeOrNull(rowData["TIME LEAD RECEIVED"]),
      time_lead_called: parseTimeOrNull(rowData["TIME LEAD CALLED"]),
      timing: rowData["TIMING"] || null,
      dentalpro_va: rowData["DENTALPRO VA"] || null,
      time_difference: rowData["TIME DIFFERENCE"] || null,
      notes: rowData["NOTES"] || null,

      day1_note: rowData["DAY 1 NOTE"] || null,
      day2_note: rowData["DAY 2 NOTE"] || null,
      day3_note: rowData["DAY 3 NOTE"] || null,
      day4_note: rowData["DAY 4 NOTE"] || null,
      day5_note: rowData["DAY 5 NOTE"] || null,
      day6_note: rowData["DAY 6 NOTE"] || null,
      day7_note: rowData["DAY 7 NOTE"] || null,

      callback_8: rowData["CALL BACK 8"] || null,
      callback_9: rowData["CALL BACK 9"] || null,
      callback_10: rowData["CALL BACK 10"] || null,
      follow_up_note: rowData["FOLLOW UP NOTE"] || null,
    };

    const [record, created] = await LeadTracker.findOrCreate({
      where: { business_id: businessId, sheet_id: sheetId, sheet_row_number: rowIdx },
      defaults: {
        ...payload,
        business_id: businessId,
        sheet_id: sheetId,
        sheet_row_number: rowIdx,
      },
    });

    if (!created) {
      await record.update(payload);
    }
  }
}
