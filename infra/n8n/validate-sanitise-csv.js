// Guards that run immediately after the Webhook node.
// Anything that is not a real CSV from our own server is rejected here, so it
// never reaches the pipeline (and never triggers a Telegram alert).
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_ROWS = 5000;
const MAX_COLUMNS = 64;
const ALLOWED_MIME = ['text/csv', 'text/plain', 'text/x-csv', 'application/csv', 'application/vnd.ms-excel', 'application/octet-stream'];
const SIGNATURES = [
  [0x25, 0x50, 0x44, 0x46], [0x50, 0x4b, 0x03, 0x04], [0x50, 0x4b, 0x05, 0x06],
  [0x50, 0x4b, 0x07, 0x08], [0x1f, 0x8b], [0x42, 0x5a, 0x68],
  [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00], [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c],
  [0x52, 0x61, 0x72, 0x21], [0x89, 0x50, 0x4e, 0x47], [0xff, 0xd8, 0xff],
  [0x47, 0x49, 0x46, 0x38], [0x42, 0x4d], [0x52, 0x49, 0x46, 0x46],
  [0xd0, 0xcf, 0x11, 0xe0], [0x7f, 0x45, 0x4c, 0x46], [0x4d, 0x5a],
  [0x00, 0x61, 0x73, 0x6d], [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66]
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  const endField = function () { row.push(field); field = ''; };
  const endRow = function () { endField(); rows.push(row); row = []; };
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i += 1; continue;
      }
      field += ch; i += 1; continue;
    }
    if (ch === '"' && field === '') { inQuotes = true; i += 1; continue; }
    if (ch === ',') { endField(); i += 1; continue; }
    if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      endRow(); i += 1; continue;
    }
    field += ch; i += 1;
  }
  if (field !== '' || row.length > 0) endRow();
  return rows;
}

function serializeCell(value) {
  if (/[",\r\n]/.test(value) || /^\s|\s$/.test(value)) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

function serializeCsv(rows) {
  return rows.map(function (row) { return row.map(serializeCell).join(','); }).join('\r\n') + '\r\n';
}

const PLAIN_NUMBER = /^-?\d+(?:[.,]\d+)*$/;
function sanitizeCell(value) {
  if (!value) return value;
  const cleaned = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
  const leading = cleaned.trimStart();
  if (!leading) return cleaned;
  const first = leading[0];
  if (first === '=' || first === '+' || first === '@') return "'" + cleaned;
  if (first === '\t' || first === '\r') return "'" + cleaned;
  if (first === '-' && !PLAIN_NUMBER.test(leading)) return "'" + cleaned;
  return cleaned;
}

function isBlankRow(row) {
  return row.every(function (cell) { return cell.trim() === ''; });
}

const item = $input.first();
const body = (item.json && item.json.body) || item.json || {};
const headers = (item.json && item.json.headers) || {};
const file = item.binary && item.binary.csv_file;
const helpersGetBinary =
  this && this.helpers && typeof this.helpers.getBinaryDataBuffer === 'function'
    ? this.helpers.getBinaryDataBuffer.bind(this.helpers)
    : null;

const reject = function (reason) {
  return [{
    json: {
      valid: false,
      reason: reason,
      receivedAt: new Date().toISOString(),
      remoteIp: String(headers['cf-connecting-ip'] || headers['x-forwarded-for'] || '').slice(0, 64),
      userAgent: String(headers['user-agent'] || '').slice(0, 160)
    }
  }];
};

const text = function (value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
};

try {
const agentName = text(body.agent_name, 120);
const agentEmail = text(body.agent_email, 200).toLowerCase();
const agentPhone = text(body.agent_phone, 40);
const emailSignature = text(body.email_signature, 1000);
const campaignName = text(body.campaign_name, 120) || 'Reactivation Campaign';

if (!agentName || !agentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(agentEmail)) {
  return reject('invalid_agent_details');
}
if (agentPhone.replace(/\D/g, '').length < 7) {
  return reject('invalid_agent_details');
}

if (!file) return reject('missing_csv');
if (file.fileSize && Number(file.fileSize) > MAX_BYTES) return reject('file_too_large');
if (file.mimeType && ALLOWED_MIME.indexOf(String(file.mimeType).toLowerCase()) === -1) {
  return reject('unsupported_file_type');
}

// Binary data is inline base64 in default mode, but with settings.binaryMode
// "separate" the item only carries a reference and the bytes must come from the
// sandbox helper. Never assume file.data exists or is base64.
let buffer = null;
const inlineData =
  typeof file.data === 'string' && /^[A-Za-z0-9+/=\r\n]{16,}$/.test(file.data.slice(0, 200));
if (inlineData) buffer = Buffer.from(file.data, 'base64');
if ((!buffer || buffer.length === 0) && helpersGetBinary) {
  const fetched = await helpersGetBinary(0, 'csv_file');
  if (fetched) buffer = Buffer.isBuffer(fetched) ? fetched : Buffer.from(fetched);
}
if (!buffer || buffer.length === 0) return reject('missing_csv');
if (buffer.length > MAX_BYTES) return reject('file_too_large');

const looksBinary = SIGNATURES.some(function (signature) {
  return signature.every(function (byte, index) { return buffer[index] === byte; });
});
if (looksBinary) return reject('binary_content');

let csvText;
try {
  csvText = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
} catch (error) {
  return reject('invalid_encoding');
}

if (csvText.indexOf('\u0000') !== -1) return reject('binary_content');
if (!csvText.trim()) return reject('empty_file');

const parsed = parseCsv(csvText).filter(function (row) { return !isBlankRow(row); });
if (parsed.length === 0) return reject('empty_file');

const header = parsed[0];
if (header.every(function (cell) { return cell.trim() === ''; })) return reject('no_header');

const columns = parsed.reduce(function (max, row) { return Math.max(max, row.length); }, 0);
if (columns > MAX_COLUMNS) return reject('too_many_columns');

const dataRows = parsed.slice(1);
if (dataRows.length === 0) return reject('no_data_rows');
if (dataRows.length > MAX_ROWS) return reject('too_many_rows');

const normalised = parsed.map(function (row) {
  const padded = row.slice(0, columns);
  while (padded.length < columns) padded.push('');
  return padded.map(sanitizeCell);
});

return [{
  json: {
    valid: true,
    rowCount: dataRows.length,
    columnCount: columns,
    agent_name: agentName,
    agent_phone: agentPhone,
    agent_email: agentEmail,
    email_signature: emailSignature,
    campaign_name: campaignName,
    source: text(body.source, 60) || 'devobi.com/reactivate',
    request_id: text(body.request_id, 64),
    receivedAt: new Date().toISOString()
  },
  binary: {
    csv_file: {
      data: Buffer.from(serializeCsv(normalised), 'utf8').toString('base64'),
      mimeType: 'text/csv',
      fileName: 'leads-sanitised.csv'
    }
  }
}];
} catch (err) {
  // A thrown error here would leave the webhook (responseMode: responseNode)
  // waiting for a response until it times out. Fail closed as invalid input.
  return [{
    json: {
      valid: false,
      reason: 'validator_exception',
      detail: String((err && err.message) || err).slice(0, 200),
      receivedAt: new Date().toISOString()
    }
  }];
}
