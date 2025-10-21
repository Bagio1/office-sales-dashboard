// loadData.js

// CSV loader that works both inside R7‑Office (Api available) and in Node.js
function loadCSV(filePath) {
    // R7‑Office macro environment
    if (typeof Api !== 'undefined' && Api && Api.Worksheet && typeof Api.Worksheet.importCSV === 'function') {
        try {
            const fileContent = Api.Worksheet.importCSV(filePath, {
                delimiter: ';',
                encoding: 'UTF-8'
            });
            return fileContent;
        } catch (error) {
            console.error('Error loading CSV via Api.Worksheet.importCSV:', error);
            return null;
        }
    }

    // Node.js fallback: read from filesystem and parse semicolon‑separated CSV
    try {
        const fs = require('fs');
        const raw = fs.readFileSync(filePath, 'utf8');
        return parseSemicolonCSV(raw);
    } catch (err) {
        console.error('Error loading CSV from filesystem:', err);
        return null;
    }
}

// Very small CSV parser for semicolon‑delimited files with a header row.
function parseSemicolonCSV(text) {
    if (!text) return [];
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const headers = splitRow(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = splitRow(lines[i]);
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = cols[j] !== undefined ? cols[j] : '';
        }
        rows.push(obj);
    }
    return rows;
}

// Splits a line by semicolons, honoring simple quoted values
function splitRow(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            // Toggle quote state or handle escaped quotes
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++; // skip next
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ';' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current);
    // Trim surrounding quotes
    return result.map(v => {
        const trimmed = v.trim();
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
            return trimmed.slice(1, -1);
        }
        return trimmed;
    });
}

module.exports = { loadCSV };
