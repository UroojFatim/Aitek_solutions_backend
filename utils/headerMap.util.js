import { sanitizeColumnName } from './sanitize.util.js';


export function buildHeaderMap(headers = []) {
const seen = new Set();
const map = [];
for (const h of headers) {
let col = sanitizeColumnName(h);
if (!col) continue;
if (seen.has(col)) {
let n = 2;
while (seen.has(`${col}_${n}`)) n++;
col = `${col}_${n}`;
}
seen.add(col);
map.push({ orig: h, col });
}
return map;
}