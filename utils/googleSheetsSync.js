// utils/googleSheetsSync.js
import { getAuthedGoogleClients } from "./googleSheetsClient.js";

export async function fetchSheetRows(spreadsheetId, sheetName) {
  const { sheets } = getAuthedGoogleClients();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:ZZ`, // enough columns for your headers
  });

  const allRows = response.data.values || [];
  if (allRows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = allRows[0];
  const rows = allRows.slice(1); // data rows from row 2
  return { headers, rows };
}

export function parseDateOrNull(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function parseTimeOrNull(raw) {
  if (!raw) return null;

  if (typeof raw === "string") {
    const m = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m) {
      const hh = m[1].padStart(2, "0");
      const mm = m[2].padStart(2, "0");
      const ss = (m[3] || "00").padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }
  }

  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(11, 19); // HH:MM:SS
}
