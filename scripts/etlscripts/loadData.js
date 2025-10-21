const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const csvParse = require('csv-parse/sync');

function detectDelimiter(sample) {
    // Count common delimiters in the header line
    const line = sample.split(/\r?\n/).find(l => l && l.trim().length > 0) || '';
    const counts = {
        ';': (line.match(/;/g) || []).length,
        ',': (line.match(/,/g) || []).length,
        '\t': (line.match(/\t/g) || []).length
    };
    // Pick the delimiter with the highest count; default to ';' for RU CSV
    let best = ';';
    let max = -1;
    for (const [delim, cnt] of Object.entries(counts)) {
        if (cnt > max) { max = cnt; best = delim === '\\t' ? '\t' : delim; }
    }
    return best;
}

function loadCSV(filePath, headerMap = {}) {
    try {
        const rawData = fs.readFileSync(filePath);
        // Try UTF-8 first and strip BOM if present
        let decodedData = iconv.decode(rawData, 'utf-8');
        decodedData = decodedData.replace(/^\uFEFF/, '');

        // Detect delimiter based on the first non-empty line
        const delimiter = detectDelimiter(decodedData);

        const records = csvParse.parse(decodedData, {
            columns: (headers) => headers.map(header => {
                const normalizedHeader = String(header).replace(/^\uFEFF/, '').trim().toLowerCase();
                return headerMap[normalizedHeader] || normalizedHeader;
            }),
            delimiter,
            skip_empty_lines: true,
            trim: true
        });
        return records;
    } catch (error) {
        console.error(`❌ Failed to load CSV: ${filePath}`, error);
        return null;
    }
}

module.exports = { loadCSV };