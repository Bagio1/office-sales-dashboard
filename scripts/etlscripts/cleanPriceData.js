function normalizeKey(key) {
  return key ? String(key).trim().toLowerCase().replace(/\uFEFF/g, '').replace(/[^a-zа-яё0-9]/gi, '') : null;
}

function toNumber(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).replace(/\u00A0/g, ' ').replace(/\s+/g, '').replace(',', '.');
  if (s === '') return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

function cleanPriceData(priceData) {
  const dict = {};
  (priceData || []).forEach(row => {
    // Support either combined string or separate columns
    if (row['productprice']) {
      const [_, productName, price] = String(row['productprice']).split(',');
      if (productName && price) {
        dict[normalizeKey(productName)] = toNumber(price);
      }
      return;
    }
    const name = row['product_name'] || row['товар'] || row['наименование'] || row['product'];
    const price = row['price'] || row['цена'];
    if (name && price != null) {
      dict[normalizeKey(name)] = toNumber(price);
    }
  });
  return dict;
}

module.exports = { cleanPriceData };