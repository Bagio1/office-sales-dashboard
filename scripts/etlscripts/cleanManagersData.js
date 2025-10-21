// cleanManagersData.js

const stripBomAndTrim = (s) => (typeof s === 'string' ? s.replace(/^\uFEFF/, '').trim() : '');
const getField = (row, name) => {
  if (row && row[name] !== undefined) return row[name];
  const key = Object.keys(row || {}).find(
    (k) => stripBomAndTrim(k).toLowerCase() === String(name).toLowerCase()
  );
  return key ? row[key] : undefined;
};

function cleanManagersData(rows) {
  return (rows || [])
    .filter((r) => r && Object.keys(r).length > 0)
    .map((raw) => {
      const row = { ...raw };

      // Safely normalize manager name
      const nameRaw = getField(row, 'Менеджер');
      const name = stripBomAndTrim(nameRaw || '');
      row['Менеджер'] = name;

      return row;
    })
    // Drop rows without a manager name
    .filter((r) => r['Менеджер'] !== '');
}

module.exports = { cleanManagersData };
