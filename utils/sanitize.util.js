const PG_RESERVED = new Set([
'user','select','table','where','from','to','by','order','group','limit',
'offset','and','or','not','insert','update','delete','join','left','right',
'full','inner','outer','on','values','primary','key','unique','constraint'
]);


export function sanitizeTableName(name) {
let t = String(name || 'default')
.trim()
.toLowerCase()
.replace(/\s+/g, '_')
.replace(/[^a-z0-9_]/g, '_')
.replace(/^_+|_+$/g, '');
if (!t) t = 'default';
if (/^[0-9]/.test(t)) t = `t_${t}`;
if (PG_RESERVED.has(t)) t = `${t}_`;
if (t.length > 60) t = t.slice(0, 60);
return t;
}


export function sanitizeColumnName(name) {
let col = String(name || '')
.trim()
.toLowerCase()
.replace(/\s+/g, '_')
.replace(/[^a-z0-9_]/g, '_')
.replace(/^_+|_+$/g, '');
if (!col) col = 'col';
if (/^[0-9]/.test(col)) col = `c_${col}`;
if (PG_RESERVED.has(col)) col = `${col}_`;
return col;
}