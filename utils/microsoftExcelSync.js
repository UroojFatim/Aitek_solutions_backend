import { getMicrosoftGraphClient } from './microsoftGraphClient.js';

/**
 * Create a new Excel workbook with two worksheets
 * @param {string} fileName - Name for the new file
 * @returns {Object} { fileId, fileUrl }
 */
export async function createNewExcelFile(fileName) {
  const client = getMicrosoftGraphClient();

  try {
    console.log(`📝 Creating new Excel file: ${fileName}`);

    // Create a new empty Excel file in OneDrive root
    const createResponse = await client
      .api('/drive/root/children')
      .post({
        name: `${fileName}.xlsx`,
        file: {},
        '@microsoft.graph.conflictBehavior': 'rename'
      });

    const fileId = createResponse.id;
    const fileUrl = createResponse.webUrl;

    console.log(`✅ Created Excel file: ${fileId}`);
    console.log(`📊 Setting up worksheets...`);

    // Create the required worksheets
    await createWorksheet(fileId, 'Booked Tracker');
    await createWorksheet(fileId, 'Lead Tracker');

    // Delete the default Sheet1
    await deleteWorksheet(fileId, 'Sheet1');

    console.log(`✅ Worksheets configured successfully`);

    return { fileId, fileUrl };
  } catch (err) {
    console.error(`❌ Error creating Excel file:`, {
      message: err.message,
      statusCode: err.statusCode,
      body: err.body
    });
    throw err;
  }
}

/**
 * Create a new worksheet in an Excel file
 * @param {string} fileId - File ID
 * @param {string} sheetName - Name for the new sheet
 */
async function createWorksheet(fileId, sheetName) {
  const client = getMicrosoftGraphClient();

  try {
    console.log(`  📄 Creating worksheet: ${sheetName}`);

    await client
      .api(`/drive/items/${fileId}/workbook/worksheets/add`)
      .post({
        name: sheetName
      });

    console.log(`  ✅ Created worksheet: ${sheetName}`);
  } catch (err) {
    console.error(`  ❌ Error creating worksheet ${sheetName}:`, err.message);
    throw err;
  }
}

/**
 * Delete a worksheet from an Excel file
 * @param {string} fileId - File ID
 * @param {string} sheetName - Name of the sheet to delete
 */
async function deleteWorksheet(fileId, sheetName) {
  const client = getMicrosoftGraphClient();

  try {
    console.log(`  🗑️ Deleting worksheet: ${sheetName}`);

    // Get all worksheets to find the one to delete
    const worksheetsResponse = await client
      .api(`/drive/items/${fileId}/workbook/worksheets`)
      .get();

    const sheet = worksheetsResponse.value.find(s => s.name === sheetName);
    
    if (sheet) {
      await client
        .api(`/drive/items/${fileId}/workbook/worksheets('${sheet.id}')`)
        .delete();

      console.log(`  ✅ Deleted worksheet: ${sheetName}`);
    } else {
      console.log(`  ⚠️ Worksheet ${sheetName} not found (already deleted)`);
    }
  } catch (err) {
    // Don't fail if we can't delete Sheet1, it's not critical
    console.warn(`  ⚠️ Warning: Could not delete ${sheetName}: ${err.message}`);
  }
}

/**
 * Fetch worksheet data from Excel file
 * @param {string} fileId - OneDrive file ID (from spreadsheet_id column)
 * @param {string} worksheetName - "Booked Tracker" or "Lead Tracker"
 * @returns {Object} { headers: string[], rows: any[][] }
 */
export async function fetchExcelRows(fileId, worksheetName) {
  const client = getMicrosoftGraphClient();

  try {
    console.log(`📊 Fetching Excel data from "${worksheetName}" in file ${fileId}`);

    // Get used range from worksheet
    const response = await client
      .api(`/drive/items/${fileId}/workbook/worksheets/${worksheetName}/usedRange`)
      .get();

    const allRows = response.values || [];
    
    if (allRows.length === 0) {
      console.log(`⚠️ No data found in ${worksheetName}`);
      return { headers: [], rows: [] };
    }

    const headers = allRows[0];
    const rows = allRows.slice(1);

    console.log(`✅ Fetched ${rows.length} rows with ${headers.length} columns from ${worksheetName}`);
    
    return { headers, rows };
  } catch (err) {
    console.error(`❌ Error fetching Excel rows from ${worksheetName}:`, err.message);
    throw err;
  }
}

/**
 * Write data to Excel range
 * @param {string} fileId - OneDrive file ID
 * @param {string} range - "Booked Tracker!A1:N1" (worksheet!cellRange)
 * @param {Array} values - [[cell1, cell2, ...], [...]]
 */
export async function writeExcelRange(fileId, range, values) {
  const client = getMicrosoftGraphClient();

  try {
    const [worksheetName, cellRange] = range.split('!');

    console.log(`✏️ Writing to ${range} in file ${fileId}`);

    const response = await client
      .api(`/drive/items/${fileId}/workbook/worksheets/${worksheetName}/range(address='${cellRange}')`)
      .patch({ values });

    console.log(`✅ Successfully wrote to ${range}`);
    return response;
  } catch (err) {
    console.error(`❌ Error writing to Excel range ${range}:`, err.message);
    throw err;
  }
}

/**
 * Freeze header row in worksheet
 * @param {string} fileId - OneDrive file ID
 * @param {string} worksheetName - "Booked Tracker" or "Lead Tracker"
 */
export async function freezeHeaderRow(fileId, worksheetName) {
  const client = getMicrosoftGraphClient();

  try {
    console.log(`❄️ Freezing header row in ${worksheetName}`);

    await client
      .api(`/drive/items/${fileId}/workbook/worksheets/${worksheetName}/freezePanes`)
      .post({ frozenRowCount: 1 });

    console.log(`✅ Froze header row in ${worksheetName}`);
  } catch (err) {
    // Freezing is optional, don't fail if it doesn't work
    console.warn(`⚠️ Warning: Could not freeze header row in ${worksheetName}: ${err.message}`);
  }
}

/**
 * Share Excel file with a user
 * @param {string} fileId - OneDrive file ID
 * @param {string} email - User's email address
 * @param {string} role - "view", "edit", or "owner"
 */
export async function shareExcelFile(fileId, email, role = 'write') {
  const client = getMicrosoftGraphClient();

  try {
    console.log(`🤝 Sharing file ${fileId} with ${email} as ${role}`);

    // Create a sharing link instead of direct invitation
    // This is more reliable for OneDrive files
    const linkType = role === 'read' ? 'view' : 'edit';
    
    const response = await client
      .api(`/drive/items/${fileId}/createLink`)
      .post({
        type: linkType,
        scope: 'users',
        recipients: [{ email: email }]
      });

    console.log(`✅ File shared successfully with link: ${response.link.webUrl}`);
    return response;
  } catch (err) {
    console.error(`❌ Error sharing file: ${err.message}`);
    throw err;
  }
}

/**
 * Parse date string to YYYY-MM-DD format or null
 * Handles Excel date formats
 */
export function parseDateOrNull(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Parse time string to HH:MM:SS format or null
 * Handles Excel time formats
 */
export function parseTimeOrNull(raw) {
  if (!raw) return null;

  // Try to parse as HH:MM or HH:MM:SS
  if (typeof raw === "string") {
    const m = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m) {
      const hh = m[1].padStart(2, "0");
      const mm = m[2].padStart(2, "0");
      const ss = (m[3] || "00").padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }
  }

  // Try to parse as date object
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(11, 19); // HH:MM:SS
}