const moment = require('moment');

function toNumber(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).replace(/\u00A0/g, ' ').replace(/\s+/g, '').replace(',', '.');
  if (s === '') return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

function formatRUDate(dateStr) {
  if (!dateStr) return null;
  const formats = ['DD-MM-YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY'];
  for (const f of formats) {
    const m = moment(dateStr, f, true);
    if (m.isValid()) return m.format('DD.MM.YYYY');
  }
  return null;
}

function cleanSalesData(salesData) {
  return (salesData || []).map(row => {
    // Expect english keys from harmonizeSalesHeaders in main.js
    const id = row.ID ?? null;
    const date = formatRUDate(row.Date);
    const product = row.Product ?? null;
    const qty = toNumber(row.Quantity);
    const price = toNumber(row.Price);
    const sum = qty != null && price != null ? qty * price : null;

    return {
      ID: id,
      Date: date,
      Manager: row.Manager ?? null,
      City: row.City ?? null,
      Product: product,
      Quantity: qty,
      Price: price,
      Sum: sum,
      Type: row.Type ?? null,
      PaymentMethod: row.PaymentMethod ?? null
    };
  });
}

module.exports = { cleanSalesData };