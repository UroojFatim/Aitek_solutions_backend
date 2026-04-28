import logger from '../config/logger.config.js';
import { buildHeaderMap } from '../utils/headerMap.util.js';
import { tableFromSpreadsheet, ensureTableAndColumns, upsertHeaderRows } from '../services/googleSheetsSync.service.js';


export async function handleGSheetsWebhook(req, res) {
try {
const payload = (req.body && Object.keys(req.body).length ? req.body : JSON.parse((req.rawBody || Buffer.alloc(0)).toString('utf8'))) || {};


const spreadsheet = payload.spreadsheetName || 'default';
const table = tableFromSpreadsheet(spreadsheet);
const sheetName = payload.sheetName || 'Sheet1';
const records = Array.isArray(payload.records) ? payload.records : [];
const headers = Array.isArray(payload.headers) ? payload.headers : [];


const headerMap = buildHeaderMap(headers);
const hasId = headerMap.some(h => h.col === 'id');
const pkCol = hasId ? 'id' : 'row_key';


if (!hasId) {
// Ensure base table exists when PK is row_key
await ensureTableAndColumns(table, headerMap, pkCol);
}


await ensureTableAndColumns(table, headerMap, pkCol);


logger.info('GSheets webhook received', {
table,
sheetName,
editedRangeA1: payload.editedRangeA1,
count: records.length,
});


if (records.length) {
await upsertHeaderRows({ table, headerMap, records, sheetName, pkCol });
}


// Emit to Socket.IO listeners
const io = req.app.get('io');
io?.emit('gsheets:update', {
table,
sheetName,
editedRangeA1: payload.editedRangeA1,
count: records.length,
timestamp: payload.timestamp,
});


return res.json({ ok: true, table, count: records.length, pk: pkCol });
} catch (err) {
logger.error('Webhook handler error', { error: err.message, stack: err.stack });
return res.status(500).json({ ok: false, error: 'Webhook processing failed' });
}
}