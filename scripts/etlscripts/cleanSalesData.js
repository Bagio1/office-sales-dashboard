// cleanSalesData.js

// Safe helpers
const sanitizeInt = (value) => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value | 0;
  const cleaned = String(value).replace(/[^\d-]/g, '');
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : 0;
};

const stripBomAndTrim = (s) => (typeof s === 'string' ? s.replace(/^\uFEFF/, '').trim() : s);

const getField = (row, canonicalName) => {
  // exact
  if (row[canonicalName] !== undefined) return row[canonicalName];
  // try BOM/whitespace/case-insensitive match
  const key = Object.keys(row).find(
    (k) => stripBomAndTrim(k).toLowerCase() === canonicalName.toLowerCase()
  );
  return key ? row[key] : undefined;
};

// Main cleaner
function cleanSalesData(rows) {
  return (rows || [])
    .filter((r) => r && Object.keys(r).length > 0)
    .map((raw) => {
      const row = { ...raw };

      // Normalize and set Количество safely
      const qtyRaw = getField(row, 'Количество');
      row['Количество'] = sanitizeInt(qtyRaw);

      // Optionally normalize other numeric fields if present
      // const priceRaw = getField(row, 'Цена');
      // row['Цена'] = sanitizeFloat(priceRaw);

      return row;
    });
}

module.exports = { cleanSalesData };
