// cleanPriceData.js

// Helpers
const stripBomAndTrim = (s) => (typeof s === 'string' ? s.replace(/^\uFEFF/, '').trim() : s);

const getField = (row, canonicalName) => {
    if (!row) return undefined;
    if (row[canonicalName] !== undefined) return row[canonicalName];
    const key = Object.keys(row).find(
        (k) => stripBomAndTrim(k).toLowerCase() === String(canonicalName).toLowerCase()
    );
    return key ? row[key] : undefined;
};

const sanitizeFloat = (value) => {
    if (value === undefined || value === null || value === '') return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    let s = String(value).trim();
    // Allow digits, dots and commas; remove others
    s = s.replace(/[^0-9.,-]/g, '');
    // If both comma and dot exist, assume comma is thousand sep: remove commas
    if (s.includes(',') && s.includes('.')) {
        s = s.replace(/,/g, '');
    } else if (s.includes(',')) {
        // Treat comma as decimal separator
        s = s.replace(/,/g, '.');
    }
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
};

function cleanPriceData(rows) {
    return (rows || [])
        .filter((r) => r && Object.keys(r).length > 0)
        .map((raw) => {
            const row = { ...raw };
            const priceRaw = getField(row, 'Цена');
            row['Цена'] = sanitizeFloat(priceRaw);
            return row;
        });
}

module.exports = { cleanPriceData };
