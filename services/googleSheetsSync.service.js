import { QueryTypes } from 'sequelize';
import crypto from 'crypto';
import sequelize from '../config/database.config.js';
import { sanitizeTableName } from '../utils/sanitize.util.js'; 


// Find the value of an 'id' field in a record (case-insensitive).
// Falls back to undefined if no id-like key exists.
export function pickIdValue(record) {
  if (!record) return undefined;
  for (const k of Object.keys(record)) {
    if (String(k).trim().toLowerCase() === 'id') {
      return record[k];
    }
  }
  return undefined;
}

export async function ensureTableAndColumns(table, headerMap, pkCol) {
await sequelize.query(`
CREATE TABLE IF NOT EXISTS ${table} (
${pkCol} TEXT PRIMARY KEY,
__sheet TEXT,
__sheet_row INTEGER,
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`);


for (const { col } of headerMap) {
if ([pkCol,'__sheet','__sheet_row','updated_at'].includes(col)) continue;
await sequelize.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${col} TEXT;`);
}


await sequelize.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS __sheet TEXT;`);
await sequelize.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS __sheet_row INTEGER;`);
await sequelize.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;`);
}


export async function upsertHeaderRows({ table, headerMap, records, sheetName, pkCol }) {
if (!records?.length) return;


const reserved = new Set([pkCol,'__sheet','__sheet_row','updated_at']);
const columns = [pkCol,'__sheet','__sheet_row', ...headerMap.map(m => m.col).filter(c => !reserved.has(c)), 'updated_at'];


const valuesSql = [];
const bind = [];
let i = 1;
const nowIso = new Date().toISOString();


for (const r of records) {
let pkVal = pickIdValue(r);
if (pkVal == null || pkVal === '') {
const row = r.__sheetRow ?? r.__sheet_row;
pkVal = `${sheetName}#${row ?? crypto.randomUUID()}`;
} else {
pkVal = String(pkVal);
}


const rowVals = [];
for (const c of columns) {
if (c === pkCol) rowVals.push(pkVal);
else if (c === '__sheet') rowVals.push(sheetName);
else if (c === '__sheet_row') rowVals.push(r.__sheetRow ?? r.__sheet_row ?? null);
else if (c === 'updated_at') rowVals.push(nowIso);
else {
const map = headerMap.find(m => m.col === c);
const val = map ? r[map.orig] : null;
rowVals.push(val != null ? String(val) : null);
}
}


valuesSql.push(`(${columns.map(() => `$${i++}`).join(',')})`);
bind.push(...rowVals);
}


const setClause = columns.filter(c => c !== pkCol).map(c => `${c}=EXCLUDED.${c}`).join(', ');
const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES ${valuesSql.join(',')} ON CONFLICT (${pkCol}) DO UPDATE SET ${setClause};`;


await sequelize.query(sql, { bind, type: QueryTypes.INSERT });
}


export function tableFromSpreadsheet(name) {
return sanitizeTableName(name || 'default');
}