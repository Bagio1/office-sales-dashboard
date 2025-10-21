function cleanManagersData(managersData) {
  return (managersData || []).map(row => {
    // Accept multiple possible columns: manager_name (en), фио (ru), manager
    const raw = row['manager_name'] || row['фио'] || row['manager'] || '';
    const parts = String(raw).trim().split(/\s+/);
    let surname = '', nameInitial = '';
    if (parts.length >= 2) {
      // Assume "Name Surname" or "Surname Name" -> pick last as surname
      surname = parts[parts.length - 1];
      const name = parts[0];
      nameInitial = name ? (name[0] + '.').toUpperCase() : '';
    } else if (parts.length === 1) {
      surname = parts[0];
    }
    const managerAbbr = `${surname} ${nameInitial}`.trim();
    return {
      Manager: managerAbbr || null,
      City: row['region'] || row['город'] || null
    };
  });
}

module.exports = { cleanManagersData };