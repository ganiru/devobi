/**
 * CSV intake guards for the lead reactivation upload.
 *
 * Everything a user uploads is untrusted, so the file is treated as hostile
 * until it has passed all of these:
 *
 *   1. size cap    -- both the request and the decoded file
 *   2. content     -- known binary magic bytes are rejected, and the bytes must
 *                     decode as strict UTF-8 (a real CSV is text)
 *   3. shape       -- row + column caps, at least one header row and one data row
 *   4. sanitisation -- cells that open with a spreadsheet formula trigger are
 *                     neutralised so a downstream CSV import (Sheets, Excel,
 *                     n8n) cannot execute them
 *
 * The sanitised CSV, not the original upload, is what gets forwarded. n8n runs
 * the same checks again (defence in depth: it is a public webhook).
 */

/** Hard cap on the uploaded CSV, in bytes. Also enforced on the HTTP body. */
export const MAX_CSV_BYTES = 2 * 1024 * 1024; // 2 MiB

/** Hard cap on data rows (header excluded). */
export const MAX_CSV_ROWS = 5000;

/** Hard cap on columns; a real lead export is nowhere near this. */
export const MAX_CSV_COLUMNS = 64;

/** MIME types browsers actually send for `.csv` uploads. */
export const ALLOWED_CSV_MIME = new Set([
    'text/csv',
    'text/plain',
    'text/x-csv',
    'application/csv',
    'application/vnd.ms-excel',
    'application/octet-stream',
]);

export type CsvRejection =
    | 'empty_file'
    | 'file_too_large'
    | 'binary_content'
    | 'invalid_encoding'
    | 'no_header'
    | 'too_many_columns'
    | 'too_many_rows'
    | 'no_data_rows';

export type CsvInspection =
    | { ok: true; csv: string; rows: number; columns: number }
    | { ok: false; reason: CsvRejection };

/**
 * Leading bytes of formats that must never be accepted as a CSV. A `.csv` file
 * is plain text, so any of these means the upload is something else: a renamed
 * PDF, an archive, a spreadsheet workbook, or an executable.
 */
const BINARY_SIGNATURES: number[][] = [
    [0x25, 0x50, 0x44, 0x46], // %PDF
    [0x50, 0x4b, 0x03, 0x04], // PK..  zip / docx / xlsx / odt
    [0x50, 0x4b, 0x05, 0x06], // PK..  empty zip
    [0x50, 0x4b, 0x07, 0x08], // PK..  spanned zip
    [0x1f, 0x8b], // gzip
    [0x42, 0x5a, 0x68], // bzip2
    [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00], // xz
    [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c], // 7z
    [0x52, 0x61, 0x72, 0x21], // rar
    [0x89, 0x50, 0x4e, 0x47], // png
    [0xff, 0xd8, 0xff], // jpeg
    [0x47, 0x49, 0x46, 0x38], // gif
    [0x42, 0x4d], // bmp
    [0x52, 0x49, 0x46, 0x46], // riff (webp/wav/avi)
    [0xd0, 0xcf, 0x11, 0xe0], // legacy doc/xls (OLE2)
    [0x7f, 0x45, 0x4c, 0x46], // elf
    [0x4d, 0x5a], // windows pe
    [0x00, 0x61, 0x73, 0x6d], // wasm
    [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66], // sqlite
];

function startsWithSignature(buffer: Buffer): boolean {
    return BINARY_SIGNATURES.some((signature) =>
        signature.every((byte, index) => buffer[index] === byte),
    );
}

/**
 * RFC 4180-ish parser: quoted fields, doubled quotes inside quotes, CRLF/LF/CR
 * line endings, and newlines preserved inside quoted fields.
 */
export function parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let inQuotes = false;
    let index = 0;

    const endField = () => {
        row.push(field);
        field = '';
    };
    const endRow = () => {
        endField();
        rows.push(row);
        row = [];
    };

    while (index < text.length) {
        const char = text[index];

        if (inQuotes) {
            if (char === '"') {
                if (text[index + 1] === '"') {
                    field += '"';
                    index += 2;
                    continue;
                }
                inQuotes = false;
                index += 1;
                continue;
            }
            field += char;
            index += 1;
            continue;
        }

        if (char === '"' && field === '') {
            inQuotes = true;
            index += 1;
            continue;
        }
        if (char === ',') {
            endField();
            index += 1;
            continue;
        }
        if (char === '\r' || char === '\n') {
            if (char === '\r' && text[index + 1] === '\n') index += 1;
            endRow();
            index += 1;
            continue;
        }

        field += char;
        index += 1;
    }

    // Trailing line ending leaves nothing behind; otherwise flush the last row.
    if (field !== '' || row.length > 0) endRow();

    return rows;
}

function serializeCell(value: string): string {
    // Quote only when required, so downstream consumers see ordinary cells.
    if (/[",\r\n]/.test(value) || /^\s|\s$/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

export function serializeCsv(rows: string[][]): string {
    return rows.map((row) => row.map(serializeCell).join(',')).join('\r\n') + '\r\n';
}

/** A plain (possibly negative, possibly decimal) number is not a formula. */
const PLAIN_NUMBER = /^-?\d+(?:[.,]\d+)*$/;

/**
 * Neutralises CSV/formula injection (OWASP): a cell whose first non-space
 * character is `=`, `+`, `@`, or `-` (and a handful of control prefixes) can be
 * executed as a formula by Excel/Sheets when the file is opened or imported.
 * Prefixing with a single quote makes the consumer treat it as text.
 *
 * `-` is only escaped when the value is not a plain number, so genuine negative
 * numbers survive the round trip.
 */
export function sanitizeCsvCell(value: string): string {
    if (!value) return value;

    // Strip control characters except tab/CR/LF, and NULs outright.
    const cleaned = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
    const leading = cleaned.trimStart();
    if (!leading) return cleaned;

    const first = leading[0];

    if (first === '=' || first === '+' || first === '@') return `'${cleaned}`;
    if (first === '\t' || first === '\r' || first === '\u000b') return `'${cleaned}`;
    if (first === '-' && !PLAIN_NUMBER.test(leading)) return `'${cleaned}`;

    return cleaned;
}

function isBlankRow(row: string[]): boolean {
    return row.every((cell) => cell.trim() === '');
}

/**
 * Full inspection of an uploaded CSV buffer. Returns the sanitised CSV to
 * forward, or the reason the upload was rejected. Never throws on bad input.
 */
export function inspectCsv(input: Buffer | Uint8Array): CsvInspection {
    const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);

    if (buffer.length === 0) return { ok: false, reason: 'empty_file' };
    if (buffer.length > MAX_CSV_BYTES) return { ok: false, reason: 'file_too_large' };
    if (startsWithSignature(buffer)) return { ok: false, reason: 'binary_content' };

    let text: string;
    try {
        // fatal:true rejects anything that is not valid UTF-8, which is the
        // strongest available "this is text, not a binary file" assertion.
        text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    } catch {
        return { ok: false, reason: 'invalid_encoding' };
    }

    if (text.includes('\u0000')) return { ok: false, reason: 'binary_content' };
    if (text.trim() === '') return { ok: false, reason: 'empty_file' };

    const parsed = parseCsv(text).filter((row) => !isBlankRow(row));
    if (parsed.length === 0) return { ok: false, reason: 'empty_file' };

    const header = parsed[0];
    if (header.every((cell) => cell.trim() === '')) return { ok: false, reason: 'no_header' };

    const columns = parsed.reduce((max, row) => Math.max(max, row.length), 0);
    if (columns > MAX_CSV_COLUMNS) return { ok: false, reason: 'too_many_columns' };

    const dataRows = parsed.slice(1);
    if (dataRows.length === 0) return { ok: false, reason: 'no_data_rows' };
    if (dataRows.length > MAX_CSV_ROWS) return { ok: false, reason: 'too_many_rows' };

    // Normalise the grid: every row is exactly `columns` wide, so the
    // downstream mapping is stable, then sanitise every cell.
    const normalised = parsed.map((row) => {
        const padded = row.slice(0, columns);
        while (padded.length < columns) padded.push('');
        return padded.map(sanitizeCsvCell);
    });

    return {
        ok: true,
        csv: serializeCsv(normalised),
        rows: dataRows.length,
        columns,
    };
}
